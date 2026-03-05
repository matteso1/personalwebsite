# Deploying RAG in AWS Bedrock: Benchmarking 9 LLMs on the WattBot Challenge

*Ensemble majority voting beat every individual model. The highest-citation model finished last. Text-only embeddings create a ceiling no LLM can overcome.*

---

## The Project

KohakuRAG was the #1 solution to the [2025 WSDM WattBot Challenge](https://www.kaggle.com/competitions/WattBot2025/overview) -- a competition where teams built retrieval-augmented generation (RAG) systems that answer sustainability questions about AI workloads by citing academic papers. The task: given a question, retrieve relevant passages from a corpus of papers and generate a citation-backed answer. If the evidence is insufficient, the system should abstain rather than hallucinate.

Our team took KohakuRAG and deployed it two ways: a fully serverless pipeline on AWS Bedrock (my focus), and a local open-source deployment (Blaise's focus). I built the Bedrock integration, the evaluation framework, and the cost tracking infrastructure. Then we benchmarked everything.

I presented this work at the [ML+X community meeting](https://uw-madison-datascience.github.io/ML-X-Nexus/Applications/Videos/Forums/mlx_2026-02-17.html) at UW-Madison on February 17, 2026.

## The RAG Pipeline

The system follows a standard RAG architecture with a few important design decisions:

1. **Retrieval.** The corpus is chunked academic papers. Queries are embedded and matched against chunk embeddings using cosine similarity. The top-k chunks become the LLM's context window.

2. **Generation.** The LLM receives the retrieved chunks plus the question and produces an answer with citations. The prompt instructs the model to cite specific passages and to abstain if the evidence does not support an answer.

3. **Abstention.** This is the hard part. A model that always answers will hallucinate when the retrieved context is insufficient. A model that abstains too aggressively leaves easy questions unanswered. The right balance depends on the model's confidence calibration and the quality of retrieval.

## AWS Bedrock Integration

Bedrock gives you a unified API to call models from Anthropic, Meta, Mistral, Amazon, and others without managing infrastructure. The integration is straightforward -- `boto3` calls to `bedrock-runtime` -- but the operational details matter:

**Cost tracking.** Each model has different per-token pricing. I built a cost tracker that logs input tokens, output tokens, and total cost per question per model. Across 282 questions and 9 models, costs ranged from pennies (Llama models) to dollars (Claude 3.5 Sonnet). This data feeds directly into the production decision: if two models have similar accuracy, you pick the cheaper one.

**Latency measurement.** End-to-end latency per question, including retrieval and generation. Some models are 3x faster than others at similar quality. For a user-facing application, this matters as much as accuracy.

**Error handling and retries.** Bedrock has rate limits and occasional throttling. The framework handles retries with exponential backoff and logs throttle events so you can right-size your provisioned throughput.

## Benchmarking 9 LLMs

We ran 282 questions from the WattBot evaluation set through 9 models available on Bedrock:

The evaluation framework scores each answer on:
- **Accuracy** -- does the answer correctly address the question?
- **Citation quality** -- are citations grounded in the retrieved passages?
- **Abstention appropriateness** -- does the model correctly abstain on unanswerable questions?
- **Overall score** -- weighted combination

## Results That Stood Out

**Ensemble majority voting (0.840) outperformed every individual model.** We ran 3-model ensembles where each model independently answers the question, then a majority vote selects the final answer. The ensemble's accuracy exceeded the best individual model. This is the "wisdom of the crowd" effect -- models make different mistakes, and voting filters out individual errors.

**But ensembles are not always worth it.** When we tested ensembles of similar models (e.g., all Qwen variants), the ensemble barely improved over the best individual. Ensembling only helps when models have genuinely different reasoning patterns. Otherwise you are paying 3x the cost and latency for the same answer.

**Llama 4 Maverick delivered 98% of the top score at a fraction of the cost and latency.** For most production deployments, this is the answer. The absolute best model might score 2% higher, but if it costs 10x more and takes 3x longer, the tradeoff is not worth it.

**The highest-citation model finished last overall.** One model aggressively cited passages for every answer, which sounds good until you realize it also refused to abstain on genuinely unanswerable questions -- instead fabricating citations to passages that did not support its claims. High citation count without citation accuracy is worse than no citations at all. This was the clearest example of why you cannot optimize a single metric in isolation.

**Text-only embeddings create a ceiling on figure-based questions.** Many academic papers contain key data in figures and tables. Our retrieval pipeline used text-only embeddings, which means figure-based information was invisible to the retriever. No matter how good the LLM is, if the relevant evidence is in a chart that was never retrieved, it cannot answer correctly. This is a retrieval problem, not a generation problem, and it sets a hard ceiling on system performance for certain question types.

## The Evaluation Framework

Building the evaluation framework was more work than building the Bedrock integration. The challenge:

**Reproducibility.** Every run must produce identical results given the same inputs. Random seeds, model temperature (set to 0 where possible), and deterministic retrieval ordering.

**Comparability.** Models have different output formats. Some return structured JSON, others return free text with inline citations. The evaluation parser handles all formats and extracts answers and citations into a normalized schema.

**Cost attribution.** Each question's cost is tracked per model. Aggregate cost reports show cost-per-correct-answer, which is the metric that actually matters for budgeting. A cheap model that gets 60% right costs more per correct answer than an expensive model that gets 95% right.

## What I Learned

**Evaluation infrastructure is the real deliverable.** The Bedrock wrapper took a day. The evaluation framework took weeks. Being able to add a new model and get a full comparative benchmark in minutes is what makes the system useful beyond this one competition. When Bedrock adds a new model, we can evaluate it against our full benchmark in a single command.

**Model behavior > raw accuracy.** The highest-citation model finishing last was the most important finding. In production, you care about the failure modes, not just the success rate. A model that confidently hallucinates is more dangerous than one that occasionally abstains.

**Cost and latency are first-class metrics.** Academic benchmarks report accuracy. Production systems optimize accuracy per dollar per second. The evaluation framework tracks all three because the deployment decision depends on all three.

**Retrieval quality bounds generation quality.** The text-only embedding ceiling demonstrates that RAG system performance is fundamentally limited by retrieval. Investing in better retrieval (multimodal embeddings, figure extraction, table parsing) would improve every model's performance, while switching to a better LLM only helps on questions where retrieval already works.

## Acknowledgments

Thank you to [Christopher Endemann](https://hub.datascience.wisc.edu/communities/mlx/) for the mentorship and for bringing me onto this project. I learned more about applied ML infrastructure in a few months than in any course. Thank you to Blaise Manga Enuh for the collaboration on the local deployment pipeline.

---

*The full presentation is available on [ML+X Nexus](https://uw-madison-datascience.github.io/ML-X-Nexus/Applications/Videos/Forums/mlx_2026-02-17.html). Source code at [github.com/matteso1/KohakuRAG_UI](https://github.com/matteso1/KohakuRAG_UI).*
