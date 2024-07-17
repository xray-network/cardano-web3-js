import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme-without-fonts"
import Layout from "./Layout.vue"
import "./style.css"

export default {
  extends: DefaultTheme,
  Layout: Layout,
} satisfies Theme
