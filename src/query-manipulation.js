;(()=>{
if(!q) throw "qjs not imported yet";


/* Manipulation methods */
q.extend('remove',function(){
    return this.sift(o=>{ o.parentElement?.removeChild(o); return false; }) });
q.extend('detach',function(){
    return this.sift(o=>o.parentElement?.removeChild(o) ?? o); });

q.extend(['clear','empty'],function(){ return this.pipe(q.clear) });

q.extend('append',function(e){ e=q(e);
    return this.sift(o=>q(e).map(el=>{ o.appendChild(el); return o; })); });
q.extend('appendTo',function(e){ e=q(e);
    return this.sift(o=>q(e).map(el=>{ el.appendChild(o); return o; })); });
q.extend('prepend',function(e){ e=q(e);
    return this.sift(o=>q(e).map(el=>{ o.insertBefore(el,o.children[0]); return o; })); });
q.extend('prependTo',function(e){ e=q(e);
    return this.sift(o=>q(e).map(el=>{ el.insertBefore(o,el.children[0]); return o; })); });
q.extend('before',function(e){ e=q(e);
    return this.sift(o=>q(e).map(el=>{ o.parentElement.insertBefore(el,o); return o; })); });
q.extend('after',function(e){ e=q(e);
    return this.sift(o=>q(e).map(el=>{ o.parentElement.insertBefore(el,o.nextSibling); return o; })); });


q.extend('replaceWith',function(e){ if(!q.isQ(e)) e=q(e);
    return this.sift(o=>q.replaceWith(o,e[0])); });

/* Class List Methods */
q.extend('addClass',function(e){
    return this.pipe(o=>{ q.tokenList(e).forEach(c=>o.classList.add(c)); return o; }); });
q.extend('removeClass',function(e){
    return this.pipe(o=>{ q.tokenList(e).forEach(c=>o.classList.remove(c)); return o; }); });
q.extend('toggleClass',function(e, force){
    return this.pipe(o=>{ q.tokenList(e).forEach(c=>o.classList.toggle(c, force)); return o; }); });
q.extend('hasClass',function(e){
    return this.some(o=>q.tokenList(e).every(c=>o.classList.contains(c))); });

/* Attribute Methods */
q.extend('addAttr',function(e){
    return this.pipe(o=>{ q.tokenList(e).forEach(c=>o.setAttribute(c,true)); return o; }); });
q.extend('removeAttr',function(e){
    return this.pipe(o=>{ q.tokenList(e).forEach(c=>o.removeAttribute(c)); return o; }); });
q.extend('toggleAttr',function(e, force){
    return this.pipe(o=>{ q.tokenList(e).forEach(c=>o.toggleAttribute(c, force)); return o; }); });
q.extend('hasAttr',function(e){
    return this.pipe(o=>q.tokenList(e).every(c=>o.hasAttribute(c))); });

/* Getters and Setters */
q.extend('css',function(e, getcomputed){
    if (q.isString(e)) {
        return getcomputed ?
            window.getComputedStyle(this[0]).getPropertyValue(q.toSnakeCase(e)) :
            this[0].style[q.toPropCase(e)];
    }
    return this.pipe(o=>q.setCSS(o,e)); });
q.extend('attr',function(e){
    if (q.isString(e)) return this[0].getAttribute(e);
    if (e === undefined) return this[0].attributes;
    return this.pipe(o=>q.setAttr(o,e)); });
q.extend('data',function(e){
    if (q.isString(e) || e === undefined) return q.getData(this[0],e);
    return this.pipe(o=>q.setData(o,e)); });
q.extend('val',function(e){
    return e === undefined ? this[0].value : this.pipe(o=>q.setVal(o,e)); });
q.extend('html',function(...e){
    return e.length === 0 ? this[0].innerHTML : this.pipe(o=>q.setHTML(o,...e)); });
q.extend('text',function(...e){
    return e.length === 0 ? this[0].innerText : this.pipe(o=>q.setText(o,...e)); });

/* Properties */
q.extend('rect',function(){
    return this[0].getBoundingClientRect(); });
q.extend('classList',function(){
    return [...this[0].classList]; });
q.extend('class',function(){
    return this[0].className; });
q.extend('index',function(e){
    if (e !== undefined) return this.toArray().indexOf(q.isQ(e) ? e[0] : e);
    return this.siblings().index(this[0]); });


q.clear = function(o){ o.innerHTML = ""; return o; }

q.setCSS = (o,e) => {
    for (let i in e) { if (e.hasOwnProperty(i)) { o.style[q.toPropCase(i)] = e[i]; } } return o; }
q.setAttr = (o,e) => {
    for (let i in e) { if (e.hasOwnProperty(i)) { o.setAttribute(i,e[i]); } } return o; }
q.setVal = (o,e) => { o.value = e; return o; }
q.setText = (o,...e) => { o.innerText = e.join(''); return o; }
q.setHTML = (o,...e) => {
    o.innerHTML = ""; let s = q.settle(e);
    s.forEach(i=>o.append(q.isString(i)?q.htmlEncode(i):i));
    return o; }
q.replaceWith = (o,e) => { o.replaceWith(e); return o; }

q.tokenList = (s) =>
    q.isArray(s) ? e :
    q.isString(s) ? s.split(' ') :
    [];


/* Cache methods for data manipulation */
q.setCache = function(o,k,v) {
    o.qcache ??= q.getData(o); if (k) o.qcache[k]=v; }
q.setData = function(o,e) {
    o.qcache ??= q.getData(o); Object.assign(o.qcache,e); return o; }
q.getData = function(o,e) {
    if (o.qcache === undefined) {
        o.qcache = {};
        for(let [k,v] of Object.entries(o.dataset)) q.setCache(o,k,q.parse(v));
    }
    if (o.dataset[e] !== undefined && o.qcache[e] !== o.dataset[e])
        q.setCache(o,e,q.parse(o.dataset[e]));
    return e===undefined ? o.qcache : o.qcache[e]; }


/* Turn css dash case properties to Camelcase */
q.toPropCase = function(e) {
    return e.replace(/\-([a-z])/g,(m,p)=>p.toUpperCase()); }
q.toSnakeCase = function(e) {
    return e.replace(/[A-Z]/g,(m)=>'-'+m.toLowerCase()); }


})();