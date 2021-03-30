import { createApp } from "vue";
import router from "./routes";

import App from "./views/App.vue";
import "@/styles/main.scss";
import "./sw";

const app = createApp(App);
app.use(router);
app.mount("#app");
