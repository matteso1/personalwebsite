# Building a Real-Time Bus Prediction System for Madison Metro

*279 commits, 44 ML features, one API rate limit, and the Wisconsin winter that started it all.*

---

## The Problem

I stand at University Ave and Randall in January. It is -8F. The Madison Metro app says my bus is 5 minutes away. It has said 5 minutes for 12 minutes. My hands stopped working 8 minutes ago.

The official transit API gives you a predicted arrival time, but it is often wrong -- sometimes by 10-15 minutes. The API's prediction is a simple linear extrapolation: bus speed times remaining distance. It does not account for rush hour traffic patterns, weather, route-specific reliability, or the fact that Route 80 is chronically late on Friday afternoons.

I wanted to build something better. Not a wrapper around the API -- an actual ML system that learns from historical prediction errors and corrects them.

## The System

Madison Bus ETA is a full-stack transit intelligence platform: a Python data collector, a PostgreSQL feature store, an XGBoost regression model that retrains nightly, a Flask API, and a React frontend with a DeckGL/MapLibre map. It runs on Railway (backend + Postgres) and Vercel (frontend).

The core idea is simple. The transit API already gives predictions. Instead of replacing them, I train a model to predict the **error** in those predictions. If the API says "8 minutes" and the model predicts "+3 minutes error," the corrected ETA is 11 minutes. This is easier than predicting arrival time from scratch because the API prediction is already a decent baseline -- the model just needs to learn the systematic biases.

The collector runs 24/7, polling vehicle positions every 30 seconds and recording what actually happened. When a bus passes a stop, the collector compares the API's prediction to reality and stores the error. After a few weeks of collection, there are hundreds of thousands of labeled examples to train on.

## The Feature Vector

The model uses 44 features. Some are obvious (hour of day, day of week, whether it is rush hour). Some required more thought.

**Horizon features.** The "horizon" is how far in the future the prediction is -- a bus 2 minutes away is much more predictable than one 30 minutes away. The relationship is nonlinear, so the model gets `horizon_min`, `horizon_squared`, `horizon_log`, a bucketed version, and an `is_long_horizon` flag. This is the single most important feature group.

**Cyclical time encoding.** Hours and months are cyclical -- 11pm is close to midnight, December is close to January. Raw integers miss this. Sine/cosine encoding (`hour_sin = sin(2*pi*hour/24)`) preserves the cyclical relationship. The model gets sin/cos pairs for hour, day of week, and month.

**Route-level historical errors.** Each route has its own reliability profile. Route 80 averages +2.1 minutes late. Route 2 averages -0.8 minutes early. These are computed as rolling aggregates from the prediction outcomes table: `route_avg_error`, `route_error_std`, and an hour-of-day variant `hr_route_error`.

**Stop-level errors.** Some stops are systematically harder to predict. Stops near highway on-ramps have high variance. Downtown stops cluster. Each stop gets `stop_avg_error` and `stop_error_std`, with shrinkage estimators for stops with fewer than 50 samples (blending toward the route average).

**Weather.** Madison weather matters. The model ingests temperature, precipitation, snow depth, wind speed, and visibility from the Open-Meteo API. Boolean flags for extreme conditions: `is_cold` (below -10C), `is_snowing`, `is_severe_weather`. A snowstorm does not just slow buses -- it makes their slowdown unpredictable, which is exactly what the error-prediction framing captures.

**Vehicle dynamics.** Real-time speed, speed standard deviation, and speed variability from the vehicle's recent position history. Flags for `is_stopped`, `is_slow`, `is_moving_fast`. A bus sitting in traffic will be later than the API thinks.

## Training Pipeline

The model retrains every night via GitHub Actions. The pipeline:

1. Pull the last 7 days of prediction outcomes from Postgres
2. Temporal split: days 1-5 for training, days 6-7 for testing (no future leakage)
3. Train XGBoost regression with `n_estimators=300`, `max_depth=6`, `learning_rate=0.05`
4. Evaluate on the held-out test set
5. Deploy only if: MAE improves by at least 2 seconds, MAE is below 90 seconds, test set has 1000+ samples, and no regression on any metric

The deployment gates are strict because a bad model is worse than no model -- users would rather see the raw API prediction than a confidently wrong correction. The model is saved in XGBoost's native `.ubj` format (not pickle) for portability and security.

Current production MAE: ~55 seconds. The raw API averages ~75 seconds of error on the same test set. That is a 27% improvement -- not revolutionary, but it means telling a student "your bus is 8 minutes away" instead of "5 minutes" when it is actually 8 minutes away. In January, those 3 minutes of not standing outside matter.

## The .pkl to .ubj Migration (The Bug That Broke Everything)

The nightly training pipeline was updated to save models in XGBoost's native `.ubj` format, but the backend model loader still looked for `.pkl` files. The model registry said "use `model_v42.ubj`" but the loader called `pickle.load()` on it and crashed. Every prediction request returned a 500.

This went unnoticed for weeks because the backend had a fallback: if the ML model fails, return the raw API prediction. The system appeared to work -- just without the ML correction. I only caught it when I noticed the model diagnostics endpoint returning zero predictions.

