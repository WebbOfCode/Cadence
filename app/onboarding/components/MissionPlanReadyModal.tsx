'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import NikeButton from '@/components/Nike/NikeButton';

interface MissionPlanReadyModalProps {
  isOpen: boolean;
  onViewPathways: () => void;
  onSkip: () => void;
}

export default function MissionPlanReadyModal({
  isOpen,
  onViewPathways,
  onSkip
}: MissionPlanReadyModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-none shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <CheckCircle size={48} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Your Mission Plan<br/>Is Ready!
            </h2>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <p className="text-gray-600 text-center font-medium">
              Would you like to view personalized career pathways based on your MOS now?
            </p>

            <p className="text-sm text-gray-500 text-center">
              Discover tailored transition options and job market insights for your military background.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-4">
              <NikeButton
                variant="primary"
                size="lg"
                onClick={onViewPathways}
                className="w-full"
              >
                View Career Pathways
                <ArrowRight className="ml-2 h-5 w-5" />
              </NikeButton>

              <button
                onClick={onSkip}
                className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-medium uppercase tracking-wider rounded-none hover:bg-gray-50 transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
