export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface FormFieldError {
  field: keyof ContactFormData;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}