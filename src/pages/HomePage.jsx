import React from "react";
import { Link } from "react-router-dom";
import PixelPortrait from "../components/PixelPortrait";
import CardLift from "../components/CardLift";
import blogPosts from "../data/blogPosts";

function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function HomePage() {
  const recent = [...blogPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="q-page">
      <div className="q-epigraph">
        <p className="quote">"I do not know which of us has written this page."</p>
        <span className="quote-greek">No sé cuál de los dos escribe esta página.</span>
        <span className="cite">— Jorge Luis Borges, <em>Borges y yo</em>, 1957</span>
      </div>

      <section className="q-hero">
        <div>
          <h1 className="q-name">
            Nils Matteson<em>.</em>
          </h1>
          <p className="q-tagline">
            Systems and ML infra. Rust, CUDA, a lot of GPU profiler tabs.
            Currently building thaw.
          </p>

          <div className="q-meta">
            <div><span className="k">now</span><span><a href="https://thaw.sh" target="_blank" rel="noreferrer">thaw</a> (YC S26 applicant) · senior at UW</span></div>
            <div><span className="k">edu</span><span>BS data science, UW–Madison '26 → MS CS, Northeastern '28</span></div>
            <div><span className="k">work</span><span>thaw · UW–Madison DoIT (AI research) · AfterQuery (ML eval)</span></div>
            <div><span className="k">next</span><span>bay area · fall '26 · open to intern '27</span></div>
            <div><span className="k">mail</span><span><a href="mailto:nilsmatteson@icloud.com">nilsmatteson@icloud.com</a></span></div>
            <div><span className="k">code</span><span><a href="https://github.com/matteso1" target="_blank" rel="noreferrer">github.com/matteso1</a> · <a href="https://linkedin.com/in/nilsmatteson" target="_blank" rel="noreferrer">linkedin</a></span></div>
          </div>
        </div>

        <div className="q-card-wrap">
          <CardLift>
            <div className="q-card">
              <div className="q-card-hd">
                <span>subject</span>
                <span>n.m</span>
              </div>
              <div className="q-card-portrait">
                <PixelPortrait
                  fill="var(--ink)"
                  eye="var(--c-green)"
                  cell={4}
                  style={{ width: "85%", maxWidth: 160 }}
                />
              </div>
              <div className="q-card-row"><span className="k">origin</span><span>boise, id</span></div>
              <div className="q-card-row"><span className="k">current</span><span>madison, wi</span></div>
              <div className="q-card-row"><span className="k">next</span><span>san jose, ca</span></div>
              <div className="q-card-row"><span className="k">shipping</span><a href="https://thaw.sh" target="_blank" rel="noreferrer">thaw.sh</a></div>
            </div>
          </CardLift>
        </div>
      </section>

      <section className="q-section">
        <div className="q-prose">
          <p>
            I work on systems software. Mostly the parts that touch
            hardware directly — schedulers, allocators, GPU kernels, the
            slow march of bytes through cache lines that decides whether
            something feels fast or feels broken.
          </p>
          <p>
            Lately I've been spending a lot of evenings on the math
            underneath modern ML: scaling laws and the Chinchilla
            compute-optimal frontier, induction heads and the
            superposition / sparse-autoencoder thread out of
            mechanistic interpretability, the now-famous result that
            transformers can be read as <em>doing in-context regression</em>{" "}
            on the prompt. Adjacent to that, causal inference — Pearl's
            do-calculus, potential outcomes, the careful frequentist
            machinery in Hernán &amp; Robins' <em>What If</em>. A lot of
            engineering questions are statistics questions wearing a
            costume, and I'd like to stop being fooled by the costume.
          </p>
          <p>
            The other half of my reading list is older and weirder.
            I'm fascinated by the kind of security that's really
            physics — <a href="https://en.wikipedia.org/wiki/Van_Eck_phreaking" target="_blank" rel="noreferrer">Van Eck phreaking</a>{" "}
            (reconstructing a CRT image from the EM leakage of its
            scan coil), Genkin and Shamir recovering RSA keys from the
            acoustic noise of a laptop's voltage regulator, Kocher's
            differential power analysis, Rowhammer, Spectre, cold-boot
            attacks, the whole genre of "your secrets escape through
            the side of the machine." There is a beautiful seriousness
            to a paper that breaks a cipher with a microphone.
          </p>
          <p>
            Right now I'm shipping <a href="https://thaw.sh" target="_blank" rel="noreferrer">thaw</a> —
            snapshot a live LLM session and fork <em>N</em> divergent
            children that skip prefill. The pitch is one sentence; the
            implementation is a small mountain of Rust. I think it's
            the most interesting thing I've built.
          </p>
          <p>
            Earlier projects, in the order I learned things from them:
            a log engine in Go (concurrency is the only real problem),
            a collaborative editor in Rust and Wasm (CRDTs are
            beautiful and very tired), an ML pipeline that
            out-predicted the Madison bus authority's own arrivals
            page. Earlier still I was a kid in Idaho gluing servos
            into balsa. Most of what I do now still rhymes with that —
            pull something apart, put it back together, feel slightly
            more honest about how it works.
          </p>
          <p>
            Off-hours: producing music in Ableton, running long and
            slow, working through statistics papers at the pace of
            someone who is determined but not in a hurry. If it has a
            spec sheet I will probably read it.
          </p>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="q-section">
          <div className="q-section-hd">writing · recent</div>
          <ul className="q-posts">
            {recent.map((p) => (
              <li key={p.slug}>
                <div className="q-post-meta">{fmt(p.date)} · {p.readTime}</div>
                <Link to={`/writing/${p.slug}`} className="q-post-title">{p.title}</Link>
                <div className="q-post-sub">{p.subtitle}</div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 14 }}>
            <Link to="/writing" className="q-mono" style={{ fontSize: 12, color: "var(--c-green)", textDecoration: "none", borderBottom: "1px solid var(--rule-2)", paddingBottom: 1 }}>
              all posts →
            </Link>
          </div>
        </section>
      )}

      <section className="q-section">
        <div className="q-section-hd">contact</div>
        <div className="q-prose">
          <p className="dim">
            Email's the best way to reach me. If you want to poke around,
            press <kbd style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--c-yellow)", border: "1px solid var(--rule-2)", padding: "1px 6px", fontSize: 12 }}>:</kbd>.
          </p>
        </div>
      </section>
    </div>
  );
}
