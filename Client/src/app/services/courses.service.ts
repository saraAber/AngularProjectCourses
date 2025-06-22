import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAll(): Observable<Course[]> {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get<Course[]>(this.apiUrl, { headers });
  }

  getById(id: number): Observable<Course> {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers });
  }

  enroll(courseId: number, userId: number) {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`, { userId }, { headers });
  }

  unenroll(courseId: number, userId: number) {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    // שימי לב: לא כל שרת תומך ב-body ב-DELETE, אם יש בעיה אפשר לעבור ל-post
    return this.http.request('delete', `${this.apiUrl}/${courseId}/unenroll`, {
      headers,
      body: { userId }
    });
  }

  getEnrolledCourses(userId: number): Observable<Course[]> {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get<Course[]>(`${this.apiUrl}/student/${userId}`, { headers });
  }

  create(course: { title: string; description: string; teacherId: number }) {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.post(`${this.apiUrl}`, course, { headers });
  }

  update(courseId: number, updates: { title: string; description: string; teacherId: number }) {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.put(`${this.apiUrl}/${courseId}`, updates, { headers });
  }

  delete(courseId: number) {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.delete(`${this.apiUrl}/${courseId}`, { headers });
  }
}