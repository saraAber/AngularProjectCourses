import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson } from '../models/lesson.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class LessonsService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  getLessonsByCourse(courseId: number) {
    const token = this.auth.getToken();
    const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return this.http.get<Lesson[]>(`http://localhost:3000/api/courses/${courseId}/lessons`, headers);
  }

  createLesson(lesson: { title: string; content: string; courseId: number }) {
    const token = this.auth.getToken();
    const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return this.http.post(`http://localhost:3000/api/courses/${lesson.courseId}/lessons`, lesson, headers);
  }

  updateLesson(lessonId: number, updates: { title: string; content: string; courseId: number }) {
    const token = this.auth.getToken();
    const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return this.http.put(`http://localhost:3000/api/courses/${updates.courseId}/lessons/${lessonId}`, updates, headers);
  }

  deleteLesson(lessonId: number) {
    const token = this.auth.getToken();
    const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return this.http.delete(`http://localhost:3000/api/courses/0/lessons/${lessonId}`, headers);
  }
}
