/**
 * 服务基本类
 */
const pinyin = require('pinyin');
const xlsx = require('node-xlsx');
const db = require('./db');
const cache = require('./cache');
const moment = require('moment');

/*
BaseService 基本的服务对象，基类，用于只读服务

开放函数
get           获取单个数据的信息
list            获取多个数据的信息，支持分页排序过滤搜索等
export      导出多个数据，支持分页排序过滤搜索等

内部使用函数
join                    快捷视图连接操作，一般使用于doJoin事件
child                   实现明细数据连接功能 ，一般使用于doJoin事件
search                搜索函数，一般用于doSearch事件
filterByObject    按对象的值进行过滤数据，一般用于doFilter事件
paging               分页排序
enumChilds       枚举有上下级关系的数据集某个节点下的所有子节点
getFirstLetter     返回首字母拼音
compare            比较函数，可用排序
getOrder
getOffset 

需要响应的事件
name      返回服务名字
expose    暴露的接口，为空则全部暴露
doGet     获取一条数据
doDict    数据字典，目前用于导入导出
doAuth   权限验证
doList     获取列表数据

ModelService 表服务对象，用于表服务类，继承于基类
add          增加一个数据
update     更新一个数据
delete      删除一个数据
import     导入多个数据
name       返回服务名字

需要响应的事件
doList          获取列表数据
doGet          获取一条数据
doUpdate    用于自定义修改事件
doAdd         用于自定义增加事件
doDelete     用于自定义删除事件
doDict         数据字典，目前用于导入导出
doImport    导入一行数据，用于生成可用于add函数的数据集
doAuth       权限验证，

CustomService


内部使用的操作
*/

class BaseService{
    static name(){
        return "";
    }

    static expose(method){
        return null;
    }

    static exposePublic(method){
        return [];
    }

    static router(id){
        if (id==this.name()){
            return this;
        }
    }

    static async get(data, env){ 
        if (!data.id){
            throw '无效的对象标识，无法获取数据!'
        }
        let val =await this.doAuth(data, env, 'get');
        if (!val){
            throw '权限不足，无法获取数据！'
        }
        let row =  await this.doGet(data, env);
        if (row.id==data.id){
            return row;
        } else {
            throw '未能找到相应的数据!';
        }               
    }

    static async list(data, env){
        let val = await this.doAuth(data, env, 'list');
        if (!val){
            throw '权限不足，无法获取数据！'
        }
        return await this.doList(data, env);
    }

    static async export(data, env){     
        let val =await this.doAuth(data, env, 'export');
        if (!val){
            throw '权限不足，无法完成导出！'
        }
        let output = [];
        let rows = await this.doList(data, env);
        rows = rows.rows;
        if (rows.length>0){
            //根据字段的中英文对应表转换标题到字段名
            output.push([]);
            let dict = await this.doDict(data, env, 'export'); 
            for(let name in dict){
                output[0].push(dict[name]);
            }
            for(let row of rows){
                let item = [];
                for(let name in dict){
                    item.push(row[name]);
                }
                output.push(item);
            }
        }
        if (data.format=='excel'){
            return xlsx.build([{name: data.sheet?data.sheet:"Sheet1", data: output}]);
        } else {
            return ;
        }
    }

    //排序的元素比较函数
    static compare(a, b){       
        //一般情况比较 
        if (a && !b){
            return 1;
        }
        if (!a && b){
            return -1;
        }
        if (!a && !b){
            return 0;
        }        
        if (a==b){
            return 0;
        }

        //如果为字符串以0开头，不做整数比较
        let Nan = false;
        if ((typeof a=='string') && a[0]=='0'){
            Nan = true;
        }
        if ((typeof b=='string') && b[0]=='0'){
            Nan = true;
        }

        //假如是整数
        if ((!isNaN(a)) && (!isNaN(b)) && !Nan){
            if (parseInt(a)>parseInt(b)){
                return 1
            } else if (parseInt(a)<parseInt(b)){
                return -1;
            } else {
                return 0;
            }
        }

        //假如是日期
        if (moment(a).isValid() && moment(b).isValid()){
            let av = moment(a).format();
            let bv = moment(b).format();
            return av.localeCompare(bv);
        } 
        
        //假如是字符串
        if ((typeof(a)=='string') || (typeof(b)=='string')){
            let av = this.getFirstLetter(a);
            let bv = this.getFirstLetter(b);
            return av.localeCompare(bv);
        } 
        
        //假如其他类型
        if (a>b){
            return 1;
        } else if (a<b){
            return -1;
        } else {
            return 0;
        }
    }

