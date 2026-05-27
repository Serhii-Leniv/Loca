import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Heart, Loader2, MapPin, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { getFeed, toggleTrackLike, type TrackResponseDto } from './services/tracks';
import { getProfile, updateLocation, updateProfile } from './services/users';
import { useAudioStore } from './stores/audioStore';
import CityPicker from './components/CityPicker';

const PAGE_SIZE = 10;

type FeedState = {
  tracks: TrackResponseDto[];
  hasMore: boolean;
  city: string | null;
  skip: number;
};

const emptyFeed: FeedState = { tracks: [], hasMore: false, city: null, skip: 0 };

export default function LocalArtistsFeed() {
  const [feed, setFeed] = useState<FeedState>(emptyFeed);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'denied' | 'unsupported' | 'resolved'>('idle');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingMoreRef = useRef(false);
  const feedRef = useRef(emptyFeed);

  const pauseGlobalAudio = useAudioStore((state) => state.pause);
  const syncGlobalLike = useAudioStore((state) => state.syncTrackLikeInContext);

  useEffect(() => {
    pauseGlobalAudio();
  }, [pauseGlobalAudio]);

  const loadInitialFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFeed({ limit: PAGE_SIZE, skip: 0 });
      const newFeed: FeedState = {
        tracks: response.tracks,
        hasMore: response.hasMore,
        city: response.city,
        skip: response.tracks.length,
      };
      feedRef.current = newFeed;
      setFeed(newFeed);
      setActiveIndex(0);
    } catch (err) {
      console.error('Failed to load feed', err);
      setError('Не вдалося завантажити стрічку');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current) return;
    const { hasMore, skip, city } = feedRef.current;
    if (!hasMore) return;
    loadingMoreRef.current = true;
    try {
      const response = await getFeed({ limit: PAGE_SIZE, skip });
      setFeed((prev) => {
        const newFeed: FeedState = {
          tracks: [...prev.tracks, ...response.tracks],
          hasMore: response.hasMore,
          city: response.city ?? city,
          skip: skip + response.tracks.length,
        };
        feedRef.current = newFeed;
        return newFeed;
      });
    } catch (err) {
      console.error('Failed to load more feed', err);
    } finally {
      loadingMoreRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadInitialFeed();
  }, [loadInitialFeed]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const profile = await getProfile();
        if (cancelled) return;
        if (profile.city) {
          setLocationStatus('resolved');
          return;
        }
        if (!('geolocation' in navigator)) {
          setLocationStatus('unsupported');
          setShowCityPicker(true);
          return;
        }
        setLocationStatus('requesting');
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const updated = await updateLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
              setLocationStatus('resolved');
              setFeed((prev) => ({ ...prev, city: updated.city ?? prev.city }));
              await loadInitialFeed();
            } catch {
              setLocationStatus('denied');
              setShowCityPicker(true);
            }
          },
          () => {
            setLocationStatus('denied');
            setShowCityPicker(true);
          },
          { timeout: 8000 },
        );
      } catch {
        // Ignore profile fetch errors - feed will still work
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadInitialFeed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const indexAttr = entry.target.getAttribute('data-index');
            if (indexAttr != null) {
              setActiveIndex(Number(indexAttr));
            }
          }
        }
      },
      { root: container, threshold: [0.6] },
    );

    slideRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [feed.tracks]);

  useEffect(() => {
    if (!feed.tracks.length) return;
    if (activeIndex >= feed.tracks.length - 3) {
      void loadMore();
    }
  }, [activeIndex, feed.tracks.length, loadMore]);

  const activeTrack = feed.tracks[activeIndex] ?? null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;

    const newSrc = activeTrack.streamUrl ?? '';
    if (audio.src !== newSrc) {
      audio.src = newSrc;
    }
    audio.muted = isMuted;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.warn('Feed autoplay blocked', err);
        }
        setIsPlaying(false);
      });

    return () => {
      audio.pause();
    };
  }, [activeTrack, isMuted]);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleLike = async (trackId: string) => {
    const previous = feed.tracks.find((t) => t.id === trackId)?.isLiked ?? false;
    setFeed((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, isLiked: !previous } : t)),
    }));
    try {
      const response = await toggleTrackLike(trackId);
      setFeed((prev) => ({
        ...prev,
        tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, isLiked: response.isLiked } : t)),
      }));
      syncGlobalLike(trackId, response.isLiked);
    } catch {
      setFeed((prev) => ({
        ...prev,
        tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, isLiked: previous } : t)),
      }));
    }
  };

  const handleManualCity = async (city: string) => {
    const profile = await getProfile();
    await updateProfile({ email: profile.email, city });
    setShowCityPicker(false);
    setLocationStatus('resolved');
    await loadInitialFeed();
  };

  const showEmptyState = !loading && !error && feed.tracks.length === 0;

  return (
    <div className="fixed inset-0 bg-black text-white">
      <audio ref={audioRef} preload="auto" playsInline />

      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-4 bg-gradient-to-b from-black/80 to-transparent">
        <Link to="/home" className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/15 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md">
          <MapPin className="w-4 h-4 text-purple-300" />
          <button
            type="button"
            onClick={() => setShowCityPicker(true)}
            className="text-xs font-medium text-white"
          >
            {feed.city ?? 'Оберіть місто'}
          </button>
        </div>
        <button
          type="button"
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/15 transition"
          aria-label={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </header>

      {loading ? (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-300" />
        </div>
      ) : error ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-sm text-gray-300 text-center">{error}</p>
          <button
            type="button"
            onClick={() => void loadInitialFeed()}
            className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-400 text-sm font-semibold"
          >
            Повторити
          </button>
        </div>
      ) : showEmptyState ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-sm text-gray-300 text-center">
            Поки немає треків{feed.city ? ` у місті ${feed.city}` : ''}. Спробуйте інше місто.
          </p>
          <CityPicker initialCity={feed.city ?? ''} onSubmit={handleManualCity} submitLabel="Знайти артистів" />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
          style={{ scrollSnapStop: 'always' }}
        >
          {feed.tracks.map((track, index) => (
            <FeedSlide
              key={track.id}
              registerRef={(node) => {
                slideRefs.current[index] = node;
              }}
              index={index}
              track={track}
              isActive={index === activeIndex}
              isPlaying={index === activeIndex && isPlaying}
              onToggleLike={() => void handleLike(track.id)}
              onTogglePlay={handleTogglePlay}
            />
          ))}
          {feed.hasMore ? (
            <div className="h-32 flex items-center justify-center snap-start">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : null}
        </div>
      )}

      {showCityPicker ? (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Оберіть ваше місто</h3>
            <CityPicker
              initialCity={feed.city ?? ''}
              onSubmit={handleManualCity}
              submitLabel="Зберегти"
            />
            <button
              type="button"
              onClick={() => setShowCityPicker(false)}
              className="w-full mt-4 text-xs text-gray-400 hover:text-gray-200"
            >
              Скасувати
            </button>
          </div>
        </div>
      ) : null}

      {locationStatus === 'requesting' ? (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs">
          Визначаємо ваше місто…
        </div>
      ) : null}
    </div>
  );
}

