'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-full section-black py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8 text-white">
              Privacy<br/>Policy
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-2xl">
              Your data. Your rights. Your control.
            </p>
            <p className="text-gray-400 mt-6 font-medium">
              Last updated: February 28, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-full bg-white py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-16">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start gap-6 mb-6">
                <Shield className="w-12 h-12 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                    Our Commitment
                  </h2>
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    At Cadence, we believe your privacy is fundamental. This policy explains how we collect, use, and protect your information.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* What We Collect */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                Information We Collect
              </h2>
              <div className="space-y-6 text-lg text-gray-600 font-medium">
                <div>
                  <h3 className="font-black text-black mb-2 text-xl">Information You Provide</h3>
                  <p className="leading-relaxed">
                    When you create an account or use Cadence, you may provide:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
                    <li>Service details (branch, rank, MOS, ETS date)</li>
                    <li>Personal goals and career interests</li>
                    <li>Location and housing preferences</li>
                    <li>Contact information</li>
                    <li>Any information you voluntarily share with us</li>
                  </ul>
                </div>
                <div className="mt-8">
                  <h3 className="font-black text-black mb-2 text-xl">Information Collected Automatically</h3>
                  <p className="leading-relaxed">
                    We may collect:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
                    <li>Device information (type, OS, browser)</li>
                    <li>Usage data (pages visited, features used, time spent)</li>
                    <li>IP address and location data (approximate)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* How We Use */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                How We Use Your Data
              </h2>
              <div className="space-y-4 text-lg text-gray-600 font-medium">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Create and maintain your Cadence account</li>
                  <li>Generate personalized AI mission plans</li>
                  <li>Improve our platform and features</li>
                  <li>Communicate updates and support information</li>
                  <li>Analyze usage patterns to enhance the user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p className="mt-6 font-bold text-black">
                  We do not and will not sell, rent, or share your personal data with third parties for marketing purposes.
                </p>
              </div>
            </motion.div>

            {/* Never Share - Security Warning */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 text-red-600">
                Never Share Sensitive Information
              </h2>
              <p className="text-lg text-gray-600 font-medium mb-6">
                For your protection, Cadence will <span className="font-black text-black">never ask</span> you to provide:
              </p>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-600 font-medium ml-2 mb-6">
                <li>Social Security Numbers (SSN)</li>
                <li>Bank account or credit card numbers</li>
                <li>Passwords or security codes</li>
                <li>Driver's license or ID numbers</li>
                <li>Passport information</li>
                <li>Medical or disability records (full documents)</li>
              </ul>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                <span className="font-black text-black">If you encounter any request for this information, please report it immediately to </span><span className="font-black text-red-600">help@demarickwebb.dev</span><span className="font-black text-black">. It may be a phishing attempt.</span>
              </p>
            </motion.div>

            {/* Data Security */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                Data Security
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-600 font-medium ml-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure authentication protocols</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information (need-to-know basis)</li>
              </ul>
              <p className="text-lg text-gray-600 font-medium leading-relaxed mt-6">
                While we take security seriously, no system is completely risk-free. If you believe your data has been compromised, please contact us immediately.
              </p>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                Your Privacy Rights
              </h2>
              <p className="text-lg text-gray-600 font-medium mb-6">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-600 font-medium ml-2">
                <li><span className="font-black text-black">Access</span> your personal data</li>
                <li><span className="font-black text-black">Correct</span> inaccurate information</li>
                <li><span className="font-black text-black">Delete</span> your account and associated data</li>
                <li><span className="font-black text-black">Opt-out</span> of communications</li>
                <li><span className="font-black text-black">Export</span> your data in a portable format</li>
              </ul>
              <p className="text-lg text-gray-600 font-medium mt-6">
                To exercise any of these rights, contact us at <span className="font-black">help@demarickwebb.dev</span>
              </p>
            </motion.div>

            {/* Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                Cookies & Tracking
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-4">
                We use cookies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings in your browser, but some features may not work optimally without them.
              </p>
            </motion.div>

            {/* Third-Party Services */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                Third-Party Services
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                We may use trusted third-party services for hosting, analytics, and support. These partners are bound by confidentiality agreements and are not permitted to use your data for their own purposes.
              </p>
            </motion.div>

            {/* Children */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                Children's Privacy
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Cadence is not intended for users under 18 years old. We do not knowingly collect information from minors. If we discover we have collected data from a minor, we will delete it immediately.
              </p>
            </motion.div>

            {/* Changes to Policy */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                Changes to This Policy
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                We may update this policy from time to time. We'll notify you of significant changes via email or by posting a notice on our website. Your continued use of Cadence indicates acceptance of any changes.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-gray-200 pt-12 pb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
                Contact Us
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-4">
                If you have questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <a
                href="mailto:help@demarickwebb.dev"
                className="inline-flex items-center justify-center px-12 py-5 bg-black text-white font-bold uppercase tracking-wider rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                Contact Support
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
