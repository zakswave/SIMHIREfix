import React, { useState } from 'react';
import { Send, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApplicationModal from './ApplicationModal';

interface ApplyButtonProps {
  internship: {
    id: string;
    position: string;
    company: {
      name: string;
      logo?: string;
    };
    location: string;
    salary?: string;
    isPaid: boolean;
  };
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
  isApplied?: boolean;
  onApplicationSubmit?: (internshipId: string) => void;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({
  internship,
  size = 'default',
  variant = 'default',
  className = '',
  disabled = false,
  isApplied = false,
  onApplicationSubmit
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!disabled && !isApplied) {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const getButtonContent = () => {
    if (isApplied) {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Sudah Melamar
        </>
      );
    }

    if (isHovered) {
      return (
        <>
          <ArrowRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
          Lamar Sekarang
        </>
      );
    }

    return (
      <>
        <Send className="w-4 h-4 mr-2" />
        Apply Now
      </>
    );
  };

  const getButtonVariant = () => {
    if (isApplied) return 'outline';
    return variant;
  };

  const getButtonClassName = () => {
    let baseClasses = `
      group relative overflow-hidden transition-all duration-300 ease-out
      focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none
      ${className}
    `;

    if (isApplied) {
      baseClasses += ' border-success text-success hover:bg-success/10';
    } else if (!disabled) {
      baseClasses += `
        btn-gradient hover:shadow-hover hover:-translate-y-0.5 
        active:translate-y-0 active:shadow-md
      `;
    }

    if (disabled) {
      baseClasses += ' opacity-50 cursor-not-allowed';
    }

    return baseClasses;
  };

  return (
    <>
      <Button
        size={size}
        variant={getButtonVariant()}
        className={getButtonClassName()}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={
          isApplied 
            ? `Sudah melamar untuk posisi ${internship.position} di ${internship.company.name}`
            : `Lamar untuk posisi ${internship.position} di ${internship.company.name}`
        }
        aria-describedby={`apply-button-description-${internship.id}`}
      >
        {}
        {!isApplied && !disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {}
        <span className="relative z-10 flex items-center font-medium">
          {getButtonContent()}
        </span>
      </Button>

      {}
      <span id={`apply-button-description-${internship.id}`} className="sr-only">
        {internship.isPaid && internship.salary 
          ? `Posisi berbayar dengan gaji ${internship.salary}` 
          : internship.isPaid 
            ? 'Posisi berbayar'
            : 'Posisi tidak berbayar'
        } di {internship.location}
      </span>

      {}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        internship={internship}
      />
    </>
  );
};

export default ApplyButton;