    //实现内存分页和排序
    static paging(data, env, dataset) {
        if (data.sort){			
            let sorts = data.sort.split(',');
            let orders = Array(sorts.length);	
            if (data.order){
                orders = data.order.split(',');
                orders.length = sorts.length;                
            }
            dataset = dataset.sort((a, b)=>{
                for(let i=0; i<sorts.length; i++){
                    let v = this.compare(a[sorts[i]],b[sorts[i]]);
                    if (v!=0){
                        return orders[i]=="desc"? -v: v;
                    }                  
                }
                return 0;
            });
        }
        if ((data.page) && (!data.offset)){
            data.offset = (data.page-1) * data.limit;
        }
        if (!data.offset){
            data.offset=0;
        }
        if (!data.limit){
            data.limit = dataset.length-data.offset;
        }
        var result = [];
        for (var i = parseInt(data.offset); i < parseInt(data.offset) + parseInt(data.limit); i++) {
            if (i < dataset.length) {
                result.push(dataset[i]);
            } else {
                break;
            }
        }
        return result;
    }

    //默认功能的效验和鉴权
    //data: 传递外部调用的数据
    //op: 操作
    //    delete : 删除
    //    add : 添加
    //    update : 修改
    //    get: 返回一条记录
    //    list: 返回一批记录
    //    import: 导入权限
    //    export: 导出权限
    //return 返回值可以是布尔值或者一个包含错误信息的字符串
    static async doAuth(data, env, op){
        return false;
    }

    //翻译事件，用于导入导出标题转换到字段
    //op 操作，用于何种用途的字典
    //返回格式
    /*
    {
        id:  "标识"
    }
    */
    static async doDict(data, env, op){
        return {};
    }

    static async doGet(data, env){    

    }

    static async doList(data, env){    

    }

    //实现类似视图的连接功能，
    //table: 如果是字符串则为表名，如果为对象则为要连接的数据源
    //row: 数据数组 
    //joins: 要连接的字段，数组或者单个字段名 
    //matchValues: 用于匹配的数组中对象的字段名，字符串或数组
    //matchFields: 用于匹配的表名对应的字段名，字符串或数组，与match_rows_fields要一一对应，无值默认为id
    //prefix: 字符串或数组，字符串则是连接后字段的前缀，默认是按照“表名_字段名”的格式，数组与joins一一对应。
    static async  join(table, row, joins, matchValues, matchFields, prefix){
        if (!prefix){
            prefix = table;
        }
        if (typeof(joins)=="string"){
            joins = [joins];
        }
        if (typeof(matchValues)=="string"){
            matchValues = [matchValues];
        }
        if (typeof(matchFields)=="string"){
            matchFields = [matchFields];
        }
        if (typeof(matchFields)=="undefined"){
            matchFields = ['id'];
        }
        let tableRow = null;
        let rows = [];
        if (typeof table=="string"){
            rows = await models(table).select();
        } else {
            rows = table;
        }
        for(let data of rows){
            let match = true;
            for(let k=0; k<matchValues.length; k++){
                let v1 = row[matchValues[k]];
                let v2 = data[matchFields[k]];
                if (v1!=v2){
                    match = false;
                    break;
                }
            }   
            if (match) {    
                tableRow = data;
                break;
            }
        }          
        if (tableRow){
            for(let k=0; k<joins.length; k++){
                if (typeof(prefix)=='string'){
                    row[prefix+'_'+joins[k]] = tableRow[joins[k]];
                } else {
                    row[prefix[k]] = tableRow[joins[k]];
                }
            }
        }
    }

    //实现子集化功能，把表中符合条件的记录作为一个数组添加到数据数组每个对像里
    //table: 表名
    //rows: 数据数组
    //name: 表记录数组在数据数组的每个对象里的名字 
    //matchValues: 用于匹配的数组中对象的字段名，字符串或数组
    //matchFields: 用于匹配的表名对应的字段名，字符串或数组，与match_rows_fields要一一对应，无值默认为id
    //sum: 每个表记录数组的最大数量
    static async child(table, row, name, matchValues, matchFields, sum){

        if (typeof(matchValues)=="string"){
            matchValues = [matchValues];
        }
        if (typeof(matchFields)=="string"){
            matchFields = [matchFields];
        }
        let Table = models(table);
        let all = await Table.select();
        if (!row[name]) {
            row[name] = [];
        }
        let childs = [];
        for(let data of all){
            let match = true;
            for(let k=0; k<matchValues.length; k++){
                let v1 = row[matchValues[k]];
                let v2 = data[matchFields[k]];
                if (v1!=v2){
                    match = false;
                    break;
                }
            }   
            if (match) {    
                childs.push(data);
                if (sum && (childs.length==sum)){
                    break;
                }
            }
        }            
        row[name].push(childs);
    }    