The fix touched three files: the model registry (track format), the backend loader (try `.ubj` first, fall back to `.pkl`), and the training script (consistent format). A small bug, but it taught me that fallback behavior can hide failures. If the ML model silently degrades to the baseline, you need monitoring that checks whether the model is actually being used, not just whether the endpoint returns 200.

## Conformal Prediction

Point estimates are not enough. "Your bus arrives in 8 minutes" is less useful than "your bus arrives in 6-10 minutes (90% confidence)." I added quantile predictions using conformal prediction -- a distribution-free method that provides valid coverage guarantees without distributional assumptions.

The system trains a separate sklearn `GradientBoostingRegressor` with `loss='quantile'` at the 10th and 90th percentiles. At inference time, the point prediction comes from XGBoost and the confidence interval comes from the quantile model. Conformal calibration adjusts the intervals on a held-out set so that empirical coverage matches the target (90%).

On the frontend, this shows up as a confidence band on each prediction: a teal bar spanning the low-to-high range with the median marked. When the model is uncertain (long horizons, bad weather, unreliable routes), the band is wide. When it is confident, the band is narrow. Users can see at a glance how much to trust the prediction.

## The Mobile PWA

The desktop dashboard is great for analytics -- route reliability scores, error-by-horizon charts, model diagnostics. But students checking bus times are on their phones, walking to a stop, probably wearing gloves.

The mobile experience is a full-screen map with a draggable bottom sheet. No tabs, no sidebars, no route dropdowns. You open the app and see every live bus in Madison as a colored dot on the map. Route lines are overlaid. Tap a route or bus to drill in. Tap a stop to see all arriving buses with ML predictions and confidence bands. Track a specific bus and watch it move toward you in real time.

The bottom sheet uses framer-motion with snap points (peek, half, full). The map uses DeckGL on MapLibre -- WebGL-rendered layers that handle 200+ bus markers at 60fps without DOM marker overhead. Vehicle positions poll every 15 seconds in the all-buses view, every 5 seconds when tracking.

Geolocation sorts nearby stops by walking distance (haversine). The "Where to?" search combines the stop database with Nominatim geocoding -- type "Memorial Union" and get walking directions to the nearest bus stop with the right route.

### The NearbyStops Performance Problem

The first implementation of "buses near me" was slow. Embarrassingly slow. It fetched all 50+ routes from the API, then for each route fetched all stops, computed distances, filtered by radius, and fetched predictions. This was 50+ sequential API calls just to show a list of nearby buses. It took 60 seconds on a good day.

The fix was adding a `/stops/nearby` backend endpoint. The backend already had a cached stop list in memory. One request with `lat`, `lon`, and `radius` parameters returns the 10 nearest stops with distances, pre-computed server-side. The 60-second load became instant.

### The All-Buses Map

Initially, the mobile map showed zero buses unless you selected a specific route. You had to know which route you wanted before you could see anything. This is backwards -- you are standing at a stop, you want to know what is coming, you want to see the whole picture.

The backend already supported fetching all vehicles (it batches requests across all routes with a 15-second cache). The frontend just never called it in the all-routes view. The fix was a `showAllBuses` prop on MapView that switches from DOM markers (fine for 10-15 buses on one route) to a DeckGL ScatterplotLayer (canvas-rendered, handles hundreds). Route lines become tappable -- tap one to filter to that route's stops and buses.

## The API Rate Limit Problem

Madison Metro provides a free API with a daily request limit. The collector uses ~2,880 requests/day (polling every 30 seconds). The frontend adds more when users check predictions. During peak usage, the app hits the limit and the API starts returning errors.

This is outside my control. The fix is partly technical (aggressive caching, batch requests, 15-second cache on all-vehicles) and partly social -- when the API errors out, the app shows a banner explaining the situation and providing a pre-filled email to `mymetrobus@cityofmadison.com` requesting a higher quota. If enough users email, maybe we get more requests.

## What I Learned

**Fallbacks hide failures.** The ML model was broken for weeks and nobody noticed because the system gracefully degraded to API predictions. Monitoring should check that the model is actually contributing, not just that the endpoint is up.

**Mobile-first is a different product.** The desktop analytics dashboard and the mobile bus-tracking PWA share a backend and a map component, but the UX is completely different. Desktop users explore data. Mobile users need one answer in 3 seconds: "when is my bus coming?"

**Feature engineering > model complexity.** XGBoost with 44 handcrafted features outperforms more complex approaches I tried. The cyclical time encoding, route-specific historical errors, and horizon features do most of the work. The model itself is simple -- 300 trees, max depth 6.

**Ship the simple version.** The first deployment was a Flask app with a single XGBoost model and a Leaflet map. It was useful on day one. The mobile PWA, conformal prediction, and analytics dashboard came months later. Every intermediate version was usable.

**Wisconsin weather is a feature, not a bug.** Literally. The weather features improved MAE by ~4 seconds. Snowstorms and extreme cold create systematic prediction errors that a model can learn.

---

*Madison Bus ETA is live at [madisonbuseta.com](https://madisonbuseta.com) and open source at [github.com/matteso1/madison-bus-eta](https://github.com/matteso1/madison-bus-eta). 279 commits, 44 ML features, and one fewer student freezing at a bus stop.*
