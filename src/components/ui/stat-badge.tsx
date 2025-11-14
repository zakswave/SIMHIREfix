import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  purple: 'from-purple-500 to-pink-500',
  orange: 'from-orange-500 to-red-500',
  pink: 'from-pink-500 to-rose-500',
  red: 'from-red-500 to-rose-600',
};

const sizeMap = {
  sm: { padding: 'p-3', icon: 'w-4 h-4', value: 'text-xl' },
  md: { padding: 'p-4', icon: 'w-5 h-5', value: 'text-2xl' },
  lg: { padding: 'p-6', icon: 'w-6 h-6', value: 'text-3xl' },
};

export const StatBadge: React.FC<StatBadgeProps> = ({
  icon: Icon,
  label,
  value,
  color = 'blue',
  size = 'md',
}) => {
  const gradient = colorMap[color];
  const sizing = sizeMap[size];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl ${sizing.padding} text-white shadow-xl`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={sizing.icon} />
        <span className="text-xs font-medium uppercase tracking-wide opacity-90">
          {label}
        </span>
      </div>
      <div className={`${sizing.value} font-bold`}>{value}</div>
    </motion.div>
  );
};
