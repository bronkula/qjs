;(()=>{
if(!q) throw "qjs not imported yet";

const {isString,isArray,isQ,unQ,htmlEncode,parse,extend,settle} = q;

/* Manipulation methods */
function remove(){
    return this.sift(o=>{ o.parentElement?.removeChild(o); return false; }) }
function detach(){
    return this.sift(o=>o.parentElement?.removeChild(o) ?? o); }

function clear(){ return this.pipe(empty) }

function append(e){
    return this.sift(o=>q(e).map(el=>{ o.appendChild(el); return o; })); }
function appendTo(e){
    return this.sift(o=>q(e).map(el=>{ el.appendChild(o); return o; })); }
function prepend(e){
    return this.sift(o=>q(e).map(el=>{ o.insertBefore(el,o.children[0]); return o; })); }
function prependTo(e){
    return this.sift(o=>q(e).map(el=>{ el.insertBefore(o,el.children[0]); return o; })); }
function before(e){
    return this.sift(o=>q(e).map(el=>{ o.parentElement.insertBefore(el,o); return o; })); }
function after(e){
    return this.sift(o=>q(e).map(el=>{ o.parentElement.insertBefore(el,o.nextSibling); return o; })); }


function replaceWith(e){ if(!isQ(e)) e=q(e);
    return this.sift(o=>replace(o,e[0])); }

/* Class List Methods */
function addClass(e){
    return this.pipe(o=>{ tokenList(e).forEach(c=>o.classList.add(c)); return o; }); }
function removeClass(e){
    return this.pipe(o=>{ tokenList(e).forEach(c=>o.classList.remove(c)); return o; }); }
function toggleClass(e, force){
    return this.pipe(o=>{ tokenList(e).forEach(c=>o.classList.toggle(c, force)); return o; }); }
function hasClass(e){
    return this.some(o=>tokenList(e).every(c=>o.classList.contains(c))); }

/* Attribute Methods */
function addAttr(e){
    return this.pipe(o=>{ tokenList(e).forEach(c=>o.setAttribute(c,true)); return o; }); }
function removeAttr(e){
    return this.pipe(o=>{ tokenList(e).forEach(c=>o.removeAttribute(c)); return o; }); }
function toggleAttr(e, force){
    return this.pipe(o=>{ tokenList(e).forEach(c=>o.toggleAttribute(c, force)); return o; }); }
function hasAttr(e){
    return this.pipe(o=>tokenList(e).every(c=>o.hasAttribute(c))); }

/* Getters and Setters */
function css(e, getcomputed){
    if (isString(e)) {
        return getcomputed ?
            window.getComputedStyle(this[0]).getPropertyValue(toSnakeCase(e)) :
            this[0].style[toPropCase(e)];
    }
    return this.pipe(o=>setCSS(o,e)); }
function attr(e){
    if (isString(e)) return this[0].getAttribute(e);
    if (e === undefined) return this[0].attributes;
    return this.pipe(o=>setAttr(o,e)); }
function data(e){
    if (isString(e) || e === undefined) return getData(this[0],e);
    return this.pipe(o=>setData(o,e)); }
function val(e){
    return e === undefined ? this[0].value : this.pipe(o=>setVal(o,e)); }
function html(...e){
    return e.length === 0 ? this[0].innerHTML : this.pipe(o=>setHTML(o,...e)); }
function text(...e){
    return e.length === 0 ? this[0].innerText : this.pipe(o=>setText(o,...e)); }

/* Properties */
function rect(){
    return this[0].getBoundingClientRect(); }
function index(e){
    if (e !== undefined) return this.toArray().indexOf(unQ(e));
    return this.siblings().index(this[0]); }


const empty = function(o){ o.innerHTML = ""; return o; }

const setCSS = (o, e) => {
    for (let i in e) { if (e.hasOwnProperty(i)) { o.style[toPropCase(i)] = e[i]; } } return o; }
const setAttr = (o, e) => {
    for (let i in e) { if (e.hasOwnProperty(i)) { o.setAttribute(i,e[i]); } } return o; }
const setVal = (o, e) => { o.value = e; return o; }
const setText = (o, ...e) => { o.innerText = e.join(''); return o; }
const setHTML = (o, ...e) => {
    o.innerHTML = ""; let s = settle(e);
    s.forEach(i=>o.append(isString(i)?htmlEncode(i):i));
    return o; }
const replace = (o, e) => { o.replaceWith(e); return o; }

const tokenList = (s) =>
    isArray(s) ? e :
    isString(s) ? s.split(' ') :
    [];


/* Cache methods for data manipulation */
const setCache = function(o, k, v) {
    o.qcache ??= getData(o); if (k) o.qcache[k]=v; }
const setData = function(o,e) {
    o.qcache ??= getData(o); Object.assign(o.qcache,e); return o; }
const getData = function(o,e) {
    if (o.qcache === undefined) {
        o.qcache = {};
        for(let [k,v] of Object.entries(o.dataset)) setCache(o,k,parse(v));
    }
    if (o.dataset[e] !== undefined && o.qcache[e] !== o.dataset[e])
        setCache(o,e,parse(o.dataset[e]));
    return e===undefined ? o.qcache : o.qcache[e]; }


/* Turn css dash case properties to Camelcase */
const toPropCase = function(e) {
    return e.replace(/\-([a-z])/g,(m,p)=>p.toUpperCase()); }
const toSnakeCase = function(e) {
    return e.replace(/[A-Z]/g,(m)=>'-'+m.toLowerCase()); }

Object.entries({
    remove,
    detach,
    empty:clear,
    clear,
    append,
    appendTo,
    prepend,
    prependTo,
    before,
    after,
    replaceWith,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    addAttr,
    removeAttr,
    toggleAttr,
    hasAttr,
    css,
    attr,
    data,
    val,
    html,
    text,
    rect,
    index
}).forEach(([k,v])=>{extend(k,v)})
Object.assign(q,{
    empty,
    setCSS,
    setAttr,
    setVal,
    setText,
    setHTML,
    replace,
    tokenList,
    setCache,
    setData,
    getData,
    toPropCase,
    toSnakeCase
});

})();