;((w)=>{


const stateObj = {};

const route = {
    navigate : (str,updateUrl=true) => {
        if(str=="back") {
            if(w.history.state != null) w.history.back();
        }
        else if (w.history.pushState) {
            setActive({
                title: str,
                url: w.location.origin + w.location.pathname + "#" + str
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
    make: (routes,page=()=>{},basis) => {
        let hashroute = (basis?basis:w.location.hash.slice(1));
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
            title:w.location.hash.slice(1),
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

if(w.q) {
    route.init = ({routes = {}, defaultPage = ()=>``, errorPage = e=>`Error: ${e}`, selector = ".app"}) => {
        q(document).on("pageshow",async (event)=>{
            const makepage = async (page) => {
                let d = await page();
                q(selector).html(d);
            }
            try {
                const route = q.route.make(routes, defaultPage);
                await makepage(route);
            } catch(e) {
                makepage(errorPage(e));
                throw("Page failed: "+ e);
            }
        });
    };
    q(()=>{
        q(w.document).delegate("click","a[href^='#']",function(e){
            e.preventDefault();
            let r = this.attributes.href.value.slice(1);
            if(r!="") route.navigate(r);
        });
    });
    q.route = route;
}
else w.route = route;


w.addEventListener("load",()=>{
    setTimeout(()=>w.addEventListener("popstate",o=>setActive(o.state)),0);
});
w.addEventListener("DOMContentLoaded",e=>setActive(null));


})(window);