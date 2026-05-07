import { MoodPlaylistPage } from './components/MoodPlaylistPage';

const tracks = [
  { id: 1, title: 'Танцюй зі мною', artist: 'DJ Karpatski', duration: '3:50', hasLegend: true },
  { id: 2, title: 'Ніч без кінця', artist: 'Lviv Rebels', duration: '4:10' },
  { id: 3, title: 'Ейфорія', artist: 'DJ Karpatski', duration: '3:35' },
  { id: 4, title: 'Всі в русі', artist: 'Анна Вольна', duration: '4:20', hasLegend: true },
  { id: 5, title: 'Феєрверк', artist: 'Сестри Тельнюк', duration: '3:55' },
  { id: 6, title: 'Рух ритму', artist: 'DJ Karpatski', duration: '4:05' },
  { id: 7, title: 'Нічні вогні', artist: 'Lviv Rebels', duration: '3:40' },
  { id: 8, title: 'До світанку', artist: 'DJ Karpatski', duration: '4:45' },
];

export default function MoodParty() {
  return (
    <MoodPlaylistPage
      name="Вечірка"
      subtitle="Гучні хіти для незабутніх вечорів і танцпольоту"
      coverImage="https://images.unsplash.com/photo-1766933161362-ccf4050529a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGNlbGVicmF0aW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3NDg4MjkxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
      gradientFrom="#86198f"
      gradientTo="#6d28d9"
      tracks={tracks}
    />
  );
}
