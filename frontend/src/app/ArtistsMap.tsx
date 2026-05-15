import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { ChevronLeft, MapPin, X, Music } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { getArtistsMapData } from './services/albums';
import { ArtistMapEntry, AlbumMap } from './types';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Виправлення іконок маркерів, які Vite ламає через імпорт шляхів
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const UKRAINE_CENTER: [number, number] = [49.0, 31.5];
const UKRAINE_ZOOM = 6;

const CITY_COORDS: Record<string, [number, number]> = {
  'Київ':             [50.4501, 30.5234],
  'Львів':            [49.8397, 24.0297],
  'Харків':           [49.9935, 36.2304],
  'Одеса':            [46.4825, 30.7233],
  'Дніпро':           [48.4647, 35.0462],
  'Запоріжжя':        [47.8388, 35.1396],
  'Вінниця':          [49.2331, 28.4682],
  'Полтава':          [49.5883, 34.5514],
  'Чернівці':         [48.2921, 25.9354],
  'Черкаси':          [49.4285, 32.0621],
  'Суми':             [50.9077, 34.7981],
  'Житомир':          [50.2547, 28.6587],
  'Рівне':            [50.6199, 26.2516],
  'Івано-Франківськ': [48.9226, 24.7111],
  'Тернопіль':        [49.5535, 25.5948],
  'Луцьк':            [50.7472, 25.3254],
  'Хмельницький':     [49.4229, 26.9870],
  'Херсон':           [46.6354, 32.6169],
  'Миколаїв':         [46.9750, 31.9946],
  'Ужгород':          [48.6208, 22.2879],
  'Кропивницький':    [48.5079, 32.2623],
  'Чернігів':         [51.4982, 31.2893],
  'Кривий Ріг':       [47.9105, 33.3918],
  'Маріуполь':        [47.0956, 37.5417],
};

function createArtistIcon(selected: boolean) {
  const size = selected ? 40 : 34;
  const glow = selected ? '0 0 16px rgba(147,51,234,0.9)' : '0 0 10px rgba(147,51,234,0.5)';
  const border = selected ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)';
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:linear-gradient(135deg,#9333ea,#7c3aed);
      border:2px solid ${border};
      border-radius:50%;
      box-shadow:${glow};
      display:flex;align-items:center;justify-content:center;
      transition:all 0.2s;
    ">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Розсіювання маркерів одного міста, щоб вони не накладались
function jitterCoords(base: [number, number], index: number, total: number): [number, number] {
  if (total === 1) return base;
  const angle = (2 * Math.PI * index) / total;
  const radius = 0.12 + 0.06 * Math.floor(index / 8);
  return [base[0] + radius * Math.sin(angle), base[1] + radius * Math.cos(angle)];
}

interface ArtistPanelProps {
  artist: ArtistMapEntry;
  onClose: () => void;
}

function ArtistPanel({ artist, onClose }: ArtistPanelProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[2000] max-h-[70vh] overflow-y-auto
                    bg-gradient-to-b from-[#141414] to-[#0a0a0a]
                    border-t border-white/10 rounded-t-3xl px-4 pt-5 pb-28">
      {/* Ручка */}
      <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

      {/* Заголовок */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0 pr-3">
          <h2 className="text-[22px] font-semibold text-white truncate">{artist.artistName}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="text-[13px] text-purple-300">{artist.locationName}</span>
            <span className="text-gray-600 text-[10px]">•</span>
            <span className="text-[13px] text-gray-500">{artist.trackCount} треків</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Альбоми */}
      <div className="mt-5">
        <h3 className="text-[14px] font-medium text-gray-400 mb-3 uppercase tracking-wider">Альбоми</h3>
        {artist.albums.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500 py-4">
            <Music className="w-5 h-5" />
            <span className="text-[14px]">Немає альбомів</span>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {artist.albums.map((album: AlbumMap) => (
              <Link
                key={album.id}
                to={`/library/albums/${encodeURIComponent(album.title)}`}
                className="flex-shrink-0 w-36 group"
              >
                <div className="w-36 h-36 rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-2 relative">
                  {album.coverImageUrl ? (
                    <ImageWithFallback
                      src={album.coverImageUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-purple-950/30">
                      <Music className="w-10 h-10 text-purple-500/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl" />
                </div>
                <p className="text-[13px] font-medium text-white truncate">{album.title}</p>
                <p className="text-[11px] text-gray-500">{album.trackCount} треків</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function ArtistsMap() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<ArtistMapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<ArtistMapEntry | null>(null);

  // Відстежуємо кількість артистів по місту для розсіювання
  const cityCountRef = useRef<Record<string, number>>({});
  const cityIndexRef = useRef<Record<string, number>>({});

  useEffect(() => {
    getArtistsMapData()
      .then(data => {
        // Рахуємо кількість артистів по кожному місту
        const counts: Record<string, number> = {};
        for (const a of data) {
          if (a.locationName in CITY_COORDS) {
            counts[a.locationName] = (counts[a.locationName] ?? 0) + 1;
          }
        }
        cityCountRef.current = counts;
        cityIndexRef.current = {};
        setArtists(data);
      })
      .catch(() => setError('Не вдалося завантажити карту артистів'))
      .finally(() => setLoading(false));
  }, []);

  const artistsWithCoords = artists.filter(a => a.locationName in CITY_COORDS);

  function getMarkerPos(artist: ArtistMapEntry): [number, number] {
    const base = CITY_COORDS[artist.locationName];
    const total = cityCountRef.current[artist.locationName] ?? 1;
    const idx = cityIndexRef.current[artist.locationName] ?? 0;
    cityIndexRef.current[artist.locationName] = idx + 1;
    return jitterCoords(base, idx, total);
  }

  // Скидаємо лічильники індексів перед рендером (щоб не накопичувались при ре-рендері)
  cityIndexRef.current = {};

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col" style={{ zIndex: 0 }}>
      {/* Шапка */}
      <div className="flex-shrink-0 z-[1000] bg-[#0a0a0a]/95 backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-[17px] font-semibold text-white">Карта артистів</h1>
            <p className="text-[12px] text-gray-500">Музика поруч</p>
          </div>
          {!loading && !error && (
            <span className="ml-auto text-[12px] text-purple-400">
              {artistsWithCoords.length} артистів
            </span>
          )}
        </div>
      </div>

      {/* Вміст */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
            <p className="text-[14px] text-gray-400">Завантаження карти...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <MapPin className="w-10 h-10 text-gray-600" />
            <p className="text-[15px] text-white font-medium">Помилка завантаження</p>
            <p className="text-[13px] text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <MapContainer
            center={UKRAINE_CENTER}
            zoom={UKRAINE_ZOOM}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              maxZoom={19}
            />
            {artistsWithCoords.map(artist => (
              <Marker
                key={`${artist.artistName}-${artist.locationName}`}
                position={getMarkerPos(artist)}
                icon={createArtistIcon(selectedArtist?.artistName === artist.artistName)}
                eventHandlers={{
                  click: () => setSelectedArtist(
                    selectedArtist?.artistName === artist.artistName ? null : artist
                  ),
                }}
              />
            ))}
          </MapContainer>
        )}

        {/* Панель артиста */}
        {selectedArtist && (
          <ArtistPanel
            artist={selectedArtist}
            onClose={() => setSelectedArtist(null)}
          />
        )}
      </div>
    </div>
  );
}
