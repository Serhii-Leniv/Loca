import { MoodPlaylistPage } from './components/MoodPlaylistPage';

const tracks = [
  { id: 1, title: 'Максимум сили', artist: 'DJ Karpatski', duration: '3:30', hasLegend: true },
  { id: 2, title: 'Прорив', artist: 'Lviv Rebels', duration: '4:00' },
  { id: 3, title: 'Без меж', artist: 'Анна Вольна', duration: '3:45' },
  { id: 4, title: 'Пульс міста', artist: 'DJ Karpatski', duration: '4:15' },
  { id: 5, title: 'Вогонь', artist: 'Lviv Rebels', duration: '3:20', hasLegend: true },
  { id: 6, title: 'Сталь', artist: 'OTOY', duration: '3:50' },
  { id: 7, title: 'Адреналін', artist: 'DJ Karpatski', duration: '3:25' },
  { id: 8, title: 'Остання серія', artist: 'Lviv Rebels', duration: '4:10' },
];

export default function MoodWorkout() {
  return (
    <MoodPlaylistPage
      name="Тренування"
      subtitle="Потужні треки для заряду енергії та мотивації"
      coverImage="https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NzQ4OTIwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
      gradientFrom="#9f1239"
      gradientTo="#be185d"
      tracks={tracks}
    />
  );
}
