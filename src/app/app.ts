import { Component, signal } from '@angular/core';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Skills } from './components/skills/skills';
import { Experience } from './components/experience/experience';
import { Projects } from './components/projects/projects';
import { Contact } from './components/contact/contact';
import { Navbar } from './shared/navbar/navbar';
import { ScrollIndicator } from './shared/scroll-indicator/scroll-indicator';
import { Background } from './shared/background/background';

@Component({
  selector: 'app-root',
  imports: [
    Background,
    Navbar,
    ScrollIndicator,
    Hero,
    About,
    Skills,
    Experience,
    Projects,
    Contact,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('aashiq-portfolio');
}
