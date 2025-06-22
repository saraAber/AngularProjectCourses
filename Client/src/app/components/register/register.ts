import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule,
    MatSelectModule,MatInputModule, MatFormFieldModule, MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  form: FormGroup;
  error: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.auth.register(this.form.value).subscribe({
      next: (res: any) => {
        this.error = '';
        if (res.token) {
          this.auth.saveToken(res.token);
        }
        this.router.navigate(['/courses']);
      },
      error: err => {
        this.error = err.error?.message || 'שגיאה בהרשמה';
      }
    });
  }
}
