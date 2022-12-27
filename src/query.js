/** qjs created by Hamilton Cline - hamdiggy@gmail.com */
;((w)=>{

const ap = Array.prototype;
class Q {
    constructor(selector, selectorcontext = w.document, debug = false) {
        let nodelist = q.identify(selector,selectorcontext);
        if (debug) q.debug(selector,selectorcontext,nodelist);
        if (!nodelist) return false;
        Object.assign(this, nodelist);
        this.length = nodelist.length;
    }

    /* Return only unique, non false, elements */
    sift(fn) { return q(q.sift(this,fn)); }
    pipe(fn) { return q(this.map(fn)); }

    /* Alter a Q selection to a more basic type */
    toArray() { return this.reduce((r,o)=>r.concat([o]), []) }
    toString() { return this.reduce((r,o)=>r + isElement(o) ? o.outerHTML : `${o}`, '') }
    toText() { return this.reduce((r,o)=>r + isElement(o) ? o.innerText : `${o}`, '') }
    
    forEach = ap.forEach;
    map = ap.map;
    flatMap = ap.flatMap;
    reduce = ap.reduce;
    some = ap.some;
    every = ap.every;
    filter = ap.filter;
    slice = ap.slice;
    indexOf = ap.indexOf;
}

const HD = HTMLDocument;
const HE = HTMLElement;
const SV = SVGElement;
const instanceOf = (d,t) => d instanceof t;
const typeOf = (d,t) => typeof d === t;
const isElement = (d) => instanceOf(d, HD) || instanceOf(d, HE) || instanceOf(d, SV) || instanceOf(d, Element);
const isHTML = (d) => instanceOf(d, HD) || instanceOf(d, HE);
const isSVG = (d) => instanceOf(d, SV);
const isObject = (d) => instanceOf(d, Object) && d !== null && !isArray(d);
const isString = (d) => typeOf(d,"string") || instanceOf(d, String);
const isFunction = (d) => typeOf(d,"function");
const isBool = (d) => typeOf(d,"boolean");
const isQ = (d) => instanceOf(d, Q);
const isArray = (d) => Array.isArray(d);
const isFragment = (d) => isString(d) && d.trim()[0]=="<";
const isEntity = (d) => isString(d) && d.trim()[0]=="&" && d.trim().substr(-1)==";";
const isJson = (s) => {
    s = !typeOf(s,"string") ? JSON.stringify(s) : s;
    try { s = JSON.parse(s); } catch (e) { return false; }
    return typeOf(s,"object") && s !== null;
}
const parse = (d) => { try { return JSON.parse(d); } catch(e) { console.error(e); return d; } }
const matching = (s) => (o) => { try { return !s || o.matches(s); } catch(e) { return false; } }


const asArray = (d) => isArray(d) ? d : [d];
const makeFragment = (str) => isFragment(str) ?
    [...document.createRange().createContextualFragment(str.trim()).childNodes] : [str];
const make = (s) => q(makeFragment(s));
const unQ = (e) => isQ(e) ? e[0] : e;

const htmlEncode = function(str) {
    if (!isString(str)) return str;
    let el = document.createElement('div');
    el.innerHTML = str; return el.innerText;
}


/* Add new methods to q instances without overriding, with option to force */
const extend = (keys, fn, force = false) => {
    asArray(keys).forEach(key=>{
        if (hasExtension(key) && !force) throw(`QJS already has a ${key} extension.`);
        if (!hasExtension(key) || force) Q.prototype[key] = fn }) }
const hasExtension = (key) => isFunction(Q.prototype[key]);


/* flatmap the list and return only unique items */
const sift = (list, fn) => {
    let set = list.toArray().flatMap(fn);
    return [...(new Set(set))]; }
/* flatmap the list, remove falsey values, make fragments, un Q any Qs */
const settle = (list) => {
    return list.flatMap(o => !o ? [] :
        isFragment(o) ? makeFragment(o) :
        isQ(o) ? o.toArray() : o ); }

const identify = (selector, selectioncontext) => {
    return !selector || !isElement(selectioncontext) ? [] :
    isQ(selector) ? selector.toArray() :
    isElement(selector) || selector === selectioncontext ? [selector] :
    isFragment(selector) ? makeFragment(selector) :
    isArray(selector) ? settle(selector) :
    isFunction(selector) ? !window.addEventListener('DOMContentLoaded',selector) :
    selectioncontext.querySelectorAll(selector);
}

const debug = (s,sc,nl) => {
    const {log,group,groupEnd} = console;
    group();
    log("debug");
    log("selector",s);
    log("selector context",sc);
    log("isHTML SC",isHTML(sc));
    log("isHTML S",isHTML(s));
    log("isSVG S",isSVG(s));
    log("isQ S",isQ(s));
    log("isElement S",isElement(s));
    log("isFragment S",isFragment(s));
    log("isFunction S",isFunction(s));
    log("isArray S",isArray(s));
    log("isEntity S",isEntity(s));
    log("isJson S",isJson(s));
    log("isString S",isString(s));
    log("isObject S",isObject(s));
    try {log("querySelectorAll S",sc.querySelectorAll(s));} catch(e){}
    log("node list",nl);
    groupEnd();
}

const q = (s,sc,d) => new Q(s,sc,d);

Object.assign(q,{
    isElement,
    isHTML,
    isSVG,
    isObject,
    isString,
    isFunction,
    isBool,
    isQ,
    isArray,
    isFragment,
    isEntity,
    isJson,
    parse,
    matching,
    asArray,
    makeFragment,
    make,
    unQ,
    htmlEncode,
    extend,
    hasExtension,
    sift,
    settle,
    identify,
    debug
});

w.q = q;
})(window);