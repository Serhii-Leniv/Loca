import { ArrowLeft, Music2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { getMemoriesCarousel, type MemoryCarouselItemDto } from './services/memories';
import { getTrack } from './services/tracks';
import { useAudioStore } from './stores/audioStore';

export default function ListenerMemories() {
  const [items, setItems] = useState<MemoryCarouselItemDto[]>([]);
  const { setContextQueue } = useAudioStore();

  useEffect(() => {
    void (async () => {
      try {
        const data = await getMemoriesCarousel(50);
        setItems(data);
      } catch (err) {
        console.error('Failed to load memories:', err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Link to="/home" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[24px] font-semibold text-white">Спогади слухачів</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-4">
        {items.map((it) => (
          <div
            key={it.trackId}
            onClick={async () => {
              try {
                const track = await getTrack(it.trackId);
                await setContextQueue([track], 0);
              } catch (err) {
                console.error('Failed to play track from memory list:', err);
              }
            }}
            className="rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/20 p-4 backdrop-blur-sm hover:from-purple-900/30 hover:to-purple-950/30 transition-all duration-200 cursor-pointer"
          >
            <div className="flex gap-3 mb-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                <ImageWithFallback
                  src={it.coverImageUrl || ''}
                  alt={it.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-white mb-1">{it.title}</p>
                <p className="text-[12px] text-gray-400 mb-1">{it.artistName}</p>
                <p className="text-[11px] text-purple-400">{new Date(it.createdAt).toLocaleDateString()}</p>
              </div>
              <Music2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
            </div>
            <p className="text-[13px] text-gray-300 leading-relaxed">{it.memoryContent}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
