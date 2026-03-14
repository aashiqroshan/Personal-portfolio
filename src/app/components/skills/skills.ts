import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import type { SkillCategory } from '../../models/portfolio';

@Component({
  selector: 'app-skills',
  imports: [NgFor],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  readonly skillCategories: SkillCategory[];

  constructor(data: PortfolioDataService) {
    this.skillCategories = data.getSkillCategories();
  }

  trackBySkill(_index: number, skill: string): string {
    return skill;
  }
}
