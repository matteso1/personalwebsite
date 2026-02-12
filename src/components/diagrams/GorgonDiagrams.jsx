import React from "react";

// Shared styles
const colors = {
    bg: "#0a0a0b",
    surface: "#111113",
    border: "#27272a",
    green: "#00ff9f",
    cyan: "#00d4ff",
    amber: "#ffb800",
    red: "#ff4757",
    muted: "#71717a",
    text: "#e4e4e7",
};

const DiagramContainer = ({ children, title, className = "" }) => (
    <div className={`my-8 ${className}`}>
        {title && (
            <div className="text-xs text-terminal-muted uppercase tracking-wider mb-3 font-mono">
                {title}
            </div>
        )}
        <div className="bg-terminal-surface/50 border border-terminal rounded-sm p-6 overflow-x-auto">
            {children}
        </div>
    </div>
);

// Simple box node component
const Node = ({ x, y, width = 120, height = 40, label, sublabel, color = colors.green, dashed = false }) => (
    <g transform={`translate(${x}, ${y})`}>
        <rect
            width={width}
            height={height}
            rx="2"
            fill={colors.surface}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray={dashed ? "4 2" : "none"}
        />
        <text
            x={width / 2}
            y={sublabel ? height / 2 - 6 : height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.text}
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
        >
            {label}
        </text>
        {sublabel && (
            <text
                x={width / 2}
                y={height / 2 + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colors.muted}
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
            >
                {sublabel}
            </text>
        )}
    </g>
);

// Arrow component
const Arrow = ({ x1, y1, x2, y2, color = colors.muted, label = "" }) => {
    const headSize = 6;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const endX = x2 - headSize * Math.cos(angle);
    const endY = y2 - headSize * Math.sin(angle);

    return (
        <g>
            <line
                x1={x1}
                y1={y1}
                x2={endX}
                y2={endY}
                stroke={color}
                strokeWidth="1.5"
            />
            <polygon
                points={`${x2},${y2} ${x2 - headSize * Math.cos(angle - 0.4)},${y2 - headSize * Math.sin(angle - 0.4)} ${x2 - headSize * Math.cos(angle + 0.4)},${y2 - headSize * Math.sin(angle + 0.4)}`}
                fill={color}
            />
            {label && (
                <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 8}
                    textAnchor="middle"
                    fill={colors.muted}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                >
                    {label}
                </text>
            )}
        </g>
    );
};

// 1. Autoregressive vs Speculative comparison
export const SpeculativeComparison = () => (
    <DiagramContainer title="Autoregressive vs Speculative Decoding">
        <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Autoregressive */}
            <div className="flex-1 max-w-md">
                <div className="text-sm text-terminal-muted mb-4 text-center">Autoregressive (Baseline)</div>
                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <React.Fragment key={i}>
                            <div className="w-16 h-10 border border-terminal-muted flex items-center justify-center text-xs font-mono text-terminal-muted">
                                tok {i}
                            </div>
                            {i < 4 && <div className="text-terminal-muted">→</div>}
                        </React.Fragment>
                    ))}
                </div>
                <div className="text-xs text-terminal-muted text-center mt-3">4 forward passes = 4 tokens</div>
            </div>

            {/* Speculative */}
            <div className="flex-1 max-w-md">
                <div className="text-sm text-terminal-green mb-4 text-center">Speculative (Gorgon)</div>
                <div className="flex items-center justify-center gap-2">
                    <div className="border border-terminal-cyan p-2 text-center">
                        <div className="text-xs font-mono text-terminal-cyan mb-1">Draft</div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-6 border border-terminal-cyan/50 flex items-center justify-center text-[10px] font-mono text-terminal-cyan/70">
                                    {i}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-terminal-muted">→</div>
                    <div className="border border-terminal-green px-4 py-2 text-center">
                        <div className="text-xs font-mono text-terminal-green">Verify</div>
                    </div>
                    <div className="text-terminal-muted">→</div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 border border-terminal-green bg-terminal-green/10 flex items-center justify-center text-xs font-mono text-terminal-green">
                                {i}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-xs text-terminal-green text-center mt-3">1 forward pass = 2-4 tokens</div>
            </div>
        </div>
    </DiagramContainer>
);

