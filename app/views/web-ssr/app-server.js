
import page from "./app.vue";
import server from "../web-ssr-lib/ssr-server";
export default context => {
    return server({context, page})
}