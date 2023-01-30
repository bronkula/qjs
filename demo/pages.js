import { Card, Container } from "./Elements.js";
import { NavBar, NavPills, NavLink } from "./Navs.js";

<<<<<<< HEAD
=======
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

>>>>>>> ffab03f9cf1d342020b9aa038269166cfb543dfa
const demonav = () => {
    return Nav(
        NavLink('/','Main Page'),
        NavLink('/page/1','Page 1'),
        NavLink('/page/2#hash','Page 2 with hash',true),
        NavLink('/page/2#other','Page 2 with other hash',true),
        NavLink('/load','Loaded Page'),
        NavLink('/bad','Error Page'),
    );
}

export const MainPage = async () => {
    window.document.title = "QJS: default page example";
    return Container(
        demonav(),
        Card(`
            <p>This is the default page. It is the page if none of your other routes are matched.</p>
            <p>QJS has a lot of basic options for PWAs that should allow a motivated developer to create something robust but live. Not needing to compile means development can be swift. Luckily most of the work done in this environment can easily be ported over to any more complex javascript frameworks, but I find I often like to simply write code and move.</p>
        `)
    );
}

export const BasicPage = async ({route}) => {
    window.document.title = "QJS: data page example";
    return Container(
        demonav(),
        Card(`This is a page that is routed from anything with the 'page' route. It is passed extra information, which in this case was '${route}'.`)
    );
}

export const ErrorPage = async (error) => {
    window.document.title = "QJS: error page example";
    return Container(
        demonav(),
        Card("This is the error page. Errors can be automatically routed to an appropriate design or default page.",
        `<div>The error thrown was: '${error}'</div>`)
    );
}

export const LoadedPage = async () => {
    /* Fetch am html fragment document and cache it into the page function */
    let page = await q.getHTML('./demo/loaded.htm');

    /* Pull a title element out of a fragment, and use it each time this page is rendered */
    const title = page.matching('title');
    LoadedPage.title = title.length ? title.text() : false;
    page = page.notMatching('title');
        
    if (LoadedPage.title) window.document.title = LoadedPage.title;
    
    return Container(
        demonav(),
        page
    );
}

export const DownloadPage = async () => {
    DownloadPage.package ??= await q.get('package.json');
    return Container(
        Card(`
            <h2 id="getting-started">Getting Started</h2>
            <p>Starting a new QJS project can be as simple as pulling it in from a repository. The current version is v${DownloadPage.package.version}. You can use jsdelivr to always get the most current version, but generally that's considered not a good idea.</p>
            <code class="block">&lt;script src="https://cdn.jsdelivr.net/gh/bronkula/qjs@v${DownloadPage.package.version}/dist/query.min.js">&lt;/script></code>
            <p>There is a lite version that just includes the basic querying and event handling. It does not include dom traversal or manipulation methods.</p>
            <code class="block">&lt;script src="https://cdn.jsdelivr.net/gh/bronkula/qjs@v${DownloadPage.package.version}/dist/query-lite.min.js">&lt;/script></code>
            <p>Also available, is a routing extension that allows standard or hash routing.</p>
            <code class="block">&lt;script src="https://cdn.jsdelivr.net/gh/bronkula/qjs@v${DownloadPage.package.version}/dist/query-route.min.js">&lt;/script></code>
            <p>One more set of tools are the fetch extensions. This has a nice set of tools for fetching data or other pages into the document.</p>
            <code class="block">&lt;script src="https://cdn.jsdelivr.net/gh/bronkula/qjs@v${DownloadPage.package.version}/dist/query-fetch.min.js">&lt;/script></code>
        `)
    );
}

export const BadPage = async () => {
    throw("Something did a bad on this page.");
}