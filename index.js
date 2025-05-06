function lexer(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    let char = input[cursor];

    if (char === " ") {
      cursor++;
      continue;
    }
    if (char === "\n") {
      tokens.push({ type: "NEWLINE", value: "\n" });
      cursor++;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (/[a-zA-Z0-9]/.test(char)) {
        word += char;
        cursor++;
        char = input[cursor];
      }

      if (word === "say" || word === "val") {
        tokens.push({ type: "KEYWORD", value: word });
      } else {
        tokens.push({ type: "IDENTIFIER", value: word });
      }

      continue;
    }
    if (/[0-9]/.test(char)) {
      let number = "";
      while (/[0-9]/.test(char)) {
        number += char;
        cursor++;
        char = input[cursor];
      }
      tokens.push({ type: "NUMBER", value: parseInt(number) });
      continue;
    }
    if (/[+\-*\/=]/.test(char)) {
      tokens.push({ type: "OPERATOR", value: char });
      cursor++;
      continue;
    }
  }

  return tokens;
}

const parser = (tokens) => {
  const ast = {
    type: "Program",
    body: [],
  };

  while (tokens.length > 0) {
    let token = tokens.shift();

    if (token.type === "KEYWORD" && token.value === "val") {
      let declaration = {
        type: "Declaration",
        value: null,
        name: tokens.shift().value,
      };

      if (tokens[0].type === "OPERATOR" && tokens[0].value === "=") {
        tokens.shift(); // remove '='

        let expression = "";

        while (tokens.length > 0 && tokens[0].type !== "KEYWORD") {
          expression += tokens.shift().value;
        }
        declaration.value = expression.trim();
      }

      ast.body.push(declaration);
    }

    if (token.type === "KEYWORD" && token.value === "say") {
      ast.body.push({
        type: "PrintStatement",
        expression: tokens.shift().value,
      });
    }
  }

  return ast;
};

function codegen(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codegen).join("\n");
    case "Declaration":
      return `let ${node.name} = ${node.value};`;
    case "PrintStatement":
      return `console.log(${node.expression});`;
  }
}

function compiler(input) {
  const tokens = lexer(input);
  const ast = parser(tokens);
  const executableCode = codegen(ast);
  eval(executableCode); // Execute the generated code
}

const localCode = `
val a = 6
val b = 14
val c = a + b
say c
`;

compiler(localCode);
