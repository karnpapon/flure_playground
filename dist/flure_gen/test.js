import { FunctionMaker } from "./maker";

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

let mod_arr = Array.from(new Array(11), (x, i) => i + 2);
let mod = mod_arr.sample();
// let fn = FunctionMaker.new().make(modulo);

console.log("fnfn", mod);
