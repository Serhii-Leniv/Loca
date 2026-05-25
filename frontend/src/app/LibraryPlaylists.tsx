import { ChevronLeft, Plus, Play, MoreHorizontal, ListMusic } from 'lucide-react';
import { Link } from 'react-router';
import PlaylistCover from './components/PlaylistCover';
import { useEffect, useState } from 'react';
import { getPlaylists, type PlaylistResponseDto } from './services/playlists';

export default function LibraryPlaylists() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [playlists, setPlaylists] = useState<PlaylistResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await getPlaylists();
        if (!cancelled) setPlaylists(res);
      } catch (err) {
        console.error('Failed to load playlists', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Плейлисти</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === 'list' ? 'grid' : 'list')}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ListMusic className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Create playlist button */}
        <button className="w-full rounded-2xl bg-white/5 border border-dashed border-purple-500/40 p-4 flex items-center gap-4 hover:bg-purple-500/5 transition-all duration-200 mb-6 group">
          <div className="w-14 h-14 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
            <Plus className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-medium text-white">Створити плейлист</p>
            <p className="text-[12px] text-gray-500">Зберігай улюблені треки разом</p>
          </div>
        </button>

        {/* Count */}
        <p className="text-[13px] text-gray-500 mb-4">{loading ? 'Завантаження…' : `${playlists.length} плейлистів`}</p>

        {/* List view */}
        {view === 'list' ? (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <Link
                to="/album"
                key={playlist.id}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 group"
              >
                <PlaylistCover coverImageUrls={playlist.coverImageUrls} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[14px] font-medium text-white truncate">{playlist.name}</p>

                  </div>
                  <p className="text-[12px] text-gray-400">
                    {playlist.trackCount} треків

                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-purple-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-purple-500/30"
                  >
                    <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Grid view */
          <div className="grid grid-cols-2 gap-4">
            {playlists.map((playlist) => (
              <Link to="/album" key={playlist.id}>
                <div className="group cursor-pointer">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-2">
                    <PlaylistCover coverImageUrls={playlist.coverImageUrls} sizeClass="w-full h-full" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white truncate">{playlist.name}</p>
                      <p className="text-[11px] text-gray-500">{playlist.trackCount} треків</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}