// 2. Architecture Overview
export const ArchitectureOverview = () => (
    <DiagramContainer title="System Architecture">
        <svg viewBox="0 0 700 120" className="w-full max-w-3xl mx-auto">
            <Node x={0} y={40} width={70} height={40} label="Prompt" color={colors.muted} />
            <Arrow x1={70} y1={60} x2={90} y2={60} />

            <Node x={90} y={40} width={80} height={40} label="Backbone" sublabel="Llama-3-8B" color={colors.cyan} />
            <Arrow x1={170} y1={60} x2={190} y2={60} />

            <Node x={190} y={40} width={90} height={40} label="Medusa" sublabel="4 heads" color={colors.green} />
            <Arrow x1={280} y1={60} x2={300} y2={60} />

            <Node x={300} y={40} width={90} height={40} label="Tree Build" sublabel="+ pruning" color={colors.amber} />
            <Arrow x1={390} y1={60} x2={410} y2={60} />

            <Node x={410} y={40} width={90} height={40} label="Tree Attn" sublabel="Triton/CUDA" color={colors.cyan} />
            <Arrow x1={500} y1={60} x2={520} y2={60} />

            <Node x={520} y={40} width={70} height={40} label="Verify" color={colors.green} />
            <Arrow x1={590} y1={60} x2={610} y2={60} />

            <Node x={610} y={40} width={70} height={40} label="Output" color={colors.green} />

            {/* Loop back arrow */}
            <path
                d="M 645 85 L 645 100 L 130 100 L 130 85"
                fill="none"
                stroke={colors.muted}
                strokeWidth="1"
                strokeDasharray="4 2"
            />
            <polygon points="130,85 126,92 134,92" fill={colors.muted} />
            <text x="400" y="112" textAnchor="middle" fill={colors.muted} fontSize="9" fontFamily="JetBrains Mono, monospace">
                loop until done
            </text>
        </svg>
    </DiagramContainer>
);

// 3. Head Architecture (before fix)
export const HeadArchitectureBefore = () => (
    <DiagramContainer title="Head Architecture (Initial - Broken)">
        <svg viewBox="0 0 500 80" className="w-full max-w-xl mx-auto">
            <Node x={0} y={20} width={100} height={40} label="Hidden" sublabel="4096-dim" color={colors.muted} />
            <Arrow x1={100} y1={40} x2={120} y2={40} />

            <Node x={120} y={20} width={80} height={40} label="Linear" color={colors.muted} />
            <Arrow x1={200} y1={40} x2={220} y2={40} />

            <Node x={220} y={20} width={60} height={40} label="SiLU" color={colors.muted} />
            <Arrow x1={280} y1={40} x2={300} y2={40} />

            <Node x={300} y={20} width={80} height={40} label="lm_head" color={colors.muted} />
            <Arrow x1={380} y1={40} x2={400} y2={40} />

            <Node x={400} y={20} width={70} height={40} label="Logits" color={colors.red} />

            {/* Skip connection */}
            <path d="M 50 60 L 50 70 L 340 70 L 340 60" fill="none" stroke={colors.muted} strokeWidth="1" strokeDasharray="3 2" />
            <text x="195" y="78" textAnchor="middle" fill={colors.muted} fontSize="8" fontFamily="JetBrains Mono, monospace">skip</text>

            {/* Problem indicator */}
            <text x={435} y={75} textAnchor="middle" fill={colors.red} fontSize="9" fontFamily="JetBrains Mono, monospace">
                0.2% accept
            </text>
        </svg>
    </DiagramContainer>
);

