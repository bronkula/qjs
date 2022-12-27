;(()=>{
if(!q) throw "qjs not imported yet";

const {matching:match,extend} = q;

/* See if any Q elements match a selector */
function is(s) { return this.some(q.matching(s)); }
function not(s) { return !this.is(s); }

/* Filter matching elements from current list */
function matching(s) { return q(this.filter(match(s))); }
function notMatching(s) { return q(this.filter(o=>!match(s)(o))); }

/* Traversal methods */
function next(s) {
    return this.sift(o=>[o.nextElementSibling].filter(match(s))); }
function prev(s) {
    return this.sift(o=>[o.previousElementSibling].filter(match(s))); }
function parent(s) {
    return this.sift(o=>[o.parentElement].filter(match(s))); }

/* Return one element from current selection */
function last(s) {
    return q([this[this.length-1]].filter(match(s))); }
function first(s) {
    return q([this[0]].filter(match(s))); }

/* Search down */
function find(s) {
    return this.sift(o=>q(s,o)); }
/* Search up */
function closest(s) {
    return this.sift(o=>o.closest(s)); }
/* Search immediate children */
function children(s) {
    return this.sift(o=>[...o.children].filter(match(s))); }
/* Search through siblings */
function siblings(s) {
    return this.sift(o=>[...o.parentElement.children].filter(a=>a !== o && match(s)(a))); }

/* Select element by index and return QJS object */
function item(e){ return q(this[e]); }

Object.entries({
    is,
    not,
    next,
    prev,
    parent,
    last,
    first,
    find,
    closest,
    children,
    siblings,
    matching,
    notMatching,
    item
}).forEach(([k,v])=>{extend(k,v)})

})();