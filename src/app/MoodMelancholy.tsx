import { MoodPlaylistPage } from './components/MoodPlaylistPage';

const tracks = [
  { id: 1, title: 'Порожній берег', artist: 'Сестри Тельнюк', duration: '5:15', hasLegend: true },
  { id: 2, title: 'Осінь у серці', artist: 'Анна Вольна', duration: '4:50' },
  { id: 3, title: 'Забутий спогад', artist: 'OTOY', duration: '5:30', hasLegend: true },
  { id: 4, title: 'Сіре небо', artist: 'Марія Коваль', duration: '4:40' },
  { id: 5, title: 'Тінь минулого', artist: 'Сестри Тельнюк', duration: '5:00' },
  { id: 6, title: 'Перший сніг', artist: 'Анна Вольна', duration: '4:25' },
  { id: 7, title: 'Далекий берег', artist: 'OTOY', duration: '5:10' },
  { id: 8, title: 'Після дощу', artist: 'Марія Коваль', duration: '4:55' },
];

export default function MoodMelancholy() {
  return (
    <MoodPlaylistPage
      name="Меланхолія"
      subtitle="Задумливі мелодії для тихих та рефлексивних моментів"
      coverImage="https://images.unsplash.com/photo-1753041261065-01d9c9a6bf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwbWVsYW5jaG9saWMlMjB3aW5kb3d8ZW58MXx8fHwxNzc0OTY1OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
      gradientFrom="#1e293b"
      gradientTo="#374151"
      tracks={tracks}
    />
  );
}
