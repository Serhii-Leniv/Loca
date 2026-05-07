import { MoodPlaylistPage } from './components/MoodPlaylistPage';

const tracks = [
  { id: 1, title: 'Шосе мрій', artist: 'Lviv Rebels', duration: '4:10', hasLegend: true },
  { id: 2, title: 'Вітер у вікні', artist: 'OTOY', duration: '3:45' },
  { id: 3, title: 'Далека дорога', artist: 'Анна Вольна', duration: '5:20' },
  { id: 4, title: 'Горизонт', artist: 'DJ Karpatski', duration: '4:00' },
  { id: 5, title: 'Нові міста', artist: 'Lviv Rebels', duration: '3:55', hasLegend: true },
  { id: 6, title: 'Свобода руху', artist: 'OTOY', duration: '4:30' },
  { id: 7, title: 'Між зупинками', artist: 'Марія Коваль', duration: '4:50' },
  { id: 8, title: 'Остання миля', artist: 'Lviv Rebels', duration: '3:35' },
];

export default function MoodRoad() {
  return (
    <MoodPlaylistPage
      name="Дорога"
      subtitle="Треки для подорожей і довгих поїздок"
      coverImage="https://images.unsplash.com/photo-1589577507866-d0a067bf8920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwdHJpcCUyMGNhciUyMGRyaXZpbmd8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080"
      gradientFrom="#9a3412"
      gradientTo="#b91c1c"
      tracks={tracks}
    />
  );
}
