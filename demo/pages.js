import { Card, Container } from "./Elements.js";

const nav = () => {
    return `
    <nav class="nav">
        <ul>
            <li><a href="#/">Main Page</a></li>
            <li><a href="#page/1">Page 1</a></li>
            <li><a href="#page/2">Page 2</a></li>
            <li><a href="#page/blorf">Page Blorf</a></li>
            <li><a href="#load">Loaded Page</a></li>
            <li><a href="#bad">Error Page</a></li>
        </ul>
    </nav>
    `;
}

export const DefaultPage = async () => {
    return Container(
        nav(),
        Card("This is the default page. It is the page if none of your other routes are matched.")
    );
}

export const BasicPage = async ({route}) => {
    return Container(
        nav(),
        Card(`This is page that is routed from anything with the 'page' route. It is passed extra information, which in this case was '${route}'.`)
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
    LoadedPage.htm = LoadedPage.htm ?? await fetch('./loaded.htm').then(d=>d.text());
    return q(LoadedPage.htm);
}

export const BadPage = async () => {
    throw("Something did a bad on this page.");
}