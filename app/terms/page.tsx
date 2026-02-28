'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Shield, FileText, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: 'Agreement to Terms',
      icon: FileText,
      content: `By accessing and using Cadence ("Service"), you agree to be bound by these Terms of Service. If you do not agree to abide by the above, please do not use this Service.`,
    },
    {
      title: 'Use License',
      icon: Shield,
      content: `Permission is granted to temporarily download one copy of the materials (information or software) on Cadence for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

• Modify or copy the materials
• Use the materials for any commercial purpose or for any public display
• Attempt to decompile or reverse engineer any software contained on the Service
• Remove any copyright or other proprietary notations from the materials
• Transfer the materials to another person or "mirror" the materials on any other server
• Use the Service or its content for any unlawful purpose or in violation of any laws
• Attempt to gain unauthorized access to the Service`,
    },
    {
      title: 'Disclaimer',
      icon: AlertCircle,
      content: `The materials on Cadence are provided on an 'as is' basis. Cadence makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

Cadence does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on the Service, or otherwise relating to such materials or on any sites linked to this site.`,
    },
    {
      title: 'Information Accuracy',
      icon: HelpCircle,
      content: `Cadence provides general information about military transition, VA benefits, and veteran resources. While we strive for accuracy, the information provided should not be relied upon as legal, financial, or medical advice. Always consult with:

• The VA directly (VA.gov)
• A Veterans Service Officer (VSO) for benefits questions
• A licensed attorney for legal matters
• A financial advisor for financial planning
• A healthcare provider for medical guidance

The landscape of veteran benefits is complex and frequently changes. Cadence is designed to help you navigate these resources, not replace professional advisors.`,
    },
    {
      title: 'Limitations',
      icon: AlertCircle,
      content: `In no event shall Cadence or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Service, even if Cadence or an authorized representative has been notified orally or in writing of the possibility of such damage.`,
    },
    {
      title: 'Accuracy of Materials',
      icon: Shield,
      content: `The materials appearing on Cadence could include technical, typographical, or photographic errors. Cadence does not warrant that any of the materials on the Service are accurate, complete, or current. Cadence may make changes to the materials contained on the Service at any time without notice. However, Cadence does not commit to updating the materials.`,
    },
    {
      title: 'Links',
      icon: FileText,
      content: `Cadence has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Cadence of the site. Use of any such linked website is at the user's own risk.`,
    },
    {
      title: 'Modifications',
      icon: Shield,
      content: `Cadence may revise these terms of service for the Service at any time without notice. By using the Service, you agree to be bound by the then current version of these terms of service.`,
    },
    {
      title: 'Governing Law',
      icon: FileText,
      content: `These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts located in the United States.`,
    },
    {
      title: 'Veteran Support Resources',
      icon: HelpCircle,
      content: `If you're in crisis or need immediate support:

• Veterans Crisis Line: 988 then press 1 (24/7)
• Crisis Text Line: Text HOME to 741741
• Suicide & Crisis Lifeline: 988 (24/7)
• VA Emergency Services: Nearest VA Medical Center

Cadence is designed to complement, not replace, professional support services.`,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black text-white py-12 md:py-16"
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-300">
            Effective Date: February 28, 2026
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16"
      >
        <motion.div variants={itemVariants} className="mb-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-amber-900 mb-2">Important Disclaimer</h2>
              <p className="text-amber-800 text-sm">
                Cadence provides general information and guidance for military transition. We are not attorneys, financial advisors, or healthcare providers. Always consult with qualified professionals before making important decisions about your transition.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div className="flex gap-4 mb-3">
                  <Icon className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <h2 className="text-2xl font-bold text-black">{section.title}</h2>
                </div>
                <div className="ml-10 text-gray-700 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <h2 className="text-xl font-bold text-black mb-4">Questions?</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service or Cadence, please contact us or visit our support page.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/support"
              className="px-6 py-3 bg-black text-white font-bold uppercase text-sm rounded-full hover:bg-gray-900 transition-colors"
            >
              Get Support
            </a>
            <a
              href="/privacy"
              className="px-6 py-3 border-2 border-black text-black font-bold uppercase text-sm rounded-full hover:bg-black hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
