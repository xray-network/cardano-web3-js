[cardano-web3-js](../../../../index.md) / [CW3Types](../index.md) / NativeConfig

# Type Alias: NativeConfig

> **NativeConfig** = \{ `keyHash`: `string`; `type`: `"sig"`; \} \| \{ `slot`: `number`; `type`: `"before"`; \} \| \{ `slot`: `number`; `type`: `"after"`; \} \| \{ `scripts`: `ReadonlyArray`\<`NativeConfig`\>; `type`: `"all"`; \} \| \{ `scripts`: `ReadonlyArray`\<`NativeConfig`\>; `type`: `"any"`; \} \| \{ `required`: `number`; `scripts`: `ReadonlyArray`\<`NativeConfig`\>; `type`: `"atLeast"`; \}

Defined in: [types/index.ts:161](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L161)
