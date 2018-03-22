
import page from "./500.vue";
import server from "./ssr-server";
import Vue from "vue";
import axios from "axios";
import ElementUI from 'element-ui'
Vue.use(ElementUI);

let store = {
    users: {}
}
function api(){
    return new Promise((resolve, reject)=>{
        axios.get('/api/user/list').then(function (response) {
            let data = response.data;
            if (data.result && (data.result='success')){
                resolve(data.data);
            } else {
                reject(data.message);
            }
        })
        .catch(reject);
    })
}
export default context => {
    return server({Vue, context, page, store});
}