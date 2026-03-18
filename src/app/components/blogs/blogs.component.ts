import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  readTime: string;
  date: string;
  level: string;
  category: string;
}

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="blogs-page">

      <section class="blogs-hero">
        <div class="hero-eyebrow">
          <span class="eyebrow-line"></span>
          Writing · System Design · Engineering
        </div>
        <h1>Technical <span class="highlight">Blog</span></h1>
        <p class="hero-sub">
          Deep dives into system design, distributed systems, and the engineering
          decisions behind modern software at scale.
        </p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">{{ posts.length }}</span>
            <span class="stat-label">Articles</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">{{ totalReadTime }}</span>
            <span class="stat-label">Avg Read</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">{{ uniqueCategories }}</span>
            <span class="stat-label">Topics</span>
          </div>
        </div>
      </section>

      <section class="blogs-grid-section">
        <div class="container">
          <div class="grid-header">
            <h2 class="grid-title">All Articles</h2>
            <div class="grid-line"></div>
          </div>
          <div class="blogs-grid">
            <article
              class="blog-card"
              *ngFor="let post of posts"
              [routerLink]="['/blogs', post.slug]"
            >
              <div class="card-accent"></div>
              <div class="card-header">
                <div class="card-category">{{ post.category }}</div>
                <div class="card-level" [class]="'level-' + post.level.toLowerCase()">
                  {{ post.level }}
                </div>
              </div>
              <h3 class="card-title">{{ post.title }}</h3>
              <p class="card-subtitle">{{ post.subtitle }}</p>
              <p class="card-desc">{{ post.description }}</p>
              <div class="card-tags">
                <span class="tag" *ngFor="let tag of post.tags">{{ tag }}</span>
              </div>
              <div class="card-footer">
                <div class="card-meta">
                  <span class="meta-item">
                    <i class="fas fa-clock"></i> {{ post.readTime }}
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-calendar-alt"></i> {{ post.date }}
                  </span>
                </div>
                <span class="read-link">
                  Read Article <i class="fas fa-arrow-right"></i>
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

    </div>
  `,
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent {
  posts: BlogPost[] = [
    {
      slug: 'kafka-explained-like-youre-5',
      title: 'Kafka Explained Like You’re 5',
      subtitle: 'Message Streams · Topics · Partitions · Consumer Groups',
      description:
        'Kafka, explained with everyday analogies: a central message pipeline that moves a huge stream of events from producers to consumers. Understand topics, partitions (lanes), consumer groups, and why Kafka scales.',
      tags: ['Kafka', 'Event Streaming', 'Distributed Systems', 'Messaging'],
      readTime: '10 min read',
      date: 'Mar 2026',
      level: 'Beginner',
      category: 'Distributed Systems',
    },
    {
      slug: 'cache-strategies',
      title: 'Cache Strategies in Distributed Systems',
      subtitle: 'TTL Jitter · Mutex · SWR · Cache Warming',
      description:
        'Basic TTL caching breaks at scale. Six production-grade strategies — Jitter, Probabilistic Early Expiry, Mutex Locking, Stale-While-Revalidate, Cache Warming — with diagrams, tradeoffs, and exactly when to use each one.',
      tags: ['Caching', 'Redis', 'System Design', 'CDN', 'Distributed Systems', 'SWR'],
      readTime: '15 min read',
      date: 'Mar 2026',
      level: 'Intermediate',
      category: 'System Design',
    },
    {
      slug: 'thundering-herd',
      title: 'Understanding the Thundering Herd Problem',
      subtitle: 'Cache Stampede · Distributed Systems',
      description:
        'When a single cache expiry event causes hundreds of servers to stampede toward your database at the same millisecond — and how to stop it with coalescing, locks, jitter, and backoff.',
      tags: ['Caching', 'Distributed Systems', 'System Design', 'Redis', 'Database'],
      readTime: '12 min read',
      date: 'Mar 2026',
      level: 'Intermediate',
      category: 'System Design',
    },
  ];

  get totalReadTime(): string {
    const minutes = this.posts
      .map(p => {
        const match = p.readTime.match(/(\d+)\s*min/i);
        return match ? Number(match[1]) : 0;
      })
      .filter(n => Number.isFinite(n) && n > 0);

    if (!minutes.length) return '—';
    const avg = Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length);
    return `${avg} min`;
  }

  get uniqueCategories(): number {
    return new Set(this.posts.map(p => p.category)).size;
  }
}
