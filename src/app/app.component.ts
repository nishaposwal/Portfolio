import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div *ngIf="!introCompleted" class="intro-container">
      <!-- Click to Start Button -->
      <div class="start-button" *ngIf="!showIntro && !showProfiles" (click)="startIntroWithSound()">
        <div class="start-content">
          <h1>Nisha Poswal</h1>
          <p>Frontend Developer Portfolio</p>
          <button class="start-btn">Click to Start</button>
        </div>
      </div>

      <div class="netflix-intro" [class.show]="showIntro" [class.hide]="hideIntro">
        <div class="intro-content">
          <div class="netflix-logo">
            <span class="logo-text">NISHAPOSWAL</span>
            <div class="logo-glow"></div>
          </div>
        </div>
      </div>
      
      <div class="profile-selection" [class.show]="showProfiles">
        <h1 class="selection-title">Who is watching?</h1>
        <div class="profiles-grid">
          <div class="profile-card" *ngFor="let profile of profiles" (click)="selectProfile(profile)">
            <div class="profile-avatar">
              <i [class]="profile.icon"></i>
            </div>
            <span class="profile-name">{{ profile.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="introCompleted" class="main-app">
      <nav class="navbar">
        <div class="container">
          <div class="nav-brand">
            <a routerLink="/" class="brand-text">Nisha Poswal</a>
          </div>
          <ul class="nav-menu" [class.active]="isMobileMenuOpen">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a></li>
            <li><a routerLink="/experience" routerLinkActive="active" (click)="closeMobileMenu()">Experience</a></li>
            <li><a routerLink="/skills" routerLinkActive="active" (click)="closeMobileMenu()">Skills</a></li>
            <li><a routerLink="/projects" routerLinkActive="active" (click)="closeMobileMenu()">Projects</a></li>
            <li><a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a></li>
            <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a></li>
          </ul>
          <div class="nav-profile" *ngIf="selectedProfile">
            <div class="profile-icon">
              <i [class]="selectedProfile.icon"></i>
            </div>
            <span class="profile-name">{{ selectedProfile.name }}</span>
          </div>
          <div class="nav-toggle" (click)="toggleMobileMenu()" [class.active]="isMobileMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 Nisha Poswal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Nisha Poswal - Frontend Developer Portfolio';
  private routerSubscription: Subscription | undefined;
  private introAudio: HTMLAudioElement | null = null;
  
  introCompleted = false;
  showIntro = false;
  hideIntro = false;
  showProfiles = false;
  selectedProfile: any = null;
  isMobileMenuOpen = false;
  
  profiles = [
    { name: 'Recruiter', icon: 'fas fa-user-tie' },
    { name: 'Developer', icon: 'fas fa-code' },
    { name: 'Random', icon: 'fas fa-eye' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Preload audio
    this.preloadAudio();
    
    // Subscribe to router events to scroll to top on navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToTop();
      });
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private preloadAudio(): void {
    this.introAudio = new Audio('/assets/sounds/netflix-intro.mp3');
    this.introAudio.volume = 0.4;
    this.introAudio.load();
    
    // Add error handling
    this.introAudio.addEventListener('error', () => {
      console.log('Audio file not found, continuing without sound');
    });
  }

  private startIntro(): void {
    // Show Netflix-style intro first
    setTimeout(() => {
      this.showIntro = true;
    }, 500);

    // Hide intro and show profile selection after intro animation
    setTimeout(() => {
      this.hideIntro = true;
      setTimeout(() => {
        this.showProfiles = true;
      }, 1000); // Wait for intro to fade out
    }, 4500); // Extended timing to match Netflix
  }

  private playIntroSound(): void {
    if (this.introAudio) {
      this.introAudio.currentTime = 0; // Reset to beginning
      this.introAudio.play().catch((error) => {
        console.log('Audio could not be played:', error);
      });
    }
  }

  selectProfile(profile: any): void {
    // Add selection animation
    const profileCard = event?.target as HTMLElement;
    if (profileCard) {
      profileCard.classList.add('selected');
    }

    // Complete intro and navigate to home
    setTimeout(() => {
      this.introCompleted = true;
      this.selectedProfile = profile;
      this.router.navigate(['/']);
    }, 1000);
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  startIntroWithSound(): void {
    this.playIntroSound();
    this.startIntro();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
} 