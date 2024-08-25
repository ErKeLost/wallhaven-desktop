import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./global.css";
import { ThemeProvider } from "@/components/theme-provider";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  // </React.StrictMode>
);
