import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="experience-hero">
      <div class="container">
        <h1 class="page-title animate-fade-in-up">My Experience</h1>
        <p class="page-subtitle animate-fade-in-up">
          A journey through my professional growth and achievements in frontend development
        </p>
      </div>
    </section>

    <section class="experience-timeline">
      <div class="container">
        <div class="timeline">
          <div class="timeline-item" *ngFor="let experience of experiences; let i = index" 
               [class.active]="i === activeIndex"
               (click)="setActiveExperience(i)">
            <div class="timeline-marker" [class.active]="i === activeIndex">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
            <div class="timeline-content glass hover-lift" [class.expanded]="i === activeIndex">
              <div class="experience-header">
                <h3 class="job-title">{{ experience.title }}</h3>
                <span class="company">{{ experience.company }}</span>
                <span class="duration">{{ experience.duration }}</span>
                <div class="experience-badge" [class]="experience.type">
                  {{ experience.type }}
                </div>
              </div>
              <p class="job-description">{{ experience.description }}</p>
              <div class="technologies">
                <span class="tech-tag" *ngFor="let tech of experience.technologies; let techIndex = index" 
                      [style.animation-delay]="getAnimationDelay(techIndex)">
                  <i [class]="getTechIcon(tech)"></i>
                  {{ tech }}
                </span>
              </div>
              <div class="achievements" [class.show]="i === activeIndex">
                <h4>Key Achievements:</h4>
                <ul>
                  <li *ngFor="let achievement of experience.achievements; let achievementIndex = index"
                      [style.animation-delay]="getAnimationDelay(achievementIndex)">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
              <div class="experience-stats" [class.show]="i === activeIndex">
                <div class="stat-item">
                  <span class="stat-number">{{ experience.stats.projects }}</span>
                  <span class="stat-label">Projects</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ experience.stats.teamSize }}</span>
                  <span class="stat-label">Team Size</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ experience.stats.performance }}</span>
                  <span class="stat-label">Performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="education-section">
      <div class="container">
        <h2 class="section-title">Education & Certifications</h2>
        <div class="education-grid">
          <div class="education-card glass hover-lift" *ngFor="let education of educationList; let i = index"
               [style.animation-delay]="getAnimationDelay(i)">
            <div class="education-icon">
              <i [class]="education.icon"></i>
            </div>
            <h3>{{ education.degree }}</h3>
            <p class="institution">{{ education.institution }}</p>
            <p class="year">{{ education.year }}</p>
            <p class="description">{{ education.description }}</p>
            <div class="education-badge" *ngIf="education.badge">
              <i [class]="education.badge.icon"></i>
              {{ education.badge.text }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="achievements-section">
      <div class="container">
        <h2 class="section-title">Career Highlights</h2>
        <div class="achievements-grid">
          <div class="achievement-card glass hover-lift" *ngFor="let achievement of careerHighlights; let i = index"
               [style.animation-delay]="getAnimationDelay(i)">
            <div class="achievement-icon">
              <i [class]="achievement.icon"></i>
            </div>
            <h3>{{ achievement.title }}</h3>
            <p>{{ achievement.description }}</p>
            <div class="achievement-metric">
              <span class="metric-value">{{ achievement.metric }}</span>
              <span class="metric-label">{{ achievement.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  activeIndex = 0;
  
  experiences = [
    {
      title: 'Senior Software  Engineer',
      company: 'Solvei8',
      duration: '2024 - Present',
      type: 'full-time',
      description: 'Leading the development of comprehensive warehouse management and production systems for apparel manufacturing, delivering end-to-end solutions that streamline operations and improve efficiency.',
      technologies: ['Angular', 'TypeScript', 'Ngrx', 'RxJS', 'Node.js', 'MongoDB', 'Socket.IO'],
      achievements: [
        'Developed a complete Warehouse Management System serving 1000+ daily users across multiple factory locations',
        'Built 8+ specialized modules including order management, quality control, and process mapping systems',
        'Implemented real-time inventory tracking with barcode/QR scanning reducing manual errors by 85%',
        'Created automated tag generation system processing 5000+ items daily with 99.9% accuracy',
        'Designed responsive counting applications improving packaging efficiency by 60%',
        'Integrated multiple systems (ERP, production, warehouse) for seamless data flow',
        'Mentored junior developers and established Angular best practices across the team',
        'Reduced system downtime by 90% through robust error handling and monitoring'
      ],
      stats: {
        projects: 16,
        teamSize: 6,
        performance: '98%'
      }
    },
    {
      title: 'Software Developer Engineer',
      company: 'Reliance Jio',
      duration: '2020 - 2024',
      type: 'full-time',
      description: 'Developed interactive multiplayer games and entertainment applications using modern web technologies, focusing on real-time communication and engaging user experiences.',
      technologies: ['Angular', 'React', 'TypeScript', 'Socket.IO', 'Node.js', 'CSS Animations', 'RxJS'],
      achievements: [
        'Built 20+ interactive games including Candy Crush, Ludo, and Fantasy Cricket with real-time multiplayer support',
        'Developed Spin the Wheel and Jackpot games with advanced animations and reward systems',
        'Created Tambola (Housie) game with automatic number generation and real-time broadcasting',
        'Implemented sticker chat system for live cricket matches with team-based chat rooms',
        'Built coupon distribution platform with secure authentication and redemption tracking',
        'Designed play-and-win mini-games collection with reward logic and point tracking',
        'Optimized game performance achieving 60fps animations and smooth user interactions',
        'Integrated payment gateways and wallet systems for monetization features'
      ],
      stats: {
        projects: 12,
        teamSize: 4,
        performance: '92%'
      }
    },
   
  ];

  educationList = [
    {
      degree: 'Bachelor of Computer Science',
      institution: 'Indian institute of technology Rorkee',
      year: '2016 - 2020',
      description: 'Specialized in web development, software engineering, and modern frontend technologies with focus on Angular ecosystem.',
      icon: 'fas fa-graduation-cap',
      badge: {
        icon: 'fas fa-award',
        text: 'First Class'
      }
    },
    {
      degree: 'Angular Advanced Certification',
      institution: 'Angular University',
      year: '2021',
      description: 'Advanced Angular development certification covering reactive programming, Ngrx state management, and enterprise patterns.',
      icon: 'fab fa-angular',
      badge: {
        icon: 'fas fa-certificate',
        text: 'Expert Level'
      }
    },
    {
      degree: 'Full Stack Development',
      institution: 'Self-Paced Learning',
      year: '2020 - Present',
      description: 'Continuous learning in Node.js, MongoDB, Socket.IO, and real-time application development for gaming and enterprise solutions.',
      icon: 'fas fa-code',
      badge: {
        icon: 'fas fa-star',
        text: 'Ongoing'
      }
    }
  ];

  careerHighlights = [
    {
      title: 'Warehouse Management Systems',
      description: 'Developed comprehensive end-to-end solutions for apparel manufacturing',
      icon: 'fas fa-warehouse',
      metric: '16',
      label: 'Modules Built'
    },
    {
      title: 'Gaming Applications',
      description: 'Created interactive multiplayer games with real-time features',
      icon: 'fas fa-gamepad',
      metric: '12',
      label: 'Games Developed'
    },
    {
      title: 'System Integration',
      description: 'Successfully integrated multiple enterprise systems for seamless operations',
      icon: 'fas fa-network-wired',
      metric: '8',
      label: 'Systems Integrated'
    },
    {
      title: 'User Impact',
      description: 'Delivered solutions serving thousands of daily users across industries',
      icon: 'fas fa-users',
      metric: '10000+',
      label: 'Daily Users'
    }
  ];

  ngOnInit() {
    // Auto-rotate through experiences
    setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.experiences.length;
    }, 5000);
  }

  setActiveExperience(index: number) {
    this.activeIndex = index;
  }

  getAnimationDelay(index: number): string {
    return `${index * 0.1}s`;
  }

  getTechIcon(tech: string): string {
    const iconMap: { [key: string]: string } = {
      'Angular': 'fab fa-angular',
      'React': 'fab fa-react',
      'TypeScript': 'fab fa-js-square',
      'JavaScript': 'fab fa-js-square',
      'HTML5': 'fab fa-html5',
      'CSS3': 'fab fa-css3-alt',
      'SCSS': 'fab fa-sass',
      'Node.js': 'fab fa-node-js',
      'Git': 'fab fa-git-alt',
      'Ngrx': 'fas fa-database',
      'RxJS': 'fas fa-stream',
      'Socket.IO': 'fas fa-wifi',
      'MongoDB': 'fas fa-database',
      'Express.js': 'fab fa-node-js',
      'REST API': 'fas fa-cloud',
      'Bootstrap': 'fab fa-bootstrap',
      'Material UI': 'fas fa-palette',
      'D3.js': 'fas fa-chart-line',
      'Chart.js': 'fas fa-chart-bar',
      'CSS Animations': 'fas fa-magic',
      'Barcode/QR Library': 'fas fa-qrcode',
      'FormsModule': 'fas fa-edit',
      'Reactive Forms': 'fas fa-edit',
      'JWT': 'fas fa-shield-alt'
    };
    return iconMap[tech] || 'fas fa-code';
  }
} 