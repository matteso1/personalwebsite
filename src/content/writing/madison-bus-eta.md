---
title: "Building a Real-Time Bus Prediction System for Madison Metro"
description: "Live ML that corrects the transit API's ETAs with a 47-feature XGBoost model and Mondrian conformal prediction, retrained nightly behind a hard deploy gate."
date: 2026-03-04
tags: ["machine learning", "conformal prediction", "transit"]
---

The Madison Metro API predicts arrival times. It is often wrong by 10-15 minutes. The underlying model is close to linear extrapolation: vehicle speed times remaining distance. It does not know that Route 80 runs chronically late on Friday afternoons, or that a stop near a highway on-ramp has high variance, or that a snowstorm makes bus slowdowns unpredictable rather than just uniform.

I wanted a system that learns from historical prediction errors and corrects them.

## the system

Madison Bus ETA is a full-stack transit intelligence platform: a Python data collector, a PostgreSQL feature store, an XGBoost regression model that retrains nightly, a Flask API, and a React frontend with DeckGL and MapLibre. Backend and Postgres on Railway; frontend on Vercel.

The core idea: the transit API already gives predictions. Instead of replacing them, train a model to predict the error. If the API says 8 minutes and the model predicts +3, the corrected ETA is 11. The API prediction is a decent baseline; the model learns the systematic biases.

## feature vector

47 features total. The ones that matter:

**Horizon features.** A bus 2 minutes out is far more predictable than one 30 minutes out; the relationship is nonlinear. Features: `horizon_min`, `horizon_squared`, `horizon_log`, a bucketed version, `is_long_horizon`. Single most important feature group.

**Cyclical time encoding.** Hours and months are cyclical. 11pm is close to midnight; December is close to January. Sine/cosine pairs for hour, day of week, and month.

**Route-level historical errors.** Rolling aggregates: `route_avg_error`, `route_error_std`, `hr_route_error`. Route 80 averages +2.1 minutes late; Route 2 averages -0.8 minutes early.

**Stop-level errors.** `stop_avg_error` and `stop_error_std`, with shrinkage toward the route mean for stops with fewer than 50 samples.

**Weather.** Temperature, precipitation, snow depth, wind speed, visibility from Open-Meteo. Boolean flags: `is_cold`, `is_snowing`, `is_severe_weather`. Weather features improved MAE by ~4 seconds.

**Vehicle dynamics.** Speed, speed standard deviation, speed variability from recent position history. Flags for `is_stopped`, `is_slow`, `is_moving_fast`.

## training pipeline

Retrains every night through GitHub Actions: pull last 7 days of outcomes, temporal split (days 1-5 train, days 6-7 test), fit XGBoost (n_estimators=300, max_depth=6, lr=0.05), evaluate. Deploys only if: MAE improves by at least 2 seconds, MAE is below 90 seconds, test set has 1000+ samples, no regression on any metric.

Current production MAE: ~55 seconds. Raw API averages ~75 seconds on the same test set, a 27% improvement.

## what broke: the .pkl to .ubj migration

The nightly pipeline was updated to save models in XGBoost's native `.ubj` format, but the backend loader still looked for `.pkl` files. The model registry said `model_v42.ubj` but the loader called `pickle.load()` and crashed. Every prediction returned a 500.

This went unnoticed for weeks because the backend falls back to the raw API prediction if ML fails. The system appeared to work, just without ML correction. I caught it when diagnostics showed zero ML predictions.

Fix: track format in the model registry, try `.ubj` first, fall back to `.pkl`, update the training script. Monitoring should check whether the model is being used, not just whether the endpoint returns 200.

## conformal prediction

Point estimates are not enough. Intervals come from Mondrian conformal prediction, calibrated to 90% coverage, stratified by route, day-type, and horizon bucket. The stratification matters: a single global interval would be too wide on easy short-horizon trips and too narrow on long-horizon unreliable-route runs. Conditioning calibration on those groups gives each cell the interval earned from its own residuals, with the coverage guarantee holding per cell.

On the frontend: a confidence band per prediction. Wide when the model is uncertain (long horizons, bad weather, unreliable routes), narrow when it is not.

## the map

React, DeckGL on MapLibre. Every live bus in Madison as a WebGL point, not a DOM marker, which is what keeps 200+ vehicles moving at 60fps. Tap a stop to see arriving buses with corrected ETAs and confidence bands, or track a single bus in real time. Mobile view: one full-screen map and a draggable bottom sheet, built for someone walking to a stop in gloves. Desktop view leans toward analytics (route reliability, error by horizon, model diagnostics).

Two frontend performance bugs fixed along the way:

**NearbyStops**: the first implementation fetched all 50+ routes from the API, then fetched all stops for each route, computed distances, filtered by radius. 50+ sequential API calls to show nearby buses; took 60 seconds. Fix: `/stops/nearby` backend endpoint that returns the 10 nearest stops with distances pre-computed server-side.

**All-buses map**: mobile initially showed no buses unless you selected a specific route. The backend already supported fetching all vehicles, the frontend just never called it in the all-routes view. Fix: `showAllBuses` prop on MapView, switches from DOM markers to a DeckGL ScatterplotLayer.

## API rate limits

Madison Metro provides a free API with a daily request limit. The collector uses ~2,880 requests/day (polling every 30 seconds). During peak usage the app hits the limit. The fix is partly technical (aggressive caching, batch requests, 15-second cache on all-vehicles) and partly a banner explaining the situation with a pre-filled email to `mymetrobus@cityofmadison.com` requesting a higher quota.

---

Live at [madisonbuseta.com](https://madisonbuseta.com), source at [github.com/matteso1/madison-bus-eta](https://github.com/matteso1/madison-bus-eta).