    /*搜索
        row：要搜索的数据内容
        fields：要搜索的字段数组
        value: 要搜索的文本
    */
    static search(row, fields, value){
        if (!value){
            return true;
        }
        for(let field of fields){
            if ((typeof(row[field])=='string') && (row[field].search(value)!=-1)){
                return true;
            } else if (row[field]==value){
                return true;
            }
        }
        return false;
    }


    //枚举所有符合条件的子项，一般用于获取树的下级节点
    //rows 来源数据
    //id 本身的标识字段
    //parentId 上级的标识字段，值与id相匹配    
    //root 开始的标识值
    static enumChilds(rows, id, parentId, root){
        let result = new Set();
        let enumChild = function(parent){
            for(let row of rows){
                if (!row.__deal__){
                    if (row[parentId]==parent){
                        row.__deal__ = true;
                        let key = row[id];
                        result.add(typeof key=='string'?key:key.toString());
                        enumChild(key)
                    }
                }
            }
        }
        result.add(typeof root=='string'?root:root.toString());
        enumChild(root);
        for(let row of rows){
            delete row.__deal__;
        }
        return result;
    }

    //返回中文拼音首字母
    static getFirstLetter(value){
        let value_1 = pinyin(value, {style: pinyin.STYLE_FIRST_LETTER});
        let result= '';
        for (let i=0; i<value.length; i++){
            result = value_1[i]?result+value_1[i]:result+value.charAt(i);
        }
        return result;   
    }
    
    //按对象过滤记录
    static filterByObject(filters, row){
        let filtered = false;        
        for(let col in filters){
            filtered = true;
            break;
        }
        if (filtered){
            for(let col in filters){
                let filter=filters[col];
                let value=row[col];
                //假如是对象
                if (typeof filter=="object"){
                    //假如是Set类型
                    if (filter.size && filter.add && filter.has){
                        if (!filter.has(value)){
                            return false;
                        }
                    } else if (filter.size && filter.set && filter.has){
                        return false;
                    } else if (filter.length){
                        //判断是否是时间段
                        if (filter.length==2){
                            let sd = new Date(filter[0]);
                            let ed = new Date(filter[1]);
                            if (sd !="Invalid Date" && ed !="Invalid Date"){
                                let d = new Date(value);
                                if ((d < sd) || (d>ed)){
                                    return false
                                }
                                continue;
                            }
                        }
                        let match = false;
                        for( let f of filter){
                            if (f==value){
                                match = true;
                                break;
                            }
                        }
                        if (!match) return false;
                    } else {
                        return false;
                    }
                //假如值是字符串，部分匹配
                } else if (typeof value=='string') {
                    if (value.search(filter) ==-1 ){
                        return false
                    } 
                //其他值需要完全相等
                } else if (value !=filter){
                    return false;
                }
            }
            return true;
        } else {
            return true;
        }
    }    

    
    //实现类似group by的功能
    //参数说明
    //rows：数据源数组
    //by：要合并的字段，可以字符串数组或者字符串
    //sum：要合计的字段，可以字符串数组或者字符串，或者一个合计函数
    //返回值：处理后的数组
    static groupBy(rows, by, sum){
        if (typeof(by)=='string'){
            by = [by];
        }
        if (typeof(sum)=='string'){
            sum = [sum];
        }
        let result = [];
        for(let row of rows){
            let match = false;
            let group = {}
            for(let item of result){
                match = true;
                for(let field of by){
                    if (item[field]!=row[field]){
                        match = false;
                        break;
                    }
                }
                if (match){       
                    group = item;
                    break;
                }
            }
            if (!match){
                if (typeof sum=='function'){
                    sum(row);
                }
                result.push(row);
            } else {
                if (typeof sum=='function'){
                    sum(row, group);
                } else {
                    for(let field of sum){
                        group[field] = parseFloat(group[field])+parseFloat(row[field]);
                    }
                }
            }
        }
        return result;
    }

    //返回用于排序的字符串
    static getOrder(data){        
        let result = '';
        if (data.sort){			
            let sorts = data.sort.split(',');
            let orders = Array(sorts.length);	
            if (data.order){
                orders = data.order.split(',');
                orders.length = sorts.length;                
            }
            for(let i=0; i<sorts.length; i++){
                let sort = sorts[i];
                let order= orders[i];
                result = result?'':result+',';
                result = order?sort+' '+order:sort;
            }
        }
        return result;
    }

