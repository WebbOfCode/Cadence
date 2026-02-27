'use client';

import { Bug } from 'lucide-react';
import { useState } from 'react';
import BugReportModal from './BugReportModal';

export default function BugReportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Bug Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        aria-label="Report a bug"
        title="Report a bug"
      >
        <Bug size={24} />
      </button>

      {/* Bug Report Modal */}
      <BugReportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
