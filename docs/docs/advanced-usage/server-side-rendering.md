# Server Side Rendering

Server Side Rendering (SSR) is a technique used to render web pages on the server instead of the client. This can improve performance and SEO, as the server sends fully rendered HTML to the client.

There are several workarounds for implementing SSR in a Cardano wallet application. Here are some common approaches:

## Implementing Spoofing
You can implement a simple spoofing mechanism to check if the code is running in a browser environment. This can be done by checking for the presence of the `window` object.

```ts
export const CardanoWeb3SSR = async () => {
  if (typeof window !== "undefined") {
    const { CardanoWeb3 } = await import("cardano-web3-js/browser")
    return CardanoWeb3
  } else {
    // Fallback for server-side rendering
    const { CardanoWeb3 } = await import("cardano-web3-js/nodejs")
    return CardanoWeb3
  }
}

const CardanoWeb3 = await CardanoWeb3SSR()
const web3 = new CardanoWeb3()
const tip = await web3.getTip()
console.log(tip)
```

## React Hook

You can also create a custom React hook that skips execution on the server side. This can be useful for components that rely on browser-specific APIs.

```ts
export function useCardanoWeb3() {
  useEffect(() => {
    if (typeof window === "undefined") {
      // Skip on SSR
      return
    }

    // Import CardanoWeb3 only on the client side
  }, [])

  return {}
}