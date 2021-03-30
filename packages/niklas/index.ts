const regex = /({|}|\/\*|\*\/|\/\/.*|".*"|\n|:|<|==|\+\+|--|\+|-|=|\*|\/|%|&&|\|\||,|\(|\)|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)/g;

type Handler = (next: Function) => any;
type Variable = { type: Type; final: boolean; value: Value };
type Type = "any" | "number" | "string" | "function";
type Parameter = { name: string; type: Type };
type Method = { params: Parameter[]; returns: Type; body: string[] | Function };
type Value = Boolean | Number | String | Method;

class SyntaxError extends Error {}

export class Niklas {
  public readonly parent?: Niklas;
  public readonly variables: any;
  public readonly handlers: any;
  public readonly depth: number;
  public tokens: string[];

  constructor(parent?: Niklas) {
    this.variables = {};
    this.tokens = [];
    if (parent) {
      this.parent = parent;
      this.depth = parent.depth + 1;
      this.handlers = parent.handlers
    } else {
      this.depth = 0;
      this.handlers = {};
    }
  }

  /* Actions */

  public run(source: string | string[]) {
    if (Array.isArray(source)) {
      this.tokens = source;
    } else {
      this.tokens = source.split(regex).filter((token) => token.trim());
    }
    return this.execute();
  }

  public addHandler(name: string, handler: Handler) {
    return (this.handlers[name] = { handler });
  }

  public addVariable(name: string, type: Type, final: boolean, value: Value) {
    return (this.variables[name] = { final, type, value });
  }

  public getVariable(name: string): Variable {
    const variable = this.variables[name];
    if (!variable && this.parent) {
      return this.parent.getVariable(name);
    }
    return variable;
  }

  public addFunction(name: string, fun: Function) {
    return this.addVariable(name, "function", true, { params: [], returns: "any", body: fun });
  }

  public registerDefaults() {
    this.addHandler("comment", this.handleComment);
    this.addHandler("assert", this.handleAssert);
    this.addHandler("condition", this.handleCondition);
    this.addHandler("variableDeclaration", this.handleVariableDeclaration);
    this.addHandler("functionDecleration", this.handleFunctionDecleration);
    this.addHandler("statement", this.handleStatement);
    this.addFunction("print", (params: any) => console.log(...params));
    this.addVariable("delay", "number", false, 0);
  }

  /* Core */

  protected async execute(): Promise<Value> {
    return new Promise(async (resolve, reject) => {
      try {
        while (this.tokens.length) {
          let found = false;

          if (this.peek() === "return") {
            this.get()
            const value = await this.evaluate(this.tokens)
            if (!this.parent && typeof value !== "number") {
              throw new SyntaxError("Returned value must be a number")
            }
            return resolve(value)
          }

          const handlers = this.getHandlers();
          await this.applyDelay();

          for (const i in handlers) {
            let next = false;

            const result = await handlers[i].handler.call(this, () => {
              next = true;
              return false;
            });

            if (result) {
              return resolve(result)
            }

            if (!next) {
              found = true;
              break;
            }
          }
          if (!found) {
            throw new SyntaxError("Cannot handle token " + this.peek());
          }
        }
        return resolve(0);
      } catch (e) {
        return reject({ error: e, message: e.message });
      }
    });
  }

  protected async executeFunction(method: Method): Promise<Value> {
    if (this.get(this.tokens) !== "(") {
      throw new SyntaxError("Parameter list must start with parenthesis");
    }
    const params: Value[] = [];
    while (this.tokens.length) {
      if (this.peek() === ")") {
        this.get();
        break;
      }
      params.push(await this.evaluate(this.tokens));
      if (this.peek() === ",") {
        this.get();
      } else if (this.peek() !== ")") {
        throw new SyntaxError("Function parameters must be separated by comma");
      }
    }
    for (let i = 0; i < method.params.length; i++) {
      const param = method.params[i];
      if (params.length < i) {
        throw new Error(`Parameter ${param.name} is missing!`);
      }
      const type = typeof params[i];
      if (param.type && param.type !== "any" && type !== param.type) {
        throw new Error(`Parameter ${param.name} must be of type ${param.type}, but was ${type}`);
      }
    }
    if (typeof method.body === "function") {
      return method.body(params);
    }
    const niklas = new Niklas(this);
    for (let i = 0; i < params.length; i++) {
      niklas.addVariable(method.params[i].name, method.params[i].type, true, params[i]);
    }
    return await niklas.run([...method.body]);
  }

