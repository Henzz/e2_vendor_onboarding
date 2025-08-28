'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface VendorData {
  // Step 1: Personal Information
  name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;

  // Step 2: Business Information
  business_name: string;
  business_type: string;
  business_description: string;
  business_email: string;
  business_phone: string;
  business_address: string;

  // Step 3: Legal & Tax Information
  tin_number: string;
  trade_license_number: string;
  tax_id: string;

  // Step 4: Document Upload
  trade_license_doc: File | null;
  id_card_doc: File | null;
}

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Your personal details',
  },
  {
    id: 2,
    title: 'Business Information',
    description: 'Tell us about your business',
  },
  {
    id: 3,
    title: 'Legal & Tax Information',
    description: 'Legal and tax details',
  },
  { id: 4, title: 'Document Upload', description: 'Upload required documents' },
  { id: 5, title: 'Review & Submit', description: 'Review your information' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [vendorData, setVendorData] = useState<VendorData>(() => {
    // Load saved data from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vendor-onboarding-data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          return {
            // Step 1: Personal Information
            name: parsedData.name || '',
            email: parsedData.email || '',
            phone_number: parsedData.phone_number || '',
            password: parsedData.password || '',
            password_confirmation: parsedData.password_confirmation || '',

            // Step 2: Business Information
            business_name: parsedData.business_name || '',
            business_type: parsedData.business_type || '',
            business_description: parsedData.business_description || '',
            business_email: parsedData.business_email || '',
            business_phone: parsedData.business_phone || '',
            business_address: parsedData.business_address || '',

            // Step 3: Legal & Tax Information
            tin_number: parsedData.tin_number || '',
            trade_license_number: parsedData.trade_license_number || '',
            tax_id: parsedData.tax_id || '',

            // Step 4: Document Upload (files can't be persisted)
            trade_license_doc: null,
            id_card_doc: null,
          };
        } catch (error) {
          console.error('Error parsing saved vendor data:', error);
        }
      }
    }

    // Default initial state
    return {
      // Step 1: Personal Information
      name: '',
      email: '',
      phone_number: '',
      password: '',
      password_confirmation: '',

      // Step 2: Business Information
      business_name: '',
      business_type: '',
      business_description: '',
      business_email: '',
      business_phone: '',
      business_address: '',

      // Step 3: Legal & Tax Information
      tin_number: '',
      trade_license_number: '',
      tax_id: '',

      // Step 4: Document Upload
      trade_license_doc: null,
      id_card_doc: null,
    };
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Only add event listener on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Load completed steps from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSteps = localStorage.getItem(
        'vendor-onboarding-completed-steps'
      );
      if (savedSteps) {
        try {
          const stepsArray = JSON.parse(savedSteps);
          setCompletedSteps(new Set(stepsArray));
        } catch (error) {
          console.error('Error parsing saved completed steps:', error);
        }
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dataToSave = {
        ...vendorData,
        // Don't save file objects as they can't be serialized
        trade_license_doc: null,
        id_card_doc: null,
      };
      localStorage.setItem(
        'vendor-onboarding-data',
        JSON.stringify(dataToSave)
      );
    }
  }, [vendorData]);

  // Save completed steps to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'vendor-onboarding-completed-steps',
        JSON.stringify(Array.from(completedSteps))
      );
    }
  }, [completedSteps]);

  const validateField = (
    field: keyof VendorData,
    value: string | string[] | File | null
  ): string | null => {
    if (value instanceof File || value === null) {
      // Handle file validation
      switch (field) {
        case 'trade_license_doc':
          if (!value) return 'Trade license document is required';
          return null;
        case 'id_card_doc':
          if (!value) return 'ID card document is required';
          return null;
        default:
          return null;
      }
    }

    const stringValue = Array.isArray(value) ? value.join(', ') : value;

    switch (field) {
      // Step 1: Personal Information
      case 'name':
        if (!stringValue.trim()) return 'Full name is required';
        if (stringValue.trim().length < 2)
          return 'Name must be at least 2 characters';
        return null;

      case 'email':
        if (!stringValue.trim()) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue))
          return 'Please enter a valid email address';
        return null;

      case 'phone_number':
        if (!stringValue.trim()) return 'Phone number is required';
        const phoneRegex = /(^(\+?)(2519|09|2517|07|9|7)(\d{8,8})$)/;
        if (!phoneRegex.test(stringValue.replace(/[\s\-\(\)]/g, '')))
          return 'Please enter a valid phone number';
        return null;

      case 'password':
        if (!stringValue.trim()) return 'Password is required';
        if (stringValue.length < 8)
          return 'Password must be at least 8 characters';
        return null;

      case 'password_confirmation':
        if (!stringValue.trim()) return 'Password confirmation is required';
        if (stringValue !== vendorData.password)
          return 'Passwords do not match';
        return null;

      // Step 2: Business Information
      case 'business_name':
        if (!stringValue.trim()) return 'Business name is required';
        if (stringValue.trim().length < 2)
          return 'Business name must be at least 2 characters';
        return null;

      case 'business_type':
        if (!stringValue) return 'Please select a business type';
        return null;

      case 'business_description':
        if (!stringValue.trim()) return 'Business description is required';
        if (stringValue.trim().length < 10)
          return 'Description must be at least 10 characters';
        return null;

      case 'business_email':
        if (!stringValue.trim()) return 'Business email address is required';
        const businessEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!businessEmailRegex.test(stringValue))
          return 'Please enter a valid business email address';
        return null;

      case 'business_phone':
        if (!stringValue.trim()) return 'Business phone number is required';
        const businessPhoneRegex = /(^(\+?)(2519|09|2517|07|9|7)(\d{8,8})$)/;
        if (!businessPhoneRegex.test(stringValue.replace(/[\s\-\(\)]/g, '')))
          return 'Please enter a valid business phone number';
        return null;

      case 'business_address':
        if (!stringValue.trim()) return 'Business address is required';
        if (stringValue.trim().length < 10)
          return 'Please enter a complete business address';
        return null;

      // Step 3: Legal & Tax Information
      case 'tin_number':
        if (!stringValue.trim()) return 'TIN number is required';
        if (stringValue.trim().length < 10)
          return 'Please enter a valid TIN number';
        return null;

      case 'trade_license_number':
        if (!stringValue.trim()) return 'Trade license number is required';
        if (stringValue.trim().length < 5)
          return 'Please enter a valid trade license number';
        return null;

      case 'tax_id':
        if (!stringValue.trim()) return 'Tax ID is required';
        if (stringValue.trim().length < 5) return 'Please enter a valid Tax ID';
        return null;

      default:
        return null;
    }
  };

  const updateVendorData = (
    field: keyof VendorData,
    value: string | string[]
  ) => {
    setVendorData((prev) => ({ ...prev, [field]: value }));

    // Validate field and update field errors
    const fieldError = validateField(field, value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: fieldError || '',
    }));

    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleFieldBlur = (field: keyof VendorData) => {
    const value = vendorData[field];
    const fieldError = validateField(field, value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: fieldError || '',
    }));
  };

  const validateStep = (step: number): boolean => {
    const fieldsToValidate: (keyof VendorData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate.push(
          'name',
          'email',
          'phone_number',
          'password',
          'password_confirmation'
        );
        break;
      case 2:
        fieldsToValidate.push(
          'business_name',
          'business_type',
          'business_description',
          'business_email',
          'business_phone',
          'business_address'
        );
        break;
      case 3:
        fieldsToValidate.push('tin_number', 'trade_license_number', 'tax_id');
        break;
      case 4:
        fieldsToValidate.push('trade_license_doc', 'id_card_doc');
        break;
      default:
        return true;
    }

    let hasErrors = false;
    const newFieldErrors: Record<string, string> = { ...fieldErrors };

    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, vendorData[field]);
      if (fieldError) {
        newFieldErrors[field] = fieldError;
        hasErrors = true;
      } else {
        newFieldErrors[field] = '';
      }
    });

    setFieldErrors(newFieldErrors);

    if (hasErrors) {
      setError('Please fix the errors below before proceeding.');
    } else {
      setError(null);
    }

    return !hasErrors;
  };

  const nextStep = () => {
    if (currentStep < 5) {
      if (validateStep(currentStep)) {
        // Mark current step as completed
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
        setCurrentStep(currentStep + 1);
        setError(null);
      } else {
        setError('Please fill in all required fields before proceeding.');
      }
    }
  };

  const goToStep = (stepNumber: number) => {
    // Only allow navigation to completed steps or the next step
    if (stepNumber <= currentStep || completedSteps.has(stepNumber - 1)) {
      setCurrentStep(stepNumber);
      setError(null);
    }
  };

  const clearFormData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vendor-onboarding-data');
      localStorage.removeItem('vendor-onboarding-completed-steps');
    }

    // Reset all state
    setVendorData({
      name: '',
      email: '',
      phone_number: '',
      password: '',
      password_confirmation: '',
      business_name: '',
      business_type: '',
      business_description: '',
      business_email: '',
      business_phone: '',
      business_address: '',
      tin_number: '',
      trade_license_number: '',
      tax_id: '',
      trade_license_doc: null,
      id_card_doc: null,
    });
    setCompletedSteps(new Set());
    setCurrentStep(1);
    setError(null);
    setFieldErrors({});
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError('Please fill in all required fields.');
      // Scroll to the first error field if any
      const firstError = Object.keys(fieldErrors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    setFieldErrors({}); // Clear previous field errors

    try {
      // Create FormData object
      const formData = new FormData();

      // Append all form fields to FormData
      Object.entries(vendorData).forEach(([key, value]) => {
        // Handle file uploads
        if (key === 'trade_license_doc' || key === 'id_card_doc') {
          if (value) {
            formData.append(key, value as File);
          }
        } else {
          // Append other fields as strings
          formData.append(key, String(value));
        }
      });

      const response = await axios.post(
        'https://sandboxadmin.e2store.net/api/vendors',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout for file uploads
          withCredentials: true, // Include cookies in the request
          validateStatus: (status) => status >= 200 && status < 500, // Don't throw on 4xx errors
        }
      );

      // Handle successful response
      if (response.status >= 200 && response.status < 300) {
        console.log('Submission successful:', response.data);
        // Clear saved data from localStorage on successful submission
        if (typeof window !== 'undefined') {
          localStorage.removeItem('vendor-onboarding-data');
          localStorage.removeItem('vendor-onboarding-completed-steps');
        }
        setIsSubmitted(true);
        return;
      }

      // Handle validation errors (422 Unprocessable Entity)
      if (response.status === 422 && (response.data?.errors || response.data?.message)) {
        const serverErrors = response.data.errors || response.data.message;
        const newFieldErrors: Record<string, string> = {};
        
        // Handle different server response formats
        if (typeof serverErrors === 'object') {
          // Format: { field: ["error1", "error2"] }
          Object.entries(serverErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              newFieldErrors[field] = messages[0];
            } else if (typeof messages === 'string') {
              // Handle case where message is a direct string
              newFieldErrors[field] = messages;
            }
          });
        }
        
        // Set field errors and general error message
        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
          setError('Please correct the errors in the form.');
          
          // Scroll to the first error field
          const firstError = Object.keys(newFieldErrors)[0];
          if (firstError) {
            const element = document.querySelector(`[name="${firstError}"]`) || 
                           document.getElementById(firstError);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          // Fallback error message if we couldn't parse the errors
          setError(response.data.message || 'Please check your input and try again.');
        }
        return;
      }

      // Handle other error responses
      throw new Error(response.data?.message || 'Failed to submit application');

    } catch (error) {
      console.error('Error submitting application:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError('Request timed out. Please check your internet connection and try again.');
        } else if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              setError('Authentication required. Please log in and try again.');
              break;
            case 403:
              setError('You do not have permission to perform this action.');
              break;
            case 404:
              setError('The requested resource was not found.');
              break;
            case 429:
              setError('Too many requests. Please try again later.');
              break;
            case 500:
              setError('A server error occurred. Our team has been notified. Please try again later.');
              break;
            default:
              setError(data?.message || `Error: ${status} - ${data?.error || 'Unknown error'}`);
          }
        } else if (error.request) {
          // Request was made but no response received
          setError('Unable to connect to the server. Please check your internet connection and try again.');
        } else {
          // Something else happened while setting up the request
          setError(`Request error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        // Non-Axios error
        setError(`Error: ${error.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      // Log the full error for debugging
      console.error('Full error details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    }
  };

  const goHome = () => {
    router.push('/');
  };

  // Helper component for field errors
  const FieldError = ({ field }: { field: keyof VendorData }) => {
    const error = fieldErrors[field];
    if (!error) return null;

    return (
      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-3 w-3 flex-shrink-0" />
        {error}
      </p>
    );
  };

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen text-white"
        style={{ backgroundColor: '#171717' }}
      >
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-black/80 backdrop-blur-sm' : ''
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 py-2">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <img
                  onClick={() => scrollToSection('hero')}
                  src="/e2-logo.png"
                  alt="e2 Logo"
                  className="h-8 w-auto cursor-pointer"
                />
                <nav className="hidden md:flex items-center space-x-8">
                  {/* <button
                    onClick={goHome}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button> */}
                  <button
                    onClick={() => {
                      goHome();
                      setTimeout(() => scrollToSection('features'), 100);
                    }}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => {
                      goHome();
                      setTimeout(() => scrollToSection('pricing'), 100);
                    }}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => {
                      goHome();
                      setTimeout(() => scrollToSection('faq'), 100);
                    }}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </nav>
              </div>

              <div className="flex items-center">
                <Button
                  size="sm"
                  className="hidden md:flex items-center hover:from-pink-600 hover:to-blue-600 text-white rounded-lg px-8 py-6 font-medium transition-colors cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(61.93deg, #FF8E54 4.59%, #DA33D0 55.72%, #0C3DDE 106.85%)',
                  }}
                  onClick={goHome}
                >
                  Back to Home
                </Button>

                <button
                  className="md:hidden p-2 text-white ml-4"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {isMenuOpen && (
              <div className="md:hidden py-4">
                <nav className="flex flex-col space-y-4">
                  {/* <button
                    onClick={goHome}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button> */}
                  <button
                    onClick={() => {
                      goHome();
                      setTimeout(() => scrollToSection('features'), 100);
                    }}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => {
                      goHome();
                      setTimeout(() => scrollToSection('pricing'), 100);
                    }}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => {
                      goHome();
                      setTimeout(() => scrollToSection('faq'), 100);
                    }}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                  <Button
                    size="sm"
                    className="bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white rounded-lg px-8 py-6 text-lg font-semibold w-fit cursor-pointer"
                    onClick={goHome}
                  >
                    Back to Home
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </header>

        <div className="pt-20 flex items-center justify-center p-4 min-h-screen">
          <Card className="max-w-2xl w-full bg-white">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Application Submitted Successfully!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Thank you for joining e2. Your vendor application has been
                received and is under review.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Application Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Name:</p>
                    <p className="text-gray-600">{vendorData.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Business Name:</p>
                    <p className="text-gray-600">{vendorData.business_name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Email:</p>
                    <p className="text-gray-600">{vendorData.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Phone:</p>
                    <p className="text-gray-600">{vendorData.phone_number}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Business Type:</p>
                    <p className="text-gray-600">{vendorData.business_type}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">TIN Number:</p>
                    <p className="text-gray-600">{vendorData.tin_number}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Our team will review your application within 2-3 business
                    days
                  </li>
                  <li>
                    • You'll receive an email confirmation with next steps
                  </li>
                  <li>• Once approved, you can start setting up your store</li>
                </ul>
              </div>

              <Button
                onClick={goHome}
                className="w-full bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white py-3 cursor-pointer"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>

        <footer
          className="border-t border-gray-800 py-16 px-4"
          style={{ backgroundColor: '#171717' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    src="/e2-logo.png"
                    alt="e2 Logo"
                    className="h-8 w-auto"
                  />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Empowering businesses to reach millions of customers and scale
                  their operations to build successful online businesses with
                  our powerful e-commerce platform.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button
                      onClick={goHome}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        goHome();
                        setTimeout(() => scrollToSection('features'), 100);
                      }}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        goHome();
                        setTimeout(() => scrollToSection('pricing'), 100);
                      }}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Pricing
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">
                  Support
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                    >
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">
                  Contact
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>contact@e2.net</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>+251 97 943 4331</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 e2 Platform. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: '#171717' }}
    >
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-sm' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <img
                onClick={goHome}
                src="/e2-logo.png"
                alt="e2 Logo"
                className="h-8 w-auto cursor-pointer"
              />
              <nav className="hidden md:flex items-center space-x-8">
                {/* <button
                  onClick={goHome}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button> */}
                <button
                  onClick={() => {
                    goHome();
                    setTimeout(() => scrollToSection('features'), 100);
                  }}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    goHome();
                    setTimeout(() => scrollToSection('pricing'), 100);
                  }}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button
                  onClick={() => {
                    goHome();
                    setTimeout(() => scrollToSection('faq'), 100);
                  }}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </nav>
            </div>

            <div className="flex items-center">
              <Button
                size="sm"
                className="hidden md:flex items-center bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white rounded-lg px-8 py-6 font-medium cursor-pointer"
                onClick={goHome}
              >
                Back to Home
              </Button>

              <button
                className="md:hidden p-2 text-white ml-4"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={goHome}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    goHome();
                    setTimeout(() => scrollToSection('features'), 100);
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    goHome();
                    setTimeout(() => scrollToSection('pricing'), 100);
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button
                  onClick={() => {
                    goHome();
                    setTimeout(() => scrollToSection('faq'), 100);
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
                <Button
                  size="sm"
                  className="bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white rounded-lg px-8 py-6 text-lg font-semibold w-fit cursor-pointer"
                  onClick={goHome}
                >
                  Back to Home
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="pt-20 p-4 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Vendor Onboarding
                </h1>
                <p className="text-gray-400">
                  Join thousands of successful sellers on e2
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFormData}
                className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer"
              >
                Clear Form
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = currentStep === step.id;
                const isAccessible =
                  step.id <= currentStep || completedSteps.has(step.id - 1);

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() =>
                          isAccessible ? goToStep(step.id) : null
                        }
                        disabled={!isAccessible}
                        title={
                          isCompleted
                            ? 'Completed - Click to review'
                            : isCurrent
                            ? 'Current step'
                            : isAccessible
                            ? 'Click to go to this step'
                            : 'Complete previous steps first'
                        }
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                          isCompleted || isCurrent
                            ? 'bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] hover:brightness-85 hover:backdrop-blur-sm text-white'
                            : 'bg-gray-600 text-gray-300'
                        } ${
                          isAccessible
                            ? 'cursor-pointer hover:scale-105 hover:shadow-lg'
                            : 'cursor-not-allowed opacity-50'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.id
                        )}
                      </button>
                      <div className="mt-2 text-center">
                        <p
                          className={`text-sm font-medium ${
                            isCompleted || isCurrent
                              ? 'text-white'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] hover:brightness-85 hover:backdrop-blur-sm'
                            : 'bg-gray-600'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                {steps[currentStep - 1].title}
              </CardTitle>
              <p className="text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={vendorData.name}
                      onChange={(e) => updateVendorData('name', e.target.value)}
                      onBlur={() => handleFieldBlur('name')}
                      placeholder="Enter your full name"
                      className={`mt-1 ${
                        fieldErrors.name
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <FieldError field="name" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={vendorData.email}
                        onChange={(e) =>
                          updateVendorData('email', e.target.value)
                        }
                        onBlur={() => handleFieldBlur('email')}
                        placeholder="your@email.com"
                        className={`mt-1 ${
                          fieldErrors.email
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      <FieldError field="email" />
                    </div>
                    <div>
                      <Label htmlFor="phone_number" className="text-gray-700">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone_number"
                        value={vendorData.phone_number}
                        onChange={(e) =>
                          updateVendorData('phone_number', e.target.value)
                        }
                        placeholder="2519XXXXXXXX or 2517XXXXXXXX"
                        className={`mt-1 ${
                          fieldErrors.phone_number
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      <FieldError field="phone_number" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password" className="text-gray-700">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={vendorData.password}
                        onChange={(e) =>
                          updateVendorData('password', e.target.value)
                        }
                        placeholder="Enter password"
                        className={`mt-1 ${
                          fieldErrors.password
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      <FieldError field="password" />
                    </div>
                    <div>
                      <Label
                        htmlFor="password_confirmation"
                        className="text-gray-700"
                      >
                        Confirm Password *
                      </Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={vendorData.password_confirmation}
                        onChange={(e) =>
                          updateVendorData(
                            'password_confirmation',
                            e.target.value
                          )
                        }
                        placeholder="Confirm password"
                        className={`mt-1 ${
                          fieldErrors.password_confirmation
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      <FieldError field="password_confirmation" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="business_name" className="text-gray-700">
                      Business Name *
                    </Label>
                    <Input
                      id="business_name"
                      value={vendorData.business_name}
                      onChange={(e) =>
                        updateVendorData('business_name', e.target.value)
                      }
                      onBlur={() => handleFieldBlur('business_name')}
                      placeholder="Enter your business name"
                      className={`mt-1 ${
                        fieldErrors.business_name
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <FieldError field="business_name" />
                  </div>

                  <div>
                    <Label htmlFor="business_type" className="text-gray-700">
                      Business Type *
                    </Label>
                    <Select
                      value={vendorData.business_type}
                      onValueChange={(value) =>
                        updateVendorData('business_type', value)
                      }
                    >
                      <SelectTrigger
                        className={`mt-1 ${
                          fieldErrors.business_type
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      >
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics & Gadgets">
                          Electronics & Gadgets
                        </SelectItem>
                        <SelectItem value="Clothing & Fashion">
                          Clothing & Fashion
                        </SelectItem>
                        <SelectItem value="Beauty & Personal Care">
                          Beauty & Personal Care
                        </SelectItem>
                        <SelectItem value="Books & Stationery">
                          Books & Stationery
                        </SelectItem>
                        <SelectItem value="Restaurants & Food">
                          Restaurants & Food
                        </SelectItem>
                        <SelectItem value="Auto & Spare Parts">
                          Auto & Spare Parts
                        </SelectItem>
                        <SelectItem value="Other Products">
                          Other Products
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError field="business_type" />
                  </div>

                  <div>
                    <Label
                      htmlFor="business_description"
                      className="text-gray-700"
                    >
                      Business Description *
                    </Label>
                    <Textarea
                      id="business_description"
                      value={vendorData.business_description}
                      onChange={(e) =>
                        updateVendorData('business_description', e.target.value)
                      }
                      placeholder="Describe your business and what you sell"
                      className={`mt-1 ${
                        fieldErrors.business_description
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                      rows={3}
                    />
                    <FieldError field="business_description" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business_email" className="text-gray-700">
                        Business Email *
                      </Label>
                      <Input
                        id="business_email"
                        type="email"
                        value={vendorData.business_email}
                        onChange={(e) =>
                          updateVendorData('business_email', e.target.value)
                        }
                        onBlur={() => handleFieldBlur('business_email')}
                        placeholder="business@example.com"
                        className={`mt-1 ${
                          fieldErrors.business_email
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      <FieldError field="business_email" />
                    </div>
                    <div>
                      <Label htmlFor="business_phone" className="text-gray-700">
                        Business Phone *
                      </Label>
                      <Input
                        id="business_phone"
                        value={vendorData.business_phone}
                        onChange={(e) =>
                          updateVendorData('business_phone', e.target.value)
                        }
                        placeholder="2519XXXXXXXX or 2517XXXXXXXX"
                        className={`mt-1 ${
                          fieldErrors.business_phone
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      <FieldError field="business_phone" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="business_address" className="text-gray-700">
                      Business Address *
                    </Label>
                    <Textarea
                      id="business_address"
                      value={vendorData.business_address}
                      onChange={(e) =>
                        updateVendorData('business_address', e.target.value)
                      }
                      placeholder="Enter complete business address"
                      className={`mt-1 ${
                        fieldErrors.business_address
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                      rows={2}
                    />
                    <FieldError field="business_address" />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tin_number" className="text-gray-700">
                      TIN Number *
                    </Label>
                    <Input
                      id="tin_number"
                      value={vendorData.tin_number}
                      onChange={(e) =>
                        updateVendorData('tin_number', e.target.value)
                      }
                      placeholder="Enter TIN number"
                      className={`mt-1 ${
                        fieldErrors.tin_number
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <FieldError field="tin_number" />
                  </div>

                  <div>
                    <Label
                      htmlFor="trade_license_number"
                      className="text-gray-700"
                    >
                      Trade License Number *
                    </Label>
                    <Input
                      id="trade_license_number"
                      value={vendorData.trade_license_number}
                      onChange={(e) =>
                        updateVendorData('trade_license_number', e.target.value)
                      }
                      placeholder="Enter trade license number"
                      className={`mt-1 ${
                        fieldErrors.trade_license_number
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <FieldError field="trade_license_number" />
                  </div>

                  <div>
                    <Label htmlFor="tax_id" className="text-gray-700">
                      Tax ID *
                    </Label>
                    <Input
                      id="tax_id"
                      value={vendorData.tax_id}
                      onChange={(e) =>
                        updateVendorData('tax_id', e.target.value)
                      }
                      placeholder="Enter tax ID"
                      className={`mt-1 ${
                        fieldErrors.tax_id
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <FieldError field="tax_id" />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="trade_license_doc"
                      className="text-gray-700"
                    >
                      Trade License Document *
                    </Label>
                    <Input
                      id="trade_license_doc"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updateVendorData('trade_license_doc', file as any);
                      }}
                      className={`mt-1 ${
                        fieldErrors.trade_license_doc
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <FieldError field="trade_license_doc" />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload your trade license document (PDF, JPG, PNG)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="id_card_doc" className="text-gray-700">
                      ID Card Document *
                    </Label>
                    <Input
                      id="id_card_doc"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updateVendorData('id_card_doc', file as any);
                      }}
                      className={`mt-1 ${
                        fieldErrors.id_card_doc
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <FieldError field="id_card_doc" />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload your ID card document (PDF, JPG, PNG)
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">
                      Review Your Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Personal Information
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Name:</span>{' '}
                            {vendorData.name}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{' '}
                            {vendorData.email}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{' '}
                            {vendorData.phone_number}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Business Information
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Business Name:</span>{' '}
                            {vendorData.business_name}
                          </p>
                          <p>
                            <span className="font-medium">Business Type:</span>{' '}
                            {vendorData.business_type}
                          </p>
                          <p>
                            <span className="font-medium">Business Email:</span>{' '}
                            {vendorData.business_email}
                          </p>
                          <p>
                            <span className="font-medium">Business Phone:</span>{' '}
                            {vendorData.business_phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Legal & Tax Information
                      </h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">TIN Number:</span>{' '}
                          {vendorData.tin_number}
                        </p>
                        <p>
                          <span className="font-medium">
                            Trade License Number:
                          </span>{' '}
                          {vendorData.trade_license_number}
                        </p>
                        <p>
                          <span className="font-medium">Tax ID:</span>{' '}
                          {vendorData.tax_id}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Documents
                      </h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">Trade License:</span>{' '}
                          {vendorData.trade_license_doc
                            ? vendorData.trade_license_doc.name
                            : 'Not uploaded'}
                        </p>
                        <p>
                          <span className="font-medium">ID Card:</span>{' '}
                          {vendorData.id_card_doc
                            ? vendorData.id_card_doc.name
                            : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep < 5 ? (
                  <Button
                    onClick={nextStep}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer
        className="border-t border-gray-800 py-16 px-4"
        style={{ backgroundColor: '#171717' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center">
                <img src="/e2-logo.png" alt="e2 Logo" className="h-8 w-auto" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering businesses to reach millions of customers and scale
                their operations to build successful online businesses with our
                powerful e-commerce platform.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={goHome}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      goHome();
                      setTimeout(() => scrollToSection('features'), 100);
                    }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      goHome();
                      setTimeout(() => scrollToSection('pricing'), 100);
                    }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>contact@e2.net</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+251 97 943 4331</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 e2 Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
