
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../services/courses.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/course.model';
import { RouterModule } from '@angular/router';
import { CourseForm } from './course-form';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CourseForm,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  courses: Course[] = [];
  enrolledCourses: number[] = [];
  userRole: string | null = null;
  userId: number | null = null;
  error: string = '';
  formOpen: boolean = false;
  editMode: boolean = false;
  editingCourse: Course | null = null;
  dialogOpen: boolean = false;

  constructor(
    private coursesService: CoursesService,
    private auth: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const token = this.auth.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
      this.userId = payload.userId ?? payload.id;
    }
    this.loadCourses();
    if (this.userId && this.userRole === 'student') {
      this.loadEnrolledCourses(this.userId);
    }
  }

  loadCourses() {
    this.coursesService.getAll().subscribe({
      next: (courses) => this.courses = courses,
      error: (err) => this.error = err.error?.message || 'שגיאה בטעינת קורסים'
    });
  }

  loadEnrolledCourses(userId: number) {
    this.coursesService.getEnrolledCourses(userId).subscribe({
      next: (courses) => {
        this.enrolledCourses = courses.map(c => c.id);
      },
      error: (err) => this.error = err.error?.message || 'שגיאה בטעינת קורסי תלמיד'
    });
  }

  isEnrolled(course: Course): boolean {
    if (!this.userId) return false;
    return this.enrolledCourses.includes(course.id);
  }

  enroll(course: Course) {
    if (this.userId) {
      this.coursesService.enroll(course.id, this.userId).subscribe({
        next: () => {
          if (!this.enrolledCourses.includes(course.id)) {
            this.enrolledCourses.push(course.id);
          }
        },
        error: (err) => {
          if (err.error?.message?.includes('UNIQUE constraint failed')) {
            this.error = 'אתה כבר רשום לקורס זה';
          } else {
            this.error = err.error?.message || 'שגיאה בהצטרפות לקורס';
          }
        }
      });
    }
  }

  unenroll(course: Course) {
    if (!this.userId) return;
    this.coursesService.unenroll(course.id, this.userId).subscribe({
      next: () => {
        this.enrolledCourses = this.enrolledCourses.filter(id => id !== course.id);
      },
      error: (err) => this.error = err.error?.message || 'שגיאה בעזיבת קורס'
    });
  }

openForm(course?: Course) {
  if (course) {
    this.editMode = true;
    this.editingCourse = course;
  } else {
    this.editMode = false;
    this.editingCourse = null;
  }
  this.dialogOpen = true;
  const dialogRef = this.dialog.open(CourseForm, {
    width: '400px',
    data: course ?? null,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    this.dialogOpen = false;
    if (result) {
      this.onCourseFormSubmit(result);
    }
    // איפוס מצב עריכה אחרי סגירת הדיאלוג
    this.editMode = false;
    this.editingCourse = null;
  });
}

  closeForm() {
    this.formOpen = false;
    this.editMode = false;
    this.editingCourse = null;
  }

 
  onCourseFormSubmit(courseData: { title: string; description: string }) {
    if (this.editMode && this.editingCourse) {
      this.coursesService.update(this.editingCourse.id, {
        ...courseData,
        teacherId: this.editingCourse.teacherId
      }).subscribe({
        next: () => {
          this.loadCourses();
          this.closeForm();
        },
        error: (err) => this.error = err.error?.message || 'שגיאה בעדכון קורס'
      });
    } else {
      if (!this.userId) return;
      this.coursesService.create({
        ...courseData,
        teacherId: this.userId
      }).subscribe({
        next: () => {
          this.loadCourses();
          this.closeForm();
        },
        error: (err) => this.error = err.error?.message || 'שגיאה ביצירת קורס'
      });
    }
  }
  

  deleteCourse(course: Course) {
    if (!confirm('האם למחוק את הקורס?')) return;
    this.coursesService.delete(course.id).subscribe({
      next: () => this.loadCourses(),
      error: (err) => this.error = err.error?.message || 'שגיאה במחיקת קורס'
    });
  }
}