import { BadPage, defaultPage, errorPage, Page } from "./pages.js";

q.route.define({
    routes:{
        "page/:route": Page,
        "bad": BadPage,
    },
    defaultPage: defaultPage,
    errorPage: errorPage,
});