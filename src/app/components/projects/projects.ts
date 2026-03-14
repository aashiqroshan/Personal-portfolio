import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import type { ProjectItem } from '../../models/portfolio';

@Component({
  selector: 'app-projects',
  imports: [NgFor, NgIf],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  readonly projects: ProjectItem[];

  constructor(data: PortfolioDataService) {
    this.projects = data.getProjects();
  }

  trackByProject(_index: number, project: ProjectItem): string {
    return project.title;
  }

  trackByTech(_index: number, tech: string): string {
    return tech;
  }
}