interface FeedSlideProps {
  index: number;
  track: TrackResponseDto;
  isActive: boolean;
  isPlaying: boolean;
  onToggleLike: () => void;
  onTogglePlay: () => void;
  registerRef: (node: HTMLDivElement | null) => void;
}

function FeedSlide({
  index,
  track,
  isActive,
  isPlaying,
  onToggleLike,
  onTogglePlay,
  registerRef,
}: FeedSlideProps) {
  const cover = track.coverImageUrl ?? '';
  return (
    <div
      ref={registerRef}
      data-index={index}
      className="relative w-full snap-start"
      style={{ height: '100dvh' }}
    >
      <div
        className="absolute inset-0 bg-center bg-cover scale-110 blur-2xl opacity-60"
        style={{ backgroundImage: cover ? `url(${cover})` : undefined, backgroundColor: '#1a1033' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      <div className="relative h-full flex flex-col items-center justify-center px-6">
        <button
          type="button"
          onClick={onTogglePlay}
          className="relative aspect-square w-64 max-w-[70%] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10"
        >
          {cover ? (
            <img src={cover} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500" />
          )}
          {!isPlaying && isActive ? (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Play className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          ) : null}
        </button>

        <div className="mt-8 text-center max-w-xs">
          <h2 className="text-2xl font-bold leading-tight">{track.title}</h2>
          <p className="text-base text-gray-200 mt-1">{track.artistName}</p>
          {track.locationName ? (
            <p className="inline-flex items-center gap-1 mt-3 text-xs text-purple-200/80">
              <MapPin className="w-3 h-3" /> {track.locationName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={onToggleLike}
          className="flex flex-col items-center text-white"
          aria-label={track.isLiked ? 'Видалити з улюблених' : 'Додати до улюблених'}
        >
          <span
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition ${
              track.isLiked ? 'bg-pink-500/90' : 'bg-white/15 hover:bg-white/25'
            }`}
          >
            <Heart className={`w-6 h-6 ${track.isLiked ? 'fill-white' : ''}`} />
          </span>
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center"
          aria-label={isPlaying ? 'Пауза' : 'Грати'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
