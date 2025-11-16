import React from 'react';

const MoodSadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-3.06 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10h.01M15 10h.01" />
    </svg>
);

export default MoodSadIcon;