import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import RenderToast from "./components/RenderToast.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RenderToast>
      <App />
    </RenderToast>
  </Provider>,
);
