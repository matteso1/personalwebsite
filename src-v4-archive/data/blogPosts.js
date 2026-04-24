import projectGorgonContent from "./posts/project-gorgon.md?raw";
import madisonBusEtaContent from "./posts/madison-bus-eta.md?raw";
import wattbotRagContent from "./posts/wattbot-rag.md?raw";

const blogPosts = [
  {
    slug: "madison-bus-eta",
    title: "Building a Real-Time Bus Prediction System for Madison Metro",
    subtitle: "279 commits, 44 ML features, one API rate limit, and the Wisconsin winter that started it all.",
    date: "2026-03-04",
    readTime: "12 min read",
    tags: ["Machine Learning", "XGBoost", "React", "DeckGL", "Flask", "PostgreSQL", "PWA"],
    summary: "How I built an ML-powered transit prediction system for UW-Madison that corrects the official API's arrival estimates by learning from historical prediction errors. 44 handcrafted features, nightly retraining, conformal prediction intervals, and a mobile PWA with live bus tracking.",
    github: "https://github.com/matteso1/madison-bus-eta",
    demo: "https://madisonbuseta.com",
    content: madisonBusEtaContent
  },
  {
    slug: "wattbot-rag-bedrock",
    title: "Deploying RAG in AWS Bedrock: Benchmarking 9 LLMs on the WattBot Challenge",
    subtitle: "Ensemble majority voting beat every individual model. The highest-citation model finished last.",
    date: "2026-02-17",
    readTime: "10 min read",
    tags: ["RAG", "AWS Bedrock", "LLM Evaluation", "NLP", "Python", "Ensemble Methods"],
    summary: "How our team deployed the #1 WattBot Challenge RAG system on AWS Bedrock and benchmarked 9 LLMs and 3 ensemble strategies across 282 questions. Built the evaluation framework, cost tracking, and discovered that model behavior matters more than raw accuracy.",
    github: "https://github.com/matteso1/KohakuRAG_UI",
    demo: "https://uw-madison-datascience.github.io/ML-X-Nexus/Applications/Videos/Forums/mlx_2026-02-17.html",
    content: wattbotRagContent
  },
  {
    slug: "project-gorgon",
    title: "Building a Speculative Decoding Engine from Scratch",
    subtitle: "Custom Triton kernels, tree-structured attention, and four bugs that made it 12x slower than baseline.",
    date: "2026-02-12",
    readTime: "15 min read",
    tags: ["CUDA", "Triton", "PyTorch", "LLM Inference", "GPU Kernels", "Speculative Decoding"],
    summary: "How I built a speculative decoding engine for Llama-3-8B with custom Triton/CUDA kernels, Medusa-style draft heads, and adaptive tree pruning. The story of four bugs -- random heads, missing RMSNorm, dead learning rate, and hidden state overhead -- that took it from 0.08x to 0.66x baseline speed.",
    github: "https://github.com/matteso1/ProjectGorgon",
    content: projectGorgonContent
  }
];

export default blogPosts;
