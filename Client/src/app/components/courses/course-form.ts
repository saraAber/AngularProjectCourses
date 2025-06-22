
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    

  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'

})
export class CourseForm implements OnInit {
  form!: ReturnType<FormBuilder['group']>;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseForm>,
    @Inject(MAT_DIALOG_DATA) public data: Course | null
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (this.data) {
      this.form.patchValue({
        title: this.data.title,
        description: this.data.description
      });
    }
  }

  // onSubmit() {
  //   if (this.form.valid) {
  //     this.dialogRef.close(this.form.value);
  //   }
  // }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      const course: Course = {
        ...this.form.value,
        id: this.data?.id || Date.now().toString()
      };
      this.dialogRef.close(course);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}