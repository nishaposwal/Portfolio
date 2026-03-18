import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-kafka-explained-like-youre-5',
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
        <div class="hero-eyebrow">Distributed Systems · Event Streaming · Kafka</div>
        <h1>Kafka Explained<br/>Like <span class="highlight">You’re 5</span></h1>
        <p class="hero-sub">
          A super-intuitive explanation of Kafka using everyday analogies — what it solves, what a
          “message stream” means, and how producers, topics, partitions, and consumer groups work
          together to handle massive workloads.
        </p>
        <div class="hero-meta">
          <div class="hero-meta-item">
            <span class="hero-meta-label">Topic</span>
            <span class="hero-meta-value">Event Streaming Basics</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Covers</span>
            <span class="hero-meta-value">Producers · Topics · Partitions · Consumer Groups</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Level</span>
            <span class="hero-meta-value">Beginner</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Read Time</span>
            <span class="hero-meta-value">10 min</span>
          </div>
        </div>
      </section>

      <!-- ── TOC ── -->
      <div class="toc-bar">
        <a href="#problem">The problem</a>
        <a href="#stream">What’s a stream?</a>
        <a href="#pipeline">Kafka as a pipeline</a>
        <a href="#roles">Producer → Kafka → Consumer</a>
        <a href="#topics">Topics</a>
        <a href="#partitions">Partitions</a>
        <a href="#fast">Why it’s fast</a>
        <a href="#groups">Consumer groups</a>
        <a href="#realworld">Real-world uses</a>
        <a href="#safety">Safe + ordered</a>
        <a href="#recap">Recap</a>
      </div>

      <!-- ── MAIN ── -->
      <main>

        <!-- 01 -->
        <section id="problem">
          <div class="section-label">01 · Start with a real-life picture</div>
          <h2 class="section-title">When Too Many Things Happen at Once</h2>
          <div class="section-body">
            <p>
              Imagine a busy restaurant on a Saturday night. Orders come in from the dining room,
              delivery apps, and phone calls. If the kitchen tries to handle every order directly
              the moment it arrives, chaos happens: missed items, mixed-up tickets, and overwhelmed chefs.
            </p>
            <p>
              Kafka solves the “too many things happening at once” problem for software.
              When your system has lots of events happening continuously (clicks, payments, logs,
              notifications, deliveries, inventory updates), Kafka helps you move those events reliably
              from the place they are created to the place they need to be processed.
            </p>
          </div>

          <div class="callout callout-info">
            <span class="callout-icon">💡</span>
            <div class="callout-text">
              <strong>Kafka in one sentence:</strong> Kafka is a system that manages a huge, continuous stream of
              events so many different workers can process them without stepping on each other.
            </div>
          </div>
        </section>

        <!-- 02 -->
        <section id="stream">
          <div class="section-label">02 · The key idea</div>
          <h2 class="section-title">What “A Message Stream” Means (Simply)</h2>
          <div class="section-body">
            <p>
              A <strong>stream</strong> is just something that keeps flowing. Like water in a river
              or cars on a road. A <strong>message stream</strong> is the same idea, but the “things flowing”
              are small pieces of information:
            </p>
            <ul class="list">
              <li><strong>“Order placed”</strong></li>
              <li><strong>“User signed up”</strong></li>
              <li><strong>“Payment succeeded”</strong></li>
              <li><strong>“Item shipped”</strong></li>
            </ul>
            <p>
              Instead of sending these events directly to every system that might care,
              you put them into a stream — and consumers can read from that stream at their own pace.
            </p>
          </div>
        </section>

        <!-- 03 -->
        <section id="pipeline">
          <div class="section-label">03 · The mental model</div>
          <h2 class="section-title">Kafka Is a Central Message Pipeline</h2>
          <div class="section-body">
            <p>
              Think of Kafka like a super-organized conveyor belt in a warehouse.
              Boxes (messages) are placed on the belt, and different stations pick them up to do work.
              The belt doesn’t do the work itself — it <strong>moves</strong> work reliably.
            </p>
            <p>
              That central pipeline is powerful because it separates “creating events” from “processing events.”
              Producers can keep sending messages even if consumers are busy. Consumers can scale up and
              down without forcing producers to change.
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>producer-kafka-consumer.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 220" height="220">
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>

                <text x="120" y="26" class="ns" text-anchor="middle">PRODUCERS</text>
                <rect x="35" y="40" width="170" height="140" rx="14" fill="rgba(52,211,153,0.08)" stroke="#34d399" stroke-width="1.5"/>
                <rect x="60" y="68" width="120" height="26" rx="10" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="60" y="104" width="120" height="26" rx="10" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="60" y="140" width="120" height="26" rx="10" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <text x="120" y="86" class="nt" text-anchor="middle" fill="#34d399">Checkout</text>
                <text x="120" y="122" class="nt" text-anchor="middle" fill="#34d399">Website</text>
                <text x="120" y="158" class="nt" text-anchor="middle" fill="#34d399">Mobile App</text>

                <text x="430" y="26" class="ns" text-anchor="middle">KAFKA</text>
                <rect x="300" y="40" width="260" height="140" rx="14" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.5"/>
                <rect x="325" y="70" width="210" height="26" rx="8" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="325" y="106" width="210" height="26" rx="8" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="325" y="142" width="210" height="26" rx="8" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <text x="430" y="88" class="nt" text-anchor="middle" fill="#38bdf8">Event stream</text>
                <text x="430" y="124" class="nt" text-anchor="middle" fill="#38bdf8">“Order placed”</text>
                <text x="430" y="160" class="nt" text-anchor="middle" fill="#38bdf8">“Payment succeeded”</text>

                <text x="740" y="26" class="ns" text-anchor="middle">CONSUMERS</text>
                <rect x="655" y="40" width="170" height="140" rx="14" fill="rgba(167,139,250,0.07)" stroke="#a78bfa" stroke-width="1.5"/>
                <rect x="680" y="68" width="120" height="26" rx="10" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1"/>
                <rect x="680" y="104" width="120" height="26" rx="10" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1"/>
                <rect x="680" y="140" width="120" height="26" rx="10" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1"/>
                <text x="740" y="86" class="nt" text-anchor="middle" fill="#a78bfa">Email</text>
                <text x="740" y="122" class="nt" text-anchor="middle" fill="#a78bfa">Shipping</text>
                <text x="740" y="158" class="nt" text-anchor="middle" fill="#a78bfa">Analytics</text>

                <line x1="205" y1="110" x2="300" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
                <line x1="560" y1="110" x2="655" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>

                <text x="252" y="98" class="ns" text-anchor="middle">send</text>
                <text x="608" y="98" class="ns" text-anchor="middle">read</text>
              </svg>
            </div>
            <div class="diagram-caption">
              Producers put events into Kafka. Consumers read those events and do work. Kafka sits in the middle as the reliable pipeline.
            </div>
          </div>
        </section>

        <!-- 04 -->
        <section id="roles">
          <div class="section-label">04 · Roles</div>
          <h2 class="section-title">Producers, Kafka, Consumers (Step by Step)</h2>
          <div class="section-body">
            <p>
              Let’s introduce the roles in the most basic chain:
            </p>
            <div class="pill-row">
              <span class="pill pill-green">Producer</span>
              <span class="pill-arrow">→</span>
              <span class="pill pill-blue">Kafka</span>
              <span class="pill-arrow">→</span>
              <span class="pill pill-purple">Consumer</span>
            </div>
            <p>
              <strong>Producers</strong> are the apps/services that <em>send</em> messages.
              <strong>Consumers</strong> are the apps/services that <em>read</em> messages to do work.
              Kafka is the system that stores and delivers those messages.
            </p>
          </div>
        </section>

        <!-- 05 -->
        <section id="topics">
          <div class="section-label">05 · Grouping</div>
          <h2 class="section-title">Topics: How Messages Are Grouped</h2>
          <div class="section-body">
            <p>
              A <strong>topic</strong> is like a named folder or channel for a category of messages.
              You don’t want “payments” mixed with “shipments” in one pile.
            </p>
            <ul class="list">
              <li><strong>Topic:</strong> <code>orders</code> → “Order created”, “Order cancelled”</li>
              <li><strong>Topic:</strong> <code>payments</code> → “Payment succeeded”, “Payment failed”</li>
              <li><strong>Topic:</strong> <code>page_views</code> → “User viewed product page”</li>
            </ul>
            <p>
              Topics keep streams organized so different teams/systems can subscribe only to what they need.
            </p>
          </div>
        </section>

        <!-- 06 -->
        <section id="partitions">
          <div class="section-label">06 · Speed through parallelism</div>
          <h2 class="section-title">Partitions: Dividing a Topic into Lanes</h2>
          <div class="section-body">
            <p>
              Here’s the big scaling trick: inside Kafka, a topic is split into <strong>partitions</strong>.
              Partitions are like multiple lanes on a highway. The topic is the road name, and partitions
              are the lanes.
            </p>
            <p>
              Why split? Because then multiple consumers can work in parallel — each on a different lane.
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>topic-partitions.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 240" height="240">
                <defs>
                  <marker id="arrow2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>

                <text x="150" y="26" class="ns" text-anchor="middle">Topic: orders</text>
                <rect x="40" y="40" width="220" height="160" rx="14" fill="rgba(56,189,248,0.05)" stroke="#38bdf8" stroke-width="1.5"/>

                <rect x="60" y="66" width="180" height="32" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="60" y="106" width="180" height="32" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="60" y="146" width="180" height="32" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <text x="150" y="86" class="nt" text-anchor="middle" fill="#38bdf8">Partition 0</text>
                <text x="150" y="126" class="nt" text-anchor="middle" fill="#38bdf8">Partition 1</text>
                <text x="150" y="166" class="nt" text-anchor="middle" fill="#38bdf8">Partition 2</text>

                <text x="580" y="26" class="ns" text-anchor="middle">Parallel processing lanes</text>
                <rect x="360" y="52" width="460" height="48" rx="14" fill="rgba(52,211,153,0.08)" stroke="#34d399" stroke-width="1.5"/>
                <rect x="360" y="106" width="460" height="48" rx="14" fill="rgba(251,191,36,0.06)" stroke="#fbbf24" stroke-width="1.5"/>
                <rect x="360" y="160" width="460" height="48" rx="14" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" stroke-width="1.5"/>
                <text x="390" y="80" class="nt" fill="#34d399">Lane 0: messages stay in order</text>
                <text x="390" y="134" class="nt" fill="#fbbf24">Lane 1: messages stay in order</text>
                <text x="390" y="188" class="nt" fill="#a78bfa">Lane 2: messages stay in order</text>

                <line x1="240" y1="82" x2="360" y2="76" stroke="#64748b" stroke-width="2" marker-end="url(#arrow2)"/>
                <line x1="240" y1="122" x2="360" y2="130" stroke="#64748b" stroke-width="2" marker-end="url(#arrow2)"/>
                <line x1="240" y1="162" x2="360" y2="184" stroke="#64748b" stroke-width="2" marker-end="url(#arrow2)"/>
              </svg>
            </div>
            <div class="diagram-caption">
              A single topic is split into multiple partitions. Each partition is an internal lane that can be processed independently.
            </div>
          </div>
        </section>

        <!-- 07 -->
        <section id="fast">
          <div class="section-label">07 · Why it scales</div>
          <h2 class="section-title">Why Kafka Is Fast and Scalable</h2>
          <div class="section-body">
            <p>
              Kafka is fast because it’s designed for the one job it does: moving lots of events.
              It keeps messages in an append-only “log” (think: writing new lines to the end of a notebook),
              which is very efficient.
            </p>
            <p>
              It scales because you can add more partitions and more consumers. More lanes + more workers
              means more throughput, without changing how producers send messages.
            </p>
          </div>

          <div class="callout callout-good">
            <span class="callout-icon">✅</span>
            <div class="callout-text">
              <strong>Simple scaling rule:</strong> to process more events, add more partitions (lanes) and more consumers (workers).
            </div>
          </div>
        </section>

        <!-- 08 -->
        <section id="groups">
          <div class="section-label">08 · Sharing work</div>
          <h2 class="section-title">Consumer Groups: Splitting Work Across Consumers</h2>
          <div class="section-body">
            <p>
              A <strong>consumer group</strong> is a team of consumers working together on the same topic.
              Kafka hands out partitions to the team so they don’t duplicate work.
            </p>
            <p>
              If a topic has 3 partitions and your consumer group has 3 consumers, each consumer can take
              one partition. That means <strong>the work is shared</strong>.
            </p>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>consumer-group-sharing.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 260" height="260">
                <defs>
                  <marker id="arrow3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>

                <text x="185" y="26" class="ns" text-anchor="middle">Topic: orders (3 partitions)</text>
                <rect x="55" y="40" width="260" height="180" rx="14" fill="rgba(56,189,248,0.05)" stroke="#38bdf8" stroke-width="1.5"/>
                <rect x="85" y="66" width="200" height="32" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="85" y="114" width="200" height="32" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="85" y="162" width="200" height="32" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <text x="185" y="86" class="nt" text-anchor="middle" fill="#38bdf8">Partition 0</text>
                <text x="185" y="134" class="nt" text-anchor="middle" fill="#38bdf8">Partition 1</text>
                <text x="185" y="182" class="nt" text-anchor="middle" fill="#38bdf8">Partition 2</text>

                <text x="660" y="26" class="ns" text-anchor="middle">One consumer group (shared work)</text>
                <rect x="460" y="40" width="350" height="180" rx="14" fill="rgba(52,211,153,0.06)" stroke="#34d399" stroke-width="1.5"/>

                <rect x="490" y="76" width="90" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="610" y="76" width="90" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="730" y="76" width="60" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>

                <text x="535" y="103" class="nt" text-anchor="middle" fill="#34d399">C1</text>
                <text x="655" y="103" class="nt" text-anchor="middle" fill="#34d399">C2</text>
                <text x="760" y="103" class="nt" text-anchor="middle" fill="#34d399">C3</text>

                <line x1="285" y1="82" x2="490" y2="92" stroke="#64748b" stroke-width="2" marker-end="url(#arrow3)"/>
                <line x1="285" y1="130" x2="610" y2="92" stroke="#64748b" stroke-width="2" marker-end="url(#arrow3)"/>
                <line x1="285" y1="178" x2="730" y2="92" stroke="#64748b" stroke-width="2" marker-end="url(#arrow3)"/>

                <text x="635" y="172" class="ns" text-anchor="middle" fill="#34d399">Each partition is assigned to one consumer in the group</text>
              </svg>
            </div>
            <div class="diagram-caption">
              A consumer group shares work by splitting partitions across consumers — no duplicate processing inside the same group.
            </div>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>3-partitions-4-consumers.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 290" height="290">
                <defs>
                  <marker id="arrow4" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>

                <text x="205" y="26" class="ns" text-anchor="middle">Topic: orders (3 partitions)</text>
                <rect x="55" y="40" width="300" height="210" rx="14" fill="rgba(56,189,248,0.05)" stroke="#38bdf8" stroke-width="1.5"/>
                <rect x="90" y="78" width="230" height="38" rx="12" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="90" y="136" width="230" height="38" rx="12" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="90" y="194" width="230" height="38" rx="12" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <text x="205" y="103" class="nt" text-anchor="middle" fill="#38bdf8">Partition 0</text>
                <text x="205" y="161" class="nt" text-anchor="middle" fill="#38bdf8">Partition 1</text>
                <text x="205" y="219" class="nt" text-anchor="middle" fill="#38bdf8">Partition 2</text>

                <text x="650" y="26" class="ns" text-anchor="middle">Consumer group: OrdersProcessor (4 consumers)</text>
                <rect x="420" y="40" width="390" height="210" rx="14" fill="rgba(52,211,153,0.06)" stroke="#34d399" stroke-width="1.5"/>

                <!-- Consumers row -->
                <rect x="460" y="74" width="76" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="554" y="74" width="76" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="648" y="74" width="76" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>

                <!-- 4th consumer: idle -->
                <rect x="742" y="74" width="56" height="44" rx="12" fill="rgba(100,116,139,0.12)" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>

                <text x="498" y="102" class="nt" text-anchor="middle" fill="#34d399">C1</text>
                <text x="592" y="102" class="nt" text-anchor="middle" fill="#34d399">C2</text>
                <text x="686" y="102" class="nt" text-anchor="middle" fill="#34d399">C3</text>
                <text x="770" y="97" class="nt" text-anchor="middle" fill="#64748b">C4</text>
                <text x="770" y="111" class="ns" text-anchor="middle" fill="#64748b">idle</text>

                <!-- assignments -->
                <line x1="320" y1="97" x2="460" y2="96" stroke="#64748b" stroke-width="2" marker-end="url(#arrow4)"/>
                <line x1="320" y1="155" x2="554" y2="96" stroke="#64748b" stroke-width="2" marker-end="url(#arrow4)"/>
                <line x1="320" y1="213" x2="648" y2="96" stroke="#64748b" stroke-width="2" marker-end="url(#arrow4)"/>

                <rect x="460" y="150" width="338" height="84" rx="14" fill="rgba(251,191,36,0.06)" stroke="rgba(251,191,36,0.25)" stroke-width="1.5"/>
                <text x="629" y="180" class="nl" text-anchor="middle" fill="#fbbf24">Partitions limit parallelism</text>
                <text x="629" y="202" class="nt" text-anchor="middle" fill="#fbbf24">With 3 partitions, only 3 consumers can work at once.</text>
                <text x="629" y="222" class="nt" text-anchor="middle" fill="#fbbf24">Extra consumers wait (idle) until partitions increase.</text>
              </svg>
            </div>
            <div class="diagram-caption">
              With 3 partitions and 4 consumers in the same group, only 3 consumers can be active. One consumer stays idle because a partition can only be owned by one consumer in a group.
            </div>
          </div>

          <div class="callout callout-info">
            <span class="callout-icon">💡</span>
            <div class="callout-text">
              <strong>Important twist:</strong> different consumer groups can read the <em>same</em> topic independently.
              One group can do shipping, another can do analytics, and both see all the same events.
            </div>
          </div>

          <div class="diagram-card">
            <div class="diagram-header">
              <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
              <span>multiple-consumer-groups.svg</span>
            </div>
            <div class="diagram-body">
              <svg viewBox="0 0 860 310" height="310">
                <defs>
                  <marker id="arrow5" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0,8 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>

                <text x="170" y="26" class="ns" text-anchor="middle">Topic: orders (same data)</text>
                <rect x="55" y="40" width="260" height="230" rx="14" fill="rgba(56,189,248,0.05)" stroke="#38bdf8" stroke-width="1.5"/>
                <rect x="85" y="78" width="200" height="34" rx="12" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="85" y="130" width="200" height="34" rx="12" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <rect x="85" y="182" width="200" height="34" rx="12" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1"/>
                <text x="185" y="100" class="nt" text-anchor="middle" fill="#38bdf8">Partition 0</text>
                <text x="185" y="152" class="nt" text-anchor="middle" fill="#38bdf8">Partition 1</text>
                <text x="185" y="204" class="nt" text-anchor="middle" fill="#38bdf8">Partition 2</text>

                <!-- Group A -->
                <text x="610" y="26" class="ns" text-anchor="middle">Consumer Group A: Shipping</text>
                <rect x="390" y="40" width="420" height="110" rx="14" fill="rgba(52,211,153,0.06)" stroke="#34d399" stroke-width="1.5"/>
                <rect x="420" y="78" width="90" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="530" y="78" width="90" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <rect x="640" y="78" width="90" height="44" rx="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" stroke-width="1"/>
                <text x="465" y="106" class="nt" text-anchor="middle" fill="#34d399">S1</text>
                <text x="575" y="106" class="nt" text-anchor="middle" fill="#34d399">S2</text>
                <text x="685" y="106" class="nt" text-anchor="middle" fill="#34d399">S3</text>

                <!-- Group B -->
                <text x="610" y="178" class="ns" text-anchor="middle">Consumer Group B: Analytics</text>
                <rect x="390" y="192" width="420" height="110" rx="14" fill="rgba(167,139,250,0.06)" stroke="#a78bfa" stroke-width="1.5"/>
                <rect x="420" y="230" width="90" height="44" rx="12" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1"/>
                <rect x="530" y="230" width="90" height="44" rx="12" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1"/>
                <rect x="640" y="230" width="90" height="44" rx="12" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1"/>
                <text x="465" y="258" class="nt" text-anchor="middle" fill="#a78bfa">A1</text>
                <text x="575" y="258" class="nt" text-anchor="middle" fill="#a78bfa">A2</text>
                <text x="685" y="258" class="nt" text-anchor="middle" fill="#a78bfa">A3</text>

                <!-- Read arrows: topic -> each group -->
                <line x1="315" y1="96" x2="390" y2="96" stroke="#64748b" stroke-width="2" marker-end="url(#arrow5)"/>
                <line x1="315" y1="148" x2="390" y2="248" stroke="#64748b" stroke-width="2" marker-end="url(#arrow5)"/>

                <text x="352" y="84" class="ns" text-anchor="middle">reads</text>
                <text x="352" y="166" class="ns" text-anchor="middle">reads</text>

                <rect x="55" y="276" width="755" height="24" rx="10" fill="rgba(251,191,36,0.06)" stroke="rgba(251,191,36,0.22)" stroke-width="1.5"/>
                <text x="432" y="292" class="nt" text-anchor="middle" fill="#fbbf24">
                  Same topic, two different groups: both see all messages, each keeps its own progress.
                </text>
              </svg>
            </div>
            <div class="diagram-caption">
              Multiple consumer groups can read the same topic independently. Shipping and Analytics both receive the same events, but they track progress separately and don’t affect each other.
            </div>
          </div>
        </section>

        <!-- 09 -->
        <section id="realworld">
          <div class="section-label">09 · Real-world applications</div>
          <h2 class="section-title">Where Kafka Shows Up in Real Products</h2>
          <div class="section-body">
            <p>
              Kafka is often the “event backbone” of a company. It’s used when you want many systems to react
              to the same stream of events without building point-to-point integrations everywhere.
            </p>
          </div>

          <div class="rw-grid">
            <div class="rw-card">
              <div class="rw-icon">🛒</div>
              <div class="rw-name">E-commerce order pipeline</div>
              <div class="rw-desc">
                Producer sends <code>order_created</code>. Consumers in different groups handle: payment capture,
                inventory reservation, shipping label creation, email/SMS confirmations, analytics dashboards.
              </div>
              <div class="rw-tags">
                <span class="rw-tag">orders</span><span class="rw-tag">payments</span><span class="rw-tag">shipping</span>
              </div>
            </div>

            <div class="rw-card">
              <div class="rw-icon">📦</div>
              <div class="rw-name">Delivery tracking + ETAs</div>
              <div class="rw-desc">
                Devices/apps produce location updates. A stream processor builds live ETAs, another service triggers
                “arriving soon” notifications, and analytics consumes the same events for route efficiency.
              </div>
              <div class="rw-tags">
                <span class="rw-tag">iot</span><span class="rw-tag">realtime</span><span class="rw-tag">notifications</span>
              </div>
            </div>

            <div class="rw-card">
              <div class="rw-icon">🔎</div>
              <div class="rw-name">Search indexing</div>
              <div class="rw-desc">
                Product/user/content updates are published once. Indexer consumers read and update Elasticsearch/OpenSearch,
                while another group updates recommendation features.
              </div>
              <div class="rw-tags">
                <span class="rw-tag">search</span><span class="rw-tag">indexing</span><span class="rw-tag">recommendations</span>
              </div>
            </div>

            <div class="rw-card">
              <div class="rw-icon">🧾</div>
              <div class="rw-name">Logs, metrics, clickstream</div>
              <div class="rw-desc">
                Websites/apps produce events like <code>page_view</code> and <code>button_click</code>. One group powers real-time
                dashboards; another loads data warehouses for deeper analysis.
              </div>
              <div class="rw-tags">
                <span class="rw-tag">analytics</span><span class="rw-tag">observability</span><span class="rw-tag">dashboards</span>
              </div>
            </div>

            <div class="rw-card">
              <div class="rw-icon">🛡️</div>
              <div class="rw-name">Fraud detection</div>
              <div class="rw-desc">
                Payment/auth events flow into streaming rules/ML. Suspicious patterns trigger holds, alerts, or step-up verification
                — fast, because consumers process events continuously.
              </div>
              <div class="rw-tags">
                <span class="rw-tag">security</span><span class="rw-tag">risk</span><span class="rw-tag">ml</span>
              </div>
            </div>

            <div class="rw-card">
              <div class="rw-icon">🗄️</div>
              <div class="rw-name">Database change data capture (CDC)</div>
              <div class="rw-desc">
                Instead of polling databases, changes become events (insert/update/delete). Consumers update caches, search indexes,
                and downstream services, keeping systems in sync.
              </div>
              <div class="rw-tags">
                <span class="rw-tag">cdc</span><span class="rw-tag">sync</span><span class="rw-tag">cache</span>
              </div>
            </div>
          </div>

          <div class="callout callout-good">
            <span class="callout-icon">✅</span>
            <div class="callout-text">
              <strong>Pattern you’ll notice:</strong> one stream of events, many independent consumers. Kafka reduces “spaghetti integrations”
              and makes scaling as simple as adding partitions + consumers where the load is.
            </div>
          </div>
        </section>

        <!-- 10 -->
        <section id="safety">
          <div class="section-label">10 · Trust</div>
          <h2 class="section-title">How Kafka Keeps Messages Safe and Ordered</h2>
          <div class="section-body">
            <p>
              Kafka keeps messages safe by storing them durably, so if a consumer crashes it can come back
              and continue from where it left off.
            </p>
            <p>
              Kafka keeps order <strong>inside each partition</strong>. That’s like saying:
              within a single lane of traffic, cars keep their order. Across different lanes, you still move fast,
              but the overall “global” order across all lanes isn’t the point — each lane is ordered.
            </p>
          </div>

          <div class="callout callout-warn">
            <span class="callout-icon">⚠️</span>
            <div class="callout-text">
              <strong>Easy rule to remember:</strong> order is guaranteed per partition. If you need strict ordering for a
              specific entity (like one user or one order), keep those events in the same partition.
            </div>
          </div>
        </section>

        <!-- 11 -->
        <section id="recap">
          <div class="section-label">11 · Wrap-up</div>
          <h2 class="section-title">Kafka Recap (Like You’re 5)</h2>
          <div class="summary-box">
            <h3>Key Takeaways</h3>
            <ul class="summary-list">
              <li>Kafka helps when <strong>many events happen continuously</strong> and many systems need to react.</li>
              <li>A <strong>message stream</strong> is just a never-ending flow of event messages.</li>
              <li><strong>Producers</strong> send messages → Kafka stores/delivers them → <strong>consumers</strong> read and process.</li>
              <li><strong>Topics</strong> group messages by category (orders, payments, page views).</li>
              <li><strong>Partitions</strong> split a topic into lanes so work can run in parallel.</li>
              <li><strong>Consumer groups</strong> share the load by splitting partitions across consumers.</li>
              <li>Different consumer groups can read the same topic independently (shipping vs analytics).</li>
              <li>Kafka keeps data safe and <strong>ordered per partition</strong>.</li>
            </ul>
          </div>
        </section>

      </main>

      <div class="blog-divider"></div>
      <div class="blog-footer-note">
        Kafka Explained Like You’re 5 · Event Streaming · Producers · Topics · Partitions · Consumer Groups
      </div>

    </div>
  `,
  styleUrls: ['./kafka-explained-like-youre-5.component.scss']
})
export class KafkaExplainedLikeYoure5Component {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  readingProgress = 0;

  constructor() {
    const url = 'https://nishaposwal-4e71c.web.app/blogs/kafka-explained-like-youre-5';
    const image = 'https://nishaposwal-4e71c.web.app/assets/images/kafka-intro.png';
    const pageTitle = 'Kafka Explained Like You’re 5 · Nisha Poswal';
    const description =
      'Kafka explained with everyday analogies: message streams, producers, topics, partitions, consumer groups, and why Kafka scales.';

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Nisha Poswal - Frontend Developer Portfolio' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const total = doc.scrollHeight - doc.clientHeight;
    this.readingProgress = total > 0 ? (scrolled / total * 100) : 0;
  }
}