  protected async evaluate(tokens: string[]): Promise<Value> {
    let value: Value;
    if (this.peek(tokens) === "(") {
      this.get(tokens);
      value = await this.evaluate(tokens);
      if (this.peek(tokens) === ")") {
        this.get(tokens);
      }
    } else {
      const left = await this.evaluateExpression(tokens);
      if (this.peek(tokens) === "==") {
        this.get(tokens);
        const ex = await this.evaluateExpression(tokens);
        value = left == ex;
      } else if (this.peek(tokens) === "<") {
        this.get(tokens);
        value = left < await this.evaluateExpression(tokens);
      } else if (this.peek(tokens) === ">") {
        this.get(tokens);
        value = left > await this.evaluateExpression(tokens);
      } else {
        value = left;
      }
    }
    if (this.peek(tokens) === "&&") {
      this.get(tokens);
      const other = await this.evaluate(tokens);
      value = value && other;
    } else if (this.peek(tokens) === "||") {
      this.get(tokens);
      const other = await this.evaluate(tokens);
      value = value || other;
    }
    return value;
  }

  protected async evaluateExpression(tokens: string[]): Promise<Value> {
    const left = await this.evaluateExpressionPriority(tokens) as any;
    if (this.peek(tokens) === "+") {
      this.get(tokens);
      return left + (await this.evaluateExpression(tokens) as any);
    }
    if (this.peek(tokens) === "-") {
      this.get(tokens);
      return left - (await this.evaluateExpression(tokens) as any);
    }
    return left;
  }

  protected async evaluateExpressionPriority(tokens: string[]): Promise<Value> {
    const left = await this.evaluateUnary(tokens) as any;
    if (this.peek(tokens) === "*") {
      this.get(tokens);
      return left * (await this.evaluateExpression(tokens) as any);
    }
    if (this.peek(tokens) === "/") {
      this.get(tokens);
      return left / (await this.evaluateExpression(tokens) as any);
    }
    if (this.peek(tokens) === "%") {
      this.get(tokens);
      return left % (await this.evaluateExpression(tokens) as any);
    }
    return left;
  }

  protected async evaluateUnary(tokens: string[]): Promise<Value> {
    if (this.peek(tokens) === "!") {
      this.get(tokens);
      const result = await this.evaluateUnary(tokens);
      if (typeof result !== "boolean") {
        throw new Error("NOT-Operator ('!') can only be applied to booleans");
      }
      return !result;
    }
    if (this.peek(tokens) === "-") {
      this.get(tokens);
      const result = await this.evaluateUnary(tokens);
      if (typeof result !== "number") {
        throw new Error("Minus-Operator ('-') can only be applied to numbers");
      }
      return -result;
    }
    if (this.peek(tokens) === "(") {
      this.get(tokens);
      const result = await this.evaluate(tokens);
      if (this.get(tokens) !== ")") {
        throw new Error("A parenthese was not closed");
      }
      return result;
    }
    if (this.peek(tokens).startsWith('"')) {
      const text = this.get(tokens);
      return text.substr(1, text.length - 2);
    }
    if (this.isBoolean()) {
      return this.get(tokens) === "true";
    }
    if (this.isNumber()) {
      return parseInt(this.get(tokens));
    }
    if (this.isLiteral()) {
      const name = this.get(tokens);
      const variable = this.getVariable(name);
      if (!variable) {
        throw new Error("Unknown variable " + name);
      }
      if (variable.type === "function") {
        return await this.executeFunction(variable.value as Method);
      }
      let result = variable.value;
      if (this.peek(tokens) === "=") {
        this.get(tokens);
        this.checkFinal(variable);
        result = await this.evaluate(tokens);
        this.checkTypeCompatibility(variable.type, result);
        variable.value = result;
      } else if (this.peek(tokens) === "++") {
        this.get(tokens);
        this.checkFinal(variable);
        variable.value = (variable.value as any) + 1;
      } else if (this.peek(tokens) === "--") {
        this.get(tokens);
        this.checkFinal(variable);
        variable.value = (variable.value as any) - 1;
      }
      return result;
    }
    throw new SyntaxError("Unknown start of factor: " + this.peek(tokens));
  }

  /* Handlers */

  protected handleComment(next: any) {
    if (this.peek() === "/*") {
      while (this.tokens.length) {
        if (this.get() === "*/") {
          break;
        }
      }
    } else if (this.peek().startsWith("//")) {
      this.get();
    } else {
      next();
    }
  }

  protected async handleAssert(next: any) {
    if (this.peek() !== "assert") {
      next();
      return;
    }
    this.get();
    const condition = await this.evaluate(this.tokens);
    if (!condition) {
      throw new Error("Assertion failed: " + condition);
    }
  }

