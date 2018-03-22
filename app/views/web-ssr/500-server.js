
import page from "./500.vue";
import server from "./ssr-server";
export default context => {
    return server({context, page});
}