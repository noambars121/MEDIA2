import React from 'react';

interface AvatarProps {
  src?: string | null;
  fallback?: string; // e.g., initials
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({
  src,
  fallback = '?',
  alt = 'User Avatar',
  className,
  size = 'md',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ${sizeClasses[size]} ${className ?? ''}`}
    >
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full" />
      ) : (
        <span className="font-medium text-muted-foreground">
          {fallback.substring(0, 1).toUpperCase()} {/* Show first initial */}
        </span>
      )}
    </div>
  );
} 