// 4. Head Architecture (after fix)
export const HeadArchitectureAfter = () => (
    <DiagramContainer title="Head Architecture (Fixed)">
        <svg viewBox="0 0 580 80" className="w-full max-w-2xl mx-auto">
            <Node x={0} y={20} width={100} height={40} label="Hidden" sublabel="pre-norm" color={colors.muted} />
            <Arrow x1={100} y1={40} x2={120} y2={40} />

            <Node x={120} y={20} width={80} height={40} label="RMSNorm" sublabel="frozen" color={colors.amber} dashed={true} />
            <Arrow x1={200} y1={40} x2={220} y2={40} />

            <Node x={220} y={20} width={100} height={40} label="ResidualBlock" color={colors.green} />
            <Arrow x1={320} y1={40} x2={340} y2={40} />

            <Node x={340} y={20} width={80} height={40} label="lm_head" color={colors.green} />
            <Arrow x1={420} y1={40} x2={440} y2={40} />

            <Node x={440} y={20} width={70} height={40} label="Logits" color={colors.green} />

            {/* Key insight */}
            <text x={160} y={75} textAnchor="middle" fill={colors.amber} fontSize="9" fontFamily="JetBrains Mono, monospace">
                key fix
            </text>
        </svg>
    </DiagramContainer>
);

// 5. Candidate Tree
export const CandidateTree = () => (
    <DiagramContainer title="Candidate Tree Structure (4 heads x top-k=4)">
        <svg viewBox="0 0 400 200" className="w-full max-w-lg mx-auto">
            {/* Root */}
            <circle cx={200} cy={20} r={12} fill={colors.surface} stroke={colors.cyan} strokeWidth="2" />
            <text x={200} y={24} textAnchor="middle" fill={colors.cyan} fontSize="10" fontFamily="JetBrains Mono, monospace">r</text>

            {/* Level 1 - Head 1 */}
            {[0, 1, 2, 3].map((i) => {
                const x = 80 + i * 80;
                return (
                    <g key={`l1-${i}`}>
                        <line x1={200} y1={32} x2={x} y2={55} stroke={colors.muted} strokeWidth="1" />
                        <circle cx={x} cy={65} r={10} fill={colors.surface} stroke={colors.green} strokeWidth="1.5" />
                        <text x={x} y={69} textAnchor="middle" fill={colors.green} fontSize="8" fontFamily="JetBrains Mono, monospace">h1</text>
                    </g>
                );
            })}

            {/* Level 2 - Head 2 (only show first branch expanded) */}
            {[0, 1, 2, 3].map((i) => {
                const x = 40 + i * 25;
                return (
                    <g key={`l2-${i}`}>
                        <line x1={80} y1={75} x2={x} y2={105} stroke={colors.muted} strokeWidth="1" />
                        <circle cx={x} cy={115} r={8} fill={colors.surface} stroke={colors.amber} strokeWidth="1" />
                        <text x={x} y={118} textAnchor="middle" fill={colors.amber} fontSize="7" fontFamily="JetBrains Mono, monospace">h2</text>
                    </g>
                );
            })}

            {/* Level 3 - Head 3 */}
            {[0, 1].map((i) => {
                const x = 30 + i * 20;
                return (
                    <g key={`l3-${i}`}>
                        <line x1={40} y1={123} x2={x} y2={145} stroke={colors.muted} strokeWidth="1" />
                        <circle cx={x} cy={155} r={6} fill={colors.surface} stroke={colors.red} strokeWidth="1" />
                        <text x={x} y={158} textAnchor="middle" fill={colors.red} fontSize="6" fontFamily="JetBrains Mono, monospace">h3</text>
                    </g>
                );
            })}

            {/* Ellipsis indicators */}
            <text x={160} y={120} fill={colors.muted} fontSize="10" fontFamily="JetBrains Mono, monospace">...</text>
            <text x={240} y={80} fill={colors.muted} fontSize="10" fontFamily="JetBrains Mono, monospace">...</text>
            <text x={60} y={165} fill={colors.muted} fontSize="10" fontFamily="JetBrains Mono, monospace">...</text>

            {/* Legend */}
            <g transform="translate(280, 100)">
                <text x={0} y={0} fill={colors.text} fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">Totals:</text>
                <text x={0} y={16} fill={colors.green} fontSize="9" fontFamily="JetBrains Mono, monospace">L1: 4</text>
                <text x={0} y={30} fill={colors.amber} fontSize="9" fontFamily="JetBrains Mono, monospace">L2: 16</text>
                <text x={0} y={44} fill={colors.red} fontSize="9" fontFamily="JetBrains Mono, monospace">L3: 64</text>
                <text x={0} y={58} fill={colors.muted} fontSize="9" fontFamily="JetBrains Mono, monospace">L4: 256</text>
                <text x={0} y={76} fill={colors.text} fontSize="10" fontFamily="JetBrains Mono, monospace">= 340 total</text>
            </g>
        </svg>
    </DiagramContainer>
);

