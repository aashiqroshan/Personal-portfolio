import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  readonly form;
  readonly isSubmitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  async submit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      await emailjs.sendForm(
        'service_7fdq9xj',
        'template_vut7qfj',
        event.target as HTMLFormElement,
        'EU__8gpK2TCfeww1N'
      );

      this.successMessage.set('Message sent successfully! I will get back to you soon.');
      this.form.reset();
    } catch (error) {
      console.log("EmailJS Error:", error);
      console.error('Email failed to send:', error);
      this.errorMessage.set('Failed to send message. Please try the direct contact links instead.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

