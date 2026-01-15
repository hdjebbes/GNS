import { useState, useEffect, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  webpSrc?: string;
  alt: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({
  src,
  webpSrc,
  alt,
  fallbackSrc,
  loading = 'lazy',
  className = '',
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);

  // Check WebP support
  useEffect(() => {
    const checkWebP = () => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        setSupportsWebP(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };
    checkWebP();
  }, []);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    if (onError) {
      onError(e);
    }
  };

  // If image failed to load and we have a fallback, use it
  if (imageError && fallbackSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        {...props}
      />
    );
  }

  // If we know WebP is supported and have a WebP source, use it
  if (supportsWebP === true && webpSrc) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={src}
          alt={alt}
          className={className}
          loading={loading}
          onError={handleError}
          {...props}
        />
      </picture>
    );
  }

  // Default to original source
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      {...props}
    />
  );
}
