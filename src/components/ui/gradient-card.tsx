import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GradientCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  delay?: number;
  onClick?: () => void;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
  delay = 0,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group`}
    >
      {}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-white/80 font-medium">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          {subtitle && (
            <p className="text-sm text-white/70">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
