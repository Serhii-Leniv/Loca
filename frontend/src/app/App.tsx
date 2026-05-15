import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { initializeAudioElement } from "./services/audioService";

export default function App() {
  useEffect(() => {
    // Initialize global audio element
    initializeAudioElement();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}