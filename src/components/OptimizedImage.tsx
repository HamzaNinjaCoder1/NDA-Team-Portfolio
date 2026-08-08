import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  webp?: string;
}

export function OptimizedImage({ webp, src, ...rest }: OptimizedImageProps) {
  if (!webp) return <img src={src} {...rest} />;
  return (
    <picture>
      <source type="image/webp" srcSet={webp} />
      <img src={src} {...rest} />
    </picture>
  );
}
