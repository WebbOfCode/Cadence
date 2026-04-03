'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, AlertTriangle, BookOpen, Phone, Globe, Users, Mail, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [expandedCadenceCards, setExpandedCadenceCards] = useState<Set<number>>(new Set());

  const toggleCadenceCard = (itemIdx: number) => {
    const newExpanded = new Set(expandedCadenceCards);
    if (newExpanded.has(itemIdx)) {
      newExpanded.delete(itemIdx);
    } else {
      newExpanded.add(itemIdx);
    }
    setExpandedCadenceCards(newExpanded);
  };

  const supportSections = [
    {
      title: 'Getting Help With Cadence',
      icon: MessageSquare,
      isAccordion: true,
      items: [
        {
          label: 'Dashboard Guide',
          shortDescription: 'Learn how to navigate your mission control center',
          fullDescription: 'Your Dashboard is your mission control center for your transition. After onboarding, start here to:\n\n• Navigate between Mission Plans, Benefits, Housing, and MOS sections\n• View and track your transition goals and deadlines\n• Monitor task completion and overall transition progress\n• Access your personalized transition plan recommendations\n\nThe dashboard shows your current phase of transition and highlights critical next steps. Use the sidebar to move between sections and the progress indicators to track your journey.',
        },
        {
          label: 'Transition Planning',
          shortDescription: 'Understand how Cadence builds your mission plan',
          fullDescription: 'Cadence creates a personalized transition plan based on your military background, goals, and timeline:\n\n• Build a Mission Plan: Define your civilian transition goals and set realistic deadlines\n• Set Priorities: Focus on what matters most—career, education, housing, or benefits\n• Track Progress: Monitor completed tasks and adjust your plan as needed\n• Structured Steps: Cadence recommends structured civilian transition steps based on your profile\n\nYour plan adapts as you complete tasks. Review and update it regularly to stay on track.',
        },
        {
          label: 'Account & Settings',
          shortDescription: 'Manage your profile and preferences',
          fullDescription: '⚠️ This feature is currently a work in progress.\n\nFuture features will include:\n\n• Profile Management: Edit your service information, branch, MOS, and ETS date\n• Transition Goals: Update your career and life transition goals anytime\n• Preferences: Customize notifications and communication preferences\n• Saved Progress: Store and resume your transition plan across sessions\n• Data Security: Manage how your information is stored and used\n\nWe\'re actively developing these features to give you full control over your transition data.',
        },
      ],
    },
    {
      title: 'Security & Private Data',
      icon: AlertTriangle,
      isAccordion: false,
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
      title: 'Benefits & Eligibility',
      icon: Globe,
      isAccordion: false,
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
      isAccordion: false,
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
      isAccordion: false,
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
                  {section.items.map((item, itemIdx) => {
                    // Accordion rendering for "Getting Help with Cadence"
                    if (section.isAccordion) {
                      const isExpanded = expandedCadenceCards.has(itemIdx);
                      return (
                        <motion.button
                          key={itemIdx}
                          variants={itemVariants}
                          onClick={() => toggleCadenceCard(itemIdx)}
                          className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-black hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-black">{item.label}</h3>
                              {!isExpanded && (
                                <p className="text-sm text-gray-600 mt-1">{item.shortDescription}</p>
                              )}
                            </div>
                            <ChevronDown
                              size={20}
                              className={`text-black flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </div>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{item.fullDescription}</p>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    }

                    // Static card rendering for other sections
                    return (
                      <motion.div
                        key={itemIdx}
                        variants={itemVariants}
                        className="p-4 rounded-lg border border-gray-200 hover:border-black hover:shadow-md transition-all"
                      >
                        <h3 className="font-semibold text-black mb-2">{item.label}</h3>
                        <p className="text-sm text-gray-700">{item.description}</p>
                      </motion.div>
                    );
                  })}
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

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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


    </div>
  );
}
