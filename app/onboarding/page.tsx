"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface VendorData {
  // Step 1: Business Information
  businessName: string
  businessType: string
  businessDescription: string
  businessEmail: string
  businessPhone: string

  // Step 2: Address Information
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string

  // Step 3: Additional Details
  website: string
  taxId: string
  bankAccount: string
  preferredCategories: string[]
}

const steps = [
  { id: 1, title: "Business Information", description: "Tell us about your business" },
  { id: 2, title: "Address Details", description: "Where is your business located?" },
  { id: 3, title: "Additional Information", description: "Complete your profile" },
  { id: 4, title: "Review & Submit", description: "Review your information" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vendorData, setVendorData] = useState<VendorData>({
    businessName: "",
    businessType: "",
    businessDescription: "",
    businessEmail: "",
    businessPhone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    website: "",
    taxId: "",
    bankAccount: "",
    preferredCategories: [],
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const updateVendorData = (field: keyof VendorData, value: string | string[]) => {
    setVendorData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          vendorData.businessName &&
          vendorData.businessType &&
          vendorData.businessDescription &&
          vendorData.businessEmail &&
          vendorData.businessPhone
        )
      case 2:
        return !!(
          vendorData.streetAddress &&
          vendorData.city &&
          vendorData.state &&
          vendorData.postalCode &&
          vendorData.country
        )
      case 3:
        return !!(vendorData.taxId && vendorData.bankAccount)
      default:
        return true
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1)
        setError(null)
      } else {
        setError("Please fill in all required fields before proceeding.")
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError("Please fill in all required fields.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post("/api/vendor-onboarding", vendorData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      })

      console.log("Submission successful:", response.data)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting application:", error)

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          setError(error.response.data?.message || "Failed to submit application. Please try again.")
        } else if (error.request) {
          // Request was made but no response received
          setError("Network error. Please check your connection and try again.")
        } else {
          // Something else happened
          setError("An unexpected error occurred. Please try again.")
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const goHome = () => {
    router.push("/")
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen text-white" style={{ backgroundColor: "#171717" }}>
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? "bg-black/80 backdrop-blur-sm" : ""
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 py-2">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <img src="/e2-logo.png" alt="e2 Logo" className="h-8 w-auto" />
                <nav className="hidden md:flex items-center space-x-8">
                  <button onClick={goHome} className="text-white/80 hover:text-white transition-colors cursor-pointer">
                    Home
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <div className="pt-20 flex items-center justify-center p-4 min-h-screen">
          <Card className="max-w-2xl w-full bg-white">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Application Submitted Successfully!</CardTitle>
              <p className="text-gray-600 mt-2">
                Thank you for joining e2. Your vendor application has been received and is under review.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Application Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Business Name:</p>
                    <p className="text-gray-600">{vendorData.businessName}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Business Type:</p>
                    <p className="text-gray-600">{vendorData.businessType}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Email:</p>
                    <p className="text-gray-600">{vendorData.businessEmail}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Phone:</p>
                    <p className="text-gray-600">{vendorData.businessPhone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Location:</p>
                    <p className="text-gray-600">
                      {vendorData.city}, {vendorData.state}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Country:</p>
                    <p className="text-gray-600">{vendorData.country}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Our team will review your application within 2-3 business days</li>
                  <li>• You'll receive an email confirmation with next steps</li>
                  <li>• Once approved, you can start setting up your store</li>
                </ul>
              </div>

              <Button
                onClick={goHome}
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white py-3 cursor-pointer"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>

        <footer className="border-t border-gray-800 py-16 px-4" style={{ backgroundColor: "#171717" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center">
                  <img src="/e2-logo.png" alt="e2 Logo" className="h-8 w-auto" />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Empowering businesses to reach millions of customers and scale their operations with our powerful
                  e-commerce platform.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
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
                        goHome()
                        setTimeout(() => scrollToSection("features"), 100)
                      }}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        goHome()
                        setTimeout(() => scrollToSection("pricing"), 100)
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
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
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
                    <span>support@ee-platform.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2024 e/e Platform. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#171717" }}>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-sm" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <img src="/e2-logo.png" alt="e2 Logo" className="h-8 w-auto" />
              <nav className="hidden md:flex items-center space-x-8">
                <button onClick={goHome} className="text-white/80 hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
                <button
                  onClick={() => {
                    goHome()
                    setTimeout(() => scrollToSection("features"), 100)
                  }}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    goHome()
                    setTimeout(() => scrollToSection("pricing"), 100)
                  }}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button
                  onClick={() => {
                    goHome()
                    setTimeout(() => scrollToSection("faq"), 100)
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
                className="hidden md:flex items-center bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-lg px-8 py-6 font-medium transition-colors cursor-pointer"
                onClick={goHome}
              >
                Back to Home
              </Button>

              <button className="md:hidden p-2 text-white ml-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                    goHome()
                    setTimeout(() => scrollToSection("features"), 100)
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    goHome()
                    setTimeout(() => scrollToSection("pricing"), 100)
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button
                  onClick={() => {
                    goHome()
                    setTimeout(() => scrollToSection("faq"), 100)
                  }}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-lg px-8 py-6 text-lg font-semibold w-fit transition-colors cursor-pointer"
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
            <h1 className="text-3xl font-bold text-white mb-2">Vendor Onboarding</h1>
            <p className="text-gray-400">Join thousands of successful sellers on e2</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step.id
                          ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${currentStep >= step.id ? "text-white" : "text-gray-400"}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-gradient-to-r from-pink-500 to-blue-500" : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">{steps[currentStep - 1].title}</CardTitle>
              <p className="text-gray-600">{steps[currentStep - 1].description}</p>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName" className="text-gray-700">
                        Business Name *
                      </Label>
                      <Input
                        id="businessName"
                        value={vendorData.businessName}
                        onChange={(e) => updateVendorData("businessName", e.target.value)}
                        placeholder="Enter your business name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType" className="text-gray-700">
                        Business Type *
                      </Label>
                      <Select
                        value={vendorData.businessType}
                        onValueChange={(value) => updateVendorData("businessType", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessDescription" className="text-gray-700">
                      Business Description *
                    </Label>
                    <Textarea
                      id="businessDescription"
                      value={vendorData.businessDescription}
                      onChange={(e) => updateVendorData("businessDescription", e.target.value)}
                      placeholder="Describe your business and what you sell"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessEmail" className="text-gray-700">
                        Business Email *
                      </Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        value={vendorData.businessEmail}
                        onChange={(e) => updateVendorData("businessEmail", e.target.value)}
                        placeholder="business@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessPhone" className="text-gray-700">
                        Business Phone *
                      </Label>
                      <Input
                        id="businessPhone"
                        value={vendorData.businessPhone}
                        onChange={(e) => updateVendorData("businessPhone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="streetAddress" className="text-gray-700">
                      Street Address *
                    </Label>
                    <Input
                      id="streetAddress"
                      value={vendorData.streetAddress}
                      onChange={(e) => updateVendorData("streetAddress", e.target.value)}
                      placeholder="123 Main Street"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-700">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={vendorData.city}
                        onChange={(e) => updateVendorData("city", e.target.value)}
                        placeholder="New York"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-gray-700">
                        State/Province *
                      </Label>
                      <Input
                        id="state"
                        value={vendorData.state}
                        onChange={(e) => updateVendorData("state", e.target.value)}
                        placeholder="NY"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode" className="text-gray-700">
                        Postal Code *
                      </Label>
                      <Input
                        id="postalCode"
                        value={vendorData.postalCode}
                        onChange={(e) => updateVendorData("postalCode", e.target.value)}
                        placeholder="10001"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-gray-700">
                        Country *
                      </Label>
                      <Select value={vendorData.country} onValueChange={(value) => updateVendorData("country", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="website" className="text-gray-700">
                      Website (Optional)
                    </Label>
                    <Input
                      id="website"
                      value={vendorData.website}
                      onChange={(e) => updateVendorData("website", e.target.value)}
                      placeholder="https://www.yourbusiness.com"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taxId" className="text-gray-700">
                        Tax ID/EIN *
                      </Label>
                      <Input
                        id="taxId"
                        value={vendorData.taxId}
                        onChange={(e) => updateVendorData("taxId", e.target.value)}
                        placeholder="12-3456789"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankAccount" className="text-gray-700">
                        Bank Account (Last 4 digits) *
                      </Label>
                      <Input
                        id="bankAccount"
                        value={vendorData.bankAccount}
                        onChange={(e) => updateVendorData("bankAccount", e.target.value)}
                        placeholder="****1234"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700">Preferred Product Categories</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {["Electronics", "Fashion", "Home & Garden", "Sports", "Beauty", "Books"].map((category) => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={vendorData.preferredCategories.includes(category)}
                            onChange={(e) => {
                              const categories = e.target.checked
                                ? [...vendorData.preferredCategories, category]
                                : vendorData.preferredCategories.filter((c) => c !== category)
                              updateVendorData("preferredCategories", categories)
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Review Your Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Business Information</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Name:</span> {vendorData.businessName}
                          </p>
                          <p>
                            <span className="font-medium">Type:</span> {vendorData.businessType}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {vendorData.businessEmail}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span> {vendorData.businessPhone}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Address</h4>
                        <div className="space-y-1 text-sm">
                          <p>{vendorData.streetAddress}</p>
                          <p>
                            {vendorData.city}, {vendorData.state} {vendorData.postalCode}
                          </p>
                          <p>{vendorData.country}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Additional Details</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">Website:</span> {vendorData.website || "Not provided"}
                        </p>
                        <p>
                          <span className="font-medium">Tax ID:</span> {vendorData.taxId}
                        </p>
                        <p>
                          <span className="font-medium">Categories:</span>{" "}
                          {vendorData.preferredCategories.join(", ") || "None selected"}
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

                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="border-t border-gray-800 py-16 px-4" style={{ backgroundColor: "#171717" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center">
                <img src="/e2-logo.png" alt="e2 Logo" className="h-8 w-auto" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering businesses to reach millions of customers and scale their operations with our powerful
                e-commerce platform.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={goHome} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      goHome()
                      setTimeout(() => scrollToSection("features"), 100)
                    }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      goHome()
                      setTimeout(() => scrollToSection("pricing"), 100)
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
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
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
                  <span>support@ee-platform.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 e/e Platform. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
