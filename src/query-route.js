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
const EMPTY = '';


const state = {};
const root = SLASH;
const style = HASH;
const navigate = (str, updateUrl = true) => {
    if(str === BACK) {
        if(w.history.state != null) w.history.back();
    } else if (w.history.pushState) {
        setActive(makeState(str, makenext(str)), updateUrl);
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
    return [page,props];
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
const makeState = (title,url) => ({ title, url });

const events = {
    pageload: state => w.document.dispatchEvent(new CustomEvent(PAGELOAD, { detail: state })),
    pagebeforeshow: state => w.document.dispatchEvent(new CustomEvent(PAGEBEFORESHOW, { detail: state })),
    pageshow: state => w.document.dispatchEvent(new CustomEvent(PAGESHOW, { detail: state })),
    pagefail: state => w.document.dispatchEvent(new CustomEvent(PAGEFAIL, { detail: state })),
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
    events,
};

const setActive = (newstate, update) => {
    newstate ??= makeState(getroot(), w.location.href);
    w.history[update?'pushState':'replaceState'](newstate, newstate.title, newstate.url);
    events.pageload({
        nextPage: {...newstate},
        prevPage: {...state}
    });
    Object.assign(state,newstate);
};

if(w.q && w.document) {
    const makepage = async ({page, data, selector=EMPTY}) => {
        try {
            events.pagebeforeshow({root: getroot(), data, selector});
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