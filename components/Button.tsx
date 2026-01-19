import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-medium transition-all duration-300 ease-out flex items-center justify-center gap-2 text-sm tracking-wide active:scale-95";
  
  const variants = {
    // Sage Green / Nature feel
    primary: "bg-[#9CAF88] hover:bg-[#8A9E75] text-white shadow-[0_4px_14px_rgba(156,175,136,0.4)] hover:shadow-[0_6px_20px_rgba(156,175,136,0.6)] hover:-translate-y-0.5",
    
    // Soft Clay / Warmth
    secondary: "bg-[#E6B8A2] hover:bg-[#DCA68D] text-white shadow-[0_4px_14px_rgba(230,184,162,0.4)] hover:shadow-[0_6px_20px_rgba(230,184,162,0.6)] hover:-translate-y-0.5",
    
    // Clean outline
    outline: "border border-[#E5E0D8] text-[#6B6054] hover:border-[#9CAF88] hover:text-[#9CAF88] bg-transparent",
    
    // Subtle ghost
    ghost: "bg-transparent text-[#8C847C] hover:bg-[#F5F2ED] hover:text-[#5C554D]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};