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

The Madison Metro API gives predicted arrival times. They are often wrong by 10-15 minutes. The underlying prediction is close to linear extrapolation: vehicle speed times remaining distance. It ignores route-level reliability patterns, stop-level variance, and weather.

Madison Metro ML learns the error in the API's prediction, not the arrival time from scratch. If the API says 8 minutes and the model says +3, the corrected ETA is 11. The systematic biases (route, stop, hour, weather) are what a tree model picks up.

## the model

47-feature XGBoost regressor. The features that matter: horizon terms (raw, squared, log, bucketed, long-horizon flag), cyclical sine/cosine encodings of hour, day, and month, rolling route-level and stop-level error histories with shrinkage toward the route mean for thin stops, live vehicle dynamics, and Madison weather from Open-Meteo. Feature engineering does most of the work; the model is a few hundred shallow trees.

## honest uncertainty

Intervals come from Mondrian conformal prediction, calibrated to 90% coverage, stratified by route, day-type, and horizon bucket. A single global interval would be too wide on easy short-horizon weekday trips and too narrow on long-horizon Friday-night runs on unreliable routes. Conditioning calibration on those groups means each cell gets the interval earned from its own residuals, and the coverage guarantee holds per cell.

## retraining behind a gate

The model retrains every night through GitHub Actions: pull recent outcomes, temporal split, fit, evaluate. It deploys only if the new model clears a hard gate: at least 2s MAE improvement over the model in production, on a test set large enough to trust. Most nights nothing deploys. That is the correct outcome.

## what broke

The nightly pipeline was updated to save models in XGBoost's native `.ubj` format, but the backend loader still looked for `.pkl` files. Model load failed silently; the backend's fallback returned the raw API prediction, so the system appeared to work. I caught it when diagnostics showed zero ML predictions. Fix: track format in the model registry, try `.ubj` first. Lesson: fallback behavior hides failures. Monitoring needs to check that the model is actually being used, not just that the endpoint returns 200.

## the map

React, DeckGL, MapLibre. 200+ live buses as WebGL points, not DOM markers, which is what keeps them moving at 60fps. Tap a stop for arriving buses with corrected ETAs and confidence bands. Mobile view is one full-screen map and a draggable sheet built for someone walking to a stop in gloves.

Live at [madisonbuseta.com](https://madisonbuseta.com).
