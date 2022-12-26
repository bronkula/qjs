;(()=>{
if(!q) throw "qjs not imported yet";


q.getPath = event => event.path || (event.composedPath && event.composedPath());
q.inPath = (event,target) => q.getPath(event).some(o=>o==target);


/* Return an array of either touches or a click */
q.evPoints = event =>
    event.type.substring(0,5)!="touch"?[event]:
    !event.touches.length?event.changedTouches:event.touches;
/* Return an offset xy object for the position of the click or touch in the object */
/* Pass in an optional object that will be used for basis */
q.getEXY = (event,obj) => {
    let r = (obj||event.target).getBoundingClientRect();
    return ({ x:event.pageX-r.left, y:event.pageY-r.top }); }
/* Return the first xy position from an event, whether touch or click */
/* Pass in an optional object that will be used for basis */
q.getEventXY = (event,obj) =>
    q.getEXY(q.evPoints(event)[0],obj);


/* Apply events to Q elements */
q.extend(['on','delegate'],function(...args) {
    const eventString = args[0],
        fn = q.isString(args[1]) ? args[2] : args[1],
        delegate = q.isString(args[1]) ? args[1] : undefined,
        capture = q.isString(args[1]) ? {capture:true} : args[2];

    eventString.trim().split(/\s+/).forEach(event=>{
        this.forEach(el=>{
            el.addEventListener(event, !q.isString(args[1]) ? fn : function(event) {
                this.find(delegate).forEach(o=>{
                    if(q.inPath(event,o)) fn.call(o,event,o);
                });
            }, capture);
        });
    });
    return this;
});


})();