  protected async handleCondition(next: any) {
    if (this.peek() !== "if") {
      return next();
    }
    this.get();
    while (this.tokens.length) {
      const condition = await this.evaluate(this.tokens);
      if (this.get() !== "{") {
        throw new Error("If-Block must begin with a brace {");
      }
      if (condition) {
        const niklas = new Niklas(this);
        const if2 = this.collectUntil(this.tokens, "{", "}")
        const result = await niklas.run(if2);
        if (this.get() !== "}") {
          throw new Error("If-Block must end with a brace }");
        }
        if (result) {
          return result;
        }
        break;
      } else {
        this.skipBlock();
        if (this.peek() === "else") {
          this.get();
          if (this.peek() === "if") {
            this.get();
            continue;
          }
          if (this.get() !== "{") {
            throw new Error("Else-Block must begin with a brace {");
          }
          const niklas = new Niklas(this);
          const tokens = this.collectUntil(this.tokens, "{", "}");
          if (this.get() !== "}") {
            throw new Error("Else-Block must end with a brace }");
          }
          const result = await niklas.run(tokens);
          if (result) {
            return result;
          }
        }
        break;
      }
    }
    while (this.peek() === "else") {
      this.get()
      if (this.peek() === "if") {
        this.get()
        await this.evaluate(this.tokens) // TODO Skip here
      }
      if (this.get() !== "{") {
        throw new SyntaxError("Else-Block must begin with a brace {");
      }
      this.skipBlock();
    }
  }

  protected async handleVariableDeclaration(next: any) {
    if (!["var", "val"].includes(this.peek())) {
      return next();
    }
    const final = this.get() === "val";
    const name = this.get();
    let type: Type = "any";
    if (this.peek() === ":") {
      this.get();
      type = this.checkType(this.get());
    }
    if (this.get() !== "=") {
      throw new Error("Variable declaration is missing '='");
    }
    const value = await this.evaluate(this.tokens);
    if (this.peek() === ";") {
      this.get();
    }
    this.addVariable(name, type, final, value);
  }

  protected handleFunctionDecleration(next: Function) {
    if (this.peek() !== "def") {
      return next();
    }
    this.get();
    const name = this.get();
    let returns: Type = "any";
    const params: Parameter[] = [];
    if (this.get() !== "(") {
      throw new Error("Function parameter list must start with parentheses");
    }
    while (this.tokens.length) {
      if (this.peek() === ")") {
        this.get();
        break;
      }
      const name = this.get();
      let type: Type = "any";
      if (this.peek() === ":") {
        this.get();
        type = this.checkType(this.get());
      }
      params.push({ name: name, type: type });
      if (this.peek() === ",") {
        this.get();
      } else if (this.peek() !== ")") {
        throw new Error("Function parameters must be separated by comma");
      }
    }
    if (this.peek() === ":") {
      this.get();
      returns = this.checkType(this.get());
    }
    if (this.get() !== "{") {
      throw new Error("Function body must start with a brace");
    }
    const body = this.collectUntil(this.tokens, "{", "}");
    if (this.get() !== "}") {
      throw new Error("Function body end with a brace");
    }
    this.addVariable(name, "function", true, { params, returns, body });
  }

  protected async handleStatement() {
    await this.evaluate(this.tokens);
  }

  /* Types */

  protected isBoolean(tokens: string[] = this.tokens) {
    return ["true", "false"].includes(this.peek(tokens));
  }

  protected isNumber(tokens: string[] = this.tokens) {
    return "0123456789".includes(this.peek(tokens)[0]);
  }

  protected isLiteral(tokens: string[] = this.tokens) {
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(this.peek(tokens)[0]);
  }

  /* Tokens */

  protected peek(tokens = this.tokens) {
    return tokens[0];
  }

  protected get(tokens = this.tokens) {
    return tokens.shift()!;
  }

  protected skipBlock() {
    let blocks = 1;
    while (true) {
      const char = this.get();
      if (char === "{") {
        blocks++;
      } else if (char === "}") {
        blocks--;
      }
      if (blocks === 0) {
        break;
      }
    }
  }

  protected collectBlock() {
    let blocks = 1;
    let tokens = [];
    while (true) {
      const token = this.get();
      if (token === "{") {
        blocks++;
      } else if (token === "}") {
        blocks--;
      }
      tokens.push(token);
      if (blocks === 0) {
        break;
      }
    }
    return tokens;
  }

  protected collectUntil(tokens = this.tokens, startChar: string, endChar: string) {
    let blocks = 1;
    let result = [];
    while (tokens.length) {
      const token = this.peek(tokens);
      if (token === startChar) {
        blocks++;
      } else if (token === endChar) {
        blocks--;
        if (blocks === 0) {
          break;
        }
      }
      result.push(token);
      this.get(tokens);
    }
    return result;
  }

  /* Util */

  protected async applyDelay() {
    const delay = this.getVariable("delay");
    if (delay && delay.value) {
      await new Promise((resolve) => setTimeout(resolve, delay.value as number));
    }
  }

  protected getHandlers() {
    return this.handlers;
  }

  protected checkType(type: string): Type {
    switch (type) {
      case "any":
      case "boolean":
      case "string":
      case "number":
        return type as Type;
    }
    throw new Error(`ConstantError: Type ${type} does not exist`);
  }

  protected checkFinal(variable: Variable) {
    if (variable.final) {
      throw new Error("ConstantError: A constant's value may not change!");
    }
  }

  protected checkTypeCompatibility(type: Type, value: Value) {
    if (type && typeof value !== type && type !== "any") {
      throw new Error(`TypeError: ${type} is not compatible to ${typeof value}`);
    }
  }
}
