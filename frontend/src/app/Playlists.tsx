import { ChevronLeft, Plus, Music, Play } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { getPlaylists, createPlaylist, type PlaylistResponseDto } from './services/playlists';
import PlaylistCover from './components/PlaylistCover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './components/ui/dialog';

export default function Playlists() {
  const [playlists, setPlaylists] = useState<PlaylistResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const res = await getPlaylists();
      setPlaylists(res);
    } catch (err) {
      console.error('Failed to load playlists', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    void loadPlaylists().then(() => {
      if (!cancelled) return;
    });
    return () => { cancelled = true; };
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      setIsCreating(true);
      await createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreateDialogOpen(false);
      await loadPlaylists();
    } catch (err) {
      console.error('Failed to create playlist', err);
    } finally {
      setIsCreating(false);
    }
  };

  const totalTracks = playlists.reduce((sum, p) => sum + p.trackCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[20px] font-semibold text-white">Мої плейлисти</h1>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors shadow-lg shadow-purple-500/30"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 mb-6">
        <div className="rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-950/20 border border-purple-500/20 p-4">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-[24px] font-bold text-white">{playlists.length}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Плейлистів</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[24px] font-bold text-white">{totalTracks}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Треків</p>
            </div>
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="px-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Завантаження плейлистів...</p>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">У вас немає плейлистів</p>
          </div>
        ) : (
          <div className="space-y-3">
            {playlists.map((playlist) => (
              <Link
                to={`/playlist/${playlist.id}`}
                key={playlist.id}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 group active:scale-[0.98]"
              >
                {/* Cover Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <PlaylistCover
                    coverImageUrls={playlist.coverImageUrls}
                    sizeClass="w-24 h-24"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Playlist Info */}
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-[16px] font-semibold text-white truncate mb-2">
                    {playlist.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <Music className="w-3 h-3" />
                    <span>{playlist.trackCount} треків</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create New Playlist Button */}
      {!loading && playlists.length > 0 && (
        <div className="px-4 mt-6">
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-950/40 border-2 border-dashed border-purple-500/40 p-6 flex flex-col items-center gap-3 hover:from-purple-900/60 hover:to-purple-950/60 hover:border-purple-500/60 transition-all duration-200 group"
          >
            <div className="w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
              <Plus className="w-7 h-7 text-purple-400" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-medium text-white mb-1">Створити новий плейлист</p>
              <p className="text-[12px] text-gray-400">Додай свої улюблені треки</p>
            </div>
          </button>
        </div>
      )}

      {/* Create Playlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Створити новий плейлист</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Назва плейліста"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleCreatePlaylist();
              }}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              autoFocus
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsCreateDialogOpen(false)}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              Скасувати
            </button>
            <button
              onClick={() => void handleCreatePlaylist()}
              disabled={!newPlaylistName.trim() || isCreating}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Створення...' : 'Створити'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
