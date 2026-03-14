import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import type { ExperienceItem } from '../../models/portfolio';

@Component({
  selector: 'app-experience',
  imports: [NgFor],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  readonly experience: ExperienceItem[];

  constructor(data: PortfolioDataService) {
    this.experience = data.getExperienceTimeline();
  }

  trackByCompany(_index: number, item: ExperienceItem): string {
    return `${item.company}-${item.period}`;
  }

  trackByBullet(_index: number, bullet: string): string {
    return bullet;
  }
}
