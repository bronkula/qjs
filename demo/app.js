import { BadPage, MainPage, ErrorPage, BasicPage, LoadedPage } from "./pages.js";

q.route.style = 'browser';
q.route.root = window.location.host === 'bronkula.github.io' ? '/qjs/' : '/';
q.route.version = '1.0.5';
q.route.init({
    routes:{
        "page/:route": BasicPage,
        "load": LoadedPage,
        "load/:page": LoadedPage,
        "bad": BadPage,
    },
    defaultPage: MainPage,
    errorPage: ErrorPage,
});