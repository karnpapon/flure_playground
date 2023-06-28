const BIN_OPS = ["+", "-", "*", "&", "|", "^", "%"];
const UN_OPS = ["-@"];
// const UN_OPS = %i{-@ ~}

function plot_wrap(obj) {
  if (
    obj.constructor.name == "Lookup" ||
    obj.constructor.name == "Expression" ||
    obj.constructor.name == "Literal"
  ) {
    return obj;
  }

  if (obj.constructor.name == "Number") {
    return new Literal(obj);
  }

  if (obj.constructor.name == "String") {
    return new Lookup(obj);
  }

  console.warn(obj.constructor.name);
  throw new Error("Unwrappable object", obj.constructor.name);
}

class FunctionMaker {
  constructor(
    max_literal = 24,
    literal_rate = 0.5,
    unary_rate = 0.3,
    depth = 3
  ) {
    this.max_literal = max_literal;
    this.literal_rate = literal_rate;
    this.unary_rate = unary_rate;
    this.depth = depth;
  }

  make(mod = null) {
    let fn = this.make_func(this.depth);
    let res;
    if (mod) {
      res = new Expression("%", fn, plot_wrap(mod)).to_s();
    }
    return res;
  }

  make_func(depth, force_lookup = true) {
    if (depth === 0) {
      return this.make_leaf(force_lookup);
    }
    // if (Math.random() < this.unary_rate) {
    //   return this.make_unary(depth);
    // }

    return this.make_binary(depth);
  }

  make_leaf(force_lookup) {
    if (force_lookup || Math.random() < this.literal_rate) {
      return new Lookup(["x", "y"].sample()).to_s();
    }
    return new Literal(Math.floor(Math.random() * this.max_literal) + 1);
  }

  make_unary(depth) {
    let op = UN_OPS.sample();
    let arg = this.make_func(depth - 1);
    return new Expression(op, arg);
  }

  make_binary(depth) {
    let op = BIN_OPS.sample();
    let left = this.make_func(depth - 1, true);
    let right = this.make_func(depth - 1, false);
    // left, right = [left, right].shuffle
    return new Expression(op, left, right);
  }
}

class PlotFn {
  constructor() {}

  lookup() {
    return false;
  }
  literal() {
    return false;
  }
  binary() {
    return false;
  }
  unary() {
    return false;
  }
  expression() {
    return false;
  }

  to_s() {
    throw new Error("Subclass responsibility.");
  }

  wrap(obj) {
    if (
      obj.constructor.name == "Lookup" ||
      obj.constructor.name == "Expression" ||
      obj.constructor.name == "Literal"
    ) {
      return obj;
    }

    if (obj.constructor.name == "Number") {
      return new Literal(obj);
    }

    if (obj.constructor.name == "String") {
      return new Lookup(obj);
    }
    console.warn(obj.constructor.name);
    throw new Error("Unwrappable object", obj.constructor.name);
  }
}

class Expression extends PlotFn {
  constructor(operator, arg1, arg2 = null) {
    super();
    this.operator = operator;
    this.exp_binary = !!arg2;
    this.lhs = this.exp_binary ? this.wrap(arg1) : null;
    this.rhs = this.exp_binary ? this.wrap(arg2) : this.wrap(arg1);
  }

  binary() {
    return this.exp_binary;
  }
  unary() {
    return !this.exp_binary;
  }
  expression() {
    return true;
  }

  to_s() {
    let op = this.operator.replace(/\@/, "");

    if (this.binary()) {
      return `${this.bracket(this.lhs)} ${op} ${this.bracket(this.rhs)}`;
    }
    return `${op}${this.bracket(this.rhs)}`;
  }

  bracket(plotfn) {
    if (plotfn.binary() || plotfn.unary()) {
      return `(${plotfn.to_s()})`;
    }
    return plotfn.to_s();
  }
}

class Lookup extends PlotFn {
  constructor(name) {
    super();
    this.name = name;
  }

  lookup() {
    return true;
  }
  to_s() {
    return `${this.name}`;
  }
}

class Literal extends PlotFn {
  constructor(int) {
    super();
    this.value = int;
  }

  literal() {
    return true;
  }
  to_s() {
    return `${this.value}`;
  }
}

export { FunctionMaker };
