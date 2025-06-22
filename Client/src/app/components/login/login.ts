import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatError, MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule,
    MatInputModule, MatError
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: FormGroup;
  error: string = '';
  private router = inject(Router);

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: (res: any) => {
        this.error = '';
        if (res.token) {
          this.auth.saveToken(res.token);
        }
        this.router.navigate(['/courses']);
      },
      error: err => {
        this.error = err.error?.message || 'שגיאה בהתחברות';
      }
    });
  }
}
