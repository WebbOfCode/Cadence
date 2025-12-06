import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getDaysUntilETS(etsDate: string): number {
  const today = new Date();
  const ets = new Date(etsDate);
  const diffTime = ets.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getGoalLabel(goal: string): string {
  const labels: Record<string, string> = {
    career: 'Career Transition',
    education: 'Education & Training',
    housing: 'Housing & Relocation',
    finance: 'Financial Planning',
    wellness: 'Health & Wellness',
  };
  return labels[goal] || goal;
}
