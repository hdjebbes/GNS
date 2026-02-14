import { useState, FormEvent } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { COMPANY } from '../constants';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  consent?: string;
}

export function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consent: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    // Validate consent
    if (!formData.consent) {
      newErrors.consent = t.contact.form.consentError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeInput = (input: string): string => {
    return input.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '');
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase configuration');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email).toLowerCase(),
          message: sanitizeInput(formData.message),
          language: language,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data as { error?: string }).error || `Request failed (${response.status})`);
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '', consent: false });
      setErrors({});

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      setStatus('error');

      let message = 'Failed to send message. Please try again.';
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = String((error as { message: string }).message);
        if (errorMsg.includes('CORS') || errorMsg.includes('NetworkError')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (errorMsg.includes('fetch')) {
          message = 'Unable to connect to the server. Please try again later.';
        } else if (errorMsg.includes('Invalid') || errorMsg.includes('Failed to save')) {
          message = errorMsg;
        }
      }
      setErrorMessage(message);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    // Validate individual field on blur
    const newErrors: FormErrors = { ...errors };
    
    if (field === 'name') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      } else {
        delete newErrors.name;
      }
    } else if (field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    } else if (field === 'message') {
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      } else if (formData.message.trim().length < 10) {
        newErrors.message = 'Message must be at least 10 characters';
      } else {
        delete newErrors.message;
      }
    }
    
    setErrors(newErrors);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/20">
      {/* Header Section */}
      <header className="relative overflow-hidden divi-section bg-gradient-to-br from-blue-50/40 via-blue-50/30 to-blue-100/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.08),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="divi-heading bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            {t.contact.title}
          </h1>
          <p className="divi-subheading text-blue-700 max-w-2xl mx-auto">
            Get in touch with us. We're here to help your business grow.
          </p>
        </div>
      </header>

      <article className="relative overflow-hidden divi-section bg-gradient-to-br from-white via-blue-50/30 to-blue-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="divi-card p-6 md:p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      {t.contact.email}
                    </h3>
                    <a
                      href={`mailto:${COMPANY.email}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    >
                      {COMPANY.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="divi-card p-6 md:p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      {t.contact.phone}
                    </h3>
                    <a
                      href={`tel:${COMPANY.phone}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    >
                      {COMPANY.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="divi-card p-6 md:p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      {t.contact.location}
                    </h3>
                    <p className="text-blue-800/80 font-medium">
                      {t.contact.locationValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="divi-card p-6 md:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-blue-900 mb-2">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  required
                  maxLength={100}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all ${
                    errors.name ? 'border-red-300' : 'border-blue-200'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-2">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  required
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all ${
                    errors.email ? 'border-red-300' : 'border-blue-200'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-blue-900 mb-2">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur('message')}
                  required
                  rows={5}
                  maxLength={2000}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all resize-none ${
                    errors.message ? 'border-red-300' : 'border-blue-200'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <p className="text-sm text-red-600">{errors.message}</p>
                  )}
                  <p className={`text-xs ml-auto ${formData.message.length > 1800 ? 'text-red-600' : 'text-blue-600'}`}>
                    {formData.message.length} / 2000
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-900">
                    {t.contact.form.consentLabel}{' '}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:text-blue-700 underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.footer.privacyPolicy}
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-sm text-red-600">{errors.consent}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-700 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>
                  {status === 'sending' ? t.contact.form.sending : t.contact.form.submit}
                </span>
                {status === 'idle' && <Send className="w-5 h-5" />}
              </button>

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                  {t.contact.form.success}
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                  {errorMessage || t.contact.form.error}
                </div>
              )}
            </form>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
