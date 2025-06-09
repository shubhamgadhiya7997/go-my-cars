import "./App.css";
import { ThemeProvider } from "./components/themeProvider";
import { MotionLazy } from "./components/animate/motion-lazy";
import AppRouter from "./routes";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MotionLazy>
        <AppRouter />
      </MotionLazy>
    </ThemeProvider>
  );
}

export default App;
