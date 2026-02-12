import projectGorgonContent from "./posts/project-gorgon.md?raw";

const blogPosts = [
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
