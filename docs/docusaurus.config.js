const lightCodeTheme = require("prism-react-renderer").themes.github
const darkCodeTheme = require("prism-react-renderer").themes.dracula
const { join } = require("path")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "CardanoWeb3js",
  tagline: "Versatile TypeScript library designed for seamless integration with the Cardano blockchain",
  url: "https://cardano-web3-js.xray.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  onBrokenAnchors: "log",
  favicon: "img/cardano-web3-js.svg",
  organizationName: "xray-network",
  projectName: "CardanoWeb3js",
  markdown: {
    // format: "md", // MDX for .mdx files, MD for .md files
    // parseFrontMatter: async (params) => {
    //   const result = await params.defaultParseFrontMatter(params)
    //   // Replace {inputs} with "inputs" in the description, CML has wrong MDX markdown docs/docs/api/types/namespaces/CML/classes/TransactionBuilder.md
    //   result.frontMatter.description = result.frontMatter.description?.replaceAll("{inputs}", "inputs")
    //   return result
    // },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [
    "@docusaurus/theme-live-codeblock",
    "docusaurus-lunr-search",
    // [
    //   "docusaurus-plugin-typedoc",
    //   {
    //     entryPoints: ["../src"],
    //     readme: "none",
    //     tsconfig: "../tsconfig.json",
    //   },
    // ],
    [
      "docusaurus-plugin-typedoc-api",
      {
        projectRoot: join(__dirname, ".."),
        packages: [
          {
            path: ".",
            entry: {
              index: "src/index.ts",
            },
          },
        ],
        minimal: false,
        debug: false,
        changelogs: true,
        readmes: false,
        tsconfigName: "tsconfig.json",
        typedocOptions: {
          plugin: [
            "typedoc-monorepo-link-types",
            'typedoc-plugin-extras',
            'typedoc-plugin-mdn-links',
          ],
        },
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "./docs",
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          editUrl: "https://github.com/xray-network/cardano-web3-js/docs",
        },
        theme: {
          customCss: require.resolve("./static/css/custom.css"),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "CardanoWeb3js",
        logo: {
          src: "img/cardano-web3-js.svg",
        },
        items: [
          {
            to: "/docs/getting-started/quickstart",
            activeBasePath: "/docs",
            label: "Documentation",
            position: "left",
          },
          {
            to: "/api",
            activeBasePath: "/api",
            label: "API",
            position: "left",
          },
          {
            to: "/playground",
            label: "Playground",
            position: "left",
          },
          {
            to: "https://xray.app",
            label: "XRAY/App",
            position: "right",
          },
          {
            href: "https://github.com/xray-network/cardano-web3-js",
            position: "right",
            className: "header-github-link",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} XRAY/Network. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      liveCodeBlock: {
        playgroundPosition: "bottom",
      },
      image: "https://pbs.twimg.com/profile_images/1746099108937363456/duG_Pqem_400x400.jpg",
      metadata: [
        {
          name: "keywords",
          content: "cardano-web3-js, cardano, web3, cardano api, blockchain, smart contracts, dapps, dApp development",
        },
        {
          name: "description",
          content:
            "CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain",
        },
        { name: "og:title", content: "CardanoWeb3js Documentation" },
        {
          name: "og:description",
          content:
            "CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain",
        },
        { name: "og:type", content: "website" },
        { name: "og:url", content: "https://cardano-web3-js.org" },
        { name: "og:image", content: "https://cardano-web3-js.org/img/cardano-web3-js.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "CardanoWeb3js Documentation" },
        {
          name: "twitter:description",
          content:
            "CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain",
        },
        { name: "twitter:image", content: "https://cardano-web3-js.org/img/cardano-web3-js-large.jpg" },
      ],
    }),
}

module.exports = config
