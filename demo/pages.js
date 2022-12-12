import { Card, Container, Page } from "./Elements.js";

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
    return Page(
        Container(
            nav(),
            Card("This is the default page.")
        )
    );
}

export const BasicPage = async ({route}) => {
    return Page(
        Container(
            nav(),
            Card(`This is page ${route}.`)
        )
    );
}

export const ErrorPage = async (error) => {
    return Page(
        Container(
            nav(),
            Card("This is the error page.",
            `<div>${error}</div>`)
        )
    );
}

export const LoadedPage = async () => {
    LoadedPage.htm = LoadedPage.htm ?? await fetch('./loaded.htm').then(d=>d.text());
    return q(LoadedPage.htm);
}

export const BadPage = async () => {
    throw("This is a thrown error.");
}