// 6. Tree Attention Mask comparison
export const TreeAttentionMask = () => (
    <DiagramContainer title="Causal vs Tree Attention Masks">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            {/* Causal Mask */}
            <div>
                <div className="text-sm text-terminal-muted mb-3 text-center">Standard Causal</div>
                <div className="grid grid-cols-4 gap-1 font-mono text-xs">
                    {[
                        [1, 0, 0, 0],
                        [1, 1, 0, 0],
                        [1, 1, 1, 0],
                        [1, 1, 1, 1],
                    ].map((row, i) =>
                        row.map((val, j) => (
                            <div
                                key={`c-${i}-${j}`}
                                className={`w-8 h-8 flex items-center justify-center border ${val ? "bg-terminal-green/20 border-terminal-green/50 text-terminal-green" : "border-terminal/50 text-terminal-muted/30"}`}
                            >
                                {val}
                            </div>
                        ))
                    )}
                </div>
                <div className="text-xs text-terminal-muted text-center mt-2">triangular</div>
            </div>

            {/* Tree Mask */}
            <div>
                <div className="text-sm text-terminal-cyan mb-3 text-center">Tree Attention</div>
                <div className="grid grid-cols-5 gap-1 font-mono text-xs">
                    {[
                        [1, 0, 0, 0, 0],
                        [1, 1, 0, 0, 0],
                        [1, 0, 1, 0, 0],
                        [1, 1, 0, 1, 0],
                        [1, 0, 1, 0, 1],
                    ].map((row, i) =>
                        row.map((val, j) => (
                            <div
                                key={`t-${i}-${j}`}
                                className={`w-8 h-8 flex items-center justify-center border ${val ? "bg-terminal-cyan/20 border-terminal-cyan/50 text-terminal-cyan" : "border-terminal/50 text-terminal-muted/30"}`}
                            >
                                {val}
                            </div>
                        ))
                    )}
                </div>
                <div className="text-xs text-terminal-muted text-center mt-2">ancestor-based</div>
            </div>
        </div>
    </DiagramContainer>
);

// 7. Pruning Strategies
export const PruningStrategies = () => (
    <DiagramContainer title="Adaptive Pruning Strategies">
        <div className="flex flex-col md:flex-row gap-6 justify-center">
            <div className="flex-1 max-w-xs border border-terminal p-4">
                <div className="text-terminal-green font-mono text-sm mb-2">Confidence</div>
                <div className="text-terminal-muted text-xs mb-3">Prune if p {"<"} threshold</div>
                <div className="flex gap-2">
                    <div className="px-2 py-1 border border-terminal-green/50 text-terminal-green text-xs">0.4</div>
                    <div className="px-2 py-1 border border-terminal-green/50 text-terminal-green text-xs">0.3</div>
                    <div className="px-2 py-1 border border-terminal-red/50 text-terminal-red/50 text-xs line-through">0.02</div>
                </div>
            </div>

            <div className="flex-1 max-w-xs border border-terminal p-4">
                <div className="text-terminal-amber font-mono text-sm mb-2">Path Probability</div>
                <div className="text-terminal-muted text-xs mb-3">Cumulative product along path</div>
                <div className="text-xs font-mono">
                    <span className="text-terminal-green">0.4</span>
                    <span className="text-terminal-muted"> x </span>
                    <span className="text-terminal-green">0.3</span>
                    <span className="text-terminal-muted"> = </span>
                    <span className="text-terminal-amber">0.12</span>
                </div>
            </div>

            <div className="flex-1 max-w-xs border border-terminal p-4">
                <div className="text-terminal-cyan font-mono text-sm mb-2">Entropy-Weighted</div>
                <div className="text-terminal-muted text-xs mb-3">Uncertain heads explore more</div>
                <div className="text-xs font-mono">
                    <div><span className="text-terminal-muted">high entropy:</span> <span className="text-terminal-cyan">lower threshold</span></div>
                    <div><span className="text-terminal-muted">low entropy:</span> <span className="text-terminal-cyan">prune more</span></div>
                </div>
            </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
            <div className="text-terminal-muted text-sm">340 candidates</div>
            <div className="text-terminal-muted">→</div>
            <div className="text-terminal-green text-sm font-mono">20-50 candidates</div>
        </div>
    </DiagramContainer>
);

