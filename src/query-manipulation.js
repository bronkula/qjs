;(()=>{
if(!q) throw "qjs not imported yet";


/* Manipulation methods */
q.extend('remove',function(){
    return this.sift(o=>{ o.parentElement.removeChild(o); return false; }) });
q.extend('detach',function(){
    return this.sift(o=>{ o.parentElement.removeChild(o); return o; }) });

q.extend(['clear','empty'],function(){ return this.pipe(q.clear) });

q.extend('append',function(e){ e=q(e);
    return this.sift(o=>e.map(el=>{ o.appendChild(el); return o; })); });
q.extend('appendTo',function(e){ e=q(e);
    return this.sift(o=>e.map(el=>{ el.appendChild(o); return o; })); });
q.extend('prepend',function(e){ e=q(e);
    return this.sift(o=>e.map(el=>{ o.insertBefore(el,o.children[0]); return o; })); });
q.extend('prependTo',function(e){ e=q(e);
    return this.sift(o=>e.map(el=>{ el.insertBefore(o,el.children[0]); return o; })); });
q.extend('before',function(e){ e=q(e);
    return this.sift(o=>e.map(el=>{ o.parentElement.insertBefore(el,o); return o; })); });
q.extend('after',function(e){ e=q(e);
    return this.sift(o=>e.map(el=>{ o.parentElement.insertBefore(el,o.nextSibling); return o; })); });


q.extend('replaceWith',function(e){ if(!q.isQ(e)) e=q(e);
    return this.sift(o=>q.replaceWith(o,e[0])); });

/* Class List Methods */
q.extend('addClass',function(e){
    return this.pipe(o=>{ o.classList.add(e); return o; }); });
q.extend('removeClass',function(e){
    return this.pipe(o=>{ o.classList.remove(e); return o; }); });
q.extend('toggleClass',function(e, force){
    return this.pipe(o=>{ o.classList.toggle(e, force); return o; }); });
q.extend('hasClass',function(e){
    return this.some(o=>o.classList.contains(e)); });

/* Attribute Methods */
q.extend('addAttr',function(e){
    return this.pipe(o=>{ o.setAttribute(e,true); return o; }); });
q.extend('removeAttr',function(e){
    return this.pipe(o=>{ o.removeAttribute(e); return o; }); });
q.extend('toggleAttr',function(e, force){
    return this.pipe(o=>{ o.toggleAttribute(e, force); return o; }); });
q.extend('hasAttr',function(e){
    return this.pipe(o=>{ o.hasAttribute(e); return o; }); });

/* Getters and Setters */
q.extend('css',function(e){
    if (q.isString(e)) return this[0].style[q.toPropCase(e)];
    if (e === undefined) return this[0].classList;
    return this.pipe(o=>q.setCSS(o,e)); });
q.extend('attr',function(e){
    if (q.isString(e)) return this[0].getAttribute(e);
    if (e === undefined) return this[0].attributes;
    return this.pipe(o=>q.setAttr(o,e)); });
q.extend('data',function(e){
    if (q.isString(e) || e === undefined) return q.getData(this[0],e);
    return this.pipe(o=>q.setData(o,e)); });
q.extend('val',function(e){
    if (e === undefined) return this[0].value;
    return this.pipe(o=>q.setVal(o,e)); });
q.extend('html',function(...e){
    if (e.length === 0) return this[0].innerHTML;
    return this.pipe(o=>q.setHTML(o,...e)); });
q.extend('text',function(...e){
    if (e.length === 0) return this[0].innerText;
    return this.pipe(o=>q.setText(o,...e)); });

/* Properties */
q.extend('rect',function(){
    return this[0].getBoundingClientRect(); });
q.extend('classList',function(){
    return [...this[0].classList]; });
q.extend('className',function(){
    return this[0].className; });
q.extend('index',function(e){
    if (e !== undefined) return this.toArray().indexOf(e);
    return this.siblings().index(this[0]); });


q.clear = function(o){ o.innerHTML = ""; return o; }

q.setCSS = (o,e) => {
    for (let i in e) { if (e.hasOwnProperty(i)) {
        o.style[q.toPropCase(i)] = e[i]; } } return o; }
q.setAttr = (o,e) => {
    for (let i in e) { if (e.hasOwnProperty(i)) {
        o.setAttribute(i,e[i]); } } return o; }
q.setVal = (o,e) => { o.value = e; return o; }
q.replaceWith = (o,e) => { o.replaceWith(e); return o; }
q.setHTML = (o,...e) => {
    o.innerHTML = ""; let s = q.settle(e);
    s.forEach(i=>o.append(q.isString(i)?q.htmlEncode(i):i));
    return o; }


/* Cache methods for data manipulation */
q.setCache = function(o,k,v) {
    if (o.qcache === undefined) o.qcache = {};
    if (k) o.qcache[k]=v; }
q.setData = function(o,e) {
    if (o.qcache === undefined) o.qcache = {};
    for (let i in e) { if (e.hasOwnProperty(i)){ o.qcache[i]=e[i]; } } return o; }
q.getData = function(o,e) {
    if (o.qcache === undefined) {
        o.qcache = {};
        for(let [k,v] of Object.entries(o.dataset))
            q.setCache(o,k,q.parse(v));
    }
    if (o.dataset[e] !== undefined && o.qcache[e] !== o.dataset[e])
        q.setCache(o,e,q.parse(o.dataset[e]));
    return e===undefined?o.qcache:o.qcache[e]; }


/* Turn css dash case properties to Camelcase */
q.toPropCase = function(e) {
    return e.replace(/\-([a-z])/g,(m,p)=>p.toUpperCase()); }


})();