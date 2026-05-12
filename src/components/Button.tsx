import React from 'react';
import './Button.css';

interface Props {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'function' | 'action' | 'equals';
  wide?: boolean;
}

const Button: React.FC<Props> = ({ label, onClick, variant = 'number', wide = false }) => {
  return (
    <button
      className={`btn btn-${variant}${wide ? ' btn-wide' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
