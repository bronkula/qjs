;((w)=>{

const PAGEBEFORESHOW = 'pagebeforeshow';
const PAGESHOW = 'pageshow';
const PAGELOAD = 'pageload';
const PAGEFAIL = 'pagefail';
const HASH = 'hash';
const BROWSER = 'browser';
const BACK = 'back';
const LINK = 'link';
const SLASH = '/';
const COLON = ':';
const POUND = '#';
const EMPTY = '';

const state = {};
const prev = {};
const next = {};
const root = SLASH;
const style = BROWSER;


const navigate = (str, updateUrl = true) => {
    let path = makepath(str);

    if (str === BACK || path.fullroute === prev.fullroute && prev.fullroute !== next.fullroute) {
        if(w.history.state !== null) {
            Object.assign(next,prev);
            Object.assign(prev,makepath(w.location.pathname + w.location.hash));
            w.history.back();
        }
    } else if (w.history.pushState) {
        if (prev.fullroute !== next.fullroute) {
            Object.assign(prev,next);
            route.setnext(str);
        }
        setActive(makestate(next.fullroute, next.href), updateUrl);
    } else {
        w.location.assign(state.url);
    }
};
const matches = (basis, tocheck) => {
    if (tocheck[0] === EMPTY && tocheck.length > 0) tocheck.shift();
    if (basis[0] !== tocheck[0] && tocheck[0].slice(0,1) !== COLON) return false;
    let props = {};
    for(let i in basis) {
        if (basis[i] === tocheck[i]) continue;
        else if (tocheck[i].slice(0,1) === COLON) props[tocheck[i].slice(1)] = basis[i];
        else if (basis[i] !== tocheck[i]) return false;
    }
    return props;
};
const make = (routes = {}, page = ()=>{}, basis) => {
    const thisroute = basis ? makepath(basis) : next;
    let props = {};
    if(thisroute.route !== EMPTY) {
        for(let [checkroute,fn] of Object.entries(routes)) {
            props = {};
            let path = makepath(checkroute);
            if (path.route === thisroute.route) { page = fn; break; }
            if(path.path[0] === thisroute.path[0] && path.path.length === thisroute.path.length) {
                props = matches(thisroute.path, path.path);
                if (props!==false) { page = fn; break; }
            }
        }
    }
    return [page,props];
};
const makepath = (str) => {
    const rooted = remroot(str);
    const [root,hash] = rooted.split(POUND);
    return {
        fullroute: rooted,
        route: root,
        href: w.location.origin + route.root + rooted,
        hash: hash ? POUND + hash : EMPTY,
        path: root.split(SLASH),
    };
}
const setnext = (str) => Object.assign(next, makepath(str));
const roots = () => ([route.root, SLASH]);
const rootregexp = () => new RegExp(`^(${roots().join('|')})`);
const remroot = (str) => str.replace(rootregexp(),EMPTY);
const isroot = (str) => roots().includes(str);
const hasroot = (str) => str.match(rootregexp());
const makestate = (title,url) => ({ title, url });
const makeevent = (name) => (state) => w.document.dispatchEvent(new CustomEvent(name, { detail: state }));

const setActive = (newstate, update) => {
    if (!next.path) route.setnext(w.location.pathname + w.location.hash);
    newstate ??= makestate(next.fullroute, next.href);
    w.history[update?'pushState':'replaceState'](newstate, newstate.title, newstate.url);
    events.pageload({ nextPage: newstate, prevPage: state });
    Object.assign(state,newstate);
};

const events = {
    pageload: makeevent(PAGELOAD),
    pagebeforeshow: makeevent(PAGEBEFORESHOW),
    pageshow: makeevent(PAGESHOW),
    pagefail: makeevent(PAGEFAIL),
};

const route = {
    state,
    root,
    style,
    prev,
    next,
    navigate,
    matches,
    makepath,
    setnext,
    roots,
    rootregexp,
    remroot,
    isroot,
    hasroot,
    make,
    makestate,
    makeevent,
    events,
};

if(w.q && w.document) {
    const makepage = async ({page, data, selector=EMPTY}) => {
        try {
            events.pagebeforeshow({next, data, selector});
            let qp = q(await page(data));
            q(selector).html(qp);
            events.pageshow({nextPage: qp, data, selector});
        } catch(e) {
            events.pagefail({page, data, selector});
            throw(e);
        }
    };
    const init = ({routes = {}, defaultPage = ()=>EMPTY, errorPage = e=>`Error: ${e}`, selector = ".app"}) => {
        q(w.document).on(PAGELOAD, async (e) => {
            try {
                const [page,data] = make(routes, defaultPage);
                await route.makepage({
                    page,
                    selector,
                    data
                });
            } catch(e) {
                route.makepage({
                    page: errorPage,
                    selector,
                    data: e,
                });
                throw("Page failed: "+ e);
            }
        });
    };
    q(()=>{
        q(w.document).delegate("click", "a", function(e){
            if (route.style === HASH && this.href[0] === '#') {
                e.preventDefault();
                const r = this.attributes.href.value.slice(1);
                if (r !== EMPTY) navigate(r);
            } else
            if (route.style === BROWSER && this.dataset.role === LINK) {
                e.preventDefault();
                const r = this.attributes.href;
                if (r !== EMPTY) navigate(r.value);
            } else
            if (route.style === BROWSER && this.dataset.rel === BACK) {
                e.preventDefault();
                navigate(BACK);
            }
        });
    });
    Object.assign(route, { makepage, init });
    q.route = route;
}
else w.route = route;


w.addEventListener("load",()=>{
    setTimeout(()=>w.addEventListener("popstate", o=>setActive(o.state)), 0);
});
w.addEventListener("DOMContentLoaded", e=>setActive(null));


})(window);