// 8. Kernel Comparison
export const KernelComparison = () => (
    <DiagramContainer title="Mask Materialization vs Fused Kernel">
        <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Standard */}
            <div className="flex-1 max-w-xs">
                <div className="text-sm text-terminal-muted mb-3 text-center">Standard Triton</div>
                <div className="border border-terminal-red/50 p-4 space-y-2">
                    <div className="text-xs font-mono text-terminal-muted">1. Allocate N x N mask</div>
                    <div className="text-xs font-mono text-terminal-red">   115,600 booleans</div>
                    <div className="text-xs font-mono text-terminal-muted">2. Load mask per row</div>
                    <div className="text-xs font-mono text-terminal-muted">3. Apply in attention</div>
                </div>
                <div className="text-xs text-terminal-red text-center mt-2">O(N^2) memory</div>
            </div>

            {/* Fused */}
            <div className="flex-1 max-w-xs">
                <div className="text-sm text-terminal-green mb-3 text-center">Fused Mask-Free</div>
                <div className="border border-terminal-green/50 p-4 space-y-2">
                    <div className="text-xs font-mono text-terminal-muted">1. Store parents array</div>
                    <div className="text-xs font-mono text-terminal-green">   340 int32s</div>
                    <div className="text-xs font-mono text-terminal-muted">2. Walk in registers</div>
                    <div className="text-xs font-mono text-terminal-muted">3. Bitmask attention</div>
                </div>
                <div className="text-xs text-terminal-green text-center mt-2">O(N) memory - 340x smaller</div>
            </div>
        </div>
    </DiagramContainer>
);

// 9. Speculative Loop (simplified sequence)
export const SpeculativeLoop = () => (
    <DiagramContainer title="Speculative Decoding Loop">
        <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-3">
                {/* Step 1 */}
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border border-terminal-cyan flex items-center justify-center text-terminal-cyan text-sm font-mono">1</div>
                    <div className="flex-1 border border-terminal p-3">
                        <span className="text-terminal-cyan font-mono text-sm">Prefill</span>
                        <span className="text-terminal-muted text-sm ml-2">- backbone processes prompt, caches KV</span>
                    </div>
                </div>

                {/* Loop indicator */}
                <div className="ml-4 border-l-2 border-terminal-green/30 pl-8 py-2">
                    <div className="text-xs text-terminal-green uppercase tracking-wider mb-3">repeat until done:</div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-6 h-6 rounded-full border border-terminal-green flex items-center justify-center text-terminal-green text-xs font-mono">2</div>
                        <div className="flex-1 text-sm">
                            <span className="text-terminal-green font-mono">Draft</span>
                            <span className="text-terminal-muted"> - heads generate candidate tree</span>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-6 h-6 rounded-full border border-terminal-amber flex items-center justify-center text-terminal-amber text-xs font-mono">3</div>
                        <div className="flex-1 text-sm">
                            <span className="text-terminal-amber font-mono">Prune</span>
                            <span className="text-terminal-muted"> - adaptive pruning reduces tree</span>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-6 h-6 rounded-full border border-terminal-cyan flex items-center justify-center text-terminal-cyan text-xs font-mono">4</div>
                        <div className="flex-1 text-sm">
                            <span className="text-terminal-cyan font-mono">Verify</span>
                            <span className="text-terminal-muted"> - single backbone pass, tree attention</span>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-6 h-6 rounded-full border border-terminal-green flex items-center justify-center text-terminal-green text-xs font-mono">5</div>
                        <div className="flex-1 text-sm">
                            <span className="text-terminal-green font-mono">Accept</span>
                            <span className="text-terminal-muted"> - longest matching path + bonus token</span>
                        </div>
                    </div>

                    {/* Step 6 */}
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full border border-terminal-muted flex items-center justify-center text-terminal-muted text-xs font-mono">6</div>
                        <div className="flex-1 text-sm">
                            <span className="text-terminal-muted font-mono">Trim KV</span>
                            <span className="text-terminal-muted"> - discard rejected branches</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DiagramContainer>
);

