const nav = () => {
    return `
    <ul>
        <li><a href="#/">Main Page</a></li>
        <li><a href="#page/1">Page 1</a></li>
        <li><a href="#page/2">Page 2</a></li>
        <li><a href="#page/blorf">Page Blorf</a></li>
        <li><a href="#bad">Error Page</a></li>
    </ul>
    `;
}

export const defaultPage = async () => {
    return `<div>
        ${nav()}
        This is the default page.
    </div>`;
}

export const Page = async ({route}) => {
    return `<div>
        ${nav()}
        This is page ${route}.
    </div>`;
}

export const BadPage = async () => {
    throw("whoopsie");
}

export const errorPage = async () => {
    return `<div>
        ${nav()}
        This is the error page.
    </div>`;
}