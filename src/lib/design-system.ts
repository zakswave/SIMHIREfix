
export const DESIGN = {
  colors: {
    primary: 'primary-600',
    primaryHover: 'primary-700',
    primaryLight: 'primary-50',
    secondary: 'gray-600',
    accent: 'accent-blue',
    success: 'primary-500',
    warning: 'amber-500',
    danger: 'red-500',
    text: {
      primary: 'gray-900',
      secondary: 'gray-600',
      muted: 'gray-500'
    },
    bg: {
      primary: 'white',
      secondary: 'gray-50',
      hover: 'gray-50'
    }
  },
  typography: {
    heading: {
      h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
      h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
      h3: 'text-2xl md:text-3xl font-semibold',
      h4: 'text-xl md:text-2xl font-semibold',
      h5: 'text-lg md:text-xl font-semibold',
      h6: 'text-base md:text-lg font-semibold',
    },
    body: {
      large: 'text-lg md:text-xl',
      base: 'text-base',
      small: 'text-sm',
      tiny: 'text-xs',
    }
  },
  spacing: {
    section: 'py-16 md:py-20 lg:py-24',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    card: 'p-6',
    button: 'px-6 py-3',
    input: 'px-4 py-2.5',
  },
  radius: {
    card: 'rounded-card',
    button: 'rounded-button',
    input: 'rounded-input',
    full: 'rounded-full',
  },
  shadow: {
    card: 'shadow-card hover:shadow-card-hover',
    button: 'shadow-button',
    none: 'shadow-none',
  },
  button: {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-button shadow-button transition-all duration-200 hover:scale-105',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-6 py-3 rounded-button transition-all duration-200',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium px-6 py-3 rounded-button transition-all duration-200',
    ghost: 'text-gray-700 hover:bg-gray-100 font-medium px-4 py-2 rounded-button transition-all duration-200',
    icon: 'p-2.5 rounded-button hover:bg-gray-100 transition-all duration-200',
  },
  card: {
    default: 'bg-white border border-gray-200 rounded-card p-6 shadow-card transition-all duration-200',
    hover: 'bg-white border border-gray-200 rounded-card p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer hover:-translate-y-1',
    feature: 'bg-white border border-gray-200 rounded-card p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2',
  },
  input: {
    default: 'w-full px-4 py-2.5 border border-gray-300 rounded-input bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
    error: 'w-full px-4 py-2.5 border-2 border-red-500 rounded-input bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent',
  },
  badge: {
    primary: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800',
    secondary: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800',
    success: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800',
    warning: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800',
    danger: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800',
  },
  transition: {
    default: 'transition-all duration-200',
    slow: 'transition-all duration-300',
    fast: 'transition-all duration-150',
  },
  headerScrollThreshold: 50,
} as const;
export const getButtonClass = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon' = 'primary') => {
  return DESIGN.button[variant];
};

export const getCardClass = (variant: 'default' | 'hover' | 'feature' = 'default') => {
  return DESIGN.card[variant];
};

export const getBadgeClass = (variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary') => {
  return DESIGN.badge[variant];
};
