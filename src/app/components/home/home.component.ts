import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../firebase.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="hero-background">
          <div class="hero-overlay"></div>
        </div>
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title animate-fade-in-up">
              Hi, I'm <span class="gradient-text">Nisha Poswal</span>
            </h1>
            <h2 class="hero-subtitle animate-fade-in-up">
              Frontend Developer & UI/UX Enthusiast
            </h2>
            <p class="hero-description animate-fade-in-up">
              Crafting beautiful, responsive, and user-centric web experiences with modern technologies.
              Specialized in Angular, React, and cutting-edge frontend development.
            </p>
            <div class="hero-buttons animate-fade-in-up">
              <a routerLink="/projects" class="btn btn-primary">View My Work</a>
              <a routerLink="/contact" class="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
        </div>
      </section>

      <section class="skills-section">
        <div class="container">
          <h2 class="section-title">Technologies I Work With</h2>
          <div class="skills-grid">
            <div class="skill-card glass hover-lift" *ngFor="let skill of skills">
              <div class="skill-icon">
                <i [class]="skill.icon"></i>
              </div>
              <h3>{{ skill.name }}</h3>
              <p>{{ skill.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>Ready to Build Something Amazing?</h2>
            <p>Let's collaborate on your next project and bring your ideas to life.</p>
            <a routerLink="/contact" class="btn btn-primary animate-pulse">Start a Project</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  ngOnInit() {
    // Log home page load event
    AnalyticsService.logHomePageLoad();
  }
  skills = [
    {
      name: 'Angular',
      icon: 'fab fa-angular',
      description: 'Building scalable applications with TypeScript and reactive programming'
    },
    {
      name: 'React',
      icon: 'fab fa-react',
      description: 'Creating dynamic user interfaces with modern React patterns'
    },
    {
      name: 'TypeScript',
      icon: 'fab fa-js-square',
      description: 'Writing type-safe, maintainable code for better development experience'
    },
    {
      name: 'SCSS/SASS',
      icon: 'fab fa-sass',
      description: 'Crafting beautiful, modular styles with advanced CSS preprocessors'
    },
    {
      name: 'Node.js',
      icon: 'fab fa-node-js',
      description: 'Full-stack development with modern JavaScript runtime'
    },
    {
      name: 'Git',
      icon: 'fab fa-git-alt',
      description: 'Version control and collaborative development workflows'
    }
  ];
} 