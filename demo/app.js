import { NavBar, NavLink } from "./Navs.js";
import { BadPage, MainPage, ErrorPage, BasicPage, LoadedPage, DownloadPage } from "./pages.js";

q.route.style = 'browser';
q.route.root = window.location.host === 'bronkula.github.io' ? '/qjs/' : '/';
q.route.makepage = async ({page, data, selector=EMPTY}) => {
    try {
        const d = await page(data);
        q.route.makepage.n ??= NavBar('QJS')(
            NavLink('/download','Download'),
            NavLink('/docs','Documentation'),
        )
        q(selector).html(
            q.route.makepage.n,
            d,
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
    },
    defaultPage: MainPage,
    errorPage: ErrorPage,
});