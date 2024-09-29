import { createApp, provide } from "vue";
import App from "./App.vue";
import "./style.css";
import { install } from "@icon-park/vue-next/es/all";
import { createPinia } from "pinia";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

install(app);

app.mount("#app");
