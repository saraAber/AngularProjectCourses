import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'lesson-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lesson-form.html',
  styleUrl: './lesson-form.css'
})
export class LessonForm implements OnChanges {
  @Input() editMode: boolean = false;
  @Input() lesson: Lesson | null = null;
  @Output() formSubmit = new EventEmitter<Lesson>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lesson'] && this.lesson) {
      this.form.patchValue(this.lesson);
    } else if (!this.editMode) {
      this.form.reset();
    }
  }

  submit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
