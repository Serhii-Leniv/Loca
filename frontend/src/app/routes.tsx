import { createBrowserRouter } from "react-router";
import Register from "./Register";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Register,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/search",
    Component: Search,
  },
  {
    path: "/library",
    Component: Library,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/now-playing",
    Component: NowPlaying,
  },
  {
    path: "/sync-room",
    Component: SyncRoom,
  },
  {
    path: "/liked-songs",
    Component: LikedSongs,
  },
  {
    path: "/album",
    Component: Album,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/notifications",
    Component: Notifications,
  },
  {
    path: "/local-news",
    Component: LocalNews,
  },
  {
    path: "/mood/calm-evening",
    Component: MoodCalmEvening,
  },
  {
    path: "/mood/study",
    Component: MoodStudy,
  },
  {
    path: "/mood/road",
    Component: MoodRoad,
  },
  {
    path: "/mood/workout",
    Component: MoodWorkout,
  },
  {
    path: "/mood/party",
    Component: MoodParty,
  },
  {
    path: "/mood/melancholy",
    Component: MoodMelancholy,
  },
  {
    path: "/library/playlists",
    Component: LibraryPlaylists,
  },
  {
    path: "/library/albums",
    Component: LibraryAlbums,
  },
  {
    path: "/library/liked-songs",
    Component: LibraryLikedSongs,
  },
  {
    path: "/my-memories",
    Component: MyMemories,
  },
  {
    path: "/listener-memories",
    Component: ListenerMemories,
  },
  {
    path: "/playlists",
    Component: Playlists,
  },
  {
    path: "/add-to-playlist",
    Component: AddToPlaylist,
  },
  {
    path: "/edit-profile",
    Component: EditProfile,
  },
  {
    path: "/change-language",
    Component: ChangeLanguage,
  },
  {
    path: "/change-password",
    Component: ChangePassword,
  },
  {
    path: "/connected-devices",
    Component: ConnectedDevices,
  },
  {
    path: "/languages",
    Component: Languages,
  },
]);