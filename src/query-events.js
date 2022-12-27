;(()=>{
if(!q) throw "qjs not imported yet";

const {extend,isString} = q;

const getPath = event => event.path || (event.composedPath && event.composedPath());
const inPath = (event,target) => getPath(event).some(o=>o==target);


/* Return an array of either touches or a click */
const evPoints = event =>
    event.type.substring(0,5)!="touch"?[event]:
    !event.touches.length?event.changedTouches:event.touches;
/* Return an offset xy object for the position of the click or touch in the object */
/* Pass in an optional object that will be used for basis */
const getEXY = (event,obj) => {
    let r = (obj||event.target).getBoundingClientRect();
    return ({ x:event.pageX-r.left, y:event.pageY-r.top }); }
/* Return the first xy position from an event, whether touch or click */
/* Pass in an optional object that will be used for basis */
const getEventXY = (event,obj) =>
    getEXY(evPoints(event)[0],obj);


/* Apply events to Q elements */
function on(...args) {
    const eventString = args[0],
        fn = isString(args[1]) ? args[2] : args[1],
        delegate = isString(args[1]) ? args[1] : undefined,
        capture = isString(args[1]) ? {capture:true} : args[2];

    eventString.trim().split(/\s+/).forEach(event=>{
        this.forEach(el=>{
            el.addEventListener(event, !isString(args[1]) ? fn : (event) => {
                this.find(delegate).forEach(o=>{
                    if(inPath(event,o)) fn.call(o,event,o);
                });
            }, capture);
        });
    });
    return this;
}

Object.assign(q,{
    getPath,
    inPath,
    evPoints,
    getEXY,
    getEventXY
});
extend(['on','delegate'],on);

})();