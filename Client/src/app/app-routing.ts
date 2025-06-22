import { Routes, RouterModule } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Courses } from './components/courses/courses';
import { CourseDetails } from './components/course-details/course-details';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register},
  { 
    path: 'courses', 
    component: Courses,
    canActivate: [AuthGuard]
  },
  { 
    path: 'course/:id', 
    component: CourseDetails,
    canActivate: [AuthGuard]
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
