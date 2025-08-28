'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StructuredData from '@/components/structured-data';
import {
  CheckCircle,
  TrendingUp,
  Mail,
  Phone,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ShoppingCart,
  Zap,
  Lock,
  Percent,
  CreditCard,
  UserRoundPlus,
  CircleDollarSign,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../components/ui/carousel';
import Image from 'next/image';

export default function VendorOnboardingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTemplateSet, setCurrentTemplateSet] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextTemplateSet = () => {
    setCurrentTemplateSet((prev) => (prev + 1) % templateSets.length);
  };

  const prevTemplateSet = () => {
    setCurrentTemplateSet(
      (prev) => (prev - 1 + templateSets.length) % templateSets.length
    );
  };

  const openPreview = (template: any) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const goToOnboarding = () => {
    window.location.href = '/onboarding';
  };

  const templateSets = [
    [
      {
        id: 1,
        name: 'Fashion Store',
        image:
          '/placeholder.svg?height=300&width=400&text=Fashion+Store+Template',
      },
      {
        id: 2,
        name: 'Electronics Shop',
        image:
          '/placeholder.svg?height=300&width=400&text=Electronics+Shop+Template',
      },
      {
        id: 3,
        name: 'Home & Garden',
        image:
          '/placeholder.svg?height=300&width=400&text=Home+Garden+Template',
      },
    ],
    [
      {
        id: 4,
        name: 'Beauty & Cosmetics',
        image:
          '/placeholder.svg?height=300&width=400&text=Beauty+Cosmetics+Template',
      },
      {
        id: 5,
        name: 'Sports & Fitness',
        image:
          '/placeholder.svg?height=300&width=400&text=Sports+Fitness+Template',
      },
      {
        id: 6,
        name: 'Books & Media',
        image:
          '/placeholder.svg?height=300&width=400&text=Books+Media+Template',
      },
    ],
  ];

  return (
    <div
      className="min-h-screen text-white relative"
      style={{ backgroundColor: '#171717' }}
    >
      <StructuredData />
      <div className="relative z-10">
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 max-sm:bg-black/80 max-sm:backdrop-blur-sm ${
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

                {/* Desktop Navigation - moved to left side */}
                <nav className="hidden md:flex items-center space-x-8">
                  {/* <button
                    onClick={() => scrollToSection('hero')}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button> */}
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </nav>
              </div>

              <div className="flex items-center">
                <Button
                  size="sm"
                  className="hidden md:flex items-center text-white bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm rounded-lg px-8 py-6 font-medium cursor-pointer"
                  onClick={goToOnboarding}
                >
                  Start Selling
                </Button>

                {/* Mobile Menu Button */}
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

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden py-4">
                <nav className="flex flex-col space-y-4">
                  {/* <button
                    onClick={() => scrollToSection('hero')}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button> */}
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                  <Button
                    size="sm"
                    className="text-white bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm rounded-lg px-8 py-6 text-lg font-semibold w-fit cursor-pointer"
                    onClick={goToOnboarding}
                  >
                    Start Selling
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </header>

        <section
          id="hero"
          className="relative pt-32 pb-40 px-4 min-h-screen flex items-center"
          style={{
            backgroundImage: `url('/e2-halftone-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="text-left">
                <div className="inline-block border-2 border-white/30 text-white px-4 py-2 rounded-full text-sm mb-6">
                  go digital
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Grow Your Business Online
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-xl">
                  Join thousands of Ethiopian entrepreneurs selling online.
                  Launch your digital store today with secure payments, reliable
                  delivery, and nationwide reach.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-start">
                  <Button
                    size="lg"
                    className="bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white hover:from-pink-600 hover:to-blue-600 rounded-lg px-12 py-8 text-lg font-semibold cursor-pointer"
                    onClick={goToOnboarding}
                  >
                    Start Selling
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-black rounded-lg px-12 py-8 text-lg font-semibold bg-transparent transition-colors cursor-pointer"
                    onClick={() => scrollToSection('how-it-works')}
                  >
                    See How It Works
                  </Button>
                </div>
              </div>

              {/* Right Column - 3D Laptop Mockup */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative transform rotate-12">
                  <img
                    src="/laptop-mockup.png"
                    alt="Ecommerce Dashboard Laptop"
                    className="w-full max-w-md h-auto"
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => scrollToSection('choose-template')}
                className="p-4 hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Scroll to templates section"
              >
                <img
                  src="/scroll-down-icon.png"
                  alt="Scroll down"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
        </section>

        {previewTemplate && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div
              className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              style={{ backgroundColor: '#171717' }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-2xl font-bold text-white">
                  {previewTemplate.name}
                </h3>
                <button
                  onClick={closePreview}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="p-6">
                <img
                  src={previewTemplate.image || '/placeholder.svg'}
                  alt={previewTemplate.name}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-6 flex gap-4 justify-center">
                  <Button
                    onClick={closePreview}
                    variant="outline"
                    className="px-8 bg-transparent text-white border-white hover:bg-white hover:text-black cursor-pointer"
                  >
                    Close Preview
                  </Button>
                  <Button className="bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white px-8 cursor-pointer">
                    Use This Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            backgroundColor: '#171717',
            position: 'relative',
          }}
          className="overflow-hidden"
        >
          <div
            style={{
              backgroundImage: `url('/Halftone 2.png')`,
              backgroundSize: '180%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'transparent',
              minHeight: '100vh',
              minWidth: '100vw',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              position: 'absolute',
              filter: 'brightness(6)',
              opacity: '.1',
            }}
          ></div>

          <section className="py-32 px-4 z-10 relative" id="choose-template">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-16 items-center">
                <div className="lg:col-span-2 text-left">
                  <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">
                    Built for Local Businesses
                  </h2>
                  <p className="text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
                    Choose from templates designed specifically for Ethiopian
                    businesses. Our platform supports payment methods and
                    delivery networks. Perfect for selling traditional crafts,
                    and modern goods.
                  </p>
                </div>

                <div className="lg:col-span-3 relative flex justify-center">
                  <Carousel>
                    <CarouselContent>
                      <CarouselItem>
                        <Image
                          src="/templates/screencapture-awrastore-template.png"
                          width={500}
                          height={500}
                          alt="Awrastore template"
                          className="w-auto mx-auto max-w-full max-h-[52rem] h-auto rounded-3xl"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <Image
                          src="/templates/screencapture-justgo22-template.png"
                          width={500}
                          height={500}
                          alt="Awrastore template"
                          className="w-auto mx-auto max-w-full max-h-[52rem] h-auto rounded-3xl"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <Image
                          src="/templates/screencapture-debonairs-template.png"
                          width={500}
                          height={500}
                          alt="Awrastore template"
                          className="w-auto mx-auto max-w-full max-h-[52rem] h-auto rounded-3xl"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <Image
                          src="/templates/screencapture-zemenstore-template.png"
                          width={500}
                          height={500}
                          alt="Awrastore template"
                          className="w-auto mx-auto max-w-full max-h-[52rem] h-auto rounded-3xl"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <Image
                          src="/templates/screencapture-spareparts-template.png"
                          width={500}
                          height={500}
                          alt="Awrastore template"
                          className="w-auto mx-auto max-w-full max-h-[52rem] h-auto rounded-3xl"
                        />
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                  {/* <img
                    src="/template-showcase.png"
                    alt="Multiple ecommerce store templates showcasing various products and layouts"
                    className="w-full max-w-6xl h-auto"
                  /> */}
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="py-20 px-4 z-10 relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  How it works?
                </h2>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-6 relative">
                    <span className="bg-white p-4 rounded-full font-bold text-2xl">
                      <UserRoundPlus className="h-6 w-6 text-pink-500 mx-auto" />
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Create Account
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Sign up and set up your vendor profile in minutes
                  </p>
                </div>

                {/* Connection Line 1 */}
                <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 relative">
                    <span className="bg-white p-4 rounded-full font-bold text-2xl">
                      <ShoppingCart className="h-6 w-6 text-purple-500 mx-auto" />
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Add Your Items
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Upload your products with photos and descriptions
                  </p>
                </div>

                {/* Connection Line 2 */}
                <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 relative">
                    <span className="bg-white p-4 rounded-full font-bold text-2xl">
                      <CircleDollarSign className="h-6 w-6 text-blue-500 mx-auto" />
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Start Selling
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Launch your store and start earning money
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="py-20 px-4 z-10 relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  Features
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Why Choose e2?
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="text-white py-16 px-8 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <CardContent className="text-left px-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-8">
                      <TrendingUp className="h-6 w-6 text-pink-500 mx-auto" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-1">
                      Web Portal
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Manage your entire business from our intuitive web portal
                      with real-time analytics and insights.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-white py-16 px-8 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <CardContent className="text-left px-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-8">
                      <ShoppingCart className="h-6 w-6 text-purple-500 mx-auto" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-1">
                      Stock Management
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Keep track of your inventory with automated stock
                      management and low-stock alerts.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-white py-16 px-8 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <CardContent className="text-left px-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-8">
                      <Zap className="h-6 w-6 text-blue-500 mx-auto" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-1">
                      Easy to Use
                    </h3>
                    <p className="text-gray-300 text-sm">
                      User-friendly interface designed for sellers of all
                      experience levels. Get started in minutes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-white py-16 px-8 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <CardContent className="text-left px-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-8">
                      <Lock className="h-6 w-6 text-pink-500 mx-auto" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-1">
                      Fast & Secure Service
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Enterprise-grade security with fast loading times and
                      99.9% uptime guarantee.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-white py-16 px-8 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <CardContent className="text-left px-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-8">
                      <Percent className="h-6 w-6 text-purple-500 mx-auto" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-1">
                      Discount and Coupons
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Create promotional campaigns with flexible discount codes
                      and coupon systems.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-white py-16 px-8 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <CardContent className="text-left px-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-8">
                      <CreditCard className="h-6 w-6 text-blue-500 mx-auto" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-1">
                      Easy Checkout
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Streamlined checkout process with multiple payment options
                      to maximize conversions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section id="pricing" className="py-20 px-4 z-10 relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  Packages
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Affordable pricing for Ethiopian businesses. Start your online
                  business today!
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card
                  className="border border-pink-500 text-white px-4 py-8 rounded-2xl relative backdrop-blur-lg min-h-[525px] flex flex-col justify-center"
                  style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                >
                  <CardHeader className="text-center">
                    <h3 className="text-white text-xl font-semibold mb-4">
                      Starter Plan
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        25,000
                      </span>
                      <span className="text-gray-400 ml-2 text-lg">ETB</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Advanced Administrator Dashboard
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Vendor Management
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        User and Data Notification
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Multiple Payment Gateway
                      </span>
                    </div>
                    <Button
                      onClick={goToOnboarding}
                      className="w-full mt-6 bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white py-6 px-12 text-lg font-semibold rounded-lg cursor-pointer"
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border border-gray-600 text-white px-4 py-8 rounded-2xl backdrop-blur-lg min-h-[525px] flex flex-col justify-center"
                  style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                >
                  <CardHeader className="text-center">
                    <h3 className="text-white text-xl font-semibold mb-4">
                      Professional Plan
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        40,000
                      </span>
                      <span className="text-gray-400 ml-2 text-lg">ETB</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Everything in Basic
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Advanced Analytics
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Priority Support
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Custom Branding
                      </span>
                    </div>
                    <Button
                      onClick={goToOnboarding}
                      className="w-full mt-6 bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white py-6 px-12 text-lg font-semibold rounded-lg cursor-pointer"
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border border-gray-600 text-white px-4 py-8 rounded-2xl backdrop-blur-lg min-h-[525px] flex flex-col justify-center"
                  style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                >
                  <CardHeader className="text-center">
                    <h3 className="text-white text-xl font-semibold mb-4">
                      Enterprise Plan
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        50,000
                      </span>
                      <span className="text-gray-400 ml-2 text-lg">ETB</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Everything in Standard
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        White Label Solution
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Dedicated Account Manager
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        Custom Integrations
                      </span>
                    </div>
                    <Button
                      onClick={goToOnboarding}
                      className="w-full mt-6 bg-[linear-gradient(61.93deg,#FF8E54_4.59%,#DA33D0_55.72%,#0C3DDE_106.85%)] transition hover:brightness-85 hover:backdrop-blur-sm text-white py-6 px-12 text-lg font-semibold rounded-lg cursor-pointer"
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Trusted by
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Join thousands of successful businesses that trust our
                  platform to power their growth
                </p>
              </div>

              <div className="flex justify-center items-center gap-12 flex-wrap">
                <img
                  src="/client-logo-1.png"
                  alt="Client logo"
                  className="h-12 w-auto opacity-70"
                />
                <img
                  src="/client-logo-2.png"
                  alt="Client logo"
                  className="h-12 w-auto opacity-70"
                />
              </div>
            </div>
          </section>

          <section className="py-20 px-4 z-10 relative" id="faq">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  About Us
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                  We are dedicated to empowering Ethiopian entrepreneurs and
                  businesses to thrive in the digital economy. Our platform is
                  built specifically for the Ethiopian market, supporting local
                  payment methods, delivery networks, and business practices.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* FAQ Item 1 */}
                <div className="text-white px-8 py-14 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <h3 className="text-xl font-semibold mb-4">
                    What is e2 Platform Ethiopia?
                  </h3>
                  <p className="text-sm">
                    e2 is Ethiopia's e-commerce platform designed specifically
                    for Ethiopian businesses. We help local entrepreneurs reach
                    customers.
                  </p>
                </div>

                {/* FAQ Item 2 */}
                <div className="text-white px-8 py-14 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <h3 className="text-xl font-semibold mb-4">
                    Why choose e2 for Ethiopian business?
                  </h3>
                  <p className="text-sm">
                    We support local delivery networks, and understand Ethiopian
                    business culture. Perfect for selling traditional crafts,
                    and modern goods.
                  </p>
                </div>

                {/* FAQ Item 3 */}
                <div className="text-white px-8 py-14 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <h3 className="text-xl font-semibold mb-4">
                    How do I start selling in Ethiopia?
                  </h3>
                  <p className="text-sm">
                    Create your vendor account, upload your products with
                    Ethiopian Birr pricing, set up delivery zones across
                    Ethiopian cities, and start reaching Ethiopian customers
                    immediately.
                  </p>
                </div>

                {/* FAQ Item 4 */}
                <div className="text-white px-8 py-14 rounded-3xl shadow-lg backdrop-blur-lg border border-slate-800 hover:bg-slate-800 bg-[#0000004d] transition">
                  <h3 className="text-xl font-semibold mb-4">
                    Do you support Ethiopian payment methods?
                  </h3>
                  <p className="text-sm">
                    Yes! We support all major Ethiopian payment methods
                    including mobile money, bank transfers, and cash on
                    delivery. Payments are processed in Ethiopian Birr with fast
                    payouts to Ethiopian bank accounts.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="border-t border-gray-800 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Company Info */}
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

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#hero"
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
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
                </ul>
              </div>

              {/* Contact Info */}
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
                  <div className="text-gray-400 text-xs mt-2">
                    Addis Ababa, Ethiopia
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
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
    </div>
  );
}
