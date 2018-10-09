global.configs = require('../configs/config');
global.modules = function (name) {
    if (name == 'db') {
        return {
            begin(){

            },
            end(){

            },
            rollback(){

            },
            commit(){

            }
        };
    }
    if (name == 'cache') {
        return {
            begin(){

            },
            end(){

            },
            rollback(){

            },
            commit(){

            }
        };
    }
    if (name == 'serviceObject') {
        return require('../app/modules/system/serviceObject');
    }
}
let modelData  = new Map();
global.models = function (name) {
    return {
        async select(data) {
            let rows = modelData.get(name) || [];
            let result = [];
            for(let i=0; i<rows.length;i++){
                let match = true;
                for(let e in data){
                    if (data[e]!=rows[i][e]){
                        match =  false;
                    }
                }
                if (match){
                    result.push(rows[i]);
                }
            }             
            return result;
        },
        async update(data) {
            let rows = modelData.get(name) || [];
            for(let i=0; i<rows.length;i++){
                if (data.d ==rows[i].id){
                    rows.splice(i,1,Object.assign(data));
                    break;
                }
            }
            modelData.set(name, rows);
            return data.id
        },
        async insert(data) {
            let rows = modelData.get(name) || [];
            let id = 0;
            for(let i=0; i<rows.length;i++){
                if (id<rows[i].id){
                    id = rows[i].id;
                }
            }
            data.id = id+1;
            rows.push(data);
            modelData.set(name, rows);
            return data.id;
        },
        async delete(data) {
            let rows = modelData.get(name) || [];
            for(let i=rows.length; i>=0; i--){
                let match = true;
                for(let e in data){
                    if (data[e]!=rows[i][e]){
                        match =  false;
                    }
                }
                if (match){
                    rows.splice(i,1);
                }
            }
            modelData.set(name, rows);
            return data.id
        }
    }
}
module.exports ={
    require(name){
        return  require('../app/'+name);
    },
    async error(fun){
        let error = "";
        try{
            await  fun;
        } catch(e){
            error = e;
        }
        console.log(error);
        return error;
    }
}