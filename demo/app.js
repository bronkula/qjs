import { BadPage, DefaultPage, ErrorPage, BasicPage } from "./pages.js";

q.route.init({
    routes:{
        "page/:route": BasicPage,
        "bad": BadPage,
    },
    defaultPage: DefaultPage,
    errorPage: ErrorPage,
});