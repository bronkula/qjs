import { BadPage, MainPage, ErrorPage, BasicPage, LoadedPage } from "./pages.js";

q.route.style = 'browser';
q.route.root = '/';
q.route.init({
    routes:{
        "page/:route": BasicPage,
        "load": LoadedPage,
        "bad": BadPage,
    },
    defaultPage: MainPage,
    errorPage: ErrorPage,
});