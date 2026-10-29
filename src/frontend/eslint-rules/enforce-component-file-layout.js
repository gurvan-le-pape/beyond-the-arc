/**
 * A `.tsx` module's top-level statements come in a fixed order of sections
 * (docs/frontend-conventions.md#file-layout), so any component file reads the
 * same way:
 *
 *   "use client"                      directive
 *   import …                          imports
 *   type Option = … / interface …     types other than props
 *   const LABEL_KEYS = …              constants
 *   function formatX(…) { … }         helpers (camelCase functions)
 *   interface XProps { … }            components, each props interface
 *   export function X(…) { … }        directly above its component
 *   export { Y } from "./y"           trailing exports (re-exports)
 *
 * A `*Props` type with no component of that name in the file is an ordinary
 * type and goes in the types section.
 *
 * Every section is optional; the rule only checks that a present one never
 * follows a later one. Each section holds what the sections below it use, so
 * the file reads top to bottom from vocabulary to the component built from it.
 *
 * Inside the components section, `XProps` is immediately followed by `X`: the
 * contract sits against the function that destructures it. Private
 * sub-components come before the exported component that renders them, for
 * the same dependency order.
 */

const SECTIONS = [
  "directive",
  "import",
  "type",
  "constant",
  "helper",
  "component",
  "trailing export",
];

const isComponentName = (name) =>
  typeof name === "string" && /^[A-Z]/.test(name);

const isFunctionInit = (init) => {
  if (!init) return false;
  if (
    init.type === "ArrowFunctionExpression" ||
    init.type === "FunctionExpression"
  )
    return true;
  // memo(…) / forwardRef(…) / React.memo(…) wrap a component.
  if (init.type === "CallExpression") {
    const callee = init.callee;
    const name = callee.name ?? callee.property?.name;
    return name === "memo" || name === "forwardRef";
  }
  return false;
};

/**
 * Classifies one top-level statement.
 *
 * @param {object} statement - A `Program.body` entry.
 * @returns {{ section: string, name?: string, exported: boolean } | null}
 *   `null` for statements the layout says nothing about.
 */
const classify = (statement) => {
  if (statement.type === "ExpressionStatement" && statement.directive)
    return { section: "directive", exported: false };
  if (statement.type === "ImportDeclaration")
    return { section: "import", exported: false };
  if (
    statement.type === "ExportDefaultDeclaration" ||
    statement.type === "ExportAllDeclaration" ||
    (statement.type === "ExportNamedDeclaration" && !statement.declaration)
  )
    return { section: "trailing export", exported: true };

  const exported = statement.type === "ExportNamedDeclaration";
  const node = exported ? statement.declaration : statement;

  switch (node.type) {
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration": {
      const name = node.id.name;
      return name.endsWith("Props")
        ? { section: "component", name, exported, props: true }
        : { section: "type", name, exported };
    }
    case "TSEnumDeclaration":
      return { section: "type", name: node.id.name, exported };
    case "FunctionDeclaration": {
      const name = node.id?.name;
      return {
        section: isComponentName(name) ? "component" : "helper",
        name,
        exported,
      };
    }
    case "VariableDeclaration": {
      const declarator = node.declarations[0];
      const name = declarator.id.name;
      if (!isFunctionInit(declarator.init))
        return { section: "constant", name, exported };
      return {
        section: isComponentName(name) ? "component" : "helper",
        name,
        exported,
      };
    }
    default:
      return null;
  }
};

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Top-level statements of a .tsx module follow the file layout (docs/frontend-conventions.md#file-layout)",
    },
    messages: {
      outOfOrder:
        "{{what}} belongs in the {{section}} section, which comes before the {{previous}} section above it. Order: directive, imports, types, constants, helpers, components, trailing exports. See docs/frontend-conventions.md#file-layout.",
      propsNotAdjacent:
        "`{{props}}` must sit directly above `{{component}}`, the component it types. See docs/frontend-conventions.md#file-layout.",
      privateAfterExported:
        "Private component `{{name}}` comes after the exported `{{exported}}`; declare sub-components above the component that renders them. See docs/frontend-conventions.md#file-layout.",
    },
  },
  create(context) {
    const filename = context.getFilename().replaceAll("\\", "/");
    if (!filename.endsWith(".tsx")) return {};

    return {
      Program(program) {
        const entries = program.body
          .map((statement) => ({ statement, info: classify(statement) }))
          .filter((entry) => entry.info !== null);

        // A props type with no component of its name here (a building block of
        // another props type, or one exported for a sibling to extend) is an
        // ordinary type.
        const componentNames = new Set(
          entries
            .filter((e) => e.info.section === "component" && !e.info.props)
            .map((e) => e.info.name),
        );
        for (const { info } of entries) {
          if (info.props && !componentNames.has(info.name.slice(0, -5))) {
            info.section = "type";
            info.props = false;
          }
        }

        let furthest = 0;
        for (const { statement, info } of entries) {
          const rank = SECTIONS.indexOf(info.section);
          if (rank < furthest) {
            context.report({
              node: statement,
              messageId: "outOfOrder",
              data: {
                what: info.name ? `\`${info.name}\`` : "This statement",
                section: info.section,
                previous: SECTIONS[furthest],
              },
            });
          } else {
            furthest = rank;
          }
        }

        const components = entries.filter(
          (entry) => entry.info.section === "component",
        );
        components.forEach(({ statement, info }, index) => {
          if (!info.props) return;
          const component = info.name.slice(0, -"Props".length);
          if (components[index + 1]?.info.name !== component) {
            context.report({
              node: statement,
              messageId: "propsNotAdjacent",
              data: { props: info.name, component },
            });
          }
        });

        let firstExported = null;
        for (const { statement, info } of components) {
          if (info.props) continue;
          if (info.exported) {
            firstExported ??= info.name;
          } else if (firstExported) {
            context.report({
              node: statement,
              messageId: "privateAfterExported",
              data: { name: info.name, exported: firstExported },
            });
          }
        }
      },
    };
  },
};
