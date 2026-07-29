const TRANSLATOR_FNS = new Set(["useTranslations", "getTranslations"]);

/**
 * `t` is resolved where it is used, never handed to another component. A
 * component either resolves its own strings or receives finished `string`s
 * (docs/frontend.md#internationalisation).
 *
 * Two signals, either of which is enough on its own:
 *   1. a type capturing a translator — `ReturnType<typeof useTranslations>`,
 *      `Awaited<ReturnType<typeof getTranslations>>`. A translator prop has to
 *      be typed somehow, and this is the only way to spell it.
 *   2. a JSX attribute whose value resolves to a translator binding, which
 *      catches a renamed prop that signal 1 would miss.
 */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "The translator function never crosses a component boundary: resolve strings in the component that renders them, or pass plain strings (docs/frontend.md#internationalisation)",
    },
    messages: {
      translatorType:
        "Don't type a value as the translator function ('typeof {{name}}'). A component either resolves its own strings — call {{name}} here — or takes finished strings as props. Passing 't' around breaks the moment this component becomes a client component, since React cannot serialise functions across that boundary.",
      translatorProp:
        "Don't pass the translator '{{name}}' as a prop. Let <{{component}}> resolve its own strings, or pass the finished strings it needs.",
    },
  },
  create(context) {
    const filename = context.getFilename().replaceAll("\\", "/");
    if (!filename.includes("src/frontend")) return {};

    const sourceCode = context.sourceCode ?? context.getSourceCode();

    // `const t = useTranslations(...)` / `const t = await getTranslations(...)`
    const translatorInit = (init) => {
      if (!init) return false;
      const expr = init.type === "AwaitExpression" ? init.argument : init;
      return (
        expr?.type === "CallExpression" &&
        expr.callee?.type === "Identifier" &&
        TRANSLATOR_FNS.has(expr.callee.name)
      );
    };

    const lookup = (startScope, name) => {
      for (let scope = startScope; scope; scope = scope.upper) {
        const variable = scope.variables.find((v) => v.name === name);
        if (variable) return variable;
      }
      return null;
    };

    const jsxName = (node) =>
      node.name?.type === "JSXIdentifier"
        ? node.name.name
        : sourceCode.getText(node.name);

    return {
      // Signal 1 — a type that captures the translator, wherever it appears.
      // `typeof useTranslations` has no use other than naming that type.
      TSTypeQuery(node) {
        const name = node.exprName?.name;
        if (!name || !TRANSLATOR_FNS.has(name)) return;
        context.report({ node, messageId: "translatorType", data: { name } });
      },

      // Signal 2 — the pass site, resolved through scope so a renamed prop
      // (`translate={t}`) is caught too.
      JSXAttribute(node) {
        const value = node.value;
        if (value?.type !== "JSXExpressionContainer") return;
        const expression = value.expression;
        if (expression?.type !== "Identifier") return;

        const variable = lookup(
          sourceCode.getScope(expression),
          expression.name,
        );
        const def = variable?.defs?.[0];
        if (def?.type !== "Variable" || !translatorInit(def.node.init)) return;

        context.report({
          node,
          messageId: "translatorProp",
          data: {
            name: expression.name,
            component: jsxName(node.parent),
          },
        });
      },
    };
  },
};
