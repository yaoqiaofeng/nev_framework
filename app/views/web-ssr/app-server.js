
import page from "./app.vue";
import server from "./ssr-server";
export default context => {
    return server({context, page})
}