    //返回位移
    static getOffset(data){
        let result  = 0;
        if (data.offset){
            result = data.offset;
        } else if (data.page){
            result = (data.page-1) * data.limit;
        }
        return result;
    }
}

class ModelService extends BaseService{

    //model名，默认和本身同名
    static modelName(){
        return this.name();
    }
 
    static async beginTran(data, env){
        let conn = await db.begin({
            transaction: true
        });
        let multi = cache.begin();
        return {
            conn, multi
        }
    }

    static async endTran(tran, commit){
        if (commit){            
            await db.commit(tran.conn);
            cache.commit(tran.multi);
        } else {
            await db.rollback(tran.conn);
            cache.rollback(tran.multi);
        }
    }   

   //默认的更新功能
   static async update(data, env){    
        if (!data.id){
            throw '无效的对象标识，无法完成修改!'
        }
        
        if (!env.authed){
            let val = await this.doAuth(data, env, 'update');
            if (!val){
                throw '权限不足，无法完成修改！'
            }        
        }
        for(let col in data){
            if (typeof data[col]=='boolean'){
                data[col]=data[col]?'1':'0';
            }
        }
        let tran = await this.beginTran(data, env);
        try{
            await this.doUpdate(data, env,  tran.conn, tran.multi);
            await this.endTran(tran, true);
            return data.id;
        }catch(err){
            await this.endTran(tran, false);
            throw err;
        }
    }

    //默认的添加功能
    static async add(data, env){    
        if (!env.authed){
            let val = await this.doAuth(data, env, 'add');
            if (!val){
                throw '权限不足，无法添加！'
            }
        }
        
        for(let col in data){
            if (typeof data[col]=='boolean'){
                data[col]=data[col]?'1':'0';
            }
        }
        let tran = await this.beginTran(data, env);
        try{
            let id = await this.doAdd(data, env,  tran.conn, tran.multi);
            await this.endTran(tran, true);
            return id;
        }catch(err){
            await this.endTran(tran, false);
            throw err;
        }
    }

    //默认的删除功能
    static async delete(data, env){     
        if (!data.id){
            throw '无效的对象标识，无法完成修改!'
        }
        let val = await this.doAuth(data, env, 'delete');
        if (!val){
            throw '权限不足，无法完成删除！'
        }
        let tran = await this.beginTran(data, env);
        try{
            await this.doDelete(data, env,  tran.conn, tran.multi);
            await this.endTran(tran, true);
        }catch(err){
            await this.endTran(tran, false);
            throw err;
        }
    }

    static async import(data, env){        
        let val =await this.doAuth(data, env, 'import');
        if (!val){
            throw '权限不足，无法完成导入！'
        }
        env.authed= true;
        let rows, fields;
        //获取输入的数据内容
        if ((/\.xlsx$/.test(data.filename)) || (/\.xls$/.test(data.filename))){
            //导入excel内容
            rows = xlsx.parse(data.buffer);
            if (rows.length>0){
                //获取 第一个sheet的内容
                rows = rows[0].data;
                //第一行必须为标题
                fields = rows[0];
                //数据不包含第一行
                rows.shift();
            }
        }
        //根据字段的中英文对应表转换标题到字段名
        let dict = await this.doDict(data, env, 'import');
        for(let i=0; i<fields.length;i++){
            let field = fields[i];
            for(let name in dict){
                if (dict[name]==field){
                    fields[i] = name;
                    break;
                }
            }
        }
        //数据导入
        for(let item of rows){
            let row = {};
            for(let i=0; i<fields.length; i++){
                let field = fields[i];
                row[field] = item[i];
            }
            row = await this.doImport(row);
            if (row.id){
                await this.update(row, env)
            } else {
                await this.add(row, env);
            }
        }
    }
    
   //导入一行数据，返回可用于add函数的数据对象
    //row 一个数据对象
    static async doImport(row){
        return row;
    }


    static async doGet(data, env){    
        let table = models(this.modelName());
        let rows = await table.select({id: data.id});
        let row = {}
        if (rows.length>0){
            //连接字段
            await this.doJoin(data, env, rows[0], 'get');
            //过滤
            if (await this.doFilter(data, env, rows[0])){
                row = rows[0];
            }
        } 
        return row;
    }

    //获取列表数据的处理过程
    //data: 传递外部调用的数据
    //row: 要验证的数据
    static async doFilter(data, env, row) {;
        return true;
    }

     //处理外键的过程
    //data: 传递外部调用的数据
    //row: 当前行数据
    //op: 操作，值为get|list
    static async doJoin(data, env, row, op){
    }

