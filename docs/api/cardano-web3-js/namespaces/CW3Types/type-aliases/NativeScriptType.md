[cardano-web3-js](../../../../index.md) / [CW3Types](../index.md) / NativeScriptType

# Type Alias: NativeScriptType

> **NativeScriptType** = \{ `ScriptPubkey`: \{ `ed25519_key_hash`: `string`; \}; \} \| \{ `ScriptInvalidBefore`: \{ `before`: `number`; \}; \} \| \{ `ScriptInvalidHereafter`: \{ `after`: `number`; \}; \} \| \{ `ScriptAll`: \{ `native_scripts`: `ReadonlyArray`\<`NativeScriptType`\>; \}; \} \| \{ `ScriptAny`: \{ `native_scripts`: `ReadonlyArray`\<`NativeScriptType`\>; \}; \} \| \{ `ScriptNOfK`: \{ `n`: `number`; `native_scripts`: `ReadonlyArray`\<`NativeScriptType`\>; \}; \}

Defined in: [types/index.ts:168](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L168)
