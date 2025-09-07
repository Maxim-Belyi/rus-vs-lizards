import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@styles/styles.scss";
import { Home } from "./pages/Home.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Home />
  </StrictMode>
);
