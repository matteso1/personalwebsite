---
title: "Madison Metro ML"
description: "Live ML that corrects the transit API's ETAs. A 47-feature XGBoost model plus Mondrian conformal prediction, calibrated to 90% coverage, retrained nightly behind a hard deploy gate."
year: "2024-2026"
role: "Solo"
order: 4
stack: ["Python", "XGBoost", "scikit-learn", "Mondrian conformal prediction", "Flask", "Postgres", "React", "DeckGL", "MapLibre", "GitHub Actions"]
links:
  demo: "https://madisonbuseta.com"
  repo: "https://github.com/matteso1/madison-bus-eta"
receipt: "Calibrated 90% coverage, stratified by route x day-type x horizon. 200+ live vehicles at 60fps."
---

The official Madison Metro API gives you a predicted arrival time, and it is often wrong by ten or fifteen minutes. The prediction underneath is close to a linear extrapolation: vehicle speed times remaining distance. It does not know that Route 80 runs chronically late on Friday afternoons, that a stop near a highway on-ramp has high variance, or that a snowstorm does not just slow buses down, it makes their slowdown unpredictable.

Madison Metro ML does not replace that prediction. It learns the error in it. The transit feed is already a decent baseline, so the model predicts the signed correction instead of the arrival time from scratch. If the API says eight minutes and the model says plus three, the corrected ETA is eleven. That framing is easier to learn and easier to be honest about, because the systematic biases (route, stop, hour, weather) are exactly what a tree model picks up.

## The model

The point estimate is a 47-feature XGBoost regressor. The features that earn their place are the ones the API ignores: horizon terms (a bus two minutes out is far more predictable than one thirty minutes out, and the relationship is nonlinear, so the model gets the raw horizon, its square, its log, and a bucketed flag), cyclical sine and cosine encodings of hour, day, and month so 11pm sits next to midnight, rolling route-level and stop-level error histories with shrinkage toward the route mean for thin stops, live vehicle dynamics, and Madison weather pulled from Open-Meteo. Feature engineering does most of the work here. The model itself is unremarkable on purpose: a few hundred shallow trees.

## Honest uncertainty

A point estimate is not enough. "Your bus arrives in eight minutes" is less useful than "six to ten minutes, ninety percent of the time," and it is worse than useless if that interval does not actually hold ninety percent of the time.

So the intervals come from Mondrian conformal prediction, calibrated to 90% coverage and stratified by route, day-type, and horizon bucket. The stratification is the point. A single global interval would be too wide on an easy short-horizon weekday trip and too narrow on a long-horizon Friday-night run on an unreliable route. Conditioning the calibration on those groups means each cell gets the interval it has earned from its own residuals, and the coverage guarantee holds per cell rather than only on average. On the map this reads as a confidence band: wide when the model is genuinely unsure, narrow when it is not, never a fixed cosmetic margin.

## Retraining behind a gate

The model retrains every night through GitHub Actions. The pipeline pulls the recent window of prediction outcomes, does a strict temporal split so no future leaks into training, fits the model, and evaluates on the held-out tail. Then it refuses to ship unless the new model clears a hard gate: at least a two-second MAE improvement over the model currently in production, on a test set large enough to trust.

The gate exists because a confidently wrong correction is worse than the raw API number a rider already half-distrusts. A model that has not actually improved does not get to displace the one that has. Most nights nothing deploys, which is the correct outcome.

## The map

The frontend is React with a DeckGL layer on MapLibre. Every live bus in Madison renders as a WebGL point rather than a DOM marker, which is what keeps 200+ vehicles moving at 60fps without the browser falling over. Tap a route to filter, tap a stop to see arriving buses with their corrected ETAs and confidence bands, or track a single bus and watch it close on you in real time. The desktop view leans toward analytics (route reliability, error by horizon, model diagnostics); the mobile view is one full-screen map and a draggable sheet, built for someone walking to a stop in gloves who needs one answer in three seconds.

Live at [madisonbuseta.com](https://madisonbuseta.com), source at [github.com/matteso1/madison-bus-eta](https://github.com/matteso1/madison-bus-eta).
