import { createBrowserRouter } from "react-router";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Search from "./Search";
import Library from "./Library";
import Profile from "./Profile";
import NowPlaying from "./NowPlaying";
import SyncRoom from "./SyncRoom";
import LikedSongs from "./LikedSongs";
import Album from "./Album";
import Settings from "./Settings";
import Notifications from "./Notifications";
import LocalNews from "./LocalNews";
import MoodCalmEvening from "./MoodCalmEvening";
import MoodStudy from "./MoodStudy";
import MoodRoad from "./MoodRoad";
import MoodWorkout from "./MoodWorkout";
import MoodParty from "./MoodParty";
import MoodMelancholy from "./MoodMelancholy";
import LibraryPlaylists from "./LibraryPlaylists";
import LibraryAlbums from "./LibraryAlbums";
import LibraryLikedSongs from "./LibraryLikedSongs";
import MyMemories from "./MyMemories";
import ListenerMemories from "./ListenerMemories";
import Playlists from "./Playlists";
import AddToPlaylist from "./AddToPlaylist";
import EditProfile from "./EditProfile";
import ChangeLanguage from "./ChangeLanguage";
import ChangePassword from "./ChangePassword";
import ConnectedDevices from "./ConnectedDevices";
import Languages from "./Languages";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

const privateRoute = (Component: React.ComponentType) => ({
  element: (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  ),
});

const publicRoute = (Component: React.ComponentType) => ({
  element: (
    <PublicOnlyRoute>
      <Component />
    </PublicOnlyRoute>
  ),
});

export const router = createBrowserRouter([
  {
    path: "/",
    ...publicRoute(Register),
  },
  {
    path: "/login",
    ...publicRoute(Login),
  },
  {
    path: "/home",
    ...privateRoute(Home),
  },
  {
    path: "/search",
    ...privateRoute(Search),
  },
  {
    path: "/library",
    ...privateRoute(Library),
  },
  {
    path: "/profile",
    ...privateRoute(Profile),
  },
  {
    path: "/now-playing",
    ...privateRoute(NowPlaying),
  },
  {
    path: "/sync-room",
    ...privateRoute(SyncRoom),
  },
  {
    path: "/liked-songs",
    ...privateRoute(LikedSongs),
  },
  {
    path: "/album",
    ...privateRoute(Album),
  },
  {
    path: "/settings",
    ...privateRoute(Settings),
  },
  {
    path: "/notifications",
    ...privateRoute(Notifications),
  },
  {
    path: "/local-news",
    ...privateRoute(LocalNews),
  },
  {
    path: "/mood/calm-evening",
    ...privateRoute(MoodCalmEvening),
  },
  {
    path: "/mood/study",
    ...privateRoute(MoodStudy),
  },
  {
    path: "/mood/road",
    ...privateRoute(MoodRoad),
  },
  {
    path: "/mood/workout",
    ...privateRoute(MoodWorkout),
  },
  {
    path: "/mood/party",
    ...privateRoute(MoodParty),
  },
  {
    path: "/mood/melancholy",
    ...privateRoute(MoodMelancholy),
  },
  {
    path: "/library/playlists",
    ...privateRoute(LibraryPlaylists),
  },
  {
    path: "/library/albums",
    ...privateRoute(LibraryAlbums),
  },
  {
    path: "/library/liked-songs",
    ...privateRoute(LibraryLikedSongs),
  },
  {
    path: "/my-memories",
    ...privateRoute(MyMemories),
  },
  {
    path: "/listener-memories",
    ...privateRoute(ListenerMemories),
  },
  {
    path: "/playlists",
    ...privateRoute(Playlists),
  },
  {
    path: "/add-to-playlist",
    ...privateRoute(AddToPlaylist),
  },
  {
    path: "/edit-profile",
    ...privateRoute(EditProfile),
  },
  {
    path: "/change-language",
    ...privateRoute(ChangeLanguage),
  },
  {
    path: "/change-password",
    ...privateRoute(ChangePassword),
  },
  {
    path: "/connected-devices",
    ...privateRoute(ConnectedDevices),
  },
  {
    path: "/languages",
    ...privateRoute(Languages),
  },
]);