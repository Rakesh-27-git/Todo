import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { Toaster } from "sonner";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="bottom-right" richColors /> 
    </BrowserRouter>
  </StrictMode>
);
