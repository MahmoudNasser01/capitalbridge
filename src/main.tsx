import { createRoot } from "react-dom/client";
import App from "./App";
import { setBaseUrl } from "@/lib/api-client";
import "./index.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? null;
const useMocks =
  import.meta.env.VITE_USE_MOCKS !== "false" && !apiBaseUrl;
setBaseUrl(apiBaseUrl);

async function bootstrap() {
  if (useMocks) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    });
  }
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();
