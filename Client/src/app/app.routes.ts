import { Routes } from '@angular/router';
import { AuthSwitcher } from './components/auth-switcher/auth-switcher';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Courses } from './components/courses/courses';
import { CourseDetails } from './components/course-details/course-details';

export const routes: Routes = [
  { path: '', component: AuthSwitcher },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'courses', component: Courses },
  { path: 'courses/:id', component: CourseDetails }
];
