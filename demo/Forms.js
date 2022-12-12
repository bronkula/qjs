
import { El } from './Elements.js';



export const Form = El('form');

export const Input = El('input',{type:'text',class:'form-input'})
export const TextInput = El('input',{type:'text',class:'form-input'});
export const NumberInput = El('input',{type:'number',class:'form-input'});
export const SearchInput = El('input',{type:'search',class:'form-input'});
export const PasswordInput = El('input',{type:'password',class:'form-input'});
export const SubmitInput = El('input',{type:'submit',class:'form-button'});
export const TextareaInput = El('textarea',{class:'form-textarea'});

export const Button = El('button',{type:'button',class:'form-button'});

export const Label = El('label',{class:'form-label'});

export const Control = El('div',{class:'form-control'});

export const FormControl = ({namespace,name,namedisplay,type=TextInput,value}) => {
   let label = Label({for:`${namespace}-${name}`})(namedisplay);
   let input = type({id:`${namespace}-${name}`})(value);
   return El('div')({class:'form-control'})(label,input);
}
export const SearchHotdog = ({placeholder,value,onSubmit=()=>{}}) => {
   let si = El('input',{
      type:'search',
      placeholder:placeholder,
      value:value
   })()();
   let sf = Form({class:'hotdog'})(si)
      .on('submit',function(e){ e.preventDefault(); onSubmit(si.val()) });
   return sf;
}