import { MoodPlaylistPage } from './components/MoodPlaylistPage';

const tracks = [
  { id: 1, title: 'Нічна тиша', artist: 'OTOY', duration: '4:20' },
  { id: 2, title: 'Зоряне небо', artist: 'Сестри Тельнюк', duration: '3:55', hasLegend: true },
  { id: 3, title: 'Вечірній Львів', artist: 'Анна Вольна', duration: '5:10' },
  { id: 4, title: 'Місячна соната', artist: 'OTOY', duration: '4:45', hasLegend: true },
  { id: 5, title: 'Тихий берег', artist: 'Сестри Тельнюк', duration: '3:30' },
  { id: 6, title: 'Осінній дощ', artist: 'Марія Коваль', duration: '4:15' },
  { id: 7, title: 'Синя година', artist: 'Анна Вольна', duration: '5:00' },
  { id: 8, title: 'Вогники міста', artist: 'OTOY', duration: '3:48' },
];

export default function MoodCalmEvening() {
  return (
    <MoodPlaylistPage
      name="Спокійний вечір"
      subtitle="М'яка музика для відпочинку і умиротворення"
      coverImage="https://images.unsplash.com/photo-1731275956984-44abf12b281f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxtJTIwZXZlbmluZyUyMHN1bnNldCUyMGFtYmllbnR8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080"
      gradientFrom="#312e81"
      gradientTo="#1d4ed8"
      tracks={tracks}
    />
  );
}
