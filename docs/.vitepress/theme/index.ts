import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme-without-fonts"
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client"
import Layout from "./Layout.vue"
import "./style.css"

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
  },
} satisfies Theme
