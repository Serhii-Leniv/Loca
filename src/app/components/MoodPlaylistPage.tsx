import { ChevronLeft, Play, Shuffle, MoreHorizontal, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export interface MoodTrack {
  id: number;
  title: string;
  artist: string;
  duration: string;
  hasLegend?: boolean;
}

export interface MoodPlaylistProps {
  name: string;
  subtitle: string;
  coverImage: string;
  gradientFrom: string;
  gradientTo: string;
  tracks: MoodTrack[];
  trackCount?: string;
}

export function MoodPlaylistPage({
  name,
  subtitle,
  coverImage,
  gradientFrom,
  gradientTo,
  tracks,
}: MoodPlaylistProps) {
  const [liked, setLiked] = useState(false);

  const totalMinutes = tracks.reduce((acc, t) => {
    const [m, s] = t.duration.split(':').map(Number);
    return acc + m + s / 60;
  }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);
  const durationLabel = hours > 0 ? `${hours} год ${mins} хв` : `${mins} хв`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-12">
      {/* Hero */}
      <div className="relative">
        {/* Cover */}
        <div
          className="relative h-[340px] w-full overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        >
          <ImageWithFallback
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

          {/* Back button */}
          <div className="absolute top-0 left-0 right-0 px-4 pt-12 pb-4 flex items-center">
            <Link to="/search" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
            <p className="text-[12px] text-white/70 uppercase tracking-widest font-medium mb-1">Плейлист настрою</p>
            <h1 className="text-[32px] font-bold text-white mb-1 leading-tight">{name}</h1>
            <p className="text-[14px] text-white/70">{subtitle}</p>
          </div>
        </div>

        {/* Meta + Actions */}
        <div className="px-5 pt-5 pb-4">
          <p className="text-[13px] text-gray-500 mb-5">
            {tracks.length} треків • {durationLabel}
          </p>
          <div className="flex items-center gap-3">
            <Link to="/now-playing" className="flex-1 h-13 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <Play className="w-5 h-5 text-white fill-white" />
              <span className="text-[15px] font-medium text-white">Відтворити</span>
            </Link>
            <button className="h-13 py-3.5 px-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-200">
              <Shuffle className="w-5 h-5 text-white" />
              <span className="text-[15px] font-medium text-white">Shuffle</span>
            </button>
            <button
              onClick={() => setLiked((v) => !v)}
              className="w-13 h-13 p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all duration-200"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${liked ? 'text-purple-400 fill-purple-400' : 'text-gray-400'}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="px-4">
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <Link to="/now-playing" key={track.id}>
              <button className="w-full rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 group">
                {/* Number */}
                <div className="w-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] text-gray-400 group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 text-purple-400 fill-purple-400 hidden group-hover:block" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-[14px] font-medium text-white truncate">{track.title}</p>
                    {track.hasLegend && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-900/40 border border-amber-500/30 text-[9px] text-amber-300 font-medium uppercase tracking-wide whitespace-nowrap flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Легенда
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-400 truncate">{track.artist}</p>
                </div>

                {/* Duration + more */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[12px] text-gray-400">{track.duration}</span>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
