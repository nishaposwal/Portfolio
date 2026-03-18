import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thundering-herd',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="blog-wrap">

      <!-- Reading progress bar -->
      <div class="read-progress" [style.width.%]="readingProgress"></div>

      <!-- ── HERO ── -->
      <section class="hero">
        <div class="back-link" routerLink="/blogs">
          <i class="fas fa-arrow-left"></i> All Articles
        </div>
        <div class="hero-eyebrow">System Design · Cache Stampede · Distributed Systems</div>
        <h1>Understanding the<br/><span class="highlight">Thundering Herd</span><br/>Problem</h1>
        <p class="hero-sub">
          When a single cache expiry event causes hundreds of servers to stampede toward your
          database at the same millisecond — and how to stop it.
        </p>
        <div class="hero-meta">
          <div class="hero-meta-item">
            <span class="hero-meta-label">Topic</span>
            <span class="hero-meta-value">Cache Stampede / Thundering Herd</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Covers</span>
            <span class="hero-meta-value">Caching · Databases · Distributed Systems</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Level</span>
            <span class="hero-meta-value">Intermediate</span>
          </div>
        </div>
      </section>

      <!-- ── TOC ── -->
      <div class="toc-bar">
        <a href="#what">What is it?</a>
        <a href="#where">Where it occurs</a>
        <a href="#arch">App→Cache→DB</a>
        <a href="#ttl">TTL Expiry</a>
        <a href="#distributed">Distributed Risk</a>
        <a href="#spike">Normal vs Herd</a>
        <a href="#impact">Impact</a>
        <a href="#fix">Prevention</a>
        <a href="#realworld">Real World</a>
      </div>

      <!-- ── MAIN CONTENT ── -->
      <main>

        <!-- 1. ANALOGY -->
        <section id="what">
          <div class="section-label">01 · The Analogy First</div>
          <h2 class="section-title">Picture a Store Opening at 9:00 AM</h2>
          <div class="section-body">
            <p>
              Before we touch any technical term, let's start with something you've probably
              lived through. A popular store announces a big sale. The doors open at 9:00 AM.
              By 8:58 AM, hundreds of people are pressed against the entrance. The moment the
              doors open, everyone rushes in at once.
            </p>
            <p>
              The staff is immediately overwhelmed. Checkout lanes jam. The billing system
              crashes. People who arrived after 9:05 AM — when the initial rush had spread out —
              are served just fine. The store never had a <em>total capacity</em> problem.
              It had a <strong>simultaneous arrival</strong> problem.
            </p>
          </div>

          <div class="analogy-card">
            <div class="analogy-icon">🏪</div>
            <div class="analogy-text">
              <h3>The Thundering Herd Analogy</h3>
              <p>
                Replace "store" with your <strong>database</strong>. Replace "customers" with
                <strong>server requests</strong>. Replace "store closing time" with a
                <strong>cache TTL expiring</strong>. The result is identical: a synchronized rush
                that would have been fine if spread over time, but breaks the system when it
                arrives all at once.
              </p>
            </div>
          </div>

          <div class="diagram-card" style="margin-top:40px;">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>what-is-thundering-herd.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 200" height="200">
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
                <!-- NORMAL scenario -->
                <text x="110" y="16" class="ns" text-anchor="middle" fill="#34d399">NORMAL TRAFFIC — spread over time</text>
                <rect x="20"  y="30" width="60" height="26" rx="6" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>
                <rect x="40"  y="65" width="60" height="26" rx="6" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>
                <rect x="25"  y="100" width="60" height="26" rx="6" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>
                <text x="50"  y="47" class="ns" text-anchor="middle" fill="#34d399">Req 1</text>
                <text x="70"  y="82" class="ns" text-anchor="middle" fill="#34d399">Req 2</text>
                <text x="55"  y="117" class="ns" text-anchor="middle" fill="#34d399">Req 3</text>
                <line x1="80" y1="43"  x2="155" y2="90" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <line x1="100" y1="78" x2="155" y2="94" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <line x1="85" y1="113" x2="155" y2="98" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="155" y="72" width="90" height="44" rx="8" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.5"/>
                <text x="200" y="92"  class="nl" text-anchor="middle" fill="#34d399">Server</text>
                <text x="200" y="108" class="ns" text-anchor="middle" fill="#34d399">handles fine</text>
                <!-- HERD scenario -->
                <text x="570" y="16" class="ns" text-anchor="middle" fill="#f87171">THUNDERING HERD — synchronized burst</text>
                <rect x="390" y="28" width="60" height="26" rx="6" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="1.5"/>
                <rect x="390" y="60" width="60" height="26" rx="6" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="1.5"/>
                <rect x="390" y="92" width="60" height="26" rx="6" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="1.5"/>
                <rect x="390" y="124" width="60" height="26" rx="6" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="1.5"/>
                <text x="420" y="45"  class="ns" text-anchor="middle" fill="#f87171">Req 1</text>
                <text x="420" y="77"  class="ns" text-anchor="middle" fill="#f87171">Req 2</text>
                <text x="420" y="109" class="ns" text-anchor="middle" fill="#f87171">Req 3</text>
                <text x="420" y="141" class="ns" text-anchor="middle" fill="#f87171">Req N</text>
                <line x1="450" y1="41"  x2="530" y2="85"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)" class="pulse"/>
                <line x1="450" y1="73"  x2="530" y2="90"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)" class="pulse" style="animation-delay:.15s"/>
                <line x1="450" y1="105" x2="530" y2="95"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)" class="pulse" style="animation-delay:.3s"/>
                <line x1="450" y1="137" x2="530" y2="100" stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)" class="pulse" style="animation-delay:.45s"/>
                <rect x="530" y="70" width="90" height="50" rx="8" fill="rgba(248,113,113,0.15)" stroke="#f87171" stroke-width="2"/>
                <text x="575" y="92"  class="nl" text-anchor="middle" fill="#f87171">Server</text>
                <text x="575" y="108" class="ns" text-anchor="middle" fill="#f87171">⚠ Overloaded</text>
                <text x="420" y="172" class="ns" text-anchor="middle" fill="#fbbf24">▲ all triggered by the same event (cache expiry)</text>
                <line x1="300" y1="30" x2="300" y2="170" stroke="#1a2640" stroke-width="1.5" stroke-dasharray="5,4"/>
                <text x="300" y="105" class="nl" text-anchor="middle" fill="#1e2d45" font-size="20" font-weight="900">VS</text>
                <text x="300" y="118" class="ns" text-anchor="middle" fill="#64748b">spread</text>
                <text x="300" y="130" class="ns" text-anchor="middle" fill="#64748b">vs sync</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Left: gradual traffic hits the server comfortably. Right: the exact same number of requests, all arriving at the same moment due to a shared trigger (cache expiry, restart, lock release). The total load is identical — the synchronization is what breaks the system.
            </div>
          </div>

          <div class="callout callout-info" style="margin-top:24px;">
            <span class="callout-icon">💡</span>
            <div class="callout-text">
              <strong>One-sentence definition:</strong> The Thundering Herd Problem occurs when many clients react to the same event at the same time and simultaneously demand the same expensive resource, causing a burst that overwhelms the system even though the total load would have been manageable if spread over time.
            </div>
          </div>
        </section>

        <!-- 2. WHERE IT OCCURS -->
        <section id="where">
          <div class="section-label">02 · Where It Commonly Occurs</div>
          <h2 class="section-title">Caches, Databases, and Load Balancers</h2>
          <div class="section-body">
            <p>
              The thundering herd isn't limited to one layer of your stack. It appears wherever
              many actors can react to the same event simultaneously. The three most common
              locations are:
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>where-it-occurs.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 220" height="220">
                <rect x="10" y="20" width="260" height="180" rx="12" fill="rgba(249,115,22,0.05)" stroke="rgba(249,115,22,0.3)" stroke-width="1.5"/>
                <text x="140" y="48" class="nl" text-anchor="middle" fill="#f97316">① CACHING</text>
                <text x="20" y="72"  class="ns">• Cache key has a TTL (time-to-live)</text>
                <text x="20" y="92"  class="ns">• When TTL hits 0, key expires</text>
                <text x="20" y="112" class="ns">• Multiple requests all see a MISS</text>
                <text x="20" y="132" class="ns">• All go to DB for the same key</text>
                <text x="20" y="155" class="ns" fill="#f97316">→ "Cache Stampede"</text>
                <text x="20" y="172" class="ns" fill="#fbbf24">Common in: Redis, Memcached</text>
                <rect x="300" y="20" width="260" height="180" rx="12" fill="rgba(56,189,248,0.05)" stroke="rgba(56,189,248,0.25)" stroke-width="1.5"/>
                <text x="430" y="48" class="nl" text-anchor="middle" fill="#38bdf8">② DATABASES</text>
                <text x="310" y="72"  class="ns">• App restarts / deployments</text>
                <text x="310" y="92"  class="ns">• All instances wake up together</text>
                <text x="310" y="112" class="ns">• Run same heavy query at once</text>
                <text x="310" y="132" class="ns">• Or all try to acquire same lock</text>
                <text x="310" y="155" class="ns" fill="#38bdf8">→ Connection pool exhaustion</text>
                <text x="310" y="172" class="ns" fill="#fbbf24">Common in: PostgreSQL, MySQL</text>
                <rect x="590" y="20" width="260" height="180" rx="12" fill="rgba(167,139,250,0.05)" stroke="rgba(167,139,250,0.25)" stroke-width="1.5"/>
                <text x="720" y="48" class="nl" text-anchor="middle" fill="#a78bfa">③ LOAD BALANCERS</text>
                <text x="600" y="72"  class="ns">• One backend instance goes down</text>
                <text x="600" y="92"  class="ns">• LB shifts all traffic instantly</text>
                <text x="600" y="112" class="ns">• Remaining instances spike</text>
                <text x="600" y="132" class="ns">• They also fail → cascade</text>
                <text x="600" y="155" class="ns" fill="#a78bfa">→ Cascading failure</text>
                <text x="600" y="172" class="ns" fill="#fbbf24">Common in: Nginx, ALB, Envoy</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Three layers where the thundering herd appears. The pattern is the same in all three: a shared event triggers synchronized behavior from many actors, and the target system gets overwhelmed.
            </div>
          </div>
        </section>

        <!-- 3. ARCHITECTURE -->
        <section id="arch">
          <div class="section-label">03 · Architecture Example</div>
          <h2 class="section-title">App → Cache → Database: The Classic Flow</h2>
          <div class="section-body">
            <p>
              Most web applications use a caching layer between the application servers and the
              database. The idea is simple: expensive data (like a rendered homepage, a product
              catalogue, or a user dashboard) is computed once, stored in a fast in-memory store
              like Redis, and served from there for the next N seconds (the TTL).
            </p>
            <p>
              Under normal conditions this works beautifully. The database is barely touched.
              Latency is in single-digit milliseconds. But what happens the moment that TTL
              reaches zero?
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>app-cache-db-architecture.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 260" height="260">
                <text x="60"  y="18" class="ns" text-anchor="middle" fill="#64748b">CLIENTS</text>
                <rect x="10" y="28"  width="100" height="32" rx="8" fill="rgba(249,115,22,0.1)" stroke="#f97316" stroke-width="1.5"/>
                <rect x="10" y="70"  width="100" height="32" rx="8" fill="rgba(249,115,22,0.1)" stroke="#f97316" stroke-width="1.5"/>
                <rect x="10" y="112" width="100" height="32" rx="8" fill="rgba(249,115,22,0.1)" stroke="#f97316" stroke-width="1.5"/>
                <rect x="10" y="154" width="100" height="32" rx="8" fill="rgba(249,115,22,0.1)" stroke="#f97316" stroke-width="1.5"/>
                <text x="60" y="49"  class="nt" text-anchor="middle">Client 1</text>
                <text x="60" y="91"  class="nt" text-anchor="middle">Client 2</text>
                <text x="60" y="133" class="nt" text-anchor="middle">Client 3</text>
                <text x="60" y="175" class="nt" text-anchor="middle">Client N</text>
                <line x1="110" y1="44"  x2="235" y2="100" stroke="#f97316" stroke-width="1.5" marker-end="url(#ah-o)"/>
                <line x1="110" y1="86"  x2="235" y2="106" stroke="#f97316" stroke-width="1.5" marker-end="url(#ah-o)"/>
                <line x1="110" y1="128" x2="235" y2="112" stroke="#f97316" stroke-width="1.5" marker-end="url(#ah-o)"/>
                <line x1="110" y1="170" x2="235" y2="118" stroke="#f97316" stroke-width="1.5" marker-end="url(#ah-o)"/>
                <text x="290" y="18" class="ns" text-anchor="middle" fill="#64748b">APP SERVER</text>
                <rect x="235" y="82" width="110" height="56" rx="10" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.5"/>
                <text x="290" y="107" class="nl" text-anchor="middle" fill="#38bdf8">App</text>
                <text x="290" y="125" class="ns" text-anchor="middle">Load Balanced</text>
                <line x1="345" y1="110" x2="460" y2="110" stroke="#64748b" stroke-width="1.5" marker-end="url(#ah)"/>
                <text x="403" y="101" class="ns" text-anchor="middle">check key</text>
                <text x="515" y="18" class="ns" text-anchor="middle" fill="#64748b">CACHE (Redis)</text>
                <rect x="460" y="82" width="110" height="56" rx="10" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.5"/>
                <text x="515" y="107" class="nl" text-anchor="middle" fill="#34d399">Cache</text>
                <text x="515" y="125" class="ns" text-anchor="middle">TTL = 60s</text>
                <path d="M 515 82 Q 515 36 403 36 Q 290 36 290 82" stroke="#34d399" stroke-width="1.5" fill="none" marker-end="url(#ah-g)" stroke-dasharray="5,3"/>
                <text x="403" y="28" class="ns" text-anchor="middle" fill="#34d399">HIT → return fast (≈2ms)</text>
                <line x1="570" y1="110" x2="690" y2="110" stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <text x="630" y="101" class="ns" text-anchor="middle" fill="#f87171">MISS →</text>
                <text x="745" y="18" class="ns" text-anchor="middle" fill="#64748b">DATABASE</text>
                <rect x="690" y="82" width="110" height="56" rx="10" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="1.5"/>
                <text x="745" y="107" class="nl" text-anchor="middle" fill="#f87171">DB</text>
                <text x="745" y="125" class="ns" text-anchor="middle">slow (~200ms)</text>
                <path d="M 745 82 Q 745 50 630 50 Q 515 50 515 82" stroke="#fbbf24" stroke-width="1" fill="none" marker-end="url(#ah)" stroke-dasharray="4,3"/>
                <text x="630" y="44" class="ns" text-anchor="middle" fill="#fbbf24">rehydrate cache</text>
                <rect x="460" y="155" width="110" height="36" rx="6" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
                <text x="515" y="170" class="ns" text-anchor="middle" fill="#fbbf24">⚠ When TTL = 0</text>
                <text x="515" y="184" class="ns" text-anchor="middle" fill="#fbbf24">all requests MISS</text>
                <text x="60"  y="220" class="ns" text-anchor="middle" fill="#34d399">Cache HIT latency: ~2ms</text>
                <text x="60"  y="235" class="ns" text-anchor="middle" fill="#f87171">Cache MISS latency: ~200ms+</text>
              </svg>
            </div>
            <div class="diagram-caption">
              The classic App → Cache → DB architecture. On a cache HIT, requests return in ~2ms without touching the database. On a MISS, the app must query the database (~200ms+) and rehydrate the cache. The thundering herd happens when all requests see a MISS at the same moment.
            </div>
          </div>
        </section>

        <!-- 4. TTL EXPIRY -->
        <section id="ttl">
          <div class="section-label">04 · The TTL Expiry Problem</div>
          <h2 class="section-title">What Happens When the Cache Expires</h2>
          <div class="section-body">
            <p>
              Imagine the key <code>homepage_data</code> has a TTL of 60 seconds. For 59 seconds,
              all requests return from cache instantly. The database gets zero queries for this key.
              Then, at exactly second 60, the TTL hits zero and the key is evicted from cache.
            </p>
            <p>
              The next request sees a cache miss and starts fetching from the database. This
              computation takes ~200ms. But during that 200ms, dozens or hundreds of other requests
              also arrive, also see a cache miss (because the key hasn't been recomputed yet), and
              <strong>all independently fire the same database query</strong>.
            </p>
            <p>
              Instead of 1 database query every 60 seconds, you now have 500 queries in a 200ms
              window. Each query does the same work. The database that was completely idle a moment
              ago is now drowning in duplicate requests.
            </p>
          </div>

          <div class="callout callout-warn">
            <span class="callout-icon">⚠️</span>
            <div class="callout-text">
              <strong>The dangerous part:</strong> The cache was doing its job perfectly for 59 seconds. One moment of expiry undoes all of that and sends a hundred times the normal database load in a fraction of a second. The system never had a capacity problem — only a coordination problem.
            </div>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>ttl-expiry-timeline.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 290" height="290">
                <line x1="40" y1="265" x2="840" y2="265" stroke="#1a2640" stroke-width="1.5"/>
                <text x="40"  y="282" class="ns" fill="#64748b">t = 0s</text>
                <text x="340" y="282" class="ns" fill="#64748b">t = 58s</text>
                <text x="460" y="282" class="ns" fill="#f97316">t = 60s</text>
                <text x="620" y="282" class="ns" fill="#64748b">t = 62s</text>
                <text x="810" y="282" class="ns" fill="#64748b">t = 65s</text>
                <rect x="40" y="18" width="420" height="28" rx="4" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1.5"/>
                <text x="250" y="37" class="nt" text-anchor="middle" fill="#34d399">CACHE HIT  ·  key: homepage_data  ·  TTL = 60s</text>
                <rect x="460" y="18" width="380" height="28" rx="4" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="1.5"/>
                <text x="650" y="37" class="nt" text-anchor="middle" fill="#f87171">CACHE EXPIRED  →  all new requests: MISS</text>
                <line x1="460" y1="10" x2="460" y2="265" stroke="#f97316" stroke-width="2" stroke-dasharray="7,4"/>
                <text x="468" y="14" class="ns" fill="#f97316">TTL = 0</text>
                <rect x="460" y="58"  width="170" height="22" rx="4" fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1" class="pulse"/>
                <text x="468" y="73"  class="ns" fill="#f87171">Req 1 → fires DB query  (t=60.000s)</text>
                <rect x="460" y="88"  width="170" height="22" rx="4" fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1" class="pulse" style="animation-delay:.2s"/>
                <text x="468" y="103" class="ns" fill="#f87171">Req 2 → fires DB query  (t=60.005s)</text>
                <rect x="460" y="118" width="170" height="22" rx="4" fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1" class="pulse" style="animation-delay:.4s"/>
                <text x="468" y="133" class="ns" fill="#f87171">Req 3 → fires DB query  (t=60.010s)</text>
                <rect x="460" y="148" width="170" height="22" rx="4" fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1" class="pulse" style="animation-delay:.6s"/>
                <text x="468" y="163" class="ns" fill="#f87171">Req 4 → fires DB query  (t=60.012s)</text>
                <rect x="460" y="178" width="170" height="22" rx="4" fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1" class="pulse" style="animation-delay:.8s"/>
                <text x="468" y="193" class="ns" fill="#f87171">Req N → fires DB query  (t=60.020s)</text>
                <line x1="634" y1="58"  x2="645" y2="58"  stroke="#f97316" stroke-width="1"/>
                <line x1="634" y1="200" x2="645" y2="200" stroke="#f97316" stroke-width="1"/>
                <line x1="645" y1="58"  x2="645" y2="200" stroke="#f97316" stroke-width="1"/>
                <line x1="645" y1="129" x2="655" y2="129" stroke="#f97316" stroke-width="1"/>
                <rect x="655" y="58" width="100" height="162" rx="10" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="2"/>
                <text x="705" y="132" class="nl" text-anchor="middle" fill="#f87171">DB</text>
                <text x="705" y="148" class="ns" text-anchor="middle">⚠ hammered</text>
                <text x="705" y="163" class="ns" text-anchor="middle">N×200ms</text>
                <text x="705" y="178" class="ns" text-anchor="middle">duplicate work</text>
                <line x1="645" y1="129" x2="655" y2="129" stroke="#f97316" stroke-width="1" marker-end="url(#ah-o)"/>
                <rect x="460" y="230" width="280" height="22" rx="4" fill="rgba(52,211,153,0.08)" stroke="#34d399" stroke-width="1"/>
                <text x="468" y="245" class="ns" fill="#34d399">Cache repopulated only after first query completes (~200ms later)</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Timeline of a cache stampede. All requests that arrive in the ~200ms window between TTL=0 and the first recomputation completing will independently fire a DB query. If 500 requests per second normally hit your cache, that's 100 duplicate DB queries in 200ms — all for the same key.
            </div>
          </div>
        </section>

        <!-- 5. DISTRIBUTED -->
        <section id="distributed">
          <div class="section-label">05 · Distributed Systems Risk</div>
          <h2 class="section-title">Why It Becomes Dangerous at Scale</h2>
          <div class="section-body">
            <p>
              On a single server with one process, a cache miss might mean one extra database query.
              That's manageable. The real danger emerges when you have a distributed system with
              many app instances.
            </p>
            <p>
              In a distributed setup, <strong>every app instance shares the same cache</strong>
              (e.g., a Redis cluster). When a key expires, every one of your 50 app instances can
              independently receive requests that miss the cache. Each instance acts on its own and
              fires its own database query. There is no built-in coordinator that says "only one of
              you should recompute — the rest should wait."
            </p>
            <p>
              So instead of 1 duplicate query, you get:
              <strong>50 instances × 20 requests each = 1,000 simultaneous duplicate DB queries</strong>.
              A database that could comfortably handle a few hundred queries per second suddenly sees
              thousands, all for the same key. This can cascade — the database slows down, which
              causes more timeouts, which causes more retries, which makes things worse.
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>distributed-herd.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 230" height="230">
                <rect x="10" y="10"  width="80" height="28" rx="6" fill="rgba(249,115,22,0.08)" stroke="#f97316" stroke-width="1"/>
                <rect x="10" y="48"  width="80" height="28" rx="6" fill="rgba(249,115,22,0.08)" stroke="#f97316" stroke-width="1"/>
                <rect x="10" y="86"  width="80" height="28" rx="6" fill="rgba(249,115,22,0.08)" stroke="#f97316" stroke-width="1"/>
                <text x="50" y="29"  class="ns" text-anchor="middle">Users</text>
                <text x="50" y="67"  class="ns" text-anchor="middle">Users</text>
                <text x="50" y="105" class="ns" text-anchor="middle">Users</text>
                <text x="50" y="135" class="ns" text-anchor="middle" fill="#64748b">…millions</text>
                <line x1="90" y1="24"  x2="150" y2="60" stroke="#f97316" stroke-width="1" marker-end="url(#ah-o)"/>
                <line x1="90" y1="62"  x2="150" y2="66" stroke="#f97316" stroke-width="1" marker-end="url(#ah-o)"/>
                <line x1="90" y1="100" x2="150" y2="72" stroke="#f97316" stroke-width="1" marker-end="url(#ah-o)"/>
                <rect x="150" y="48" width="80" height="36" rx="8" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" stroke-width="1.5"/>
                <text x="190" y="63"  class="nt" text-anchor="middle" fill="#a78bfa">Load</text>
                <text x="190" y="77"  class="nt" text-anchor="middle" fill="#a78bfa">Balancer</text>
                <line x1="230" y1="56" x2="295" y2="25"  stroke="#a78bfa" stroke-width="1" marker-end="url(#ah)"/>
                <line x1="230" y1="62" x2="295" y2="62"  stroke="#a78bfa" stroke-width="1" marker-end="url(#ah)"/>
                <line x1="230" y1="68" x2="295" y2="100" stroke="#a78bfa" stroke-width="1" marker-end="url(#ah)"/>
                <rect x="295" y="10"  width="80" height="28" rx="6" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.5"/>
                <rect x="295" y="48"  width="80" height="28" rx="6" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.5"/>
                <rect x="295" y="86"  width="80" height="28" rx="6" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.5"/>
                <text x="335" y="29"  class="ns" text-anchor="middle" fill="#38bdf8">App #1</text>
                <text x="335" y="67"  class="ns" text-anchor="middle" fill="#38bdf8">App #2</text>
                <text x="335" y="105" class="ns" text-anchor="middle" fill="#38bdf8">App #3</text>
                <text x="335" y="132" class="ns" text-anchor="middle" fill="#64748b">… 50 instances</text>
                <line x1="375" y1="24"  x2="450" y2="70" stroke="#64748b" stroke-width="1" marker-end="url(#ah)"/>
                <line x1="375" y1="62"  x2="450" y2="76" stroke="#64748b" stroke-width="1" marker-end="url(#ah)"/>
                <line x1="375" y1="100" x2="450" y2="82" stroke="#64748b" stroke-width="1" marker-end="url(#ah)"/>
                <rect x="450" y="58" width="90" height="40" rx="8" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="2"/>
                <text x="495" y="75"  class="nt" text-anchor="middle" fill="#f87171">Cache</text>
                <text x="495" y="90"  class="ns" text-anchor="middle" fill="#f87171">EXPIRED ✗</text>
                <line x1="540" y1="67" x2="620" y2="25"  stroke="#f87171" stroke-width="2" marker-end="url(#ah-r)" class="pulse"/>
                <line x1="540" y1="74" x2="620" y2="75"  stroke="#f87171" stroke-width="2" marker-end="url(#ah-r)" class="pulse" style="animation-delay:.2s"/>
                <line x1="540" y1="81" x2="620" y2="125" stroke="#f87171" stroke-width="2" marker-end="url(#ah-r)" class="pulse" style="animation-delay:.4s"/>
                <rect x="620" y="10" width="90" height="155" rx="10" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="2"/>
                <text x="665" y="60"  class="nl" text-anchor="middle" fill="#f87171">DB</text>
                <text x="665" y="80"  class="ns" text-anchor="middle">50 × 20</text>
                <text x="665" y="95"  class="ns" text-anchor="middle">= 1,000</text>
                <text x="665" y="110" class="ns" text-anchor="middle">queries</text>
                <text x="665" y="128" class="ns" text-anchor="middle" fill="#fbbf24">⚠ OVERLOAD</text>
                <text x="665" y="145" class="ns" text-anchor="middle" fill="#f87171">→ cascade</text>
                <rect x="730" y="60" width="120" height="70" rx="8" fill="rgba(248,113,113,0.05)" stroke="rgba(248,113,113,0.2)" stroke-width="1"/>
                <text x="740" y="78"  class="ns" fill="#f87171">1. DB slows</text>
                <text x="740" y="95"  class="ns" fill="#f87171">2. Timeouts ↑</text>
                <text x="740" y="112" class="ns" fill="#f87171">3. Retries ↑↑</text>
                <text x="740" y="126" class="ns" fill="#f87171">4. DB dies 💀</text>
                <text x="495" y="140" class="ns" text-anchor="middle" fill="#fbbf24">⚠ No coordinator: each instance</text>
                <text x="495" y="155" class="ns" text-anchor="middle" fill="#fbbf24">independently fires a DB query</text>
                <text x="495" y="175" class="ns" text-anchor="middle" fill="#64748b">Scale factor: N instances × M requests</text>
              </svg>
            </div>
            <div class="diagram-caption">
              In a distributed system, 50 app instances × 20 requests each = 1,000 simultaneous DB queries for one expired cache key. Each instance acts independently — there is no built-in "only one recompute" coordination.
            </div>
          </div>
        </section>

        <!-- 6. SPIKE VS HERD -->
        <section id="spike">
          <div class="section-label">06 · Comparison</div>
          <h2 class="section-title">Normal Traffic Spike vs Thundering Herd</h2>
          <div class="section-body">
            <p>
              These two are easy to confuse because both result in high load. The difference is
              in the <strong>root cause</strong> and the <strong>nature of the requests</strong>.
              A normal spike brings more users doing different things. A thundering herd brings
              many actors doing the exact same thing at the exact same moment.
            </p>
          </div>

          <div class="compare-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th>ASPECT</th>
                  <th>NORMAL TRAFFIC SPIKE</th>
                  <th>THUNDERING HERD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Root cause</td>
                  <td>More users (event, viral moment, ad campaign)</td>
                  <td>Shared internal event — cache TTL, lock release, restart</td>
                </tr>
                <tr>
                  <td>Request type</td>
                  <td>Mixed and varied — different pages, APIs, user IDs</td>
                  <td>Identical — same key, same query, same computation</td>
                </tr>
                <tr>
                  <td>Predictability</td>
                  <td>Often foreseeable — IPL match time, flash sale start</td>
                  <td>Tied to internal system events, harder to predict</td>
                </tr>
                <tr>
                  <td>DB load</td>
                  <td>High but varied; queries hit different rows/tables</td>
                  <td>High with all duplicate queries — pure wasted work</td>
                </tr>
                <tr>
                  <td>Fix approach</td>
                  <td>Scale out horizontally, CDN, read replicas, queuing</td>
                  <td>Coalescing, lock per key, TTL jitter, backoff, rate limit</td>
                </tr>
                <tr>
                  <td>Analogy</td>
                  <td>Rush hour on a highway — more cars, but spread out</td>
                  <td>Store opening — everyone rushes in the same second</td>
                </tr>
                <tr>
                  <td>Solved by adding servers?</td>
                  <td>Yes — more instances handle more diverse load</td>
                  <td>No — more instances = more agents firing the same query</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="callout callout-warn" style="margin-top:24px;">
            <span class="callout-icon">⚠️</span>
            <div class="callout-text">
              <strong>Scaling out makes the thundering herd worse.</strong> Adding more app instances means more agents simultaneously fire the same duplicate queries when the cache expires. The fix is coordination — not scale.
            </div>
          </div>
        </section>

        <!-- 7. IMPACT -->
        <section id="impact">
          <div class="section-label">07 · System Impact</div>
          <h2 class="section-title">What Breaks and Why</h2>
          <div class="section-body">
            <p>
              When the herd strikes, the damage spreads across every layer of the stack simultaneously.
              Understanding each impact area helps in both diagnosis and mitigation.
            </p>
          </div>

          <div class="impact-grid">
            <div class="impact-card">
              <div class="impact-label">CPU</div>
              <div class="impact-title">CPU Spike</div>
              <div class="impact-body">
                Each request independently runs the same expensive computation — building a page,
                aggregating data, running ML inference. CPU usage spikes from idle to 100%.
                Other requests get starved of CPU time, causing global latency degradation
                across all endpoints — not just the affected one.
              </div>
            </div>
            <div class="impact-card">
              <div class="impact-label">DATABASE</div>
              <div class="impact-title">Connection Pool Exhaustion</div>
              <div class="impact-body">
                Databases serve a limited connection pool (e.g., 100 connections). If 500 requests
                simultaneously try to run the same query, 400 of them wait for a free connection.
                Lock contention increases. Slow queries pile up. The DB query queue backs up,
                causing timeouts that propagate back as 503 or 504 errors.
              </div>
            </div>
            <div class="impact-card">
              <div class="impact-label">CACHE</div>
              <div class="impact-title">Cache Stays Cold</div>
              <div class="impact-body">
                During the ~200ms window that the first recomputation takes, the cache remains
                empty for that key. Every new request that arrives during this window also sees
                a miss and fires yet another DB query. The cache is designed to protect the DB —
                but during the stampede window, it provides zero protection.
              </div>
            </div>
            <div class="impact-card">
              <div class="impact-label">LATENCY</div>
              <div class="impact-title">Latency Explosion</div>
              <div class="impact-body">
                Requests that would have returned in 2ms (cache hit) now wait 200ms+ for a DB
                query that itself is queued behind 499 other identical queries. P99 latency can
                go from 10ms to 5s or more. Users see slow page loads. SLAs break.
                Cascading retries from clients make everything worse.
              </div>
            </div>
          </div>

          <div class="diagram-card" style="margin-top:32px;">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>impact-chain.svg — cascade from one expired key</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 100" height="100">
                <rect x="10"  y="30" width="120" height="40" rx="8" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" stroke-width="1.5"/>
                <text x="70"  y="47" class="nt" text-anchor="middle" fill="#fbbf24">Cache key</text>
                <text x="70"  y="63" class="nt" text-anchor="middle" fill="#fbbf24">expires</text>
                <line x1="130" y1="50" x2="165" y2="50" stroke="#f97316" stroke-width="2" marker-end="url(#ah-o)"/>
                <rect x="165" y="30" width="120" height="40" rx="8" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="1.5"/>
                <text x="225" y="47" class="nt" text-anchor="middle" fill="#f87171">N requests</text>
                <text x="225" y="63" class="nt" text-anchor="middle" fill="#f87171">MISS cache</text>
                <line x1="285" y1="50" x2="320" y2="50" stroke="#f97316" stroke-width="2" marker-end="url(#ah-o)"/>
                <rect x="320" y="30" width="130" height="40" rx="8" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="1.5"/>
                <text x="385" y="47" class="nt" text-anchor="middle" fill="#f87171">DB flooded</text>
                <text x="385" y="63" class="nt" text-anchor="middle" fill="#f87171">N queries</text>
                <line x1="450" y1="50" x2="485" y2="50" stroke="#f97316" stroke-width="2" marker-end="url(#ah-o)"/>
                <rect x="485" y="30" width="130" height="40" rx="8" fill="rgba(248,113,113,0.15)" stroke="#f87171" stroke-width="2"/>
                <text x="550" y="47" class="nt" text-anchor="middle" fill="#f87171">CPU 100%</text>
                <text x="550" y="63" class="nt" text-anchor="middle" fill="#f87171">Latency spikes</text>
                <line x1="615" y1="50" x2="650" y2="50" stroke="#f97316" stroke-width="2" marker-end="url(#ah-o)"/>
                <rect x="650" y="30" width="200" height="40" rx="8" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="2"/>
                <text x="750" y="47" class="nt" text-anchor="middle" fill="#f87171">Timeouts + retries</text>
                <text x="750" y="63" class="nt" text-anchor="middle" fill="#f87171">→ cascade failure</text>
                <text x="70"  y="90" class="ns" text-anchor="middle" fill="#fbbf24">trigger</text>
                <text x="225" y="90" class="ns" text-anchor="middle" fill="#f87171">stampede</text>
                <text x="385" y="90" class="ns" text-anchor="middle" fill="#f87171">overload</text>
                <text x="550" y="90" class="ns" text-anchor="middle" fill="#f87171">degradation</text>
                <text x="750" y="90" class="ns" text-anchor="middle" fill="#f87171">cascade 💀</text>
              </svg>
            </div>
            <div class="diagram-caption">
              One expired cache key triggers a cascade: MISS → DB flood → CPU spike → latency explosion → timeouts → client retries → more load. Each stage amplifies the next.
            </div>
          </div>
        </section>

        <!-- 8. MITIGATIONS -->
        <section id="fix">
          <div class="section-label">08 · Mitigation Techniques</div>
          <h2 class="section-title">Five Ways to Stop the Herd</h2>
          <div class="section-body">
            <p>
              The goal of every mitigation is the same: ensure that a shared event does not cause
              synchronized, duplicate work across many actors. The approaches range from collapsing
              requests into one, to spreading expiry times, to slowing down retries.
            </p>
          </div>

          <div class="technique-grid">
            <div class="technique-card">
              <div class="technique-num">01 · Coalescing</div>
              <div class="technique-name">Request Coalescing</div>
              <div class="technique-body">
                When multiple requests arrive for the same missing cache key, only the first one
                triggers a DB fetch. All subsequent requests are held in a queue. When the first
                fetch completes and populates the cache, all waiting requests are served the same result.
              </div>
              <div class="technique-effect">N requests → 1 DB call → shared result</div>
            </div>
            <div class="technique-card">
              <div class="technique-num">02 · Mutex</div>
              <div class="technique-name">Cache Lock / Mutex</div>
              <div class="technique-body">
                Before recomputing, acquire a distributed lock for that key (e.g. <code>lock:homepage</code>).
                Only the holder recomputes and sets the cache. Others read stale data or wait briefly
                then read the freshly populated cache. No duplicate work is done.
              </div>
              <div class="technique-effect">One recompute per key at a time</div>
            </div>
            <div class="technique-card">
              <div class="technique-num">03 · Jitter</div>
              <div class="technique-name">Staggered Expiry</div>
              <div class="technique-body">
                Add random jitter to TTL so keys don't all expire at the same moment:
                <code>TTL = base + random(0, N)</code>. Keys that were set at the same time
                now expire at different times, preventing a synchronized mass-expiry.
              </div>
              <div class="technique-effect">No synchronized mass-expiry event</div>
            </div>
            <div class="technique-card">
              <div class="technique-num">04 · Backoff</div>
              <div class="technique-name">Exponential Backoff</div>
              <div class="technique-body">
                When a request fails (e.g., DB timeout, 503), clients wait before retrying — and the
                wait doubles each time: 1s → 2s → 4s → 8s (plus jitter). Prevents all clients from
                retrying simultaneously after a failure, which would cause another stampede.
              </div>
              <div class="technique-effect">Retries spread over time, not synchronized</div>
            </div>
            <div class="technique-card">
              <div class="technique-num">05 · Rate Limit</div>
              <div class="technique-name">Rate Limiting</div>
              <div class="technique-body">
                Limit how many requests can trigger a cache recomputation per key per second.
                Excess requests are either queued, served stale cached values, or gracefully
                rejected. Acts as a safety cap on herd size.
              </div>
              <div class="technique-effect">Caps maximum simultaneous recomputes</div>
            </div>
          </div>

          <div class="diagram-card" style="margin-top:32px;">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>before-vs-after-mitigation.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 260" height="260">
                <text x="10" y="18" class="nl" fill="#f87171">BEFORE: No mitigation — Thundering Herd</text>
                <rect x="10"  y="30" width="65" height="24" rx="5" fill="rgba(248,113,113,0.15)" stroke="#f87171" stroke-width="1"/>
                <rect x="10"  y="60" width="65" height="24" rx="5" fill="rgba(248,113,113,0.15)" stroke="#f87171" stroke-width="1"/>
                <rect x="10"  y="90" width="65" height="24" rx="5" fill="rgba(248,113,113,0.15)" stroke="#f87171" stroke-width="1"/>
                <rect x="10"  y="120" width="65" height="24" rx="5" fill="rgba(248,113,113,0.15)" stroke="#f87171" stroke-width="1"/>
                <text x="42" y="46"  class="ns" text-anchor="middle" fill="#f87171">Req 1</text>
                <text x="42" y="76"  class="ns" text-anchor="middle" fill="#f87171">Req 2</text>
                <text x="42" y="106" class="ns" text-anchor="middle" fill="#f87171">Req 3</text>
                <text x="42" y="136" class="ns" text-anchor="middle" fill="#f87171">Req N</text>
                <line x1="75"  y1="42"  x2="155" y2="85"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="75"  y1="72"  x2="155" y2="88"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="75"  y1="102" x2="155" y2="91"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="75"  y1="132" x2="155" y2="94"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <rect x="155" y="72" width="80" height="40" rx="6" fill="rgba(248,113,113,0.1)" stroke="#f87171" stroke-width="1.5"/>
                <text x="195" y="89"  class="nt" text-anchor="middle" fill="#f87171">Cache</text>
                <text x="195" y="104" class="nt" text-anchor="middle" fill="#f87171">MISS ✗</text>
                <line x1="235" y1="82" x2="330" y2="50"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="235" y1="86" x2="330" y2="82"  stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="235" y1="90" x2="330" y2="115" stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <line x1="235" y1="94" x2="330" y2="145" stroke="#f87171" stroke-width="1.5" marker-end="url(#ah-r)"/>
                <rect x="330" y="30" width="90" height="145" rx="8" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="2"/>
                <text x="375" y="98"  class="nl" text-anchor="middle" fill="#f87171">DB</text>
                <text x="375" y="115" class="ns" text-anchor="middle">N queries</text>
                <text x="375" y="130" class="ns" text-anchor="middle" fill="#fbbf24">⚠ overload</text>
                <line x1="445" y1="10" x2="445" y2="250" stroke="#1a2640" stroke-width="1.5" stroke-dasharray="6,4"/>
                <text x="455" y="18" class="nl" fill="#34d399">AFTER: With Lock + Coalescing</text>
                <rect x="455" y="30"  width="65" height="24" rx="5" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1.5"/>
                <rect x="455" y="60"  width="65" height="24" rx="5" fill="rgba(100,116,139,0.1)" stroke="#64748b" stroke-width="1"/>
                <rect x="455" y="90"  width="65" height="24" rx="5" fill="rgba(100,116,139,0.1)" stroke="#64748b" stroke-width="1"/>
                <rect x="455" y="120" width="65" height="24" rx="5" fill="rgba(100,116,139,0.1)" stroke="#64748b" stroke-width="1"/>
                <text x="487" y="46"  class="ns" text-anchor="middle" fill="#34d399">Req 1 ★</text>
                <text x="487" y="76"  class="ns" text-anchor="middle">Req 2</text>
                <text x="487" y="106" class="ns" text-anchor="middle">Req 3</text>
                <text x="487" y="136" class="ns" text-anchor="middle">Req N</text>
                <line x1="520" y1="42" x2="595" y2="58" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="595" y="46" width="80" height="36" rx="6" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" stroke-width="1.5"/>
                <text x="635" y="62"  class="nt" text-anchor="middle" fill="#a78bfa">🔒 Lock</text>
                <text x="635" y="76"  class="nt" text-anchor="middle" fill="#a78bfa">acquired</text>
                <line x1="675" y1="64" x2="745" y2="50" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)"/>
                <rect x="745" y="30" width="90" height="80" rx="8" fill="rgba(52,211,153,0.08)" stroke="#34d399" stroke-width="1.5"/>
                <text x="790" y="68"  class="nl" text-anchor="middle" fill="#34d399">DB</text>
                <text x="790" y="84"  class="ns" text-anchor="middle">1 query ✓</text>
                <text x="790" y="100" class="ns" text-anchor="middle" fill="#34d399">Normal load</text>
                <line x1="520" y1="72"  x2="595" y2="84" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>
                <line x1="520" y1="102" x2="595" y2="88" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>
                <line x1="520" y1="132" x2="595" y2="92" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>
                <rect x="595" y="96" width="80" height="36" rx="6" fill="rgba(100,116,139,0.1)" stroke="#64748b" stroke-width="1"/>
                <text x="635" y="112" class="nt" text-anchor="middle">Wait /</text>
                <text x="635" y="126" class="nt" text-anchor="middle">Read stale</text>
                <rect x="575" y="160" width="120" height="36" rx="6" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1.5"/>
                <text x="635" y="176" class="nt" text-anchor="middle" fill="#34d399">Cache updated ✓</text>
                <text x="635" y="190" class="nt" text-anchor="middle" fill="#34d399">All served from cache</text>
                <line x1="790" y1="110" x2="695" y2="162" stroke="#34d399" stroke-width="1.5" marker-end="url(#ah-g)" stroke-dasharray="4,3"/>
                <text x="455" y="230" class="ns" fill="#34d399">✓ 1 DB query  ✓ Normal CPU  ✓ Fast for all  ✓ Cache repopulated</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Before: every request independently hits the DB — N queries, overload. After: Req 1 acquires a lock and does one DB call. Others wait briefly or read stale. Once cache is repopulated, all requests are served instantly.
            </div>
          </div>

          <div class="diagram-card" style="margin-top:24px;">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>staggered-ttl-jitter.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 270" height="270">
                <text x="10" y="16" class="nl" fill="#f87171">WITHOUT Jitter — all keys expire at t=60s → synchronized spike</text>
                <line x1="10" y1="130" x2="840" y2="130" stroke="#1a2640" stroke-width="1"/>
                <text x="10"  y="145" class="ns" fill="#64748b">0s</text>
                <text x="420" y="145" class="ns" fill="#f97316">60s (all expire here)</text>
                <text x="820" y="145" class="ns" fill="#64748b">90s</text>
                <rect x="10" y="30"  width="420" height="20" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="55"  width="420" height="20" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="80"  width="420" height="20" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="105" width="420" height="20" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <text x="14" y="45"  class="ns" fill="#34d399">Key A [CACHED]</text>
                <text x="14" y="70"  class="ns" fill="#34d399">Key B [CACHED]</text>
                <text x="14" y="95"  class="ns" fill="#34d399">Key C [CACHED]</text>
                <text x="14" y="120" class="ns" fill="#34d399">Key D [CACHED]</text>
                <line x1="430" y1="20" x2="430" y2="130" stroke="#f97316" stroke-width="2" stroke-dasharray="5,4"/>
                <rect x="430" y="30"  width="180" height="20" rx="3" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1"/>
                <rect x="430" y="55"  width="180" height="20" rx="3" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1"/>
                <rect x="430" y="80"  width="180" height="20" rx="3" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1"/>
                <rect x="430" y="105" width="180" height="20" rx="3" fill="rgba(248,113,113,0.2)" stroke="#f87171" stroke-width="1"/>
                <text x="434" y="45"  class="ns" fill="#f87171">→ DB hit</text>
                <text x="434" y="70"  class="ns" fill="#f87171">→ DB hit</text>
                <text x="434" y="95"  class="ns" fill="#f87171">→ DB hit</text>
                <text x="434" y="120" class="ns" fill="#f87171">→ DB hit</text>
                <text x="630" y="80"  class="ns" fill="#f97316">⚡ 4 simultaneous DB queries</text>
                <text x="10" y="164" class="nl" fill="#34d399">WITH Jitter — TTLs staggered → smooth load on DB</text>
                <line x1="10" y1="260" x2="840" y2="260" stroke="#1a2640" stroke-width="1"/>
                <text x="10" y="275" class="ns" fill="#64748b">0s</text>
                <text x="820" y="275" class="ns" fill="#64748b">90s</text>
                <rect x="10" y="178" width="420" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="200" width="454" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="222" width="490" height="18" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <rect x="10" y="244" width="530" height="16" rx="3" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1"/>
                <text x="14" y="192" class="ns" fill="#34d399">Key A TTL=60s</text>
                <text x="14" y="214" class="ns" fill="#34d399">Key B TTL=65s</text>
                <text x="14" y="236" class="ns" fill="#34d399">Key C TTL=71s</text>
                <text x="14" y="256" class="ns" fill="#34d399">Key D TTL=76s</text>
                <rect x="430" y="178" width="90" height="18" rx="3" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>
                <rect x="464" y="200" width="90" height="18" rx="3" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>
                <rect x="500" y="222" width="90" height="18" rx="3" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>
                <rect x="540" y="244" width="90" height="16" rx="3" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>
                <text x="434" y="192" class="ns" fill="#34d399">1 DB (t=60)</text>
                <text x="468" y="214" class="ns" fill="#34d399">1 DB (t=65)</text>
                <text x="504" y="236" class="ns" fill="#34d399">1 DB (t=71)</text>
                <text x="544" y="256" class="ns" fill="#34d399">1 DB (t=76)</text>
                <text x="660" y="220" class="nl" fill="#34d399">✓ 1 query at a time</text>
                <text x="660" y="238" class="ns" fill="#34d399">  load spread over 16s</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Without jitter: all four keys expire at t=60s → 4 simultaneous DB queries. With jitter (<code>TTL = base + random(0, 20)</code>): expiries staggered from t=60s to t=76s → one DB query at a time, database load stays flat.
            </div>
          </div>
        </section>

        <!-- 9. REAL WORLD -->
        <section id="realworld">
          <div class="section-label">09 · Real-World Examples</div>
          <h2 class="section-title">Where You've Already Seen This</h2>
          <div class="section-body">
            <p>
              You don't need to look far for thundering herd scenarios. They happen at massive scale
              regularly — usually triggered by predictable real-world events that cause millions of
              people to act at the same moment.
            </p>
          </div>

          <div class="rw-grid">
            <div class="rw-card">
              <div class="rw-icon">🏏</div>
              <div class="rw-name">IPL Match — Live Score</div>
              <div class="rw-desc">
                A key wicket falls. 40 million people simultaneously refresh the score. If "live score" is cached
                with a 5-second TTL, that TTL expiry aligns with the next wave of refreshes — creating a massive
                cache stampede on the score computation API.
              </div>
            </div>
            <div class="rw-card">
              <div class="rw-icon">🎬</div>
              <div class="rw-name">Netflix / OTT — Midnight Release</div>
              <div class="rw-desc">
                A highly anticipated series drops at midnight. Millions open the app simultaneously.
                "Show metadata" and "personalized recommendations" are cached with the same TTL.
                Coordinated expiry at midnight → stampede on backend recommendation services.
              </div>
            </div>
            <div class="rw-card">
              <div class="rw-icon">🛍️</div>
              <div class="rw-name">Flash Sale — 10:00 AM</div>
              <div class="rw-desc">
                "Sale starts at 10:00." Everyone clicks at exactly 10:00:00. Same product pages,
                same inventory APIs, same checkout cache. Without coalescing or locking, the cache
                and database are overwhelmed in the first 200ms of the sale.
              </div>
            </div>
          </div>

          <div class="callout callout-info" style="margin-top:24px;">
            <span class="callout-icon">💡</span>
            <div class="callout-text">
              <strong>The pattern in all three:</strong> The total number of users is expected and manageable. The
              <em>synchronization</em> of their actions — driven by a shared real-world event — is what creates the herd.
              The system was designed for average load, not a synchronized burst of the same operation.
            </div>
          </div>

          <div class="summary-box">
            <h3>Key Takeaways</h3>
            <ul class="summary-list">
              <li>The thundering herd is a <strong>coordination</strong> problem, not a capacity problem.</li>
              <li>Adding more servers makes it <strong>worse</strong> — more agents fire the same duplicate query.</li>
              <li><strong>Request coalescing</strong> is the most effective single fix — collapse N queries into 1.</li>
              <li><strong>TTL jitter</strong> is cheap and prevents synchronized mass-expiry at no real cost.</li>
              <li><strong>Exponential backoff</strong> stops retry storms from turning a blip into an outage.</li>
            </ul>
          </div>
        </section>

      </main>

      <div class="blog-divider"></div>
      <div class="blog-footer-note">
        Understanding the Thundering Herd Problem &nbsp;·&nbsp; System Design &nbsp;·&nbsp; Cache Stampede · Distributed Systems
      </div>

    </div>
  `,
  styleUrls: ['./thundering-herd.component.scss']
})
export class ThunderingHerdComponent {
  readingProgress = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const total = doc.scrollHeight - doc.clientHeight;
    this.readingProgress = total > 0 ? (scrolled / total * 100) : 0;
  }
}
