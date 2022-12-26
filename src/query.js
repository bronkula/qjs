/** qjs created by Hamilton Cline - hamdiggy@gmail.com */


;((w)=>{

class Q {
    constructor(s, sc = w.document, debug = false) {
        let nl =
            !s || !q.isElement(sc) ? [] :
            q.isQ(s) ? s.toArray() :
            q.isElement(s) || s==sc ? [s] :
            q.isFragment(s) ? q.makeFragment(s) :
            q.isArray(s) ? q.settle(s) :
            q.isFunction(s) ? !window.addEventListener('DOMContentLoaded',s) :
            sc.querySelectorAll(s);
        if (debug) q.debug(s,sc,nl);
        if (!nl) return false;
        Object.assign(this,nl);
        this.length = nl.length;
    }

    /* Return only unique, non false, elements */
    sift(f) { return q(q.sift(this,f)); }
    pipe(f) { return q(this.map(f)); }

    /* Alter a Q selection to a more basic type */
    toArray() { return this.reduce((r,o)=>r.concat([o]),[]) }
    toString() { return this.reduce((r,o)=>r+q.isElement(o)?o.outerHTML:`${o}`,'') }
    toText() { return this.reduce((r,o)=>r+q.isElement(o)?o.innerText:`${o}`,'') }
    
    forEach = Array.prototype.forEach;
    map = Array.prototype.map;
    flatMap = Array.prototype.flatMap;
    reduce = Array.prototype.reduce;
    some = Array.prototype.some;
    every = Array.prototype.every;
    filter = Array.prototype.filter;
    slice = Array.prototype.slice;
}


const q = (s,sc,d) => new Q(s,sc,d);


q.isElement = d => d instanceof HTMLDocument || d instanceof HTMLElement || d instanceof SVGElement || d instanceof Element;
q.isHTML = d => d instanceof HTMLElement || d instanceof HTMLDocument;
q.isSVG = d => d instanceof SVGElement;
q.isObject = d => d instanceof Object && d !== null && !Array.isArray(d);
q.isString = d => typeof d == "string" || d instanceof String;
q.isFunction = d => typeof d == "function";
q.isBool = d => typeof d == "boolean";
q.isQ = d => d instanceof Q;
q.isArray = d => Array.isArray(d);
q.isFragment = d => q.isString(d) && d.trim()[0]=="<";
q.isEntity = d => q.isString(d) && d.trim()[0]=="&" && d.trim().substr(-1)==";";
q.isJson = (s) => {
    s = typeof s !== "string" ? JSON.stringify(s) : s;
    try { s = JSON.parse(s); } catch (e) { return false; }
    return typeof s === "object" && s !== null;
}
q.parse = (d) => { try { return JSON.parse(d); } catch(e) { return d; } }
q.matching = (s) => (o) => { try { return !s || o.matches(s); } catch(e) { return false; } }


q.asArray = (d) => Array.isArray(d) ? d : [d];
q.makeFragment = (s) => q.isFragment(s) ?
    [...document.createRange().createContextualFragment(s.trim()).childNodes] : [s];
q.make = (s) => q(q.makeFragment(s));
q.unQ = (e) => q.isQ(e) ? e[0] : e;

q.htmlEncode = function(s) {
   let d = document.createElement('div');
   d.innerHTML = s; return d.innerText;
}


q.extend = (keys, fn, force = false) => {
    q.asArray(keys).forEach(key=>{
        if (!q.hasExtension(key) || force) Q.prototype[key] = fn }) }
q.hasExtension = (key) => {
    return q.isFunction(Q.prototype[key]); }


q.sift = (s,f) => {
    let set = s.toArray().flatMap(f);
    return [...(new Set(set))]; }
q.settle = (o) => {
    return o.flatMap(e=>!e ? [] :
        q.isFragment(e) ? q.makeFragment(e) :
        q.isQ(e) ? e.toArray() : e ); }


q.debug = (s,sc,nl) => {
    const l = console.log;
    console.group();
    l("debug");
    l("selector",s);
    l("selector context",sc);
    l("isHTML SC",q.isHTML(sc));
    l("isHTML S",q.isHTML(s));
    l("isSVG S",q.isSVG(s));
    l("isQ S",q.isQ(s));
    l("isElement S",q.isElement(s));
    l("isFragment S",q.isFragment(s));
    l("isFunction S",q.isFunction(s));
    l("isArray S",q.isArray(s));
    l("isEntity S",q.isEntity(s));
    l("isJson S",q.isJson(s));
    l("isString S",q.isString(s));
    l("isObject S",q.isObject(s));
    try {l("querySelectorAll S",sc.querySelectorAll(s));} catch(e){}
    l("node list",nl);
    console.groupEnd();
}


w.q = q;
})(window);