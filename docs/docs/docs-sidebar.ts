export const quickStartSidebar = {
  text: "Getting Started",
  items: [
    { text: "Quickstart", link: "/docs/quickstart" },
    { text: "Glossary", link: "/docs/glossary" },
  ],
}

export const cardanoWeb3Sidebar = {
  text: "CardanoWeb3",
  collapsed: true,
  items: [
    { text: "Initialization", link: "/docs/cardano-web3/initialization" },
    { text: "Providers", link: "/docs/cardano-web3/providers" },
    { text: "Utilities & Libraries", link: "/docs/cardano-web3/utils-and-libs" },
    { text: "Advanced Usage", link: "/docs/cardano-web3/advanced-usage" },
  ],
}

export const accountsSidebar = {
  text: "Accounts",
  collapsed: true,
  items: [
    { text: "Accounts & Keys", link: "/docs/accounts/accounts-and-keys" },
    { text: "Addresses", link: "/docs/accounts/addresses" },
  ],
}

export const transactionsSidebar = {
  text: "Transactions",
  collapsed: true,
  items: [
    { text: "Basic Transactions", link: "/docs/transactions/basic-transactions" },
    { text: "Smart Contracts Transactions", link: "/docs/transactions/smart-contracts-transactions" },
  ],
}

export const explorersSidebar = {
  text: "Explorers",
  collapsed: true,
  items: [
    { text: "Koios", link: "/docs/explorers/koios" },
    { text: "XRAY/Graph NFTCDN", link: "/docs/explorers/xray-graph-nftcdn" },
    { text: "XRAY/Graph Pricing", link: "/docs/explorers/xray-graph-pricing" },
  ],
}

export const docsSidebar = {
  text: "Documentation",
  items: [cardanoWeb3Sidebar, accountsSidebar, transactionsSidebar, explorersSidebar],
}