// 10. Training Pipeline
export const TrainingPipeline = () => (
    <DiagramContainer title="Knowledge Distillation Training">
        <svg viewBox="0 0 500 140" className="w-full max-w-xl mx-auto">
            {/* Data */}
            <Node x={0} y={50} width={80} height={40} label="WikiText" color={colors.muted} />

            {/* Backbone */}
            <Arrow x1={80} y1={70} x2={110} y2={70} />
            <Node x={110} y={50} width={90} height={40} label="Backbone" sublabel="frozen" color={colors.cyan} />

            {/* Hidden states */}
            <Arrow x1={200} y1={70} x2={230} y2={70} />
            <Node x={230} y={50} width={80} height={40} label="Hidden" color={colors.muted} />

            {/* Medusa heads */}
            <Arrow x1={310} y1={70} x2={340} y2={70} />
            <Node x={340} y={50} width={80} height={40} label="Heads" sublabel="trainable" color={colors.green} />

            {/* Logits */}
            <Arrow x1={420} y1={70} x2={450} y2={50} />

            {/* Targets from data */}
            <Arrow x1={40} y1={90} x2={40} y2={120} color={colors.muted} />
            <path d="M 40 120 L 450 120 L 450 90" fill="none" stroke={colors.muted} strokeWidth="1" />

            {/* Loss */}
            <circle cx={450} cy={70} r={20} fill={colors.surface} stroke={colors.amber} strokeWidth="1.5" />
            <text x={450} y={74} textAnchor="middle" fill={colors.amber} fontSize="9" fontFamily="JetBrains Mono, monospace">CE</text>
            <text x={450} y={105} textAnchor="middle" fill={colors.muted} fontSize="8" fontFamily="JetBrains Mono, monospace">loss</text>

            {/* Gradient arrow back */}
            <path d="M 430 70 Q 385 20 340 50" fill="none" stroke={colors.green} strokeWidth="1" strokeDasharray="3 2" />
            <text x={385} y={25} textAnchor="middle" fill={colors.green} fontSize="8" fontFamily="JetBrains Mono, monospace">gradients</text>
        </svg>

        <div className="flex flex-wrap justify-center gap-6 mt-4 text-xs font-mono">
            <div><span className="text-terminal-muted">steps:</span> <span className="text-terminal-green">30k</span></div>
            <div><span className="text-terminal-muted">lr:</span> <span className="text-terminal-green">3e-4</span></div>
            <div><span className="text-terminal-muted">batch:</span> <span className="text-terminal-green">16</span></div>
            <div><span className="text-terminal-muted">params:</span> <span className="text-terminal-green">~8M</span></div>
        </div>
    </DiagramContainer>
);

// Export all diagrams
export default {
    SpeculativeComparison,
    ArchitectureOverview,
    HeadArchitectureBefore,
    HeadArchitectureAfter,
    CandidateTree,
    TreeAttentionMask,
    PruningStrategies,
    KernelComparison,
    SpeculativeLoop,
    TrainingPipeline,
};
