;((w)=>{

const PAGESHOW = 'pageshow';
const HASH = 'hash';
const BROWSER = 'browser';
const BACK = 'back';
const LINK = 'link';
const SLASH = '/';
const EMPTY = '';


const state = {};
const root = SLASH;
const style = HASH;
const navigate = (str, updateUrl = true) => {
    if(str === BACK) {
        if(w.history.state != null) w.history.back();
    }
    else if (w.history.pushState) {
        setActive({
            title: str,
            url: makenext(str),
        }, updateUrl);
    } else {
        w.location.assign(state.url);
    }
};
const matches = (basis, tocheck) => {
    if (tocheck[0] === EMPTY && tocheck.length > 0) tocheck.shift();
    if (basis[0] != tocheck[0]) return false;
    let props = {};
    for(let i in basis) {
        if (basis[i] == tocheck[i]) continue;
        else if (tocheck[i].slice(0,1) == ":") props[tocheck[i].slice(1)] = basis[i];
        else if (basis[i] != tocheck[i]) return false;
    }
    return props;
};
const makenext = (str) => {
    if (route.style === HASH) {
        return w.location.origin + w.location.pathname + (isroot(str) ? EMPTY : '#' + str);
    } else if (route.style === BROWSER) {
        const ext = hasroot(str) ? route.root + rootremove(str) : w.location.pathname + SLASH + str;
        return w.location.origin + ext;
    } else {
        return EMPTY;
    }
};
const roots = () => ([route.root, SLASH]);
const rootregexp = () => new RegExp(`^(${roots().join('|')})`);
const rootremove = (str) => str.replace(rootregexp(),EMPTY);
const isroot = (str) => roots().includes(str);
const hasroot = (str) => str.match(rootregexp());
const getroot = (basis) => {
    return basis ?? 
        route.style === BROWSER ? w.location.pathname.slice(route.root.length) :
        route.style === HASH ? w.location.hash.slice(1) :
        EMPTY;
};
const make = (routes = {}, page = ()=>{}, basis) => {
    let hashroute = getroot(basis);
    let hashsplit = hashroute.split(SLASH);
    let props = {};
    if(hashroute !== EMPTY) {
        for(let [checkroute,fn] of Object.entries(routes)) {
            props = {};
            if (checkroute === hashroute) { page = fn; break; }
            let checksplit = checkroute.split(SLASH);
            if(checksplit[0] === hashsplit[0] && checksplit.length === hashsplit.length) {
                props = matches(hashsplit,checksplit);
                if (props!==false) { page = fn; break; }
            }
        }
    }
    return (data) => page(props,data);
};

const route = {
    state,
    root,
    style,
    navigate,
    matches,
    makenext,
    roots,
    rootregexp,
    rootremove,
    isroot,
    hasroot,
    getroot,
    make,
};

const events = {
    pageshow: newstate => w.document.dispatchEvent(new CustomEvent(PAGESHOW, {
        detail:{
            nextPage: {...newstate},
            prevPage: {...state}
        }
    })),
};

const setActive = (newstate,update) => {
    if(newstate === null) {
        newstate = {
            title: getroot(),
            url: w.location.href
        };
    }
    w.history[update?'pushState':'replaceState'](newstate, newstate.title, newstate.url);
    events.pageshow(newstate);
    Object.entries(newstate).forEach(([key,val])=>state[key] = val);
};

if(w.q && w.document) {
    const makepage = async ({page,data,selector=EMPTY}) => {
        try {
            let d = await page(data);
            q(selector).html(d);
        } catch(e) {
            throw(e);
        }
    };
    const init = ({routes = {}, defaultPage = ()=>EMPTY, errorPage = e=>`Error: ${e}`, selector = ".app"}) => {
        q(w.document).on(PAGESHOW, async () => {
            try {
                const page = make(routes, defaultPage);
                await makepage({
                    page,
                    selector,
                });
            } catch(e) {
                makepage({
                    page: errorPage,
                    selector,
                    data: e,
                });
                throw("Page failed: "+ e);
            }
        });
    };
    q(()=>{
        q(w.document).delegate("click","a",function(e){
            if (route.style === HASH && this.href[0] === '#') {
                e.preventDefault();
                const r = this.attributes.href.value.slice(1);
                if(r !== EMPTY) navigate(r);
            } else
            if (route.style === BROWSER && this.dataset.role === LINK) {
                e.preventDefault();
                const r = this.attributes.href;
                if(r !== EMPTY) navigate(r.value);
            } else
            if (route.style === BROWSER && this.dataset.rel === BACK) {
                e.preventDefault();
                navigate(BACK);
            }
        });
    });
    Object.entries({makepage,init}).forEach(([key,val])=>route[key] = val);
    q.route = route;
}
else w.route = route;


w.addEventListener("load",()=>{
    setTimeout(()=>w.addEventListener("popstate",o=>setActive(o.state)),0);
});
w.addEventListener("DOMContentLoaded",e=>{setActive(null);});


})(window);