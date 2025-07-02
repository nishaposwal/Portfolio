import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-hero">
      <div class="container">
        <div class="profile-section animate-fade-in-down">
          <div class="profile-image-container">
            <img src="assets/images/profile.PNG" alt="Nisha Poswal" class="profile-image">
            <div class="profile-overlay"></div>
          </div>
        </div>
        <h1 class="page-title animate-fade-in-up">About Me</h1>
        <p class="page-subtitle animate-fade-in-up">
          Get to know me better - my journey, passion, and what drives me in the world of frontend development
        </p>
      </div>
    </section>

    <section class="about-content">
      <div class="container">
        <div class="about-grid">
          <div class="about-text animate-fade-in-left">
            <h2>Who I Am</h2>
            <p>
              I\'m Nisha Poswal, a passionate frontend developer with over 4 years of experience crafting 
              beautiful and functional web experiences. I believe in the power of clean code, intuitive design, 
              and user-centered development.
            </p>
            <p>
              My journey in web development started with a curiosity about how websites work, which quickly 
              evolved into a passion for creating digital experiences that make a difference. I specialize in 
              modern JavaScript frameworks, particularly Angular and React, and I\'m always eager to learn new 
              technologies and best practices.
            </p>
            <p>
              When I\'m not coding, you\'ll find me exploring new design trends, contributing to open-source 
              projects, or sharing knowledge with the developer community. I believe in continuous learning 
              and staying up-to-date with the latest industry trends.
            </p>
          </div>
          <div class="about-stats animate-fade-in-right">
            <div class="stat-card glass">
              <div class="stat-number">5+</div>
              <div class="stat-label">Years Experience</div>
            </div>
            <div class="stat-card glass">
              <div class="stat-number">50+</div>
              <div class="stat-label">Projects Completed</div>
            </div>
            <div class="stat-card glass">
              <div class="stat-number">15+</div>
              <div class="stat-label">Happy Clients</div>
            </div>
            <div class="stat-card glass">
              <div class="stat-number">100%</div>
              <div class="stat-label">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="skills-showcase">
      <div class="container">
        <h2 class="section-title">Technical Skills</h2>
        <div class="skills-categories">
          <div class="skill-category" *ngFor="let category of skillCategories">
            <h3>{{ category.name }}</h3>
            <div class="skill-bars">
              <div class="skill-bar" *ngFor="let skill of category.skills">
                <div class="skill-info">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-percentage">{{ skill.level }}%</span>
                </div>
                <div class="skill-progress">
                  <div class="skill-fill" [style.width.%]="skill.level"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="interests-section">
      <div class="container">
        <h2 class="section-title">Interests & Hobbies</h2>
        <div class="interests-grid">
          <div class="interest-card glass hover-lift" *ngFor="let interest of interests">
            <div class="interest-icon">
              <i [class]="interest.icon"></i>
            </div>
            <h3>{{ interest.title }}</h3>
            <p>{{ interest.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2 class="section-title">My Values</h2>
        <div class="values-grid">
          <div class="value-card glass hover-lift" *ngFor="let value of values">
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  skillCategories = [
    {
      name: 'Frontend Technologies',
      skills: [
        { name: 'Angular', level: 95 },
        { name: 'React', level: 90 },
        { name: 'TypeScript', level: 92 },
        { name: 'JavaScript', level: 95 },
        { name: 'HTML5/CSS3', level: 98 }
      ]
    },
    {
      name: 'Styling & Design',
      skills: [
        { name: 'SCSS/SASS', level: 90 },
        { name: 'Responsive Design', level: 95 },
        { name: 'UI/UX Design', level: 85 },
        { name: 'CSS Grid/Flexbox', level: 92 },
        { name: 'Bootstrap/Tailwind', level: 88 }
      ]
    },
    {
      name: 'Tools & Technologies',
      skills: [
        { name: 'Git/GitHub', level: 90 },
        { name: 'Node.js', level: 80 },
        { name: 'Webpack/Vite', level: 85 },
        { name: 'Jest/Testing', level: 82 },
        { name: 'Docker', level: 75 }
      ]
    }
  ];

  interests = [
    {
      title: 'Open Source',
      description: 'Contributing to open-source projects and sharing knowledge with the developer community.',
      icon: 'fab fa-github'
    },
    {
      title: 'Design Trends',
      description: 'Exploring new design patterns, UI/UX trends, and creative inspiration from around the web.',
      icon: 'fas fa-palette'
    },
    {
      title: 'Tech Conferences',
      description: 'Attending and speaking at tech conferences to stay updated with industry trends.',
      icon: 'fas fa-microphone'
    },
    {
      title: 'Reading',
      description: 'Reading tech blogs, documentation, and books to continuously improve my skills.',
      icon: 'fas fa-book'
    },
    {
      title: 'Photography',
      description: 'Capturing moments and finding inspiration in visual storytelling and composition.',
      icon: 'fas fa-camera'
    },
    {
      title: 'Travel',
      description: 'Exploring new places and cultures to gain fresh perspectives and creative inspiration.',
      icon: 'fas fa-plane'
    }
  ];

  values = [
    {
      title: 'Quality First',
      description: 'I believe in writing clean, maintainable code that not only works but is also easy to understand and extend.'
    },
    {
      title: 'User-Centered',
      description: 'Every decision I make is driven by creating the best possible experience for the end user.'
    },
    {
      title: 'Continuous Learning',
      description: 'Technology evolves rapidly, and I\'m committed to staying updated with the latest trends and best practices.'
    },
    {
      title: 'Collaboration',
      description: 'I thrive in team environments and believe that the best solutions come from working together.'
    }
  ];
} 