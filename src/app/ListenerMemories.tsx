import { ArrowLeft, Music2 } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function ListenerMemories() {
  const listenerMemories = [
    {
      id: 1,
      track: 'Літо',
      artist: 'OTOY',
      memory: 'Цей трек асоціюється в мене з літом 2025, коли ми їздили на море. Кожного разу, коли я чую цю пісню, я відчуваю морський бриз і тепло сонця на шкірі.',
      image: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '3 дні тому',
    },
    {
      id: 2,
      track: 'Карпати кличуть',
      artist: 'Lviv Rebels',
      memory: 'Слухав цю пісню під час походу в гори, неймовірні відчуття. Коли стояв на вершині і дивився на схід сонця, ця мелодія звучала у навушниках.',
      image: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '1 тиждень тому',
    },
    {
      id: 3,
      track: 'Вечір у Львові',
      artist: 'Сестри Тельнюк',
      memory: 'Ця композиція нагадує мені про перше побачення в старому місті. Ми гуляли вузькими вуличками, а з кафе лунала саме ця музика.',
      image: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2 тижні тому',
    },
    {
      id: 4,
      track: 'Нічний драйв',
      artist: 'DJ Karpatski',
      memory: 'Їхали додому після концерту, і ця композиція ідеально підходила до настрою нічного міста. Вогні міста, порожні вулиці, відчуття свободи.',
      image: 'https://images.unsplash.com/photo-1589577507866-d0a067bf8920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwdHJpcCUyMGNhciUyMGRyaXZpbmd8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '3 тижні тому',
    },
    {
      id: 5,
      track: 'Весняний ранок',
      artist: 'Сестри Тельнюк',
      memory: 'Ця мелодія назавжди пов\'язана з ранковою прогулянкою парком, коли все навколо цвіло. Запах квітів і ця пісня - ідеальне поєднання.',
      image: 'https://images.unsplash.com/photo-1634284633072-a98a84684ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '1 місяць тому',
    },
    {
      id: 6,
      track: 'Танці до світанку',
      artist: 'OTOY',
      memory: 'Випускний вечір, і ця пісня грала останньою. Ми танцювали до самого ранку, не хотілося відпускати цей момент.',
      image: 'https://images.unsplash.com/photo-1599594407558-957c79005316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBwbGF5ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '1 місяць тому',
    },
    {
      id: 7,
      track: 'Місто мрій',
      artist: 'OTOY',
      memory: 'Переїхав до Львова рік тому, і ця пісня стала саундтреком моєї нової історії. Кожен день відкриваю щось нове в цьому місті.',
      image: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2 місяці тому',
    },
    {
      id: 8,
      track: 'Ритми міста',
      artist: 'Lviv Rebels',
      memory: 'Слухав цей трек на пробіжці вранці. Місто тільки прокидається, а ця музика додає енергії та мотивації.',
      image: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2 місяці тому',
    },
  ];

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
        {listenerMemories.map((memory) => (
          <Link to="/now-playing" key={memory.id}>
            <div className="rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/20 p-4 backdrop-blur-sm hover:from-purple-900/30 hover:to-purple-950/30 transition-all duration-200 cursor-pointer">
              <div className="flex gap-3 mb-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={memory.image}
                    alt={memory.track}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium text-white mb-1">{memory.track}</p>
                  <p className="text-[12px] text-gray-400 mb-1">{memory.artist}</p>
                  <p className="text-[11px] text-purple-400">{memory.date}</p>
                </div>
                <Music2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
              </div>
              <p className="text-[13px] text-gray-300 leading-relaxed">{memory.memory}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
