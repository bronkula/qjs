
import { El, A, Ul, Li, Div } from './Elements.js';

export const NavLi = ({link, basis}) => {
   const rootsplit = basis ?? q.route.getroot().split('/');
   const linksplit = link.split('/');
   console.log({link,basis,rootsplit,linksplit})
   const matched = q.route.matches(rootsplit, linksplit) ? {class:'active'} : {};
   return Li({...(matched)});
}
export const NavLink = ({link, label, basis}) => {
   return NavLi({link, basis})(
      A({href:link, 'data-role':'link'})(label)
   );
}
export const NavButton = (check) => ({link, label}) =>
   NavLi(link, check)(
      El('button', {type:'button'})({href:link})(label)
   );
export const Nav = (...ch) => {
   return El('nav')({class:'nav'})(
      Ul()(...ch)
   );
}
export const NavBar = (...ch) => {
   return Div({class:'navbar'})(...ch);
}
export const NavPills = (...ch) => {
   return El('nav')({class:'nav pills'})(
      Ul()(...ch)
   );
}
