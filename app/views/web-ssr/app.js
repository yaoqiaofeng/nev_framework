//页面
import page from "./app.vue";
import client from "../web-ssr-lib/ssr-client";

client(page, '#app');