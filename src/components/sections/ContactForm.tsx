import React, { useState } from 'react';
import { Button, Input } from '@/components/common';
import { useForm } from '@/hooks/useForm';
import { ContactFormData } from '@/types/forms';
import { validateContactForm } from '@/utils/validation';

export const ContactForm: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const form = useForm({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async () => {
    const validation = validateContactForm(form.values);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        form.setFieldError(error.field, error.message);
      });
      return;
    }

    await form.handleSubmit(async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitStatus('success');
        form.resetForm();
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } catch {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
        
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-800">Thank you for your message! We'll get back to you soon.</p>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Something went wrong. Please try again.</p>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Input
            name="name"
            label="Your Name"
            placeholder="Enter your full name"
            value={form.values.name}
            onChange={(value) => form.handleChange('name', value)}
            error={form.errors.name}
            required
          />
          
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={form.values.email}
            onChange={(value) => form.handleChange('email', value)}
            error={form.errors.email}
            required
          />
          
          <Input
            name="message"
            label="Message"
            type="textarea"
            placeholder="Tell us about your project or question"
            value={form.values.message}
            onChange={(value) => form.handleChange('message', value)}
            error={form.errors.message}
            required
          />
          
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="lg"
              loading={form.isSubmitting}
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};