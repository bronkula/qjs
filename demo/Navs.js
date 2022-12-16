
import { El, A, Ul, Li } from './Elements.js';

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

export const Nav = (...ch) => El('nav')({class:'nav'})(Ul()(...ch));