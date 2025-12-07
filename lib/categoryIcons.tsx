import { 
  FaClipboardList, 
  FaHeartbeat, 
  FaBriefcase, 
  FaGraduationCap, 
  FaHome, 
  FaDollarSign, 
  FaSpa 
} from 'react-icons/fa';

export type TaskCategory = 'admin' | 'healthcare' | 'career' | 'education' | 'housing' | 'finance' | 'wellness';

export const categoryIcons: Record<TaskCategory, { icon: React.ComponentType<{ className?: string }>, color: string }> = {
  admin: {
    icon: FaClipboardList,
    color: 'text-gray-600',
  },
  healthcare: {
    icon: FaHeartbeat,
    color: 'text-red-600',
  },
  career: {
    icon: FaBriefcase,
    color: 'text-blue-600',
  },
  education: {
    icon: FaGraduationCap,
    color: 'text-purple-600',
  },
  housing: {
    icon: FaHome,
    color: 'text-green-600',
  },
  finance: {
    icon: FaDollarSign,
    color: 'text-emerald-600',
  },
  wellness: {
    icon: FaSpa,
    color: 'text-pink-600',
  },
};

export function getCategoryIcon(category: TaskCategory) {
  return categoryIcons[category] || categoryIcons.admin;
}
