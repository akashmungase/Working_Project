// user/user.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
        this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      avatar: ['', [Validators.required,]]
    });
  }

  ngOnInit(): void {
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.userForm.invalid) {
      return;
    }

    const userData: User = {
      ...this.userForm.value
    };
    
    this.authService.createUser(userData).subscribe({
      next: () => {
        this.successMessage = `User created successfully!`;
        this.userForm.reset();
        this.submitted = false;
      },
    });
  }
}