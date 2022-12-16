import { Card, Container } from "./Elements.js";
import { Nav, NavLink } from "./Navs.js";

const nav = () => {
    return Nav(
        NavLink('/','Main Page'),
        NavLink('page/1','Page 1'),
        NavLink('page/more','Page More'),
        NavLink('page/blorf','Page blorf'),
        NavLink('load','Loaded Page'),
        NavLink('bad','Error Page'),
    );
}

export const MainPage = async () => {
    return Container(
        nav(),
        Card(`
            <p>This is the default page. It is the page if none of your other routes are matched.</p>
            <p>QJS has a lot of basic options for PWAs that should allow a motivated developer to create something robust but live. Not needing to compile means development can be swift. Luckily most of the work done in this environment can easily be ported over to any more complex javascript frameworks, but I find I often like to simply write code and move.</p>
        `)
    );
}

export const BasicPage = async ({route}) => {
    return Container(
        nav(),
        Card(`This is a page that is routed from anything with the 'page' route. It is passed extra information, which in this case was '${route}'.`)
    );
}

export const ErrorPage = async (error) => {
    return Container(
        nav(),
        Card("This is the error page. Errors can be automatically routed to an appropriate design or default page.",
        `<div>The error thrown was: '${error}'</div>`)
    );
}

export const LoadedPage = async () => {
    LoadedPage.htm = LoadedPage.htm ?? await fetch('./demo/loaded.htm').then(d=>d.text());
    return q(LoadedPage.htm);
}

export const BadPage = async () => {
    throw("Something did a bad on this page.");
}