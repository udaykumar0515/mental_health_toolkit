import React from 'react';

interface MusicIconProps {
  size?: 'small' | 'large';
  className?: string;
}

const MusicIcon: React.FC<MusicIconProps> = ({ size = 'small', className }) => {
    const sizeClass = size === 'large' ? 'h-12 w-12' : 'h-6 w-6';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${sizeClass} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v9.75a2.25 2.25 0 002.25 2.25h9.75a2.25 2.25 0 002.25-2.25v-6.386z" />
        </svg>
    );
};

export default MusicIcon;