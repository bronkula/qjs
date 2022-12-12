;(()=>{
if(!q) throw "qjs not imported yet";


q.template = fn => arr => (Array.isArray(arr)?arr:[arr]).reduce((r,o,i,a)=>r + fn(o,i,a),'');

})();