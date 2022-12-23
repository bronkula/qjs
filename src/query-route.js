;((w)=>{

const PAGESHOW = 'pageshow';
const HASH = 'hash';
const BROWSER = 'browser';
const BACK = 'back';
const LINK = 'link';
const SLASH = '/';
const EMPTY = '';

const route = {
    state : {},
    root : SLASH,
    style : HASH,
    navigate : (str, updateUrl = true) => {
        if(str==BACK) {
            if(w.history.state != null) w.history.back();
        }
        else if (w.history.pushState) {
            const ext = [route.root, SLASH].includes(str) ? EMPTY : str;
            setActive({
                title: str,
                url: route.style === HASH ? w.location.origin + w.location.pathname + "#" + str :
                    route.style === BROWSER ? w.location.origin + route.root + ext :
                    EMPTY
            }, updateUrl);
        } else {
            w.location.assign(route.state.url);
        }
    },
    matches: (basis, tocheck) => {
        if (basis[0] != tocheck[0]) return false;
        let props = {};
        for(let i in basis) {
            if (basis[i] == tocheck[i]) continue;
            else if (tocheck[i].slice(0,1) == ":") props[tocheck[i].slice(1)] = basis[i];
            else if (basis[i] != tocheck[i]) return false;
        }
        return props;
    },
    getroot: (basis) => {
        return basis ?? 
            route.style === BROWSER ? w.location.pathname.slice(route.root.length) :
            route.style === HASH ? w.location.hash.slice(1) :
            EMPTY;
    },
    make: (routes = {}, page = ()=>{}, basis) => {
        let hashroute = route.getroot(basis);
        let hashsplit = hashroute.split(SLASH);
        let props = {};
        if(hashroute != EMPTY) {
            for(let [checkroute,fn] of Object.entries(routes)) {
                props = {};
                if (checkroute==hashroute) { page = fn; break; }
                let checksplit = checkroute.split(SLASH);
                if(checksplit[0]==hashsplit[0] && checksplit.length==hashsplit.length) {
                    props = route.matches(hashsplit,checksplit);
                    if (props!==false) { page = fn; break; }
                }
            }
        }
        return (data)=>page(props,data);
    },
};

const events = {
    pageshow: state => w.document.dispatchEvent(new CustomEvent(PAGESHOW, {
        detail:{
            nextPage: {...state},
            prevPage: {...route.state}
        }
    })),
};

const setActive = (state,update) => {
    if(state==null) {
        state = {
            title: 
                route.style === HASH ? w.location.hash.slice(1) :
                route.style === BROWSER ? w.location.pathname.slice(route.root.length) :
                EMPTY,
            url: w.location.href
        };
    }
    w.history[update?'pushState':'replaceState'](state, state.title, state.url);
    events.pageshow(state);
    route.state = {...state};
};

if(w.q && w.document) {
    route.makepage = async ({page,data,selector=EMPTY}) => {
        try {
            let d = await page(data);
            q(selector).html(d);
        } catch(e) {
            throw(e);
        }
    },
    route.init = ({routes = {}, defaultPage = ()=>EMPTY, errorPage = e=>`Error: ${e}`, selector = ".app"}) => {
        q(w.document).on(PAGESHOW, async (event) => {
            try {
                const page = route.make(routes, defaultPage);
                await route.makepage({
                    page,
                    selector,
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
        q(w.document).delegate("click","a",function(e){
            if (route.style === HASH && this.href[0] === '#') {
                e.preventDefault();
                const r = this.attributes.href.value.slice(1);
                if(r !== EMPTY) route.navigate(r);
            } else
            if (route.style === BROWSER && this.dataset.role === LINK) {
                e.preventDefault();
                const r = this.attributes.href;
                if(r !== EMPTY) route.navigate(r.value);
            } else
            if (route.style === BROWSER && this.dataset.rel === BACK) {
                e.preventDefault();
                route.navigate(BACK);
            }
        });
    });
    q.route = route;
}
else w.route = route;


w.addEventListener("load",()=>{
    setTimeout(()=>w.addEventListener("popstate",o=>setActive(o.state)),0);
});
w.addEventListener("DOMContentLoaded",e=>{setActive(null);});


})(window);