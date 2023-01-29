import { NavBar, NavLink } from "./Navs.js";
import { BadPage, MainPage, ErrorPage, BasicPage, LoadedPage, DownloadPage } from "./pages.js";

q.route.style = 'browser';
q.route.root = window.location.host === 'bronkula.github.io' ? '/qjs/' : '/';
q.route.makepage = async ({page, data, selector=EMPTY}) => {
    try {
        const qs = q(await page(data));
        q(selector).html(
            NavBar('QJS')(
                NavLink('/download','Download'),
                NavLink('/','Docs'),
            ),
            qs,
        );
    } catch(e) {
        throw(e);
    }
};
q.route.init({
    routes:{
        "page/:route": BasicPage,
        "load": LoadedPage,
        "download": DownloadPage,
        "bad": BadPage,
        ":route": BasicPage,
    },
    defaultPage: MainPage,
    errorPage: ErrorPage,
});