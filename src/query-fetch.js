;(()=>{
if(!q) throw "qjs not imported yet";

const {asArray,isArray,isJson} = q;
const {resolve,reject,all} = Promise;

const catchJson = async d => {
   let r = await d.text();
   return isJson(r) ?
      resolve(JSON.parse(r)) :
      reject({error:'JSON Malformed',data:r}); }


const promiseAll = (promisetype) => (list) =>
   all(list.map((o) => promisetype(...asArray(o))))
const promiseList = (promisetype) => (list, fn=d=>d) => 
   list.map((url) =>
      (pipeddata) => promisetype(...asArray(url)).then((data) =>
         (pipeddata??[]).concat([fn(data)])
      )
   );
const promiseEach = (functionlist) => 
   functionlist.reduce((accumulator, callback) => {
      if(isArray(callback)) {
         const [resolve=()=>{}, reject=()=>{}] = callback;
         return accumulator.then(resolve, reject);
      } else return accumulator.then(callback);
   }, resolve([]));

const get = (url, o) => fetch(url, o).then(catchJson);
const getAll = promiseAll(get)
const getList = promiseList(get);
const getEach = (list, fn) => promiseEach(getList(list, fn));


const POST = {method:'POST'};
const post = (url, o) => fetch(url, {...POST, body: JSON.stringify(o)}).then(catchJson);
const postAll = promiseAll(post)
const postList = promiseList(post);
const postEach = (list, fn) => promiseEach(postList(list, fn));


const toFormData = (d={}) => Object.entries(d)
   .reduce((r, [k,v])=>{ r.append(k,v); return r; }, new FormData);
const postForm = (url, o) => fetch(url, {...POST, body: toFormData(o)}).then(catchJson);
const postFormAll = promiseAll(postForm)
const postFormList = promiseList(postForm);
const postFormEach = (list, fn) => promiseEach(postFormList(list, fn));


const getHTML = async (url) => {
   getHTML.files ??= {};
   if (getHTML.files[url]) return q(getHTML.files[url]);
   const file = await fetch(url).then((d) => d.text()).catch(()=>false);
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
