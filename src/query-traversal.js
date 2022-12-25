;(()=>{
if(!q) throw "qjs not imported yet";

/* See if any Q elements match a selector */
q.extend('is',function(s){ return this.some(q.matching(s)); });
q.extend('not',function(s){ return !this.is(s); });

/* Traversal methods */
q.extend('next',function(s){
    return this.sift(o=>[o.nextElementSibling].filter(q.matching(s))); });
q.extend('prev',function(s){
    return this.sift(o=>[o.previousElementSibling].filter(q.matching(s))); });
q.extend('parent',function(s){
    return this.sift(o=>[o.parentElement].filter(q.matching(s))); });

/* Return one element from current selection */
q.extend('last',function(s){
    return q([this[this.length-1]].filter(q.matching(s))); });
q.extend('first',function(s){
    return q([this[0]].filter(q.matching(s))); });

/* Search down */
q.extend('find',function(s){
    return this.sift(o=>q(s,o)); });
/* Search up */
q.extend('closest',function(s){
    return this.sift(o=>o.closest(s)); });
/* Search immediate children */
q.extend('children',function(s){
    return this.sift(o=>[...o.children].filter(q.matching(s))); });
/* Search through siblings */
q.extend('siblings',function(s){
    return this.sift(o=>[...o.parentElement.children].filter(a=>a !== o && q.matching(s)(a))); });

/* Filter matching elements from current list */
q.extend('matching',function(s){
    return q(this.filter(q.matching(s))); });
q.extend('notMatching',function(s){
    return q(this.filter(o=>!q.matching(s)(o))); });

/* Select element by index and return QJS object */
q.extend('item',function(e){
    return q(this[e]); });

})();