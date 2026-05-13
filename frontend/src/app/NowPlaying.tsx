import { Pause, Play, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ChevronsDown } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link, useInRouterContext, useLocation } from 'react-router';
import { useAudioStore } from './stores/audioStore';

function formatTime(seconds: number): string {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

type NowPlayingBoundaryProps = {
  children: ReactNode;
};

type NowPlayingBoundaryState = {
  hasError: boolean;
};

class NowPlayingErrorBoundary extends Component<NowPlayingBoundaryProps, NowPlayingBoundaryState> {
  constructor(props: NowPlayingBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): NowPlayingBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('NowPlaying render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function NowPlayingContent() {
  const { currentTrack, isPlaying, isRepeating, isShuffleEnabled, currentTime, duration, togglePlay, toggleRepeat, toggleShuffle, seek, setVolume, volume, playPrevious, playNext } = useAudioStore();
  const location = useLocation();
  const isFullScreen = location.pathname === '/now-playing';

  // If no track selected, show minimal empty state for full-screen, nothing for mini-bar.
  if (!currentTrack) {
    if (isFullScreen) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black/80 to-black/95 text-white">
          <div className="text-center space-y-4">
            <p className="text-2xl font-semibold">No track playing</p>
            <p className="text-sm text-gray-400">Start playing a track from Home or Library.</p>
            <div className="pt-3">
              <Link to="/home" className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500">Go to Home</Link>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  const trackTitle = currentTrack.title || 'Unknown track';
  const trackArtist = currentTrack.artistName || 'Unknown artist';
  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  // If rendered as the page route, show full-screen player
  if (isFullScreen) {
    const cover = currentTrack.coverImageUrl || 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080';

    return (
      <div className="fixed inset-0 z-[80]">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-105"
          style={{ backgroundImage: `url(${cover})` }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4 py-12">
          <Link to="/home" className="absolute left-4 top-6 rounded-full bg-black/40 p-2 backdrop-blur-sm">
            <ChevronsDown className="h-5 w-5 text-white" />
          </Link>

          <div className="flex flex-col items-center gap-8">
            <img
              src={cover}
              alt={`${trackTitle} cover`}
              className="w-72 h-72 rounded-2xl object-cover shadow-2xl"
            />

            <div className="text-center">
              <h2 className="text-3xl font-extrabold">{trackTitle}</h2>
              <p className="mt-1 text-lg text-gray-300">{trackArtist}</p>
            </div>

            <div className="w-[400px] max-w-[400px] mx-auto flex items-center justify-between gap-4 text-sm text-gray-300 tabular-nums">
                <div className="w-14 shrink-0 text-right">{formatTime(currentTime)}</div>

                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 0}
                  step={0.1}
                  value={duration > 0 ? currentTime : 0}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="flex-1"
                  aria-label="Seek track"
                />

                <div className="w-14 shrink-0 text-left">{formatTime(duration)}</div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6">
                <button onClick={toggleShuffle} className={`p-2 rounded transition-colors ${isShuffleEnabled ? 'bg-white/10 text-purple-300' : 'bg-transparent text-white'}`} aria-label="Shuffle">
                  <Shuffle className="h-6 w-6" />
                </button>

                <button onClick={playPrevious} className="p-2 rounded" aria-label="Previous">
                  <SkipBack className="h-8 w-8" />
                </button>

                <button
                  onClick={() => togglePlay()}
                  className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>

                <button onClick={playNext} className="p-2 rounded" aria-label="Next">
                  <SkipForward className="h-8 w-8" />
                </button>

                <button onClick={toggleRepeat} className={`p-2 rounded ${isRepeating ? 'bg-white/10 text-purple-300' : 'bg-transparent'}`} aria-label="Repeat">
                  <Repeat className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                <Volume2 className="h-5 w-5 text-gray-300" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-48"
                />
              </div>
            </div>
          </div>
      </div>
    );
  }

  // Otherwise render the small fixed bar (mini-player)
  return (
    <div className="fixed bottom-20 left-0 right-0 z-[90] px-3">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#121212]/95 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/now-playing" className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-white">{trackTitle}</p>
            <p className="truncate text-[12px] text-gray-400">{trackArtist}</p>
          </Link>

          <div className="text-[11px] text-gray-400 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <button
            onClick={togglePlay}
            className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors"
            aria-label={isPlaying ? 'Pause track' : 'Play track'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white fill-white" />
            ) : (
              <Play className="h-5 w-5 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>

        <button
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const percentage = (event.clientX - rect.left) / rect.width;
            seek(percentage * duration);
          }}
          className="block h-1.5 w-full overflow-hidden rounded-b-2xl bg-white/10"
          aria-label="Seek track"
        >
          <span
            className="block h-full bg-gradient-to-r from-purple-500 to-purple-400"
            style={{ width: `${progressPercent}%` }}
          />
        </button>
      </div>
    </div>
  );
}

export default function NowPlaying() {
  // Defensive guard in case this component is accidentally rendered outside RouterProvider.
  if (!useInRouterContext()) {
    return null;
  }

  return (
    <NowPlayingErrorBoundary>
      <NowPlayingContent />
    </NowPlayingErrorBoundary>
  );
}