    static async doList(data, env){    
        let table = models(this.modelName());
        let all = await table.select(data.filter);
        let result = [];
        for (let row of all){
            //连接字段
            await this.doJoin(data, env, row, 'list');
            //过滤
            if (await this.doFilter(data, env, row)){
                result.push(row);
            }
        }
        //分页排序
        let count = result.length;
        result = this.paging(data, env, result);
        return {    
            rows : result,
            count
        }
    }

    static async doUpdate(data, env, conn, multi){
        let table = models(this.modelName());
        return await table.update(data, conn, multi);
    }

    static async doAdd(data, env, conn, multi){
        let table = models(this.modelName());
        return await table.insert(data, conn, multi);
    }

    static async doDelete(data, env, conn, multi){
        let table = models(this.modelName());
        let rows = await table.select({id: data.id});
        if (rows.length==1){
            await table.delete({id:data.id}, conn, multi);
        } else  if (rows.length==0){
            throw `删除错误，id为${data.id}的记录不存在！`
        } else {
            throw `删除错误，id为${data.id}的记录存在多个！`;
        }
    }
}

class CustomService extends BaseService{

    //model名，默认和本身同名
    static modelName(){

    }
 
    static async beginTran(data, env){
    }

    static async endTran(tran, commit){
    }   

   //默认的更新功能
   static async update(data, env){    
        if (!data.id){
            throw '无效的对象标识，无法完成修改!'
        }
        
        if (!env.authed){
            let val = await this.doAuth(data, env, 'update');
            if (!val){
                throw '权限不足，无法完成修改！'
            }        
        }
        for(let col in data){
            if (typeof data[col]=='boolean'){
                data[col]=data[col]?'1':'0';
            }
        }
        let tran = await this.beginTran(data, env);
        try{
            await this.doUpdate(data, env,  tran.conn, tran.multi);
            await this.endTran(tran, true);
            return data.id;
        }catch(err){
            await this.endTran(tran, false);
            throw err;
        }
    }

    //默认的添加功能
    static async add(data, env){ 
        if (!env.authed){
            let val = await this.doAuth(data, env, 'add');
            if (!val){
                throw '权限不足，无法添加！'
            }
        }
         
        for(let col in data){
            if (typeof data[col]=='boolean'){
                data[col]=data[col]?'1':'0';
            }
        } 
        let tran = await this.beginTran(data, env);
        try{
            let id = await this.doAdd(data, env,  tran.conn, tran.multi);
            await this.endTran(tran, true); 
            return id;
        }catch(err){
            await this.endTran(tran, false);
            throw err;
        }
    }

    //默认的删除功能
    static async delete(data, env){     
        if (!data.id){
            throw '无效的对象标识，无法完成修改!'
        }
        let val = await this.doAuth(data, env, 'delete');
        if (!val){
            throw '权限不足，无法完成删除！'
        }
        let tran = await this.beginTran(data, env);
        try{
            await this.doDelete(data, env,  tran.conn, tran.multi);
            await this.endTran(tran, true);
        }catch(err){
            await this.endTran(tran, false);
            throw err;
        }
    }

    static async import(data, env){        
        let val =await this.doAuth(data, env, 'import');
        if (!val){
            throw '权限不足，无法完成导入！'
        }
        env.authed= true;
        let rows, fields;
        //获取输入的数据内容
        if ((/\.xlsx$/.test(data.filename)) || (/\.xls$/.test(data.filename))){
            //导入excel内容
            rows = xlsx.parse(data.buffer);
            if (rows.length>0){
                //获取 第一个sheet的内容
                rows = rows[0].data;
                //第一行必须为标题
                fields = rows[0];
                //数据不包含第一行
                rows.shift();
            }
        }
        //根据字段的中英文对应表转换标题到字段名
        let dict = await this.doDict(data, env, 'import');
        for(let i=0; i<fields.length;i++){
            let field = fields[i];
            for(let name in dict){
                if (dict[name]==field){
                    fields[i] = name;
                    break;
                }
            }
        }
        //数据导入
        for(let item of rows){
            let row = {};
            for(let i=0; i<fields.length; i++){
                let field = fields[i];
                row[field] = item[i];
            }
            row = await this.doImport(row);
            if (row.id){
                await this.update(row, env)
            } else {
                await this.add(row, env);
            }
        }
    }
    
   //导入一行数据，返回可用于add函数的数据对象
    //row 一个数据对象
    static async doImport(row){
        return row;
    }


    static async doGet(data, env){    
    }

    static async doList(data, env){
    }

    static async doUpdate(data, env, tran){
    }

    static async doAdd(data, env, tran){
    }

    static async doDelete(data, env, tran){
    }
}
module.exports = {
    BaseService,
    ModelService,
    CustomService
};