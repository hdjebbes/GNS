import { useLanguage } from '../contexts/LanguageContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const { isRTL } = useLanguage();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} ${className}`}>
      <img
        src="/logo.png"
        alt="Global Nexus Logo"
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback si l'image n'existe pas encore
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      
      {showText && (
        <span className={`font-bold text-white ${textSizeClasses[size]} tracking-tight`}>
          GLOBAL NEXUS
        </span>
      )}
    </div>
  );
}

