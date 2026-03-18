import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cache-strategies',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="blog-wrap">

      <div class="read-progress" [style.width.%]="readingProgress"></div>

      <!-- ── HERO ── -->
      <section class="hero">
        <div class="back-link" routerLink="/blogs">
          <i class="fas fa-arrow-left"></i> All Articles
        </div>
        <div class="hero-eyebrow">System Design · Caching · Distributed Systems</div>
        <h1>Cache Strategies in<br/><span class="highlight">Distributed Systems</span></h1>
        <p class="hero-sub">
          Basic TTL caching breaks at scale. Here are six production-grade strategies —
          Jitter, Probabilistic Early Expiry, Mutex Locking, Stale-While-Revalidate,
          Cache Warming — and exactly when to use each one.
        </p>
        <div class="hero-meta">
          <div class="hero-meta-item">
            <span class="hero-meta-label">Topic</span>
            <span class="hero-meta-value">Advanced Cache Strategies</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Covers</span>
            <span class="hero-meta-value">Redis · CDN · Distributed Caching</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Level</span>
            <span class="hero-meta-value">Intermediate</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Read Time</span>
            <span class="hero-meta-value">15 min</span>
          </div>
        </div>
      </section>

      <!-- ── TOC ── -->
      <div class="toc-bar">
        <a href="#problem">The Problem</a>
        <a href="#jitter">TTL Jitter</a>
        <a href="#probabilistic">Probabilistic Expiry</a>
        <a href="#mutex">Mutex Locking</a>
        <a href="#swr">Stale-While-Revalidate</a>
        <a href="#warming">Cache Warming</a>
        <a href="#tradeoffs">Tradeoffs</a>
        <a href="#selector">When to Use</a>
        <a href="#realworld">Real World</a>
      </div>

      <!-- ── MAIN ── -->
      <main>

        <!-- ─── 1. THE PROBLEM ─── -->
        <section id="problem">
          <div class="section-label">01 · The Root Problem</div>
          <h2 class="section-title">Why Basic TTL Caching Breaks at Scale</h2>
          <div class="section-body">
            <p>
              The simplest caching strategy is also the most dangerous at scale: set a key,
              assign a fixed TTL, and let it expire. When hundreds of keys are written at the
              same moment — during a deployment, a batch job, or a service restart — they all
              share the same TTL offset. They were born together. They die together.
            </p>
            <p>
              When that shared expiry moment arrives, every application server simultaneously
              detects a cache miss for every hot key. Every server independently fires the
              same set of database queries. A system that was happily serving millions of
              requests from cache suddenly routes everything to the database in one synchronized
              burst. The database, designed to handle a trickle of cache misses, drowns.
            </p>
          </div>

          <div class="callout callout-warn">
            <span class="callout-icon">⚠️</span>
            <div class="callout-text">
              <strong>The synchronized expiry trap:</strong> The more keys you cache at once
              (deployments, batch hydration, service restarts), the larger the synchronized expiry
              event. A 10,000-key warm-up at startup means 10,000 simultaneous cache misses
              exactly TTL seconds later.
            </div>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>synchronized-ttl-expiry.svg — the root problem visualized</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 300" height="300">
                <defs>
                  <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#64748b"/>
                  </marker>
                  <marker id="ah-r" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#f87171"/>
                  </marker>
                  <marker id="ah-g" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#34d399"/>
                  </marker>
                  <marker id="ah-o" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#f97316"/>
                  </marker>
                </defs>

                <!-- Phase labels -->
                <text x="200" y="16" class="ns" text-anchor="middle" fill="#34d399">PHASE 1: Keys cached at t=0 (same moment)</text>
                <text x="680" y="16" class="ns" text-anchor="middle" fill="#f87171">PHASE 2: All expire at t=60 → DB hammered</text>
                <line x1="450" y1="8" x2="450" y2="275" stroke="#f97316" stroke-width="2" stroke-dasharray="6,4"/>
                <text x="458" y="24" class="ns" fill="#f97316">TTL=0</text>

                <!-- Key bars (cached phase) -->
                <rect x="20" y="32" width="425" height="22" rx="4" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="20" y="62" width="425" height="22" rx="4" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="20" y="92" width="425" height="22" rx="4" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="20" y="122" width="425" height="22" rx="4" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="20" y="152" width="425" height="22" rx="4" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <text x="28" y="47"  class="ns" fill="#34d399">Key: user_feed      [CACHED — HIT ✓]</text>
                <text x="28" y="77"  class="ns" fill="#34d399">Key: trending_now   [CACHED — HIT ✓]</text>
                <text x="28" y="107" class="ns" fill="#34d399">Key: homepage_data  [CACHED — HIT ✓]</text>
                <text x="28" y="137" class="ns" fill="#34d399">Key: product_list   [CACHED — HIT ✓]</text>
                <text x="28" y="167" class="ns" fill="#34d399">Key: recommendations[CACHED — HIT ✓]</text>

                <!-- Expired phase -->
                <rect x="450" y="32"  width="160" height="22" rx="4" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1.5" class="pulse"/>
                <rect x="450" y="62"  width="160" height="22" rx="4" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1.5" class="pulse" style="animation-delay:.1s"/>
                <rect x="450" y="92"  width="160" height="22" rx="4" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1.5" class="pulse" style="animation-delay:.2s"/>
                <rect x="450" y="122" width="160" height="22" rx="4" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1.5" class="pulse" style="animation-delay:.3s"/>
                <rect x="450" y="152" width="160" height="22" rx="4" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1.5" class="pulse" style="animation-delay:.4s"/>
                <text x="458" y="47"  class="ns" fill="#f87171">MISS → DB query #1</text>
                <text x="458" y="77"  class="ns" fill="#f87171">MISS → DB query #2</text>
                <text x="458" y="107" class="ns" fill="#f87171">MISS → DB query #3</text>
                <text x="458" y="137" class="ns" fill="#f87171">MISS → DB query #4</text>
                <text x="458" y="167" class="ns" fill="#f87171">MISS → DB query #5</text>

                <!-- DB box -->
                <rect x="630" y="28" width="110" height="170" rx="12" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="2"/>
                <text x="685" y="100" class="nl" text-anchor="middle" fill="#f87171">DB</text>
                <text x="685" y="118" class="ns" text-anchor="middle">5 simultaneous</text>
                <text x="685" y="133" class="ns" text-anchor="middle">queries</text>
                <text x="685" y="151" class="ns" text-anchor="middle" fill="#fbbf24">⚠ OVERLOAD</text>
                <text x="685" y="168" class="ns" text-anchor="middle" fill="#f87171">→ cascade</text>
                <line x1="610" y1="43"  x2="628" y2="70"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="610" y1="73"  x2="628" y2="95"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="610" y1="103" x2="628" y2="115" stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="610" y1="133" x2="628" y2="138" stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="610" y1="163" x2="628" y2="160" stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>

                <!-- Time axis -->
                <line x1="20" y1="200" x2="750" y2="200" stroke="#1a2640" stroke-width="1.5"/>
                <text x="20"  y="216" class="ns" fill="#64748b">t = 0s</text>
                <text x="200" y="216" class="ns" fill="#64748b">t = 30s</text>
                <text x="440" y="216" class="ns" fill="#f97316">t = 60s ← all TTLs expire here</text>
                <text x="730" y="216" class="ns" fill="#64748b">t = 65s</text>

                <!-- DB load bar -->
                <text x="20" y="240" class="ns" fill="#64748b">DB query load:</text>
                <rect x="20" y="248" width="430" height="10" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <text x="225" y="258" class="ns" text-anchor="middle" fill="#34d399">~0 queries (cache serving all)</text>
                <rect x="450" y="248" width="160" height="10" rx="3" fill="rgba(248,113,113,0.8)" stroke="#f87171" stroke-width="1"/>
                <text x="530" y="258" class="ns" text-anchor="middle" fill="#f87171">SPIKE</text>
                <rect x="610" y="248" width="140" height="10" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <text x="680" y="258" class="ns" text-anchor="middle" fill="#34d399">~0 (refilled)</text>

                <text x="20" y="285" class="ns" fill="#fbbf24">⚠ All 5 keys share TTL=60s → all expire at the exact same millisecond → stampede</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Five hot cache keys, all set at t=0 with TTL=60s. For 59 seconds the database gets zero queries. At exactly t=60s, all five expire simultaneously, creating 5 duplicate DB queries from every app instance. With 50 instances × 5 queries = 250 DB queries in one burst.
            </div>
          </div>
        </section>

        <!-- ─── 2. TTL JITTER ─── -->
        <section id="jitter">
          <div class="section-label">02 · Strategy One</div>
          <h2 class="section-title">TTL Jitter — The Simplest Fix</h2>
          <div class="section-body">
            <p>
              The fix is almost embarrassingly simple: instead of every key sharing the same TTL,
              add a small random offset to each one. Instead of <code>TTL = 60</code>, use
              <code>TTL = 60 + random(0, 20)</code>. The keys still expire around the 60-second
              mark — but they now expire at <em>different</em> moments, spread over a 20-second
              window. No synchronized mass-expiry event. No stampede.
            </p>
            <p>
              This requires zero architectural changes. It is a one-line change in the code that
              sets cache keys. The tradeoff is that some keys are served slightly stale for a bit
              longer than intended — but this is almost always acceptable. The goal of TTL is
              approximate freshness, not exact freshness.
            </p>
          </div>

          <div class="callout callout-good">
            <span class="callout-icon">✅</span>
            <div class="callout-text">
              <strong>Best first line of defense.</strong> TTL jitter is free, trivially implementable,
              and eliminates the synchronized expiry problem. Every caching system should use it.
              <code>TTL = base_ttl + Math.random() * jitter_range</code>
            </div>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>ttl-jitter-before-after.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 310" height="310">
                <!-- WITHOUT jitter -->
                <text x="10" y="16" class="nl" fill="#f87171">WITHOUT Jitter — synchronized mass-expiry</text>

                <rect x="10" y="28" width="400" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="52" width="400" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="76" width="400" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="100" width="400" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="124" width="400" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <text x="14" y="42"  class="ns" fill="#34d399">user_feed     TTL=60s</text>
                <text x="14" y="66"  class="ns" fill="#34d399">trending_now  TTL=60s</text>
                <text x="14" y="90"  class="ns" fill="#34d399">homepage      TTL=60s</text>
                <text x="14" y="114" class="ns" fill="#34d399">product_list  TTL=60s</text>
                <text x="14" y="138" class="ns" fill="#34d399">recommendations TTL=60s</text>

                <line x1="410" y1="20" x2="410" y2="150" stroke="#f97316" stroke-width="2" stroke-dasharray="5,4"/>
                <text x="415" y="18" class="ns" fill="#f97316">All expire at t=60</text>

                <rect x="410" y="28"  width="140" height="18" rx="3" fill="rgba(248,113,113,0.25)" stroke="#f87171" stroke-width="1"/>
                <rect x="410" y="52"  width="140" height="18" rx="3" fill="rgba(248,113,113,0.25)" stroke="#f87171" stroke-width="1"/>
                <rect x="410" y="76"  width="140" height="18" rx="3" fill="rgba(248,113,113,0.25)" stroke="#f87171" stroke-width="1"/>
                <rect x="410" y="100" width="140" height="18" rx="3" fill="rgba(248,113,113,0.25)" stroke="#f87171" stroke-width="1"/>
                <rect x="410" y="124" width="140" height="18" rx="3" fill="rgba(248,113,113,0.25)" stroke="#f87171" stroke-width="1"/>
                <text x="414" y="42"  class="ns" fill="#f87171">→ DB hit ✗</text>
                <text x="414" y="66"  class="ns" fill="#f87171">→ DB hit ✗</text>
                <text x="414" y="90"  class="ns" fill="#f87171">→ DB hit ✗</text>
                <text x="414" y="114" class="ns" fill="#f87171">→ DB hit ✗</text>
                <text x="414" y="138" class="ns" fill="#f87171">→ DB hit ✗</text>
                <text x="558" y="90"  class="ns" fill="#f97316">⚡ 5 simultaneous DB hits</text>

                <!-- WITH jitter -->
                <text x="10" y="172" class="nl" fill="#34d399">WITH Jitter — staggered expiry, smooth DB load</text>

                <rect x="10" y="185" width="400" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="209" width="430" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="233" width="465" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="257" width="500" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="281" width="535" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <text x="14" y="199" class="ns" fill="#34d399">user_feed     TTL=60s (base)</text>
                <text x="14" y="223" class="ns" fill="#34d399">trending_now  TTL=68s (+8 jitter)</text>
                <text x="14" y="247" class="ns" fill="#34d399">homepage      TTL=74s (+14 jitter)</text>
                <text x="14" y="271" class="ns" fill="#34d399">product_list  TTL=80s (+20 jitter)</text>
                <text x="14" y="295" class="ns" fill="#34d399">recommendations TTL=87s (+27 jitter)</text>

                <rect x="410" y="185" width="70"  height="18" rx="3" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="440" y="209" width="70"  height="18" rx="3" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="475" y="233" width="70"  height="18" rx="3" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="510" y="257" width="70"  height="18" rx="3" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="545" y="281" width="70"  height="18" rx="3" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <text x="414" y="199" class="ns" fill="#34d399">1 DB (t=60)</text>
                <text x="444" y="223" class="ns" fill="#34d399">1 DB (t=68)</text>
                <text x="479" y="247" class="ns" fill="#34d399">1 DB (t=74)</text>
                <text x="514" y="271" class="ns" fill="#34d399">1 DB (t=80)</text>
                <text x="549" y="295" class="ns" fill="#34d399">1 DB (t=87)</text>

                <text x="700" y="240" class="nl" fill="#34d399">✓ 1 query</text>
                <text x="700" y="256" class="ns" fill="#34d399">at a time</text>
                <text x="700" y="274" class="ns" fill="#34d399">spread over</text>
                <text x="700" y="288" class="ns" fill="#34d399">27 seconds</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Without jitter: all 5 keys expire at t=60s — 5 simultaneous DB queries. With jitter (<code>TTL = base + random(0, 30)</code>): expiry events spread from t=60s to t=87s — one DB query every ~7 seconds. Zero changes to architecture, one line of code.
            </div>
          </div>
        </section>

        <!-- ─── 3. PROBABILISTIC EARLY EXPIRY ─── -->
        <section id="probabilistic">
          <div class="section-label">03 · Strategy Two</div>
          <h2 class="section-title">Probabilistic Early Re-computation</h2>
          <div class="section-body">
            <p>
              Jitter helps with synchronized expiry, but it doesn't eliminate the miss itself.
              The moment any key expires, the first request to hit it must still wait for a full
              DB recompute. Probabilistic Early Re-computation (also called <strong>XFetch</strong>
              or Fetch-Ahead) goes further: it triggers recomputation <em>before</em> the key expires,
              while the cache still has valid data to serve.
            </p>
            <p>
              The idea is elegant: as a key approaches its TTL, the probability of triggering an
              early recompute increases. When a request arrives and the key is close to expiry,
              a random number is drawn. If that number falls within the "early recompute" range
              (which grows as the key ages), the request proactively refreshes the cache — while
              still serving the existing (still-valid) cached value to the user.
            </p>
            <p>
              The result: by the time the actual TTL hits zero, the key has almost certainly been
              refreshed already. The cache never goes cold. The database never sees a spike.
              Users never see latency. The recompute happens under low-pressure conditions.
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>probabilistic-early-expiry.svg — XFetch timeline</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 260" height="260">
                <!-- TTL bar -->
                <rect x="20" y="30" width="720" height="30" rx="6" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.5"/>
                <text x="380" y="50" class="nt" text-anchor="middle" fill="#34d399">KEY CACHED — serving from cache (valid)</text>

                <!-- probability zones -->
                <rect x="20" y="30" width="360" height="30" rx="6" fill="rgba(52,211,153,0.05)" stroke="none"/>
                <rect x="380" y="30" width="200" height="30" rx="0" fill="rgba(251,191,36,0.08)" stroke="none"/>
                <rect x="580" y="30" width="100" height="30" rx="0" fill="rgba(249,115,22,0.12)" stroke="none"/>
                <rect x="680" y="30" width="60" height="30" rx="0" fill="rgba(248,113,113,0.15)" stroke="none"/>

                <!-- labels on bar -->
                <text x="200" y="50" class="ns" text-anchor="middle" fill="#34d399">Low recompute probability ≈ 0%</text>
                <text x="480" y="50" class="ns" text-anchor="middle" fill="#fbbf24">Prob ≈ 30%</text>
                <text x="630" y="50" class="ns" text-anchor="middle" fill="#f97316">≈ 70%</text>
                <text x="710" y="50" class="ns" text-anchor="middle" fill="#f87171">≈ 95%</text>

                <!-- TTL countdown arrows -->
                <line x1="20"  y1="72" x2="740" y2="72" stroke="#1a2640" stroke-width="1.5"/>
                <text x="20"  y="88" class="ns" fill="#64748b">t=0s</text>
                <text x="200" y="88" class="ns" fill="#64748b">t=30s</text>
                <text x="380" y="88" class="ns" fill="#fbbf24">t=45s</text>
                <text x="540" y="88" class="ns" fill="#f97316">t=54s</text>
                <text x="640" y="88" class="ns" fill="#f87171">t=58s</text>
                <text x="715" y="88" class="ns" fill="#f97316">t=60s</text>

                <!-- Early recompute event at t=56 -->
                <line x1="620" y1="10" x2="620" y2="72" stroke="#34d399" stroke-width="2" stroke-dasharray="5,3"/>
                <text x="625" y="18" class="ns" fill="#34d399">Early recompute</text>
                <text x="625" y="30" class="ns" fill="#34d399">triggered (t≈56)</text>

                <!-- Early recompute flow -->
                <rect x="480" y="108" width="130" height="36" rx="8" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.5"/>
                <text x="545" y="124" class="nt" text-anchor="middle" fill="#34d399">Request arrives</text>
                <text x="545" y="138" class="nt" text-anchor="middle" fill="#34d399">at t≈56</text>

                <line x1="545" y1="144" x2="545" y2="164" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>

                <rect x="430" y="164" width="230" height="36" rx="8" fill="rgba(249,115,22,0.1)" stroke="#f97316" stroke-width="1.5"/>
                <text x="545" y="180" class="nt" text-anchor="middle" fill="#f97316">Random draw → within</text>
                <text x="545" y="194" class="nt" text-anchor="middle" fill="#f97316">early-recompute range</text>

                <!-- Serve stale + background recompute -->
                <line x1="430" y1="182" x2="300" y2="182" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)" stroke-dasharray="4,3"/>
                <rect x="140" y="164" width="160" height="36" rx="8" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.5"/>
                <text x="220" y="180" class="nt" text-anchor="middle" fill="#34d399">Serve existing</text>
                <text x="220" y="194" class="nt" text-anchor="middle" fill="#34d399">cached value ← fast</text>

                <line x1="660" y1="182" x2="750" y2="182" stroke="#f97316" stroke-width="1.5" marker-end="url(#ah-o)"/>
                <rect x="750" y="164" width="90" height="36" rx="8" fill="rgba(249,115,22,0.1)" stroke="#f97316" stroke-width="1.5"/>
                <text x="795" y="178" class="nt" text-anchor="middle" fill="#f97316">Background</text>
                <text x="795" y="192" class="nt" text-anchor="middle" fill="#f97316">DB recompute</text>

                <!-- Cache updated -->
                <line x1="795" y1="200" x2="795" y2="228" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="730" y="228" width="120" height="24" rx="6" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="790" y="244" class="nt" text-anchor="middle" fill="#34d399">Cache refreshed ✓ (t≈57)</text>

                <!-- TTL=0 result -->
                <line x1="740" y1="72" x2="740" y2="108" stroke="#f97316" stroke-width="2" stroke-dasharray="4,3"/>
                <rect x="690" y="108" width="120" height="32" rx="6" fill="rgba(52,211,153,0.08)" stroke="#34d399" stroke-width="1.5"/>
                <text x="750" y="122" class="nt" text-anchor="middle" fill="#34d399">t=60: key already</text>
                <text x="750" y="135" class="nt" text-anchor="middle" fill="#34d399">refreshed → HIT ✓</text>

                <text x="20" y="248" class="ns" fill="#34d399">✓ No cold cache  ✓ No latency spike  ✓ DB recompute under low pressure  ✓ Users always served from cache</text>
              </svg>
            </div>
            <div class="diagram-caption">
              As the key approaches its TTL, the probability of triggering an early background recompute increases. A request at t≈56 (Prob ≈ 70%) triggers a background DB fetch while still serving the valid cached value. By t=60 the cache is already refreshed — no miss ever occurs.
            </div>
          </div>

          <div class="callout callout-info">
            <span class="callout-icon">💡</span>
            <div class="callout-text">
              <strong>XFetch formula (conceptual):</strong> <code>should_recompute = random() &lt; exp(−β × remaining_ttl / compute_time)</code>.
              Higher <code>β</code> = more aggressive early recompute. Lower remaining TTL = higher probability.
              The key insight: recompute cost is paid during low-traffic periods, not at expiry time.
            </div>
          </div>
        </section>

        <!-- ─── 4. MUTEX LOCKING ─── -->
        <section id="mutex">
          <div class="section-label">04 · Strategy Three</div>
          <h2 class="section-title">Mutex / Cache Locking</h2>
          <div class="section-body">
            <p>
              When a cache miss is detected by multiple concurrent requests simultaneously,
              mutex locking ensures only one of them actually hits the database. The first
              request to detect the miss acquires a distributed lock (e.g. a Redis SETNX lock)
              for that specific cache key. All other concurrent requests see the lock is held
              and either: (a) wait briefly then read the freshly populated cache, or
              (b) serve the last known stale value while the lock holder recomputes.
            </p>
            <p>
              This guarantees that <strong>N simultaneous cache misses produce exactly 1 DB query</strong>,
              not N queries. The lock is released the moment the recomputed value is written
              to cache, at which point all waiters can serve the fresh result.
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>mutex-locking-flow.svg — only one request recomputes</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 310" height="310">
                <!-- Timeline axis -->
                <line x1="20" y1="290" x2="840" y2="290" stroke="#1a2640" stroke-width="1.5"/>
                <text x="20"  y="305" class="ns" fill="#64748b">t=0</text>
                <text x="200" y="305" class="ns" fill="#64748b">t=5ms</text>
                <text x="380" y="305" class="ns" fill="#64748b">t=10ms</text>
                <text x="560" y="305" class="ns" fill="#64748b">t=200ms</text>
                <text x="740" y="305" class="ns" fill="#64748b">t=202ms</text>

                <!-- Req 1 (lock acquirer) -->
                <text x="10" y="24" class="ns" fill="#38bdf8">Req 1 (wins lock):</text>
                <rect x="20"  y="30" width="80" height="22" rx="5" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1.5"/>
                <text x="60" y="45" class="ns" text-anchor="middle" fill="#38bdf8">MISS</text>
                <line x1="100" y1="41" x2="140" y2="41" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#ah)"/>
                <rect x="140" y="30" width="100" height="22" rx="5" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1.5"/>
                <text x="190" y="45" class="ns" text-anchor="middle" fill="#a78bfa">🔒 LOCK SET</text>
                <line x1="240" y1="41" x2="380" y2="41" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#ah)"/>
                <rect x="380" y="30" width="180" height="22" rx="5" fill="rgba(249,115,22,0.1)" stroke="#f97316" stroke-width="1.5"/>
                <text x="470" y="45" class="ns" text-anchor="middle" fill="#f97316">DB query (~200ms)</text>
                <line x1="560" y1="41" x2="620" y2="41" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="620" y="30" width="120" height="22" rx="5" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="680" y="45" class="ns" text-anchor="middle" fill="#34d399">Cache set + LOCK RELEASED</text>
                <line x1="740" y1="41" x2="800" y2="41" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="800" y="30" width="50" height="22" rx="5" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="825" y="45" class="ns" text-anchor="middle" fill="#34d399">✓</text>

                <!-- Req 2 -->
                <text x="10" y="84" class="ns" fill="#64748b">Req 2 (waits):</text>
                <rect x="60"  y="90" width="80" height="22" rx="5" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="1.5"/>
                <text x="100" y="105" class="ns" text-anchor="middle" fill="#f87171">MISS</text>
                <line x1="140" y1="101" x2="200" y2="101" stroke="#64748b" stroke-width="1.5" marker-end="url(#ah)"/>
                <rect x="200" y="90" width="360" height="22" rx="5" fill="rgba(100,116,139,0.08)" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>
                <text x="380" y="105" class="ns" text-anchor="middle" fill="#64748b">LOCK exists → WAIT (sleep/poll) … … …</text>
                <line x1="560" y1="101" x2="620" y2="101" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="620" y="90" width="100" height="22" rx="5" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="670" y="105" class="ns" text-anchor="middle" fill="#34d399">Cache HIT ✓</text>
                <line x1="720" y1="101" x2="800" y2="101" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="800" y="90" width="50" height="22" rx="5" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="825" y="105" class="ns" text-anchor="middle" fill="#34d399">✓</text>

                <!-- Req 3 -->
                <text x="10" y="144" class="ns" fill="#64748b">Req 3 (waits):</text>
                <rect x="90"  y="150" width="80" height="22" rx="5" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="1.5"/>
                <text x="130" y="165" class="ns" text-anchor="middle" fill="#f87171">MISS</text>
                <line x1="170" y1="161" x2="220" y2="161" stroke="#64748b" stroke-width="1.5" marker-end="url(#ah)"/>
                <rect x="220" y="150" width="340" height="22" rx="5" fill="rgba(100,116,139,0.08)" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>
                <text x="390" y="165" class="ns" text-anchor="middle" fill="#64748b">LOCK exists → WAIT … … … … … …</text>
                <line x1="560" y1="161" x2="620" y2="161" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="620" y="150" width="100" height="22" rx="5" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="670" y="165" class="ns" text-anchor="middle" fill="#34d399">Cache HIT ✓</text>
                <line x1="720" y1="161" x2="800" y2="161" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="800" y="150" width="50" height="22" rx="5" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="825" y="165" class="ns" text-anchor="middle" fill="#34d399">✓</text>

                <!-- Req N -->
                <text x="10" y="204" class="ns" fill="#64748b">Req N (stale or wait):</text>
                <rect x="130" y="210" width="80" height="22" rx="5" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="1.5"/>
                <text x="170" y="225" class="ns" text-anchor="middle" fill="#f87171">MISS</text>
                <line x1="210" y1="221" x2="270" y2="221" stroke="#64748b" stroke-width="1.5" marker-end="url(#ah)"/>
                <rect x="270" y="210" width="290" height="22" rx="5" fill="rgba(251,191,36,0.06)" stroke="#fbbf24" stroke-width="1" stroke-dasharray="4,3"/>
                <text x="415" y="225" class="ns" text-anchor="middle" fill="#fbbf24">Serve stale value (if available) …</text>
                <line x1="560" y1="221" x2="620" y2="221" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="620" y="210" width="100" height="22" rx="5" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="670" y="225" class="ns" text-anchor="middle" fill="#34d399">Cache HIT ✓</text>
                <line x1="720" y1="221" x2="800" y2="221" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="800" y="210" width="50" height="22" rx="5" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="825" y="225" class="ns" text-anchor="middle" fill="#34d399">✓</text>

                <!-- Result summary -->
                <rect x="20" y="250" width="820" height="28" rx="6" fill="rgba(52,211,153,0.05)" stroke="rgba(52,211,153,0.2)" stroke-width="1"/>
                <text x="430" y="268" class="nt" text-anchor="middle" fill="#34d399">N simultaneous cache misses → exactly 1 DB query → all N requests served from cache after lock releases</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Req 1 wins the distributed lock and does the one DB query. Req 2, 3…N either wait briefly or serve the last stale value. Once Req 1 populates the cache and releases the lock, all requests hit the fresh cache. Total DB queries: 1 (not N).
            </div>
          </div>

          <div class="callout callout-warn">
            <span class="callout-icon">⚠️</span>
            <div class="callout-text">
              <strong>Watch for lock expiry:</strong> Always set a TTL on the distributed lock itself
              (e.g., 5s). If the lock holder crashes mid-recompute, the lock auto-releases and another
              request can take over. Without this, a crashed holder leaves all others stuck indefinitely.
            </div>
          </div>
        </section>

        <!-- ─── 5. STALE-WHILE-REVALIDATE ─── -->
        <section id="swr">
          <div class="section-label">05 · Strategy Four</div>
          <h2 class="section-title">Stale-While-Revalidate (SWR)</h2>
          <div class="section-body">
            <p>
              Stale-While-Revalidate (SWR) is the strategy that CDNs like Cloudflare, Fastly, and
              Nginx have built their freshness models on. The core idea: when a cached value is
              expired but a fresh one hasn't been computed yet, <strong>serve the stale value immediately</strong>
              and trigger a background recompute. The user gets a fast response. The cache gets
              refreshed in the background. The next request gets the fresh value.
            </p>
            <p>
              SWR uses two TTL windows: the <strong>max-age</strong> (serve fresh, no revalidation),
              and the <strong>stale-while-revalidate</strong> window (serve stale, but recompute
              in background). Only after both windows are exhausted is the user forced to wait for
              a synchronous DB fetch.
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>stale-while-revalidate.svg — CDN-style freshness model</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 270" height="270">
                <!-- Three phases bar -->
                <rect x="20"  y="20" width="320" height="36" rx="6" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1.5"/>
                <rect x="340" y="20" width="250" height="36" rx="6" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="1.5"/>
                <rect x="590" y="20" width="250" height="36" rx="6" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="1.5"/>

                <text x="180" y="35" class="nt" text-anchor="middle" fill="#34d399">FRESH ZONE</text>
                <text x="180" y="50" class="ns" text-anchor="middle" fill="#34d399">max-age = 60s · serve from cache</text>
                <text x="465" y="35" class="nt" text-anchor="middle" fill="#fbbf24">STALE-WHILE-REVALIDATE</text>
                <text x="465" y="50" class="ns" text-anchor="middle" fill="#fbbf24">serve stale + background recompute</text>
                <text x="715" y="35" class="nt" text-anchor="middle" fill="#f87171">STALE-IF-ERROR / HARD MISS</text>
                <text x="715" y="50" class="ns" text-anchor="middle" fill="#f87171">must wait for fresh DB fetch</text>

                <!-- Time axis -->
                <line x1="20" y1="74" x2="840" y2="74" stroke="#1a2640" stroke-width="1.5"/>
                <text x="20"  y="88" class="ns" fill="#64748b">t=0</text>
                <text x="330" y="88" class="ns" fill="#34d399">t=60s</text>
                <text x="580" y="88" class="ns" fill="#fbbf24">t=90s</text>
                <text x="740" y="88" class="ns" fill="#f87171">t=120s</text>

                <!-- Request flows -->
                <!-- Request at t=30 (fresh) -->
                <line x1="180" y1="74" x2="180" y2="108" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4,3"/>
                <rect x="100" y="108" width="160" height="32" rx="6" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.5"/>
                <text x="180" y="122" class="nt" text-anchor="middle" fill="#34d399">Request at t=30</text>
                <text x="180" y="136" class="nt" text-anchor="middle" fill="#34d399">→ Cache HIT ✓ (2ms)</text>

                <!-- Request at t=75 (SWR zone) -->
                <line x1="465" y1="74" x2="465" y2="108" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4,3"/>
                <rect x="355" y="108" width="220" height="32" rx="6" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" stroke-width="1.5"/>
                <text x="465" y="122" class="nt" text-anchor="middle" fill="#fbbf24">Request at t=75 (stale)</text>
                <text x="465" y="136" class="nt" text-anchor="middle" fill="#fbbf24">→ Serve stale immediately ✓ + bgr recompute</text>

                <!-- Background recompute -->
                <line x1="465" y1="140" x2="465" y2="165" stroke="#f97316" stroke-width="1.5" marker-end="url(#ah-o)"/>
                <rect x="355" y="165" width="220" height="28" rx="6" fill="rgba(249,115,22,0.08)" stroke="#f97316" stroke-width="1"/>
                <text x="465" y="183" class="nt" text-anchor="middle" fill="#f97316">Background: DB fetch → cache refreshed</text>

                <!-- Next request -->
                <line x1="530" y1="74" x2="530" y2="108" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4,3"/>
                <rect x="540" y="108" width="160" height="32" rx="6" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.5"/>
                <text x="620" y="122" class="nt" text-anchor="middle" fill="#34d399">Next request</text>
                <text x="620" y="136" class="nt" text-anchor="middle" fill="#34d399">→ Fresh HIT ✓</text>

                <!-- Request at t=110 (hard miss) -->
                <line x1="715" y1="74" x2="715" y2="108" stroke="#f87171" stroke-width="1.5" stroke-dasharray="4,3"/>
                <rect x="630" y="108" width="180" height="32" rx="6" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="1.5"/>
                <text x="720" y="122" class="nt" text-anchor="middle" fill="#f87171">Request at t=110</text>
                <text x="720" y="136" class="nt" text-anchor="middle" fill="#f87171">→ Must wait for fresh (200ms)</text>

                <!-- User experience bar -->
                <text x="20" y="218" class="ns" fill="#64748b">User latency:</text>
                <rect x="100" y="224" width="250" height="10" rx="3" fill="#34d399"/>
                <text x="225" y="235" class="ns" text-anchor="middle" fill="#070b12">~2ms (fresh)</text>
                <rect x="350" y="224" width="200" height="10" rx="3" fill="#fbbf24"/>
                <text x="450" y="235" class="ns" text-anchor="middle" fill="#070b12">~2ms (stale, no wait)</text>
                <rect x="550" y="224" width="200" height="10" rx="3" fill="#f87171"/>
                <text x="650" y="235" class="ns" text-anchor="middle" fill="#070b12">~200ms (blocked)</text>

                <text x="20" y="258" class="ns" fill="#34d399">✓ Users never see latency during the SWR window  ✓ DB recompute happens under low pressure  ✓ Cache always has data to serve</text>
              </svg>
            </div>
            <div class="diagram-caption">
              SWR divides cache lifetime into three zones. In the "fresh" zone (0–60s): normal cache hit. In the SWR window (60–90s): serve the stale value immediately while triggering a background recompute — users see zero latency. After 120s: forced synchronous DB fetch.
            </div>
          </div>

          <div class="callout callout-info">
            <span class="callout-icon">💡</span>
            <div class="callout-text">
              <strong>HTTP Cache-Control header:</strong> <code>Cache-Control: max-age=60, stale-while-revalidate=30</code>.
              CDNs like Cloudflare, Varnish, and Nginx natively understand this directive and implement
              the background revalidation automatically. You get SWR for free with one header change.
            </div>
          </div>
        </section>

        <!-- ─── 6. CACHE WARMING ─── -->
        <section id="warming">
          <div class="section-label">06 · Strategy Five</div>
          <h2 class="section-title">Cache Warming / Pre-Warming</h2>
          <div class="section-body">
            <p>
              All previous strategies deal with expiry events during live traffic. Cache Warming
              is different: it is a <em>proactive</em> strategy that populates the cache
              <strong>before</strong> the traffic arrives. You know the spike is coming — a
              product launch, an IPL match, a midnight Netflix drop — so you fill the cache in
              advance. By the time the first real request arrives, the cache is fully hydrated
              and the database never sees a cold-start spike.
            </p>
            <p>
              Pre-warming is typically done by a batch job or a dedicated warm-up service.
              It iterates over the hot keys (the top-N products, the trending content, the
              homepage data), fetches each from the database, and writes it to the cache.
              This can be done minutes or even hours before the expected traffic event.
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>cache-warming-timeline.svg — before vs after warm-up</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 290" height="290">
                <!-- WITHOUT warming -->
                <text x="10" y="16" class="nl" fill="#f87171">WITHOUT Cache Warming — cold start at traffic spike</text>

                <!-- Timeline -->
                <line x1="10" y1="125" x2="840" y2="125" stroke="#1a2640" stroke-width="1.5"/>
                <text x="10"  y="140" class="ns" fill="#64748b">-15min</text>
                <text x="260" y="140" class="ns" fill="#64748b">-5min</text>
                <text x="440" y="140" class="ns" fill="#f97316">T=0 (sale goes live)</text>
                <text x="740" y="140" class="ns" fill="#64748b">+5min</text>

                <!-- Cold cache -->
                <rect x="10" y="30" width="430" height="80" rx="8" fill="rgba(100,116,139,0.05)" stroke="#64748b" stroke-width="1" stroke-dasharray="5,4"/>
                <text x="225" y="75" class="nl" text-anchor="middle" fill="#64748b">CACHE EMPTY (cold)</text>

                <!-- Traffic arrives -->
                <line x1="440" y1="20" x2="440" y2="125" stroke="#f97316" stroke-width="2" stroke-dasharray="5,3"/>
                <text x="448" y="28" class="ns" fill="#f97316">Traffic spike</text>
                <rect x="440" y="30" width="220" height="80" rx="8" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="2"/>
                <text x="550" y="65" class="nl" text-anchor="middle" fill="#f87171">ALL MISS → DB</text>
                <text x="550" y="80" class="ns" text-anchor="middle" fill="#f87171">Stampede ⚠</text>
                <text x="550" y="95" class="ns" text-anchor="middle" fill="#fbbf24">~200ms latency each</text>

                <!-- WITH warming -->
                <text x="10" y="162" class="nl" fill="#34d399">WITH Cache Warming — hot cache ready before traffic</text>
                <line x1="10" y1="270" x2="840" y2="270" stroke="#1a2640" stroke-width="1.5"/>
                <text x="10"  y="285" class="ns" fill="#64748b">-15min</text>
                <text x="260" y="285" class="ns" fill="#64748b">-5min</text>
                <text x="440" y="285" class="ns" fill="#f97316">T=0</text>
                <text x="740" y="285" class="ns" fill="#64748b">+5min</text>

                <!-- Batch warm-up phase -->
                <rect x="10" y="175" width="200" height="80" rx="8" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.5"/>
                <text x="110" y="210" class="nl" text-anchor="middle" fill="#38bdf8">Batch Warm-up</text>
                <text x="110" y="226" class="ns" text-anchor="middle" fill="#38bdf8">Job iterates hot keys</text>
                <text x="110" y="241" class="ns" text-anchor="middle" fill="#38bdf8">writes to cache</text>

                <!-- Cache full -->
                <rect x="210" y="175" width="230" height="80" rx="8" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1.5"/>
                <text x="325" y="210" class="nl" text-anchor="middle" fill="#34d399">CACHE WARM ✓</text>
                <text x="325" y="226" class="ns" text-anchor="middle" fill="#34d399">All hot keys ready</text>
                <text x="325" y="241" class="ns" text-anchor="middle" fill="#34d399">DB: 0 queries</text>

                <!-- Traffic arrives -->
                <line x1="440" y1="162" x2="440" y2="270" stroke="#f97316" stroke-width="2" stroke-dasharray="5,3"/>
                <rect x="440" y="175" width="220" height="80" rx="8" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1.5"/>
                <text x="550" y="210" class="nl" text-anchor="middle" fill="#34d399">ALL HIT ✓</text>
                <text x="550" y="226" class="ns" text-anchor="middle" fill="#34d399">~2ms latency</text>
                <text x="550" y="241" class="ns" text-anchor="middle" fill="#34d399">DB load = 0</text>

                <!-- Steady state -->
                <rect x="660" y="175" width="180" height="80" rx="8" fill="rgba(52,211,153,0.08)" stroke="#34d399" stroke-width="1"/>
                <text x="750" y="210" class="nl" text-anchor="middle" fill="#34d399">Steady state</text>
                <text x="750" y="226" class="ns" text-anchor="middle" fill="#34d399">normal TTL-based</text>
                <text x="750" y="241" class="ns" text-anchor="middle" fill="#34d399">refresh cycle</text>

                <!-- Arrow showing warm-up populates cache -->
                <line x1="210" y1="215" x2="215" y2="215" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#ah)"/>
              </svg>
            </div>
            <div class="diagram-caption">
              Without warming: traffic hits an empty cache → DB stampede. With warming: a batch job populates all hot keys 10–15 minutes before the expected spike. When traffic arrives, every request gets a cache hit. The database stays idle during the highest-traffic window.
            </div>
          </div>

          <div class="callout callout-good">
            <span class="callout-icon">✅</span>
            <div class="callout-text">
              <strong>Essential for predictable high-traffic events.</strong> If you know a spike is coming
              (IPL live match start, midnight OTT release, 10 AM flash sale), always pre-warm.
              Cache warming is the only strategy that <em>prevents</em> the first DB hit entirely.
              All other strategies reduce duplicate hits — warming eliminates the first hit.
            </div>
          </div>
        </section>

        <!-- ─── 7. TRADEOFFS ─── -->
        <section id="tradeoffs">
          <div class="section-label">07 · The Hard Part</div>
          <h2 class="section-title">Tradeoffs: Freshness vs Latency vs Consistency</h2>
          <div class="section-body">
            <p>
              Every caching strategy is a negotiation between three competing values. Understanding
              these tradeoffs is what separates a caching decision from a guess.
            </p>
          </div>

          <div class="tradeoff-grid">
            <div class="tradeoff-card">
              <div class="tradeoff-icon">⏱️</div>
              <div class="tradeoff-name">Freshness</div>
              <div class="tradeoff-desc">
                How current is the cached data? Short TTL = very fresh but frequent DB hits.
                Long TTL = stale data but protected DB. SWR and probabilistic expiry maximize
                freshness without the DB cost. Mutex and warming sacrifice some freshness for stability.
              </div>
            </div>
            <div class="tradeoff-card">
              <div class="tradeoff-icon">⚡</div>
              <div class="tradeoff-name">Latency</div>
              <div class="tradeoff-desc">
                How fast does the user get a response? Cache hits are ~2ms. DB fetches are ~200ms.
                SWR guarantees ~2ms even for slightly stale data. Mutex forces some users to wait.
                Probabilistic expiry eliminates wait by recomputing before expiry. Warming ensures
                zero-latency at traffic peaks.
              </div>
            </div>
            <div class="tradeoff-card">
              <div class="tradeoff-icon">🔗</div>
              <div class="tradeoff-name">Consistency</div>
              <div class="tradeoff-desc">
                Will all users see the same data? Serving stale (SWR, probabilistic) means
                different users may briefly see different versions. Mutex ensures exactly one
                recompute but waiters may read slightly older data. For financial or inventory
                data, you may need zero stale tolerance — which means no caching for writes.
              </div>
            </div>
            <div class="tradeoff-card">
              <div class="tradeoff-icon">🏗️</div>
              <div class="tradeoff-name">Complexity</div>
              <div class="tradeoff-desc">
                Jitter: one line of code. SWR: one HTTP header. Mutex: distributed lock implementation,
                lock TTL management, crash recovery. Probabilistic: mathematical tuning of β parameter.
                Cache warming: dedicated batch infrastructure. Pick the simplest strategy that
                solves your actual problem.
              </div>
            </div>
          </div>

          <div class="compare-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th>STRATEGY</th>
                  <th>FRESHNESS</th>
                  <th>LATENCY</th>
                  <th>CONSISTENCY</th>
                  <th>COMPLEXITY</th>
                  <th>BEST FOR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic TTL</td>
                  <td>Medium</td>
                  <td>Spiky (miss = 200ms)</td>
                  <td>Good</td>
                  <td>Minimal</td>
                  <td>Low-traffic apps</td>
                </tr>
                <tr>
                  <td>TTL Jitter</td>
                  <td>Medium</td>
                  <td>Slightly better</td>
                  <td>Good</td>
                  <td>Trivial (1 line)</td>
                  <td>Always — first fix</td>
                </tr>
                <tr>
                  <td>Probabilistic Early</td>
                  <td>High</td>
                  <td>Excellent (no miss)</td>
                  <td>Very Good</td>
                  <td>Low-Medium</td>
                  <td>High read traffic, low write rate</td>
                </tr>
                <tr>
                  <td>Mutex Locking</td>
                  <td>High</td>
                  <td>Good (some wait)</td>
                  <td>Excellent</td>
                  <td>Medium</td>
                  <td>Strong consistency needs</td>
                </tr>
                <tr>
                  <td>Stale-While-Revalidate</td>
                  <td>Medium-High</td>
                  <td>Excellent (~2ms always)</td>
                  <td>Medium (brief stale)</td>
                  <td>Low (1 header)</td>
                  <td>CDN, HTTP APIs, dashboards</td>
                </tr>
                <tr>
                  <td>Cache Warming</td>
                  <td>High (at launch)</td>
                  <td>Excellent at launch</td>
                  <td>Good</td>
                  <td>Medium (batch job)</td>
                  <td>Predictable traffic spikes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ─── 8. STRATEGY SELECTOR ─── -->
        <section id="selector">
          <div class="section-label">08 · Decision Guide</div>
          <h2 class="section-title">When to Use Which Strategy</h2>
          <div class="section-body">
            <p>
              These strategies aren't mutually exclusive. Production systems typically layer
              multiple approaches. Start with the cheapest fix, add more only where the
              problem demands it.
            </p>
          </div>

          <div class="selector-grid">
            <div class="selector-card">
              <div class="selector-num">Always</div>
              <div class="selector-title">Use TTL Jitter everywhere</div>
              <div class="selector-body">
                Even if you use other strategies, always add jitter to your TTLs.
                It's free, it prevents synchronized mass-expiry, and it costs nothing
                in terms of complexity or freshness. No reason not to.
              </div>
              <div class="selector-signal">signal: any caching system</div>
            </div>
            <div class="selector-card">
              <div class="selector-num">When</div>
              <div class="selector-title">Users must never wait → SWR</div>
              <div class="selector-body">
                If P99 latency must stay below 10ms regardless of cache state, SWR is your
                friend. Dashboards, feed APIs, product listings, recommendation panels — anything
                where slightly-stale is acceptable. Use <code>stale-while-revalidate</code> at CDN.
              </div>
              <div class="selector-signal">signal: HTTP API · CDN · dashboard</div>
            </div>
            <div class="selector-card">
              <div class="selector-num">When</div>
              <div class="selector-title">Strong consistency is required → Mutex</div>
              <div class="selector-body">
                Inventory counts, account balances, session data, pricing — anywhere where
                two users must not see conflicting values simultaneously. Use distributed mutex
                locking with a stale fallback. Accept the brief wait.
              </div>
              <div class="selector-signal">signal: financial · inventory · auth</div>
            </div>
            <div class="selector-card">
              <div class="selector-num">When</div>
              <div class="selector-title">Hot keys with expensive compute → Probabilistic</div>
              <div class="selector-body">
                If your homepage aggregation takes 2 seconds or your ML recommendation takes
                500ms, you cannot afford a miss under load. Use probabilistic early re-computation
                to pay the compute cost before the key goes cold, under low-pressure conditions.
              </div>
              <div class="selector-signal">signal: expensive compute · ML · aggregations</div>
            </div>
            <div class="selector-card">
              <div class="selector-num">When</div>
              <div class="selector-title">Known spike is coming → Cache Warm</div>
              <div class="selector-body">
                IPL matches, OTT midnight releases, flash sales, product launches. If you can
                predict the spike, pre-warm. Run the batch job 10–15 minutes before. Pair with
                jitter and SWR for the subsequent natural expiry cycle.
              </div>
              <div class="selector-signal">signal: scheduled events · launches · sales</div>
            </div>
          </div>
        </section>

        <!-- ─── 9. REAL WORLD ─── -->
        <section id="realworld">
          <div class="section-label">09 · Real-World Systems</div>
          <h2 class="section-title">How Production Systems Apply These</h2>
          <div class="section-body">
            <p>
              These aren't theoretical patterns. Every large-scale system you use daily applies
              multiple cache strategies simultaneously — they just don't announce it.
            </p>
          </div>

          <div class="rw-grid">
            <div class="rw-card">
              <div class="rw-icon">🎬</div>
              <div class="rw-name">Netflix — Midnight Release</div>
              <div class="rw-desc">
                <strong>Warming + Mutex + SWR.</strong> 30 minutes before a new series drops,
                Netflix batch-warms title metadata, thumbnail assets, and episode lists for the
                top-predicted users. At midnight, cache is fully hot. Mutex prevents duplicate
                recommendation recomputes. CDN layers use SWR for static assets and thumbnails.
              </div>
            </div>
            <div class="rw-card">
              <div class="rw-icon">🏏</div>
              <div class="rw-name">IPL / Hotstar — Live Streaming Spike</div>
              <div class="rw-desc">
                <strong>Jitter + Probabilistic + Warming.</strong> Match schedules are known in advance.
                Player stats, match data, and live scoreboard APIs are pre-warmed before toss.
                Live score TTLs use probabilistic early recompute so the scoreboard is never cold
                during the peak wicket-refresh moment. Jitter prevents mass-expiry between overs.
              </div>
            </div>
            <div class="rw-card">
              <div class="rw-icon">🛍️</div>
              <div class="rw-name">E-commerce Flash Sale</div>
              <div class="rw-desc">
                <strong>Warming + Mutex (for inventory) + SWR (for listings).</strong>
                Product listing pages are pre-warmed and served via SWR — slightly stale is fine
                for browsing. But inventory counts use strict mutex locking — you cannot oversell.
                Price data uses probabilistic early expiry to keep prices fresh without DB spikes.
              </div>
            </div>
            <div class="rw-card">
              <div class="rw-icon">☁️</div>
              <div class="rw-name">Cloudflare / CDN Edge</div>
              <div class="rw-desc">
                <strong>SWR natively.</strong> Every Cloudflare cache respects
                <code>stale-while-revalidate</code> and <code>stale-if-error</code> headers.
                Edges serve stale content while asynchronously revalidating from origin. This
                eliminates origin stampedes globally. Zero infrastructure change — just set the header.
              </div>
            </div>
            <div class="rw-card">
              <div class="rw-icon">💳</div>
              <div class="rw-name">Banking / Fintech APIs</div>
              <div class="rw-desc">
                <strong>Mutex only — no stale ever.</strong> Account balance APIs must not serve
                stale data. Caching is used only for read-heavy, low-mutation data (exchange rates,
                branch info). Mutex with zero stale tolerance: waiters always block until the fresh
                value is written. Jitter still applied to prevent synchronized refresh storms.
              </div>
            </div>
            <div class="rw-card">
              <div class="rw-icon">🔍</div>
              <div class="rw-name">Search &amp; Autocomplete</div>
              <div class="rw-desc">
                <strong>Probabilistic + jitter.</strong> Popular search autocomplete results are
                cached with probabilistic early expiry — the computation is expensive (ranking,
                personalization) and must never go cold during a typing session. Jitter ensures
                no two popular queries expire simultaneously across a global Redis cluster.
              </div>
            </div>
          </div>

          <div class="summary-box">
            <h3>Key Takeaways</h3>
            <ul class="summary-list">
              <li>Basic TTL caching with no jitter will eventually cause a stampede at scale — it's not a question of if, but when.</li>
              <li><strong>TTL Jitter</strong> is a one-line fix that every caching system should have by default.</li>
              <li><strong>SWR</strong> eliminates user-visible latency during cache transitions — use it for any HTTP API served through a CDN.</li>
              <li><strong>Mutex locking</strong> is the right tool for strong consistency — but always set a lock TTL to handle crashes.</li>
              <li><strong>Probabilistic early expiry</strong> pays the recompute cost before expiry, under low pressure — ideal for expensive hot keys.</li>
              <li><strong>Cache warming</strong> is the only strategy that prevents the <em>first</em> DB hit entirely — essential for predicted traffic events.</li>
              <li>Production systems layer multiple strategies: warm at launch + jitter during steady state + mutex for critical data + SWR at the CDN edge.</li>
            </ul>
          </div>
        </section>

      </main>

      <div class="blog-divider"></div>
      <div class="blog-footer-note">
        Cache Strategies in Distributed Systems · System Design · Advanced Caching · Redis · CDN
      </div>

    </div>
  `,
  styleUrls: ['./cache-strategies.component.scss']
})
export class CacheStrategiesComponent {
  readingProgress = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const total = doc.scrollHeight - doc.clientHeight;
    this.readingProgress = total > 0 ? (scrolled / total * 100) : 0;
  }
}
