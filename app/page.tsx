'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Home, FileText, Shield, Clock, MapPin, Heart, User } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Your Mission Continues
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transition from military to civilian life with confidence. AI-powered mission plans tailored to your service, goals, and timeline—created by someone who's been there.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ backgroundColor: '#000000', color: '#ffffff' }}
              >
                Start Your Transition Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                <Heart className="h-4 w-4 text-red-600" />
                Veteran-founded • Disability-informed
              </div>
            </div>
            <div className="flex items-center justify-center mb-6">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              From Service to Service
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-4">
                As a service-disabled veteran who navigated the complex transition process myself, I created Cadence because I know the challenges you're facing. The paperwork, the uncertainty, the feeling of starting over—I've been there.
              </p>
              <p className="mb-4">
                This tool isn't just code on a screen. It's built from real experience, late nights filling out VA forms, and countless conversations with fellow veterans trying to find their footing in civilian life.
              </p>
              <p>
                Your service doesn't end when you take off the uniform. Let me help you plan your next mission with the same precision and purpose you brought to your military career.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Built for Veterans, by Those Who Understand
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every feature designed to address the unique challenges of military transition and disability navigation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "AI-Powered Mission Plans",
                description: "Personalized transition checklists based on your branch, MOS, disability status, and goals"
              },
              {
                icon: Clock,
                title: "Timeline-Based Tasks",
                description: "Automatically prioritized actions based on your ETS date, medical timeline, and deadlines"
              },
              {
                icon: Shield,
                title: "VA Benefits Integration",
                description: "Step-by-step guidance for healthcare, disability claims, education benefits, and compensation"
              },
              {
                icon: Home,
                title: "Housing Finder",
                description: "Veteran-friendly apartment and home search with filters for disability accommodations and vouchers"
              },
              {
                icon: MapPin,
                title: "Local Resources",
                description: "Connect with VA facilities, VSOs, and veteran services in your area"
              },
              {
                icon: FileText,
                title: "Document Tracking",
                description: "Keep all your transition paperwork, medical records, and claims organized and on schedule"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
              Comprehensive Veteran Transition Resources
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600 space-y-6">
              <p>
                <strong>Transitioning from military service?</strong> Cadence provides free tools for veterans at every stage of their military-to-civilian transition. Whether you're separating, retiring, or medically retiring, our AI-powered platform creates personalized transition plans tailored to your specific situation.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-8">Disability Claims & VA Benefits</h3>
              <p>
                Navigate the complex VA disability claims process with confidence. Our platform helps disabled veterans understand their benefits, file claims correctly, and track their disability compensation. Get guidance on VA healthcare, disability ratings, and appeals processes.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-8">Housing & Employment Resources</h3>
              <p>
                Find veteran-friendly housing options with accessibility features and voucher support. Connect with employers who value military experience. Access GI Bill benefits for education and training programs designed for veteran success.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-8">Local Veteran Support</h3>
              <p>
                Connect with VA medical centers, Veterans Service Organizations (VSOs), and local veteran support groups in your community. Get help with job searches, mental health resources, and family transition support.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-black text-white">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Your Next Mission Starts Here
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of veterans who have successfully navigated their transition with Cadence. Created by a service-disabled veteran who has walked this path.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
            >
              Get Started Now - It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              No credit card required. Ever.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
