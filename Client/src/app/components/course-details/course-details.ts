import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { LessonsService } from '../../services/lessons.service';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { Lesson } from '../../models/lesson.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LessonForm } from './lesson-form';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'course-details',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, LessonForm,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css'
})
export class CourseDetails {
  course: Course | null = null;
  lessons: Lesson[] = [];
  error: string = '';
  userRole: string | null = null;
  form: FormGroup;
  editMode: boolean = false;
  editingLessonId: number | null = null;
  formOpen: boolean = false;
  editingLesson: Lesson | null = null;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private lessonsService: LessonsService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.coursesService.getById(id).subscribe({
      next: (course) => this.course = course,
      error: (err) => this.error = err.error?.message || 'שגיאה בטעינת פרטי הקורס'
    });
    this.lessonsService.getLessonsByCourse(id).subscribe({
      next: (lessons) => this.lessons = lessons,
      error: (err) => this.error = err.error?.message || 'שגיאה בטעינת שיעורים'
    });
    const token = this.auth.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
    }
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  openForm() {
    this.formOpen = true;
    this.form.reset();
    this.editMode = false;
    this.editingLessonId = null;
    this.editingLesson = null;
  }

  closeForm() {
    this.formOpen = false;
    this.editMode = false;
    this.editingLessonId = null;
    this.editingLesson = null;
    this.form.reset();
  }

  submit() {
    if (!this.course) return;
    if (this.form.invalid) return;
    if (this.editMode && this.editingLessonId) {
      this.lessonsService.updateLesson(this.editingLessonId, {
        title: this.form.value.title,
        content: this.form.value.content,
        courseId: this.course.id
      }).subscribe({
        next: () => {
          this.editMode = false;
          this.editingLessonId = null;
          this.formOpen = false;
          this.form.reset();
          this.loadLessons(this.course!.id);
        },
        error: (err) => this.error = err.error?.message || 'שגיאה בעדכון שיעור'
      });
    } else {
      this.lessonsService.createLesson({
        title: this.form.value.title,
        content: this.form.value.content,
        courseId: this.course.id
      }).subscribe({
        next: () => {
          this.formOpen = false;
          this.form.reset();
          this.loadLessons(this.course!.id);
        },
        error: (err) => this.error = err.error?.message || 'שגיאה בהוספת שיעור'
      });
    }
  }

  edit(lesson: Lesson) {
    this.editMode = true;
    this.editingLessonId = lesson.id;
    this.formOpen = true;
    this.editingLesson = lesson;
    this.form.patchValue({ title: lesson.title, content: lesson.content });
  }

  onLessonFormSubmit(lesson: Lesson) {
    if (!this.course) return;
    if (this.editMode && this.editingLessonId) {
      this.lessonsService.updateLesson(this.editingLessonId, {
        title: lesson.title,
        content: lesson.content,
        courseId: this.course.id
      }).subscribe({
        next: () => {
          this.editMode = false;
          this.editingLessonId = null;
          this.formOpen = false;
          this.editingLesson = null;
          this.form.reset();
          this.loadLessons(this.course!.id);
        },
        error: (err) => this.error = err.error?.message || 'שגיאה בעדכון שיעור'
      });
    } else {
      this.lessonsService.createLesson({
        title: lesson.title,
        content: lesson.content,
        courseId: this.course.id
      }).subscribe({
        next: () => {
          this.formOpen = false;
          this.editingLesson = null;
          this.form.reset();
          this.loadLessons(this.course!.id);
        },
        error: (err) => this.error = err.error?.message || 'שגיאה בהוספת שיעור'
      });
    }
  }

  delete(lessonId: number) {
    if (!this.course) return;
    if (!confirm('האם למחוק את השיעור?')) return;
    this.lessonsService.deleteLesson(lessonId).subscribe({
      next: () => this.loadLessons(this.course!.id),
      error: (err) => this.error = err.error?.message || 'שגיאה במחיקת שיעור'
    });
  }

  private loadLessons(courseId: number) {
    this.lessonsService.getLessonsByCourse(courseId).subscribe({
      next: (lessons) => this.lessons = lessons,
      error: (err) => this.error = err.error?.message || 'שגיאה בטעינת שיעורים'
    });
  }
}
