import { defineConfig } from "vitepress"
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs"
import { quickStartSidebar, docsSidebar } from "../docs/docs-sidebar"
import typedocSidebar from "../api/typedoc-sidebar.json"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CardanoWeb3js",
  description:
    "CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain",
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: "https://carano-web3-js.org",
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    },
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    [
      "link",
      {
        rel: "preload",
        href: "https://cdn.xray.app/fonts/satoshi/Satoshi-Variable.ttf",
        as: "font",
        type: "font/ttf",
        crossorigin: "anonymous",
      },
    ],
    [
      "link",
      {
        rel: "preload",
        href: "https://cdn.xray.app/fonts/archivo/Archivo-Variable.ttf",
        as: "font",
        type: "font/ttf",
        crossorigin: "anonymous",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdn.xray.app/fonts/satoshi.css",
        type: "text/css",
        crossorigin: "anonymous",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdn.xray.app/fonts/archivo.css",
        type: "text/css",
        crossorigin: "anonymous",
      },
    ],
    [
      "script",
      {
        async: "true",
        src: "https://www.googletagmanager.com/gtag/js?id=G-QFZCYEEPH1",
      },
    ],
    [
      "script",
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-QFZCYEEPH1');",
    ],
  ],
  themeConfig: {
    logo: "/cardano-web3-js.svg",

    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/docs/quickstart" },
      { text: "Typedoc API", link: "/api/" },
      { text: "Playground", link: "/playground/" },
    ],

    footer: {
      message: "Released under the MIT License",
      copyright: "Copyright © 2024-present XRAY/Network",
    },

    editLink: {
      text: "Edit this page on GitHub",
      pattern: "https://github.com/xray-network/cardano-web3-js/edit/main/docs/:path",
    },

    search: {
      provider: "local",
      options: {
        _render(src, env, md) {
          const html = md.render(src, env)
          if (env.frontmatter?.search === false) return ""
          if (env.relativePath.startsWith("api/")) return ""
          return html
        },
      },
    },

    sidebar: [
      quickStartSidebar,
      docsSidebar,
      {
        text: "Typedoc API",
        items: [{ text: "API Reference", link: "/api/" }, ...typedocSidebar],
      },
    ],

    socialLinks: [
      { icon: "x", link: "https://x.com/xray_network" },
      { icon: "discord", link: "https://discord.com/invite/WhZmm46APN" },
      { icon: "github", link: "https://github.com/xray-network/cardano-web3-js" },
    ],
  },
})
