;((w)=>{

const states = {};

class State {
    value;
    constructor(defaultValue) {
        this.value = this.value ?? defaultValue;
    }
    get() { return this.value; }
    set(v) { this.value = v; }
}
const makeState = (defaultValue,render) => {
    let state = new State(defaultValue);
    return [state, (v)=>{ state = v; render(); }];
}


class Component {
    constructor(fn) {
        super(fn());
    }
}

if(w.q && w.document) {
    q.component = (fn) => q(new Component(fn));
}

})(window);

