
import { El, A, Ul, Li, Div } from './Elements.js';

export const NavLi = (link,check=()=>location.hash) => Li({...(check()==link?{class:'active'}:{})});
export const NavLink = (link,name,options={}) => NavLi(link)( A({href:link,...options})(name) );
export const NavButton = (check) => (link,name,events={}) =>
   NavLi(link, check) ( El('button', {type:'button'}) ({href:link}, events) (name) );

export const Nav = (...ch) => Div({class:'nav'})(Ul()(...ch));

export const CoreNav = () => {
   return Nav(
      NavLink('#recent','Recent'),
      NavLink('#list','List'),
      NavLink('#profile','Profile')
   )
}