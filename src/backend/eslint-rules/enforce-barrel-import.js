const BARREL_DIRS = [
  "@common/constants",
  "@common/dto",
  "@common/filters",
  "@common/interceptors",
  "@common/middleware",
  "@common/pipes",
  "@common/types",
  "@common/utils",
  "@modules/competitions/championships/dto",
  "@modules/competitions/leaderboards/dto",
  "@modules/competitions/pools/dto",
  "@modules/geography/dto",
  "@modules/geography/departments/dto",
  "@modules/geography/regions/dto",
  "@modules/matches/dto",
  "@modules/organizations/clubs/dto",
  "@modules/organizations/committees/dto",
  "@modules/organizations/leagues/dto",
  "@modules/players/dto",
  "@modules/teams/dto",
  "@modules/stats/dto",
];

// Filters out backend paths (no @ alias there)
const FRONTEND_BARREL_DIRS = BARREL_DIRS.filter((dir) => dir.startsWith("@"));

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description:
        "Enforce imports from barrel index instead of direct file paths",
    },
    messages: {
      useBarrelImport:
        'Import from barrel index instead. Use "{{ barrelPath }}" instead of "{{ foundPath }}"',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value.replace(/\/index$/, "");

        const matchingBarrel = FRONTEND_BARREL_DIRS.find((barrel) =>
          importPath.startsWith(barrel + "/"),
        );

        if (!matchingBarrel) return;

        context.report({
          node: node.source,
          messageId: "useBarrelImport",
          data: {
            barrelPath: matchingBarrel,
            foundPath: importPath,
          },
          fix(fixer) {
            return fixer.replaceText(node.source, `"${matchingBarrel}"`);
          },
        });
      },
    };
  },
};
