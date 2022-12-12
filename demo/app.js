import { BadPage, defaultPage, errorPage, Page } from "./pages.js";

q.route.init({
    routes:{
        "page/:route": Page,
        "bad": BadPage,
    },
    defaultPage: defaultPage,
    errorPage: errorPage,
});