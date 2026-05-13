import { ChevronLeft, Play, MoreHorizontal, Disc3 } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { getAlbums } from './services/albums';
import { Album } from './types';

type SortKey = 'Нещодавні' | 'Назва' | 'Артист';

export default function LibraryAlbums() {
  const [sort, setSort] = useState<SortKey>('Нещодавні');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sorts: SortKey[] = ['Нещодавні', 'Назва', 'Артист'];

  useEffect(() => {
    let isMounted = true;

    async function loadAlbums() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAlbums();
        if (isMounted) {
          setAlbums(response);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити альбоми');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAlbums();

    return () => {
      isMounted = false;
    };
  }, []);

  const sorted = [...albums].sort((a, b) => {
    if (sort === 'Назва') return a.title.localeCompare(b.title, 'uk');
    if (sort === 'Артист') return a.artistName.localeCompare(b.artistName, 'uk');
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-12">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Альбоми</h1>
          <div className="w-10 h-10" />
        </div>
      </div>

      <div className="px-4">
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {sorts.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                sort === s
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="text-[13px] text-gray-500 mb-4">
          {isLoading ? 'Завантаження...' : `${albums.length} альбомів`}
        </p>

        {error ? (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200 mb-4">
            {error}
          </div>
        ) : null}

        {!isLoading && sorted.length === 0 && !error ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              <Disc3 className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-white mb-0.5">Альбомів ще немає</p>
              <p className="text-[12px] text-gray-500">Запусти синхронізацію, щоб згрупувати треки за тегом Album</p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          {sorted.map((album) => (
            <Link to={`/library/albums/${encodeURIComponent(album.title)}`} key={album.id}>
              <div className="group cursor-pointer">
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-2 relative">
                  <ImageWithFallback
                    src={album.coverImageUrl ?? ''}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{album.title}</p>
                    <p className="text-[11px] text-gray-500 truncate">{album.artistName}</p>
                    <p className="text-[10px] text-gray-600">
                      {new Date(album.createdAt ?? Date.now()).getFullYear()} • {album.trackCount ?? 0} треків
                    </p>
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="h-8" />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
