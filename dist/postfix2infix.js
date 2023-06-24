function isOperator(char) {
  let operators = ["^", "/", "*", "+", "-", "|","%"];
  return operators.includes(char);
}

var print = function (exp) {
  if (typeof (exp) == 'string') return exp;

  var left = print(exp.left);
  var right = print(exp.right);

  if (typeof (exp.left) != 'string') left = '(' + left + ')';
  
  if (typeof (exp.right) != 'string' ) right = '(' + right + ')';

  return left + '' + exp.op + '' + right;
};

function postfixToInfix(expr) {
  expr = expr.split("").join(" ");

  var i = 0;
  function nextChar() {
      while (i < expr.length && expr[i] == ' ') i++;
      if (i == expr.length) return '';
      var b = '';
      while (i < expr.length && expr[i] != ' ') b += expr[i++];
      return b;
  }

  var stack = [], char;

  while ((char = nextChar(expr)) != '') {
      if (isOperator(char)) {
          if (stack.length < 2) return 'invalid: binary operation needs 2 values';
          stack.push({op: char, right: stack.pop(), left: stack.pop()});
      } else {
          stack.push(char);
      }
  }
  if (stack.length != 1) return 'invalid';
  return print(stack.pop());
}

// console.log(postfixToInfix("x w 2 / - w 4 / * y w 2 / - %"));