import { createRoot } from "react-dom/client";
import "./index.css";
import { Main } from "./main";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

createRoot(container).render(<Main />);
