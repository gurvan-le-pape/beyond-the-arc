/**
 * A component's props are a named `interface`, never an inline object type
 * (docs/frontend-conventions.md#props).
 *
 * React's own docs sanction the inline form for a field or two, so this is a
 * project decision rather than an upstream requirement: a name is what error
 * messages quote, what an editor shows on hover, and — since props are
 * documented on their members here — the only place a per-prop doc comment can
 * live. Two props is already past the point where that matters.
 *
 * Both spellings are caught:
 *
 *   function Baseline({ y }: { y: number })        // parameter annotation
 *   const Baseline: React.FC<{ y: number }>        // FC type argument
 *
 * Scope is deliberately narrow. Only PascalCase declarations in `.tsx` are
 * components; a plain function taking an options bag is not, and an inline
 * literal is the right shape there.
 */

const isComponentName = (name) =>
  typeof name === "string" && /^[A-Z]/.test(name);

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Component props are declared as a named interface, not an inline object type (docs/frontend-conventions.md#props)",
    },
    messages: {
      inlineProps:
        "Declare <{{name}}>'s props as `interface {{name}}Props` rather than an inline object type. A name is what type errors quote and what an editor shows at the call site, and it is the only place a per-prop doc comment can live. See docs/frontend-conventions.md#props.",
    },
  },
  create(context) {
    const filename = context.getFilename().replaceAll("\\", "/");
    if (!filename.endsWith(".tsx")) return {};

    /** Reports when `annotation` is an inline object type. */
    const check = (annotation, name, node) => {
      if (annotation?.type !== "TSTypeLiteral") return;
      if (!isComponentName(name)) return;
      context.report({ node, messageId: "inlineProps", data: { name } });
    };

    /** `React.FC<{ … }>` / `FC<{ … }>` — the props are the first type argument. */
    const checkFcAnnotation = (typeAnnotation, name, node) => {
      if (typeAnnotation?.type !== "TSTypeReference") return;
      const params =
        typeAnnotation.typeArguments ?? typeAnnotation.typeParameters;
      check(params?.params?.[0], name, node);
    };

    /** The first parameter's annotation, for `function X({ … }: { … })`. */
    const checkParams = (fn, name, node) => {
      check(fn.params?.[0]?.typeAnnotation?.typeAnnotation, name, node);
    };

    return {
      FunctionDeclaration(node) {
        checkParams(node, node.id?.name, node.id ?? node);
      },
      VariableDeclarator(node) {
        const name = node.id?.name;
        if (!isComponentName(name)) return;

        // const X: React.FC<{ … }> = …
        checkFcAnnotation(
          node.id.typeAnnotation?.typeAnnotation,
          name,
          node.id,
        );

        // const X = ({ … }: { … }) => …
        const init = node.init;
        if (
          init &&
          (init.type === "ArrowFunctionExpression" ||
            init.type === "FunctionExpression")
        ) {
          checkParams(init, name, node.id);
        }
      },
    };
  },
};
