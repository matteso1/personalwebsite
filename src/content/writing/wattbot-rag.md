---
title: "Deploying RAG in AWS Bedrock: Benchmarking 9 LLMs on the WattBot Challenge"
description: "Ensemble majority voting scored 0.840 and beat every individual model. The highest-citation model finished last. A serverless RAG pipeline on Bedrock with full cost tracking."
date: 2026-02-17
tags: ["RAG", "AWS Bedrock", "LLM eval"]
---

KohakuRAG was the #1 solution to the [2025 WSDM WattBot Challenge](https://www.kaggle.com/competitions/WattBot2025/overview): RAG systems answering sustainability questions about AI workloads by citing academic papers. We deployed it two ways: a fully serverless pipeline on AWS Bedrock (my focus) and a local open-source deployment. I built the Bedrock integration, the evaluation framework, and the cost tracking infrastructure.

Presented at the [ML+X community meeting](https://uw-madison-datascience.github.io/ML-X-Nexus/Applications/Videos/Forums/mlx_2026-02-17.html) at UW-Madison, February 17, 2026.

## the pipeline

Standard RAG: chunk academic papers, embed queries, cosine similarity retrieval, LLM generates a citation-backed answer. The hard part is abstention. A model that always answers will hallucinate when retrieved context is insufficient. A model that abstains too aggressively leaves easy questions unanswered.

## bedrock integration

`boto3` calls to `bedrock-runtime`. The operational details matter:

**Cost tracking.** Each model has different per-token pricing. I logged input tokens, output tokens, and total cost per question per model across 9 models and 282 questions. This feeds directly into the production decision: if two models have similar accuracy, pick the cheaper one.

**Latency measurement.** End-to-end per question including retrieval and generation. Some models are 3x faster than others at similar quality.

**Error handling.** Bedrock has rate limits. Retries with exponential backoff, throttle events logged.

## results

Ensemble majority voting scored `0.840` and outperformed every individual model. Three-model ensembles: each model independently answers, majority vote selects the final answer. The ensemble's accuracy exceeded the best individual model. This is the standard result: models make different mistakes, voting filters them out.

Ensembling does not always help. Ensembles of similar models (e.g., all Qwen variants) barely improve over the best individual. Ensembling only pays when models have genuinely different reasoning patterns.

Llama-4 Maverick reached `98%` of the top score at a fraction of the cost and latency. For most production deployments this is the right choice.

The highest-citation model finished last overall. It aggressively cited passages for every answer but refused to abstain on unanswerable questions, fabricating citations to passages that did not support its claims. High citation count without citation accuracy is worse than no citations at all.

Text-only embeddings create a ceiling on figure-based questions. Key data in figures and tables is invisible to the retriever; no LLM quality can fix a retrieval gap.

## evaluation framework

Building the evaluation framework took more time than the Bedrock integration.

**Reproducibility.** Random seeds, temperature 0 where possible, deterministic retrieval ordering.

**Comparability.** Models return different formats: structured JSON, free text with inline citations. The evaluation parser normalizes all formats.

**Cost attribution.** Cost per question per model. Cost-per-correct-answer is the metric that matters for budgeting.

## what I learned

Evaluation infrastructure is the real deliverable. The Bedrock wrapper took a day. The framework took weeks. Being able to add a new model and get a full comparative benchmark in minutes is what makes the system useful.

Model failure modes matter more than aggregate accuracy. The highest-citation model finishing last was the most important finding. In production, you care about how it fails, not just its average success rate.

Retrieval quality bounds generation quality. Investing in better retrieval (multimodal embeddings, figure extraction) would improve every model's performance; switching to a better LLM only helps on questions where retrieval already works.

---

Full presentation at [ML+X Nexus](https://uw-madison-datascience.github.io/ML-X-Nexus/Applications/Videos/Forums/mlx_2026-02-17.html). Source at [github.com/matteso1/KohakuRAG_UI](https://github.com/matteso1/KohakuRAG_UI).
