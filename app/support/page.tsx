'use client';

import { motion } from 'framer-motion';
import { MessageSquare, AlertTriangle, BookOpen, Phone, Globe, Users, Mail, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const supportSections = [
    {
      title: 'Getting Help With Cadence',
      icon: MessageSquare,
      items: [
        {
          label: 'Dashboard Guide',
          description: 'Learn how to use your mission control dashboard, track tasks, and manage your transition plan.',
        },
        {
          label: 'Transition Planning',
          description: 'Understand how Cadence generates your personalized transition plan and interprets the recommendations.',
        },
        {
          label: 'Account & Settings',
          description: 'Edit your profile, change your transition goals, and manage your personal information securely.',
        },
      ],
    },
    {
      title: 'Security & Private Data',
      icon: AlertTriangle,
      items: [
        {
          label: 'Never Share Sensitive Information',
          description: 'Do NOT enter SSN, bank account numbers, credit card info, date of birth, ID numbers, or passwords in any field.',
        },
        {
          label: 'Phishing Prevention',
          description: 'Cadence will never ask for passwords or sensitive data via email. Only enter information in secure forms on this site.',
        },
        {
          label: 'Data Storage',
          description: 'Your profile data is stored securely. We use industry-standard encryption and do not sell your data to third parties.',
        },
      ],
    },
    {
      title: 'Finding Local Resources',
      icon: Users,
      items: [
        {
          label: 'Support Groups & Services',
          description: 'Use our "Support Groups" tab at the top to find VA Vet Centers, Benefits Offices, and community resources by ZIP code.',
        },
        {
          label: 'VA Medical Centers',
          description: 'Locate your nearest VA Medical Center, VA benefits office, and Vet Center for healthcare and support services.',
        },
        {
          label: 'Veteran Service Organizations',
          description: 'Connect with VSOs like DAV, VFW, and American Legion who can help with benefits claims and document review.',
        },
      ],
    },
    {
      title: 'Benefits & Eligibility',
      icon: Globe,
      items: [
        {
          label: 'Understanding Your Eligibility',
          description: 'Your transition plan is based on your discharge type, branch, and service record. Consult a VSO for complex questions.',
        },
        {
          label: 'VA Benefits Portal',
          description: 'Create your VA.gov account to file claims, check benefits status, and enroll in healthcare.',
        },
        {
          label: 'Discharge Upgrades',
          description: 'If you have a non-honorable discharge, you may be eligible for a discharge upgrade review. Ask a VSO for help.',
        },
      ],
    },
    {
      title: 'Career & Education',
      icon: BookOpen,
      items: [
        {
          label: 'Military to Civilian Translation',
          description: 'Learn how to translate military experience into civilian job titles using Cadence\'s MOS translator tool.',
        },
        {
          label: 'GI Bill & Education',
          description: 'Explore education and training programs available through your GI Bill or other veteran benefits.',
        },
        {
          label: 'Job Search Resources',
          description: 'Access veteran-friendly job boards, federal hiring preferences, and career transition programs.',
        },
      ],
    },
    {
      title: 'Crisis Support',
      icon: Phone,
      items: [
        {
          label: 'Veterans Crisis Line',
          description: 'Call 988 then press 1 (24/7). Text 838255. Confidential crisis support for veterans.',
        },
        {
          label: 'Suicide & Crisis Lifeline',
          description: 'Call 988 (24/7) for mental health crisis support. Veterans get priority routing to specialized support.',
        },
        {
          label: 'VA Mental Health Services',
          description: 'All VA Medical Centers offer mental health services. No copay for service-connected disabilities. Call your local VA.',
        },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black text-white py-12 md:py-16"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Support & Resources</h1>
          <p className="text-lg text-gray-300">
            Help with Cadence, veteran benefits, and mental health support
          </p>
        </div>
      </motion.div>

      {/* Navigation to Support Groups */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 border-b border-gray-200 py-6 md:py-8"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-black mb-1">Find Local Resources</h2>
              <p className="text-sm text-gray-600">Search for VA facilities, Vet Centers, and veteran support groups near you</p>
            </div>
            <Link
              href="/support-groups"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase text-sm rounded-full hover:bg-gray-900 transition-colors"
            >
              <Users size={18} />
              Support Groups & Services
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {supportSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div className="flex gap-3 mb-6">
                  <Icon className="w-8 h-8 text-black flex-shrink-0 mt-0.5" />
                  <h2 className="text-2xl font-bold text-black">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="p-4 rounded-lg border border-gray-200 hover:border-black hover:shadow-md transition-all">
                      <h3 className="font-semibold text-black mb-2">{item.label}</h3>
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Links Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-200"
      >
        <motion.div variants={itemVariants} className="mb-10">
          <h2 className="text-3xl font-bold text-black mb-4">Official Veteran Resources</h2>
          <p className="text-lg text-gray-700 mb-8">
            Connect directly with official government and veteran organization resources.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {[
            {
              name: 'VA.gov',
              url: 'https://www.va.gov/',
              description: 'Official VA benefits, healthcare, and services portal',
            },
            {
              name: 'Veterans Crisis Line',
              url: 'tel:988',
              description: 'Call 988 then press 1 (24/7 crisis support)',
            },
            {
              name: 'military.com',
              url: 'https://www.military.com/',
              description: 'Veteran job board, forums, and resources',
            },
            {
              name: 'DAV (Disabled American Veterans)',
              url: 'https://www.dav.org/',
              description: 'Veteran service organization with benefits advocates',
            },
            {
              name: 'VFW (Veterans of Foreign Wars)',
              url: 'https://www.vfw.org/',
              description: 'Advocacy and local post support',
            },
            {
              name: 'American Legion',
              url: 'https://www.legion.org/',
              description: 'Community support and benefits assistance',
            },
          ].map((resource, idx) => (
            <motion.a
              key={idx}
              variants={itemVariants}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-lg border border-gray-200 hover:border-black hover:shadow-lg transition-all group"
            >
              <h3 className="font-bold text-black group-hover:underline mb-2">{resource.name}</h3>
              <p className="text-sm text-gray-600">{resource.description}</p>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Critical Information Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-6xl mx-auto px-4 md:px-6 py-12"
      >
        <div className="p-8 rounded-xl bg-red-50 border-2 border-red-300">
          <div className="flex gap-4">
            <AlertTriangle className="w-8 h-8 text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-3">Never Share Sensitive Information</h3>
              <p className="text-red-800 mb-4">
                Do NOT enter or share the following information anywhere on Cadence or any unfamiliar website:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-red-800 mb-4">
                {[
                  'Social Security Number (SSN)',
                  'Bank account or routing numbers',
                  'Credit card information',
                  'Date of birth',
                  'Military ID number',
                  'Passwords or PINs',
                  'Biometric data',
                  'Medical record numbers',
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </ul>
              <p className="text-red-800 font-semibold">
                Cadence stores only your name, branch, MOS, ETS date, and transition goals. We never ask for or store sensitive financial or medical data.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto px-4 md:px-6 py-12 border-t border-gray-200"
      >
        <h2 className="text-2xl font-bold text-black mb-8">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="mailto:help@demarickwebb.dev"
            className="p-6 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <div className="flex gap-3 mb-3">
              <Mail className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-lg">Email Support</h3>
            </div>
            <p className="text-sm mb-3">For detailed inquiries and support requests</p>
            <p className="font-bold">help@demarickwebb.dev</p>
          </a>

          <div className="p-6 rounded-lg border-2 border-gray-300">
            <div className="flex gap-3 mb-3">
              <HelpCircle className="w-6 h-6 flex-shrink-0 text-gray-700" />
              <h3 className="font-bold text-lg">Response Time</h3>
            </div>
            <p className="text-sm text-gray-700">
              We aim to respond to all inquiries within 24-48 hours during business days.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-6xl mx-auto px-4 md:px-6 py-8 border-t border-gray-200"
      >
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/privacy" className="text-black font-semibold hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-black font-semibold hover:underline">
            Terms of Service
          </Link>
          <Link href="/dashboard" className="text-black font-semibold hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
