import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="skills-hero">
      <div class="container">
        <h1 class="page-title animate-fade-in-up">Technical Skills</h1>
        <p class="page-subtitle animate-fade-in-up">
          A comprehensive overview of my technical expertise and proficiency levels
        </p>
      </div>
    </section>

    <section class="skills-overview">
      <div class="container">
        <div class="skills-stats">
          <div class="stat-card glass" *ngFor="let stat of skillStats; let i = index"
               [style.animation-delay]="getAnimationDelay(i)">
            <div class="stat-icon">
              <i [class]="stat.icon"></i>
            </div>
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="skills-categories">
      <div class="container">
        <div class="category-tabs">
          <button class="tab-btn" 
                  *ngFor="let category of skillCategories; let i = index"
                  [class.active]="i === activeCategory"
                  (click)="setActiveCategory(i)">
            <i [class]="category.icon"></i>
            {{ category.name }}
          </button>
        </div>

        <div class="category-content">
          <div class="skills-grid" *ngIf="skillCategories[activeCategory]">
            <div class="skill-card glass hover-lift" 
                 *ngFor="let skill of skillCategories[activeCategory].skills; let i = index"
                 [style.animation-delay]="getAnimationDelay(i)">
              <div class="skill-header">
                <div class="skill-icon">
                  <i [class]="skill.icon"></i>
                </div>
                <div class="skill-info">
                  <h3>{{ skill.name }}</h3>
                  <p>{{ skill.description }}</p>
                </div>
                <div class="skill-level">
                  <span class="level-badge" [class]="getLevelClass(skill.level)">
                    {{ skill.level }}%
                  </span>
                </div>
              </div>
              
              <div class="skill-progress">
                <div class="progress-bar">
                  <div class="progress-fill" 
                       [style.width.%]="skill.level"
                       [style.animation-delay]="getAnimationDelay(i)">
                  </div>
                </div>
              </div>

              <div class="skill-details" *ngIf="skill.details">
                <div class="detail-item" *ngFor="let detail of skill.details">
                  <span class="detail-label">{{ detail.label }}:</span>
                  <span class="detail-value">{{ detail.value }}</span>
                </div>
              </div>

              <div class="skill-projects" *ngIf="skill.projects">
                <h4>Related Projects:</h4>
                <ul>
                  <li *ngFor="let project of skill.projects">
                    <a [href]="project.link" target="_blank">{{ project.name }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="skills-comparison">
      <div class="container">
        <h2 class="section-title">Skills Comparison</h2>
        <div class="comparison-chart">
          <div class="chart-item" *ngFor="let skill of topSkills; let i = index"
               [style.animation-delay]="getAnimationDelay(i)">
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-bar">
              <div class="bar-fill" [style.width.%]="skill.level"></div>
            </div>
            <div class="skill-percentage">{{ skill.level }}%</div>
          </div>
        </div>
      </div>
    </section>

    <section class="learning-path">
      <div class="container">
        <h2 class="section-title">Learning Journey</h2>
        <div class="learning-timeline">
          <div class="learning-item" *ngFor="let item of learningPath; let i = index"
               [style.animation-delay]="getAnimationDelay(i)">
            <div class="learning-icon">
              <i [class]="item.icon"></i>
            </div>
            <div class="learning-content">
              <h3>{{ item.skill }}</h3>
              <p>{{ item.description }}</p>
              <div class="learning-progress">
                <span class="progress-text">{{ item.progress }}% Complete</span>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="item.progress"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  activeCategory = 0;

  skillStats = [
   
    {
      icon: 'fas fa-tools',
      number: '25+',
      label: 'Tools & Technologies'
    },
    {
      icon: 'fas fa-project-diagram',
      number: '50+',
      label: 'Projects Completed'
    },
    {
      icon: 'fas fa-clock',
      number: '5+',
      label: 'Years Experience'
    }
  ];

  skillCategories = [
    {
      name: 'Frontend Development',
      icon: 'fas fa-desktop',
      skills: [
        {
          name: 'Angular',
          description: 'Advanced Angular development with TypeScript and reactive programming',
          level: 95,
          icon: 'fab fa-angular',
          details: [
            { label: 'Experience', value: '5 years' },
            { label: 'Projects', value: '15+' },
            { label: 'Latest Version', value: 'Angular 17' }
          ],
          projects: [
            { name: 'E-Commerce Platform', link: '#' },
            { name: 'Admin Dashboard', link: '#' },
            { name: 'Portfolio Website', link: '#' }
          ]
        },
        {
          name: 'React',
          description: 'Modern React development with hooks and functional components',
          level: 90,
          icon: 'fab fa-react',
          details: [
            { label: 'Experience', value: '3 years' },
            { label: 'Projects', value: '12+' },
            { label: 'State Management', value: 'Redux, Context' }
          ],
          projects: [
            { name: 'Task Management App', link: '#' },
            { name: 'Social Media Dashboard', link: '#' }
          ]
        },
        {
          name: 'TypeScript',
          description: 'Type-safe JavaScript development with advanced features',
          level: 92,
          icon: 'fab fa-js-square',
          details: [
            { label: 'Experience', value: '4 years' },
            { label: 'Advanced Features', value: 'Generics, Decorators' }
          ]
        },
        {
          name: 'HTML5 & CSS3',
          description: 'Semantic HTML and modern CSS with advanced layouts',
          level: 98,
          icon: 'fab fa-html5',
          details: [
            { label: 'Experience', value: '5 years' },
            { label: 'Layouts', value: 'Grid, Flexbox' }
          ]
        }
      ]
    },
    {
      name: 'Styling & Design',
      icon: 'fas fa-palette',
      skills: [
        {
          name: 'SCSS/SASS',
          description: 'Advanced CSS preprocessing with variables and mixins',
          level: 90,
          icon: 'fab fa-sass',
          details: [
            { label: 'Experience', value: '4 years' },
            { label: 'Features', value: 'Variables, Mixins, Functions' }
          ]
        },
        {
          name: 'Responsive Design',
          description: 'Mobile-first responsive design principles',
          level: 95,
          icon: 'fas fa-mobile-alt',
          details: [
            { label: 'Experience', value: '4 years' },
            { label: 'Approach', value: 'Mobile-First' }
          ]
        },
        {
          name: 'UI/UX Design',
          description: 'User interface and experience design principles',
          level: 85,
          icon: 'fas fa-eye',
          details: [
            { label: 'Experience', value: '3 years' },
            { label: 'Tools', value: 'Figma, Adobe XD' }
          ]
        }
      ]
    },
    {
      name: 'Tools & Technologies',
      icon: 'fas fa-tools',
      skills: [
        {
          name: 'Git & GitHub',
          description: 'Version control and collaborative development',
          level: 90,
          icon: 'fab fa-git-alt',
          details: [
            { label: 'Experience', value: '4 years' },
            { label: 'Workflow', value: 'Git Flow' }
          ]
        },
        {
          name: 'Node.js',
          description: 'Server-side JavaScript development',
          level: 80,
          icon: 'fab fa-node-js',
          details: [
            { label: 'Experience', value: '3 years' },
            { label: 'Frameworks', value: 'Express.js' }
          ]
        },
        {
          name: 'Testing',
          description: 'Unit and integration testing with Jest',
          level: 82,
          icon: 'fas fa-vial',
          details: [
            { label: 'Experience', value: '3 years' },
            { label: 'Tools', value: 'Jest, Testing Library' }
          ]
        }
      ]
    }
  ];

  topSkills = [
    { name: 'Angular', level: 95 },
    { name: 'TypeScript', level: 92 },
    { name: 'React', level: 90 },
    { name: 'SCSS', level: 90 },
    { name: 'Git', level: 90 },
    { name: 'HTML/CSS', level: 98 },
    { name: 'JavaScript', level: 95 },
    { name: 'Testing', level: 82 }
  ];

  learningPath = [
    {
      skill: 'Advanced Angular Patterns',
      description: 'Learning advanced architectural patterns and performance optimization',
      progress: 75,
      icon: 'fab fa-angular'
    },
    {
      skill: 'React Native',
      description: 'Mobile app development with React Native',
      progress: 60,
      icon: 'fab fa-react'
    },
    {
      skill: 'GraphQL',
      description: 'Modern API development with GraphQL',
      progress: 45,
      icon: 'fas fa-project-diagram'
    },
    {
      skill: 'AWS Cloud',
      description: 'Cloud infrastructure and deployment',
      progress: 30,
      icon: 'fab fa-aws'
    }
  ];

  ngOnInit() {
    // Auto-rotate through categories
    setInterval(() => {
      this.activeCategory = (this.activeCategory + 1) % this.skillCategories.length;
    }, 8000);
  }

  setActiveCategory(index: number) {
    this.activeCategory = index;
  }

  getAnimationDelay(index: number): string {
    return `${index * 0.1}s`;
  }

  getLevelClass(level: number): string {
    if (level >= 90) return 'expert';
    if (level >= 80) return 'advanced';
    if (level >= 70) return 'intermediate';
    return 'beginner';
  }
} 