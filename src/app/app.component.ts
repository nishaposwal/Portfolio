import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="main-app">
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
            <li><a routerLink="/blogs" routerLinkActive="active" (click)="closeMobileMenu()">Blogs</a></li>
            <li><a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a></li>
            <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a></li>
          </ul>
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
  private readonly platformId = inject(PLATFORM_ID);

  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
} 