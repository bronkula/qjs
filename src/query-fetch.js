;(()=>{
if(!q) throw "qjs not imported yet";

const {asArray,isJson} = q;

const catchJson = async d => {
   let r = await d.text();
   return isJson(r) ?
      Promise.resolve(JSON.parse(r)) :
      Promise.reject({error:'JSON Malformed',data:r}); }


const promiseList = (type) => (list, fn=data=>data) => 
   list.map((...args) => pipeddata =>
      type(...args).then(data => pipeddata.concat([fn(data)])));
const promiseEach = (list) => 
   list.reduce((accumulator, callback) => {
      if(Array.isArray(callback)) {
         let [fulfill=()=>{}, reject=()=>{}] = callback;
         return accumulator.then(fulfill, reject);
      } else return accumulator.then(callback);
   }, Promise.resolve([]));


const get = (url, o) => fetch(url, o).then(catchJson);
const getAll = list => Promise.all(list.map(o => get(...asArray(o))));
const getList = promiseList(get);
const getEach = list => promiseEach(getList(list));

const POST = {method:'POST'};
const post = (url, o) => fetch(url, {...POST, body: JSON.stringify(o)}).then(catchJson);
const postAll = list => Promise.all(list.map(o => post(...asArray(o))));
const postList = promiseList(post);
const postEach = list => promiseEach(postList(list));


const toFormData = (d={}) => Object.entries(d)
   .reduce((r, [k,v])=>{ r.append(k,v); return r; }, new FormData);
const postForm = (url, o) => fetch(url, {...POST, body: toFormData(o)}).then(catchJson);
const postFormAll = list => Promise.all(list.map(o => postForm(...asArray(o))));
const postFormList = promiseList(postForm);
const postFormEach = list => promiseEach(postFormList(list));


const getHTML = async (url) => {
   getHTML.files ??= {};
   if (getHTML.files[url]) return q(getHTML.files[url]);
   const file = await fetch(url).then(d=>d.text()).catch(()=>false);
   if (file) getHTML.files[url] = file;
   return q(file);
}

Object.assign(q,{
   catchJson,
   promiseList,
   promiseEach,
   get,
   getAll,
   getList,
   getEach,
   post,
   postAll,
   postList,
   postEach,
   toFormData,
   postForm,
   postFormAll,
   postFormList,
   postFormEach,
   getHTML
});


})();
