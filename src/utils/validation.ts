import { ContactFormData, FormFieldError } from '../types/forms';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateContactForm = (data: ContactFormData): { isValid: boolean; errors: FormFieldError[] } => {
  const errors: FormFieldError[] = [];

  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.message.trim()) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (data.message.length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};