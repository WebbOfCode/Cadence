'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { NikeButton, NikeHeadline, NikeSection } from '@/components/Nike';

// Nike-inspired animation variants
const fadeUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function HomePage() {
  // Scroll reveal effect for fallback animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Full-Bleed Hero Section - Nike Style */}
      <section className="hero-section">
        <div className="hero-bg" style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))', 
          backgroundColor: '#111' 
        }}></div>
        <div className="hero-content">
          <motion.h1 
            className="hero-headline text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-8"
            {...fadeUp}
          >
            YOUR MISSION<br/>CONTINUES
          </motion.h1>
          <motion.p 
            className="hero-subheadline text-xl md:text-2xl font-medium text-white/90 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Transition from military to civilian life with confidence. AI-powered mission plans tailored to your service.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <Link
              href="/onboarding"
              className="btn-nike btn-nike-primary btn-nike-large"
            >
              Start Your Transition
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="btn-nike btn-nike-outline-white btn-nike-large"
            >
              View Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="marquee-text">Service to Service •</span>
          <span className="marquee-text">Service to Service •</span>
          <span className="marquee-text">Service to Service •</span>
          <span className="marquee-text">Service to Service •</span>
          <span className="marquee-text">Service to Service •</span>
          <span className="marquee-text">Service to Service •</span>
        </div>
      </div>

      {/* Founder Story Section - Nike Minimal */}
      <section className="section-full section-black">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              Veteran-Founded • Disability-Informed
            </p>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8 text-white">
              From Service<br/>to Service
            </h2>
            <div className="max-w-3xl text-lg md:text-xl font-medium text-gray-300 space-y-6">
              <p>
                As a service-disabled veteran who navigated the complex transition process myself, I created Cadence because I know the challenges you're facing.
              </p>
              <p>
                This tool isn't just code on a screen. It's built from real experience, late nights filling out VA forms, and countless conversations with fellow veterans trying to find their footing.
              </p>
              <p className="text-white font-semibold">
                Your service doesn't end when you take off the uniform.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Nike Asymmetric Grid */}
      <section className="section-full bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20"
          >
            <h2 className="headline-lg text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Built for<br/>Veterans
            </h2>
          </motion.div>

          {/* Asymmetric Grid - Desktop */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Large featured card - spans 7 cols, 2 rows */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-7 md:row-span-2 card-nike bg-gray-100 reveal"
            >
              <div className="aspect-[4/3] relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 z-10"></div>
                <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                  <p className="label-text text-white/70 mb-3">01</p>
                  <h3 className="text-3xl font-black uppercase tracking-tight">AI-Powered<br/>Mission Plans</h3>
                </div>
              </div>
            </motion.div>

            {/* Top right card */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="md:col-span-5 card-nike bg-gray-100 reveal"
            >
              <div className="aspect-square relative w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 z-10"></div>
                <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                  <p className="label-text text-white/70 mb-2">02</p>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Timeline-Based<br/>Tasks</h3>
                </div>
              </div>
            </motion.div>

            {/* Bottom right card */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="md:col-span-5 card-nike bg-gray-100 reveal"
            >
              <div className="aspect-square relative w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 z-10"></div>
                <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                  <p className="label-text text-white/70 mb-2">03</p>
                  <h3 className="text-2xl font-black uppercase tracking-tight">VA Benefits<br/>Integration</h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Horizontal Carousel */}
          <div className="md:hidden">
            <div className="carousel-container">
              {[
                {
                  num: '01',
                  title: "AI-Powered Mission Plans",
                  description: "Personalized transition checklists based on your branch, MOS, disability status, and goals"
                },
                {
                  num: '02',
                  title: "Timeline-Based Tasks",
                  description: "Automatically prioritized actions based on your ETS date and deadlines"
                },
                {
                  num: '03',
                  title: "VA Benefits Integration",
                  description: "Step-by-step guidance for healthcare, disability claims, and education benefits"
                },
                {
                  num: '04',
                  title: "Housing Finder",
                  description: "Veteran-friendly housing with disability accommodations"
                },
                {
                  num: '05',
                  title: "Local Resources",
                  description: "Connect with VA facilities and veteran services"
                },
                {
                  num: '06',
                  title: "Document Tracking",
                  description: "Keep transition paperwork organized and on schedule"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="carousel-item"
                >
                  <div className="card-nike h-full bg-gray-50">
                    <div className="card-nike-content">
                      <p className="label-text mb-4">{feature.num}</p>
                      <h3 className="card-nike-title text-xl mb-3 font-black">{feature.title}</h3>
                      <p className="text-sm font-medium text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section - Nike Minimal */}
      <section className="section-full bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="resources-grid"
          >
            <div className="reveal">
              <h2 className="headline-lg text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
                Comprehensive Resources
              </h2>
              <p className="text-lg font-medium text-gray-500 mb-8">
                <strong className="text-black">Transitioning from military service?</strong> Cadence provides free tools for veterans at every stage of their military-to-civilian transition.
              </p>
            </div>
            <div className="space-y-12 stagger-children">
              <div className="resource-category reveal">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Disability Claims</h3>
                <p className="text-lg font-medium text-gray-500">
                  Navigate the complex VA disability claims process with confidence. Get guidance on healthcare, disability ratings, and appeals.
                </p>
              </div>
              <div className="resource-category reveal">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Housing & Employment</h3>
                <p className="text-lg font-medium text-gray-500">
                  Find veteran-friendly housing with accessibility features. Connect with employers who value military experience.
                </p>
              </div>
              <div className="resource-category reveal">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Local Support</h3>
                <p className="text-lg font-medium text-gray-500">
                  Connect with VA medical centers, VSOs, and veteran support groups in your community.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Nike Bold */}
      <section className="relative bg-black text-white py-24 md:py-32 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white), linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="reveal"
          >
            <h2 className="headline-lg text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8">
              Your Next Mission<br/>Starts Here
            </h2>
            <p className="text-lg md:text-xl font-medium text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of veterans who have successfully navigated their transition.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Link
                href="/onboarding"
                className="px-10 py-5 bg-white text-black font-bold uppercase tracking-wider text-sm rounded-full hover:scale-105 transition-transform duration-300 flex items-center"
              >
                Get Started Now
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="px-10 py-5 border-2 border-white text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                View Dashboard
              </Link>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              No credit card required. Ever.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
