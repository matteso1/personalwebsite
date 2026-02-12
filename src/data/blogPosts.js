import projectGorgonContent from "./posts/project-gorgon.md?raw";

const blogPosts = [
  {
    slug: "project-gorgon",
    title: "Building a Speculative Decoding Engine from Scratch",
    subtitle: "Custom Triton kernels, tree-structured attention, adaptive pruning, and the debugging story of a missing normalization layer.",
    date: "2026-02-11",
    readTime: "15 min read",
    tags: ["CUDA", "Triton", "PyTorch", "LLM Inference", "GPU Kernels", "Speculative Decoding"],
    summary: "A deep dive into Project Gorgon — how I built a speculative decoding engine for Llama-3-8B with custom Triton/CUDA kernels, adaptive tree pruning, and Medusa-style draft heads. Covers the architecture, the debugging story of a missing RMSNorm layer that caused 0.2% acceptance rates, and three custom GPU kernel implementations.",
    github: "https://github.com/matteso1/ProjectGorgon",
    content: projectGorgonContent
  }
];

export default blogPosts;
