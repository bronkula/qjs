
import { El, A, Ul, Li, FlexNone, FlexStretch } from './Elements.js';

export const NavLi = (link) => {
   const rootsplit = q.route.getroot().split('/');
   const linksplit = link.split('/');
   const matched = q.route.matches(rootsplit, linksplit) ? {class:'active'} : {};
   return Li({...(matched)});
}
export const NavLink = (link,name,options={}) => {
   return NavLi(link)( A({href:link, 'data-role':'link',...options})(name) );
}
export const NavButton = (check) => (link,name,events={}) =>
   NavLi(link, check) ( El('button', {type:'button'}) ({href:link}, events) (name) );

export const NavBar = (title) => (...ch) =>
   El('Header')({class:'navbar'})(
      El('container')({class:'container flex-parent flex-align-center'})(
         FlexNone(El('h1')()(title)),
         FlexStretch(),
         El('nav')({class:'nav pills flex-none nav-flex'})(
            Ul()(...ch)
         )
      )
   );

export const Nav = (...ch) => El('nav')({class:'nav'})(Ul()(...ch));