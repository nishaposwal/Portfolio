import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnalyticsService } from "../../firebase.config";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="projects-background">
      <div class="projects-container">
        <div class="projects-header">
          <h1 class="page-title">My Projects</h1>
          <p class="page-subtitle">
            Showcasing my work and technical expertise
          </p>
        </div>

        <div class="projects-grid">
          <div class="container">
            <div
              class="project-card"
              *ngFor="let project of projects; let i = index"
              [style.animation-delay]="getAnimationDelay(i)"
              (click)="logProjectView(project.title)"
            >
              <div class="project-image">
                <img [src]="project.image" [alt]="project.title" />
                
              </div>
              <div class="project-content">
                <h3 class="project-title">{{ project.title }}</h3>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-tech">
                  <h4 class="tech-title">Technologies Used</h4>
                  <div class="tech-tags">
                    <span
                      class="tech-tag"
                      *ngFor="let tech of project.technologies"
                      >{{ tech }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent {
  projects = [
    {
      title: "Warehouse Management System for Apparel Factory",
      description:
        "A comprehensive end-to-end warehouse management system tailored for apparel manufacturing. Built with Angular and Node.js, it handles inventory tracking, GRN (Goods Receipt Note), stock transfers, barcode scanning, order dispatch, and real-time reporting. Features include role-based access, automated alerts, and integration with production and ERP systems.",
      image: "assets/images/WMS.png",
      technologies: ["Angular", "Node.js", "MongoDB", "Express.js", "REST API", "Ngrx", "Typescript"],
      liveUrl: "https://your-warehouse-system-demo.com",
      githubUrl: "https://github.com/nishaposwal/apparel-warehouse-system",
    },
    {
      title: "Tag Generation System",
      description:
        "A dynamic tag generation module built using Angular for an apparel factory's warehouse management system. It automates the creation of barcoded/QR-coded tags for apparel items based on size, style, and batch, streamlining inventory tracking and dispatch operations.",
      image: "assets/images/tag-gem.jpeg",
      technologies: [
        "Angular",
        "TypeScript",
        "HTML5",
        "CSS3",
        "Barcode/QR Library",
        "Ngrx",
      ],
      liveUrl: "https://demo-tag-generator.com",
      githubUrl: "https://github.com/nishaposwal/tag-generation-system",
    },
    {
      title: "Order Management System",
      description:
        "An Angular-based order management module developed for an apparel factory. It enables end-to-end tracking of customer orders—from creation to dispatch—managing product variants, order status, due dates, and customer details, integrated with production and warehouse systems.",
      image: "assets/images/order-management.webp",
      technologies: ["Angular", "TypeScript", "RxJS", "Bootstrap", "REST API", "Ngrx"],
      liveUrl: "https://demo-order-management.com",
      githubUrl: "https://github.com/nishaposwal/order-management-system",
    },
    {
      title: "Counting Application",
      description:
        "A lightweight Angular-based application designed to count finished apparel items during packaging and warehouse intake. It supports batch-wise tracking, real-time quantity validation, and seamless syncing with inventory systems, improving efficiency and reducing human errors.",
      image: "assets/images/counting.png",
      technologies: ["Angular", "TypeScript", "RxJS", "Bootstrap", "Ngrx"],
      liveUrl: "https://demo-counting-app.com",
      githubUrl: "https://github.com/nishaposwal/counting-application",
    },
    {
      title: "Quality Check Application",
      description:
        "A quality control module developed in Angular to digitize the inspection process for apparel items. It allows operators to log issues (stains, stitching errors, mislabels), categorize defects, and generate QC reports—ensuring consistent product quality before dispatch.",
      image: "assets/images/qa.jpeg",
      technologies: ["Angular", "TypeScript", "FormsModule", "Material UI", "Ngrx"],
      liveUrl: "https://demo-quality-check.com",
      githubUrl: "https://github.com/nishaposwal/quality-check-app",
    },
    {
      title: "Process Mapping System",
      description:
        "An Angular-based application to define, map, and visualize the entire apparel production workflow—from raw material intake to final dispatch. This tool enables supervisors to assign responsibilities, set timelines, and monitor each stage of production with real-time updates.",
      image: "assets/images/process-mapping.png",
      technologies: ["Angular", "TypeScript", "D3.js", "Bootstrap", "REST API", "Ngrx"],
      liveUrl: "https://demo-process-mapping.com",
      githubUrl: "https://github.com/nishaposwal/process-mapping-system",
    },
    {
      title: "Fabric & Trims Inspection App",
      description:
        "A dedicated Angular application for fabric and trims inspection before production. It allows operators to log defects, measure shrinkage, color variation, and quality grade. The app generates inspection reports and integrates with procurement and production planning modules.",
      image: "assets/images/fb.png",
      technologies: [
        "Angular",
        "TypeScript",
        "Reactive Forms",
        "Material UI",
        "Chart.js",
        "Ngrx",
      ],
      liveUrl: "https://demo-fabric-inspection.com",
      githubUrl: "https://github.com/nishaposwal/fabric-trims-inspection",
    },
    {
      title: "Candy Crush Game",
      description:
        "A tile-matching puzzle game inspired by Candy Crush, developed using Angular. Features include colorful animated candies, match-3 logic, scoring system, level progression, and combo effects.",
      image: "assets/images/cany-crush.jpeg",
      technologies: ["Angular", "TypeScript", "RxJS", "CSS Animations"],
      liveUrl: "https://your-candy-crush-demo.com",
      githubUrl: "https://github.com/nishaposwal/candy-crush-game",
    },
    {
      title: "Ludo Game",
      description:
        "A multiplayer Ludo board game built with Angular. Features include real-time gameplay, dice animation, player turn logic, and a dynamic UI for tracking progress and game rules.",
      image: "assets/images/ludo.jpeg",
      technologies: ["Angular", "TypeScript", "RxJS", "Socket.IO", "Node.js"],
      liveUrl: "https://your-ludo-game-demo.com",
      githubUrl: "https://github.com/nishaposwal/ludo-game",
    },
    {
      title: "Spin the Wheel Game",
      description:
        'An interactive "Spin the Wheel" game built using Angular. Features include randomized spinning logic, reward segments, confetti animation, and customizable prize options.',
      image: "assets/images/spin-wheel.jpeg",
      technologies: ["Angular", "TypeScript", "CSS Animations", "RxJS", "React"],
      liveUrl: "https://your-spin-wheel-demo.com",
      githubUrl: "https://github.com/nishaposwal/spin-the-wheel",
    },
    {
      title: "Jackpot Game",
      description:
        "A dynamic Jackpot slot machine game built with Angular. Features include spinning reels, randomized winning logic, audio effects, animated symbols, and score tracking.",
      image: "assets/images/jackpot.jpeg",
      technologies: ["Angular", "TypeScript", "RxJS", "CSS Animations"],
      liveUrl: "https://your-jackpot-game-demo.com",
      githubUrl: "https://github.com/nishaposwal/jackpot-game",
    },
    {
      title: "Tambola Game",
      description:
        "A multiplayer Tambola (Housie) game built with Angular. Includes automatic number generation, ticket creation, real-time number broadcasting, and winning pattern detection.",
      image: "assets/images/tambola.jpeg",
      technologies: ["Angular", "TypeScript", "Socket.IO", "Node.js"],
      liveUrl: "https://your-tambola-game-demo.com",
      githubUrl: "https://github.com/nishaposwal/tambola-game",
    },
    {
      title: "Fantasy Cricket Game",
      description:
        "A fantasy cricket platform built with Angular where users can create virtual teams, join contests, track live scores, and earn points based on real match performance. Features include player selection logic, leaderboard, wallet system, and match integration.",
      image: "assets/images/fantasy.jpeg",
      technologies: ["Angular", "TypeScript", "Node.js", "MongoDB", "REST API"],
      liveUrl: "https://your-fantasy-cricket-demo.com",
      githubUrl: "https://github.com/nishaposwal/fantasy-cricket",
    },
    {
      title: "Coupon Distribution System",
      description:
        "A secure coupon distribution platform built with Angular for managing and distributing promotional codes. Features include user authentication, coupon generation, redemption tracking, usage limits, and expiry management.",
      image: "assets/images/cms.jpg",
      technologies: ["Angular", "TypeScript", "Node.js", "MongoDB", "JWT"],
      liveUrl: "https://your-coupon-system-demo.com",
      githubUrl: "https://github.com/nishaposwal/coupon-distribution",
    },
    {
      title: "Sticker Chat for Live Cricket Games",
      description:
        "An interactive sticker-based chat system integrated into live cricket matches. Built with Angular, it allows users to send real-time stickers and emojis during matches. Features include team-based chat rooms, sticker packs, live match sync, and moderation tools.",
      image: "assets/images/sticker.jpeg",
      technologies: [
        "Angular",
        "TypeScript",
        "Socket.IO",
        "Node.js",
        "MongoDB",
      ],
      liveUrl: "https://your-sticker-chat-demo.com",
      githubUrl: "https://github.com/nishaposwal/sticker-chat-cricket",
    },
    {
      title: "Play & Win Mini Games",
      description:
        "A collection of lightweight play-and-win games developed using Angular. Includes games like spin-the-wheel, scratch card, tap-to-win, and timed challenges. Features reward logic, animations, point tracking, and eligibility conditions.",
      image: "assets/images/pnw.jpeg",
      technologies: ["Angular", "TypeScript", "RxJS", "Node.js"],
      liveUrl: "https://your-play-win-games-demo.com",
      githubUrl: "https://github.com/nishaposwal/play-and-win-games",
    },
  ];

  getAnimationDelay(index: number): string {
    return `${index * 0.2}s`;
  }

  // Log project view when project card is clicked
  logProjectView(projectTitle: string) {
    AnalyticsService.logProjectView(projectTitle);
  }
}
