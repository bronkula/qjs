;((w)=>{

const stateObj = {};

const route = {
    root : '/',
    style : 'hash',
    navigate : (str,updateUrl=true) => {
        if(str=="back") {
            if(w.history.state != null) w.history.back();
        }
        else if (w.history.pushState) {
            setActive({
                title: str,
                url: route.style === 'hash' ? w.location.origin + w.location.pathname + "#" + str :
                    route.style === 'browser' ? w.location.origin + route.root + (str !== route.root ? str : '') :
                    ''
            },updateUrl);
        } else {
            w.location.assign(stateObj.url);
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
            route.style === 'browser' ? w.location.pathname.slice(route.root.length) :
            route.style === 'hash' ? w.location.hash.slice(1) :
            '';
    },
    make: (routes,page=()=>{},basis) => {
        let hashroute = route.getroot(basis);
        let hashsplit = hashroute.split("/");
        let props = {};
        if(hashroute != '') {
            for(let [checkroute,fn] of Object.entries(routes)) {
                props = {};
                if (checkroute==hashroute) { page = fn; break; }
                let checksplit = checkroute.split("/");
                if(checksplit[0]==hashsplit[0] && checksplit.length==hashsplit.length) {
                    props = route.matches(hashsplit,checksplit);
                    if (props!==false) { page = fn; break; }
                }
            }
        }
        return (data)=>page(props,data);
    },
};

const setActive = (state,update) => {

    if(state==null) {
        state = {
            title: 
                route.style === 'hash' ? w.location.hash.slice(1) :
                route.style === 'browser' ? w.location.pathname.slice(route.root.length) :
                '',
            url:w.location.href
        };
    }
    
    stateObj.state = {...state};
    
    w.history[update?'pushState':'replaceState']
        (state, state.title, state.url);

    w.document.dispatchEvent(
        new CustomEvent("pageshow",{
            detail:{
                nextPage:{...state},
                prevPage:{...stateObj.state}
            }
        })
    );

};

if(w.q && w.document) {
    route.makepage = async ({page,data,selector=''}) => {
        try {
            let d = await page(data);
            q(selector).html(d);
        } catch(e) {
            throw(e);
        }
    },
    route.init = ({routes = {}, defaultPage = ()=>``, errorPage = e=>`Error: ${e}`, selector = ".app"}) => {
        q(w.document).on("pageshow",async (event)=>{
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
                    data: e
                });
                throw("Page failed: "+ e);
            }
        });
    };
    q(()=>{
        q(w.document).delegate("click","a",function(e){
            if (route.style === 'hash' && this.href[0] === '#') {
                e.preventDefault();
                let r = this.attributes.href.value.slice(1);
                if(r !== "") route.navigate(r);
            } else
            if (route.style === 'browser' && this.dataset.role === 'link') {
                e.preventDefault();
                let r = this.attributes.href;
                if(r !== "") route.navigate(r.value);
            } else
            if (route.style === 'browser' && this.dataset.rel === 'back') {
                e.preventDefault();
                route.navigate('back');
            }
            e.preventDefault();
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