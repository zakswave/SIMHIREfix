import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  gradient?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  gradient = 'from-primary-400 to-blue-400',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-6"
    >
      {}
      <div className="relative inline-block mb-6">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 blur-2xl rounded-full`}></div>
        <div className={`relative w-24 h-24 bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center mx-auto shadow-2xl`}>
          <Icon className="w-12 h-12 text-white" strokeWidth={1.5} />
        </div>
      </div>

      {}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>

      {}
      {action && (
        <Button
          onClick={action.onClick}
          size="lg"
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
};
