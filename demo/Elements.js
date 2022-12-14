
export const El = (type='div',attr1={}) => (attr2={}) => (...children) => {
    const e = q(`<${type}>`);
    e.attr(attr1);
    if (attr2.className) {
        attr2.className.split(' ').forEach(c=>e.addClass(c));
        delete attr2.className;
    }
    e.attr(attr2);
    e.html(...children);
    return e;
}
 
 
export const A = El('a');
export const Div = El('div');
export const Img = El('img');
export const Ul = El('ul');
export const Li = El('li');
 

export const Icon = El('i')({class:'icon'});
export const SVGIcon = src => El('img')({src:'img/icon/'+src+'.svg',class:'icon'})();


export const Page = Div({class:'page','data-role':'page'});

export const Header = El('header',{class:'header','data-role':'header'})();
export const Main = El('div',{class:'main','data-role':'main'})();
export const MainFlex = (...ch) => Main(...ch).addClass('display-flex flex-column');
export const Footer = El('footer',{class:'footer','data-role':'footer'})();

export const FlexStretch = Div({class:'flex-stretch'});
export const FlexNone = Div({class:'flex-none'});

export const Overscroll = Div({class:'overscroll'});
export const Container = Div({class:'container'});
export const Card = Div({class:'card soft'});