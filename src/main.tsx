import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ConfigProvider } from "antd";
import App from "./Components/App/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Steps: {
            iconSize: 60,
            iconFontSize: 30,
          },
        },
        token: {
          fontSize: 20
        }
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
