import { BadPage, DefaultPage, ErrorPage, BasicPage, LoadedPage } from "./pages.js";

q.route.init({
    routes:{
        "page/:route": BasicPage,
        "load": LoadedPage,
        "bad": BadPage,
    },
    defaultPage: DefaultPage,
    errorPage: ErrorPage,
});