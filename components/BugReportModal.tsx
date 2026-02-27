'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import NikeButton from './Nike/NikeButton';

interface FormData {
  description: string;
  pageUrl: string;
  email: string;
  screenshot?: File;
}

export default function BugReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    description: '',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get current page URL on mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      pageUrl: window.location.href
    }));
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      };

      modalRef.current.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        modalRef.current?.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      alert('Please describe the bug');
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, integrate with EmailJS
      // For now, send to a simple backend endpoint or use Formspree
      const response = await fetch('/api/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          pageUrl: formData.pageUrl,
          email: formData.email || 'help@demarickwebb.dev',
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
          setFormData({
            description: '',
            pageUrl: window.location.href,
            email: ''
          });
        }, 3000);
      } else {
        alert('Failed to submit bug report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting bug report:', error);
      alert('Error submitting bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0">
        <div
          ref={modalRef}
          role="dialog"
          aria-labelledby="bug-modal-title"
          aria-describedby="bug-modal-description"
          className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 id="bug-modal-title" className="text-xl font-black uppercase tracking-tight">
              Report a Bug
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p id="bug-modal-description" className="text-sm text-gray-600 mb-4">
                Help us improve by reporting any issues you encounter.
              </p>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What went wrong?"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Page URL Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Page URL
                </label>
                <input
                  type="text"
                  value={formData.pageUrl}
                  onChange={(e) => setFormData({ ...formData, pageUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium text-sm"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">Auto-filled, editable</p>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Screenshot (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFormData({ ...formData, screenshot: e.target.files[0] });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-gray-800"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="for follow-up"
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Bar */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-black font-bold uppercase tracking-wider text-sm transition-colors hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <NikeButton
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </NikeButton>
              </div>
            </form>
          ) : (
            // Success State
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Thank You!</h3>
              <p className="text-sm text-gray-600">
                Your bug report has been submitted. We'll review it and reach out if we need more information.
              </p>
              <p className="text-xs text-gray-500">Closing in a moment...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
