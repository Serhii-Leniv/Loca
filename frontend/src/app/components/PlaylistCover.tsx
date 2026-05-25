import React from 'react';
import { Music2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Props = {
  coverImageUrls?: string[] | null;
  sizeClass?: string; // tailwind classes for size e.g. 'w-14 h-14'
};

export default function PlaylistCover({ coverImageUrls, sizeClass = 'w-14 h-14' }: Props) {
  const urls = (coverImageUrls ?? []).filter(Boolean);

  if (urls.length === 0) {
    return (
      <div className={`${sizeClass} rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400`}>
        <Music2 className="h-5 w-5" />
      </div>
    );
  }

  if (urls.length < 4) {
    return (
      <div className={`${sizeClass} rounded-xl overflow-hidden bg-white/10`}>
        <ImageWithFallback src={urls[0]} alt="playlist cover" className="w-full h-full object-cover" />
      </div>
    );
  }

  // 4 or more images: 2x2 grid
  return (
    <div className={`${sizeClass} rounded-xl overflow-hidden grid grid-cols-2 grid-rows-2 gap-0 bg-white/10`}>
      {urls.slice(0, 4).map((u, i) => (
        <div key={i} className="w-full h-full overflow-hidden">
          <ImageWithFallback src={u} alt={`cover-${i}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}
