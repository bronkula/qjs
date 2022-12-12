
export const El = (type='div',attr1={}) => (attr2={}) => (...children) => {
    El.e = q(`<${type}>`);
    El.e.attr({...attr1,...attr2});
    El.e.html(...children);
    return El.e;
}
 
 
export const A = El('a');
export const Div = El('div');
export const Img = El('img');
export const Ul = El('ul');
export const Li = El('li');
 

export const Icon = El('i',{class:'icon'})();
export const SVGIcon = src => El('img')({src:'img/icon/'+src+'.svg',class:'icon'})();


export const Page = Div({class:'page','data-role':'page'});

export const Header = El('header')({class:'header','data-role':'header'});
export const Main = Div({class:'main','data-role':'main'});
export const MainFlex = Div({class:'main display-flex flex-column','data-role':'main'});
export const Footer = El('footer')({class:'footer','data-role':'footer'});

export const FlexStretch = Div({class:'flex-stretch'});
export const FlexNone = Div({class:'flex-none'});

export const Overscroll = Div({class:'overscroll'});
export const Container = Div({class:'container'});
export const Card = Div({class:'card soft'});