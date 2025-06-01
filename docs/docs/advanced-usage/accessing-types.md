# Accessing Types

Accessing types in CardanoWeb3js is straightforward. You can import the types you need from the `cardano-web3-js` package. This is particularly useful for TypeScript users who want to ensure type safety in their applications.

## Example of Accessing Types

```ts
import type { CW3Types } from "cardano-web3-js"

// CW3Types is a namespace that contains all the types used in CardanoWeb3js

const NewProvider = (): CW3Types.Provider => {
  return {
    ...
  }
}
```