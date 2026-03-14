import { Injectable } from '@angular/core';
import { ExperienceItem, ProjectItem, SkillCategory } from '../models/portfolio';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  readonly name = 'Aashiq Roshan V S';
  readonly role = 'Software Engineer – Flutter | Angular | ASP.NET Core';
  readonly location = 'Kerala, India';
  readonly experienceSummary = '2+ years';
  readonly email = 'aashiqroshan@gmail.com';
  readonly phone = '+91-7736391176';
  readonly linkedIn = 'https://linkedin.com/in/aashiq-roshan-vs';

  getAboutSummary(): string {
    return 'Software Engineer with 2+ years of experience building cross-platform mobile and web applications using Flutter, Angular, and ASP.NET Core. Experienced in REST API integration, scalable application architecture, and delivering production-ready applications deployed to the Google Play Store and Apple App Store.';
  }

  getSkillCategories(): SkillCategory[] {
    return [
      {
        name: 'Languages',
        skills: ['Dart', 'TypeScript', 'JavaScript', 'C#', 'SQL', 'Python'],
      },
      {
        name: 'Frameworks',
        skills: ['Flutter', 'Angular', 'ASP.NET Core'],
      },
      {
        name: 'State Management',
        skills: ['BLoC', 'Provider', 'GetX', 'Cubit'],
      },
      {
        name: 'Databases',
        skills: ['Firebase Firestore', 'Hive', 'SQFLite', 'SQL Server'],
      },
      {
        name: 'Tools',
        skills: ['Git', 'GitHub', 'Android Studio', 'Xcode', 'Postman', 'Swagger'],
      },
    ];
  }

  getExperienceTimeline(): ExperienceItem[] {
    return [
      {
        company: 'SpeeHive',
        role: 'Software Engineer L2',
        period: '2025 – Present',
        bullets: [
          'Flutter mobile & web development',
          'REST API integration',
          'PDF generation, analytics dashboards',
          'App Store & Play Store deployments',
          'Angular and .NET upgrades',
        ],
      },
      {
        company: 'Levon Techno Solutions',
        role: 'Flutter Developer Intern',
        period: '2024 – 2025',
        bullets: [
          'Led Flutter development team',
          'Hospital management application',
          'SK Cements e-commerce platform',
          'B2B networking application',
          'Firebase integration',
        ],
      },
      {
        company: 'Brototype',
        role: 'Flutter Developer Trainee',
        period: '2023 – 2024',
        bullets: [
          'Flutter training program',
          'Music player application',
          'Firebase services integration',
          'REST API integration',
          'Data structures and algorithms practice',
        ],
      },
    ];
  }

  getProjects(): ProjectItem[] {
    return [
      {
        title: 'Hospital Management App',
        description:
          'End-to-end hospital management system built with Flutter, integrating real-time patient tracking, appointments, and billing dashboards.',
        image: 'assets/projects/hospital-management.webp',
        techStack: ['Flutter', 'Firebase', 'REST APIs'],
        githubUrl: '',
        demoUrl: '',
      },
      {
        title: 'E-Commerce App (SK Cements)',
        description:
          'E-commerce platform for SK Cements with product catalogue, order workflows, and secure payments optimized for mobile.',
        image: 'assets/projects/sk-cements.webp',
        techStack: ['Flutter', 'Razorpay', 'BLoC', 'REST APIs'],
        githubUrl: '',
        demoUrl: '',
      },
      {
        title: 'B2B Networking Platform (Know Connections)',
        description:
          'B2B networking application enabling businesses to discover partners, manage leads, and collaborate securely.',
        image: 'assets/projects/b2b-platform.webp',
        techStack: ['Flutter', 'Firebase', 'Cloud Functions'],
        githubUrl: '',
        demoUrl: '',
      },
      {
        title: 'Beatz Music Player',
        description:
          'Beautifully animated music player with offline caching, playlists, and Firebase-backed user profiles.',
        image: 'assets/projects/music-player.webp',
        techStack: ['Flutter', 'Firebase', 'Provider'],
        githubUrl: '',
        demoUrl: '',
      },
    ];
  }
}

