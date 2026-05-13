const BARREL_DIRS = [
  "@/features/competitions/championships/api",
  "@/features/competitions/championships/components",
  "@/features/competitions/championships/constants",
  "@/features/competitions/championships/hooks",
  "@/features/competitions/championships/types",
  "@/features/competitions/championships/utils",
  "@/features/competitions/leaderboards/api",
  "@/features/competitions/leaderboards/types",
  "@/features/competitions/pools/api",
  "@/features/competitions/pools/types",
  "@/features/geography/api",
  "@/features/geography/types",
  "@/features/matches/api",
  "@/features/matches/components",
  "@/features/matches/constants",
  "@/features/matches/hooks",
  "@/features/matches/types",
  "@/features/matches/utils",
  "@/features/organizations/clubs/api",
  "@/features/organizations/clubs/components",
  "@/features/organizations/clubs/constants",
  "@/features/organizations/clubs/hooks",
  "@/features/organizations/clubs/types",
  "@/features/organizations/clubs/utils",
  "@/features/organizations/committees/api",
  "@/features/organizations/committees/types",
  "@/features/organizations/leagues/api",
  "@/features/organizations/leagues/types",
  "@/features/players/api",
  "@/features/players/components",
  "@/features/players/constants",
  "@/features/players/hooks",
  "@/features/players/types",
  "@/features/players/utils",
  "@/features/search/components",
  "@/features/stats/api",
  "@/features/stats/types",
  "@/features/site/about/components",
  "@/features/site/architecture/components",
  "@/features/site/contact/components",
  "@/features/site/docs/components",
  "@/features/site/docs/hooks",
  "@/features/site/features/components",
  "@/features/teams/api",
  "@/features/teams/components",
  "@/features/teams/constants",
  "@/features/teams/hooks",
  "@/features/teams/types",
  "@/features/teams/utils",
  "@/shared/components/charts",
  "@/shared/components/domain",
  "@/shared/components/layout",
  "@/shared/components/blocks",
  "@/shared/components/table",
  "@/shared/components/navigation",
  "@/shared/components/feedback",
  "@/shared/components/forms",
  "@/shared/components/primitives",
  "@/shared/components/typography",
  "@/shared/constants",
  "@/shared/hooks",
  "@/shared/types",
  "@/shared/utils",
  "@/lib/providers",
];
// Filters out backend paths (no @/ alias there)
const FRONTEND_BARREL_DIRS = BARREL_DIRS.filter((dir) => dir.startsWith("@/"));

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
