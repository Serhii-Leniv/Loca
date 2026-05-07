import { MoodPlaylistPage } from './components/MoodPlaylistPage';

const tracks = [
  { id: 1, title: 'Фокус', artist: 'OTOY', duration: '3:40' },
  { id: 2, title: 'Глибока думка', artist: 'Марія Коваль', duration: '4:25' },
  { id: 3, title: 'Концентрація', artist: 'DJ Karpatski', duration: '5:00', hasLegend: true },
  { id: 4, title: 'Потік', artist: 'Анна Вольна', duration: '3:50' },
  { id: 5, title: 'Роздуми', artist: 'OTOY', duration: '4:05' },
  { id: 6, title: 'Тиша розуму', artist: 'Сестри Тельнюк', duration: '4:35', hasLegend: true },
  { id: 7, title: 'Ясна голова', artist: 'Марія Коваль', duration: '3:55' },
  { id: 8, title: 'Внутрішній простір', artist: 'Анна Вольна', duration: '5:15' },
];

export default function MoodStudy() {
  return (
    <MoodPlaylistPage
      name="Для навчання"
      subtitle="Музика без відволікань — для продуктивної роботи"
      coverImage="https://images.unsplash.com/photo-1617239098289-ad0ee436361e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGJvb2tzJTIwY29mZmVlfGVufDF8fHx8MTc3NDk2NTkyNHww&ixlib=rb-4.1.0&q=80&w=1080"
      gradientFrom="#065f46"
      gradientTo="#0f766e"
      tracks={tracks}
    />
  );
}
