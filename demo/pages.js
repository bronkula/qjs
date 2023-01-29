import { Card, Container } from "./Elements.js";
import { NavBar, NavPills, NavLink } from "./Navs.js";

const CoreNav = () => {
    return NavBar(
        Container(
            NavPills(
                NavLink({link:'/',label:'QJS'}),
                NavLink({link:'load',label:'Documentation'}),
            )
        )
    ).css({'margin-bottom':'1em'});
}

export const DocsNav = () => {
    return NavPills(
        NavLink({link:'load/basics',label:'Basics'}),
    );
}

export const MainPage = async () => {
    return q([
        CoreNav(),
        Container(
            Card(`
                <p>This is the default page. It is the page if none of your other routes are matched.</p>
                <p>QJS has a lot of basic options for PWAs that should allow a motivated developer to create something robust but live. Not needing to compile means development can be swift. Luckily most of the work done in this environment can easily be ported over to any more complex javascript frameworks, but I find I often like to simply write code and move.</p>
            `)
        )
    ]);
}

export const BasicPage = async ({route}) => {
    return q([
        CoreNav(),
        Container(
            Card(`This is a page that is routed from anything with the 'page' route. It is passed extra information, which in this case was '${route}'.`)
        )
    ]);
}

export const ErrorPage = async (error) => {
    return q([
        CoreNav(),
        Container(
            Card("This is the error page. Errors can be automatically routed to an appropriate design or default page.",
            `<div>The error thrown was: '${error}'</div>`)
        )
    ]);
}

export const LoadedPage = async ({page}) => {
    let href = page ? `./demo/pages/${page}.htm` : './demo/pages/loaded.htm';
    LoadedPage[page] = LoadedPage[page] ?? await fetch(href).then(d=>d.text());
    return q([
        CoreNav(),
        Container(
            DocsNav(),
            LoadedPage[page],
        )
    ]);
}

export const BadPage = async () => {
    throw("Something did a bad on this page.");
}