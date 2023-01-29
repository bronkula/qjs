
import { El, A, Ul, Li, FlexNone, FlexStretch } from './Elements.js';

export const NavLi = (link,full) => {
   let r = full ? 'fullroute' : 'route';
   const matched = q.route.makepath(link)[r] === q.route.next[r] ? {class:'active'} : {};
   return Li({...matched});
}
export const NavLink = (link,name,full) => {
   return NavLi(link,full)( A({href:link, 'data-role':'link'})(name) );
}
export const NavButton = (check) => (link,name,events={}) =>
   NavLi(link, check) ( El('button', {type:'button'}) ({href:link}, events) (name) );

export const NavBar = (title) => (...ch) =>
   El('Header')({class:'navbar '})(
      El('div')({class:'container flex-parent flex-align-center'})(
         FlexNone(El('h1')()(title)),
         FlexStretch(),
         El('nav')({class:'nav pills flex-none nav-flex'})(
            Ul()(...ch)
         )
      )
   );

export const Nav = (...ch) => El('nav')({class:'nav'})(Ul()(...ch));
