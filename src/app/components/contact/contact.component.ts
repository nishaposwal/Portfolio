import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../firebase.config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contact-container">
      <div class="contact-header">
        <h1 class="contact-title">Get In Touch</h1>
        <p class="contact-subtitle">Let's connect and discuss opportunities</p>
      </div>

      <div class="contact-content">
                   <!-- Availability Status -->
          <div class="availability-status">
            <div class="status-indicator available"></div>
            <div class="status-text">
              <h3>Currently Available</h3>
              <p>Open to new opportunities and collaborations</p>
            </div>
          </div>
        <div class="contact-info-grid">
          <!-- Email Section -->
          <div class="contact-card email-card">
            <div class="contact-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="contact-details">
              <h3>Email</h3>
                             <p class="contact-value">nishaposwal321&#64;example.com</p>
                             <a href="mailto:nishaposwal321&#64;example.com" class="contact-link" (click)="logEmailClick()">
                Send Email <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>

          <!-- Phone Section -->
          <div class="contact-card phone-card">
            <div class="contact-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div class="contact-details">
              <h3>Phone</h3>
              <p class="contact-value">+91 8126139270</p>
              <p class="contact-value">+971 586818826</p>
              <a href="tel:+918126139270" class="contact-link" (click)="logPhoneClick()">
                Call Now <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>

          <!-- LinkedIn Section -->
          <div class="contact-card linkedin-card">
            <div class="contact-icon">
              <i class="fab fa-linkedin"></i>
            </div>
            <div class="contact-details">
              <h3>LinkedIn</h3>
              <p class="contact-value">linkedin.com/in/nisha-poswal</p>
              <a href="https://linkedin.com/in/nisha-poswal" target="_blank" class="contact-link" (click)="logLinkedInClick()">
                View Profile <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>

          <!-- GitHub Repository Section -->
          <div class="contact-card github-card">
            <div class="contact-icon">
              <i class="fab fa-github"></i>
            </div>
            <div class="contact-details">
              <h3>Portfolio Repository</h3>
              <p class="contact-value">github.com/nishaposwal/Portfolio</p>
              <a href="https://github.com/nishaposwal/Portfolio.git" target="_blank" class="contact-link" (click)="logGitHubClick()">
                View Repository <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>

    
       
      </div>
    </div>
  `,
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  
  // Log email click event
  logEmailClick() {
    AnalyticsService.logContactInteraction('email');
  }

  // Log phone click event
  logPhoneClick() {
    AnalyticsService.logContactInteraction('phone');
  }

  // Log LinkedIn click event
  logLinkedInClick() {
    AnalyticsService.logContactInteraction('linkedin');
  }

  // Log GitHub click event
  logGitHubClick() {
    AnalyticsService.logContactInteraction('github');
  }
} 