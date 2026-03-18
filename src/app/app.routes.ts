import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { SkillsComponent } from './components/skills/skills.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { ThunderingHerdComponent } from './components/blogs/thundering-herd/thundering-herd.component';
import { CacheStrategiesComponent } from './components/blogs/cache-strategies/cache-strategies.component';
import { KafkaExplainedLikeYoure5Component } from './components/blogs/kafka-explained-like-youre-5/kafka-explained-like-youre-5.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'blogs/thundering-herd', component: ThunderingHerdComponent },
  { path: 'blogs/cache-strategies', component: CacheStrategiesComponent },
  { path: 'blogs/kafka-explained-like-youre-5', component: KafkaExplainedLikeYoure5Component },
  { path: '**', redirectTo: '' }
]; 