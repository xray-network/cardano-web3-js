let wasm
export function __wbg_set_wasm(val) {
  wasm = val
}

const heap = new Array(128).fill(undefined)

heap.push(undefined, null, true, false)

function getObject(idx) {
  return heap[idx]
}

let heap_next = heap.length

function dropObject(idx) {
  if (idx < 132) return
  heap[idx] = heap_next
  heap_next = idx
}

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

const lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder

let cachedTextDecoder = new lTextDecoder("utf-8", { ignoreBOM: true, fatal: true })

cachedTextDecoder.decode()

let cachedUint8Memory0 = null

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8Memory0
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len))
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}

let WASM_VECTOR_LEN = 0

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0
  getUint8Memory0().set(arg, ptr / 1)
  WASM_VECTOR_LEN = arg.length
  return ptr
}

let cachedUint32Memory0 = null

function getUint32Memory0() {
  if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
    cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer)
  }
  return cachedUint32Memory0
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0
  const mem = getUint32Memory0()
  for (let i = 0; i < array.length; i++) {
    mem[ptr / 4 + i] = addHeapObject(array[i])
  }
  WASM_VECTOR_LEN = array.length
  return ptr
}

let cachedInt32Memory0 = null

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachedInt32Memory0
}

function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  const mem = getUint32Memory0()
  const slice = mem.subarray(ptr / 4, ptr / 4 + len)
  const result = []
  for (let i = 0; i < slice.length; i++) {
    result.push(takeObject(slice[i]))
  }
  return result
}
/**
 * @param {Uint8Array} tx_bytes
 * @param {(Uint8Array)[]} utxos_bytes_x
 * @param {(Uint8Array)[]} utxos_bytes_y
 * @param {Uint8Array} cost_mdls_bytes
 * @param {bigint} initial_budget_n
 * @param {bigint} initial_budget_d
 * @param {bigint} slot_config_x
 * @param {bigint} slot_config_y
 * @param {number} slot_config_z
 * @returns {(Uint8Array)[]}
 */
export function eval_phase_two_raw(
  tx_bytes,
  utxos_bytes_x,
  utxos_bytes_y,
  cost_mdls_bytes,
  initial_budget_n,
  initial_budget_d,
  slot_config_x,
  slot_config_y,
  slot_config_z
) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passArray8ToWasm0(tx_bytes, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passArrayJsValueToWasm0(utxos_bytes_x, wasm.__wbindgen_malloc)
    const len1 = WASM_VECTOR_LEN
    const ptr2 = passArrayJsValueToWasm0(utxos_bytes_y, wasm.__wbindgen_malloc)
    const len2 = WASM_VECTOR_LEN
    const ptr3 = passArray8ToWasm0(cost_mdls_bytes, wasm.__wbindgen_malloc)
    const len3 = WASM_VECTOR_LEN
    wasm.eval_phase_two_raw(
      retptr,
      ptr0,
      len0,
      ptr1,
      len1,
      ptr2,
      len2,
      ptr3,
      len3,
      initial_budget_n,
      initial_budget_d,
      slot_config_x,
      slot_config_y,
      slot_config_z
    )
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    if (r3) {
      throw takeObject(r2)
    }
    var v5 = getArrayJsValueFromWasm0(r0, r1).slice()
    wasm.__wbindgen_free(r0, r1 * 4, 4)
    return v5
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len)
}
/**
 * @param {Uint8Array} params_bytes
 * @param {Uint8Array} plutus_script_bytes
 * @returns {Uint8Array}
 */
export function apply_params_to_script(params_bytes, plutus_script_bytes) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passArray8ToWasm0(params_bytes, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passArray8ToWasm0(plutus_script_bytes, wasm.__wbindgen_malloc)
    const len1 = WASM_VECTOR_LEN
    wasm.apply_params_to_script(retptr, ptr0, len0, ptr1, len1)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    if (r3) {
      throw takeObject(r2)
    }
    var v3 = getArrayU8FromWasm0(r0, r1).slice()
    wasm.__wbindgen_free(r0, r1 * 1, 1)
    return v3
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

export function __wbindgen_object_drop_ref(arg0) {
  takeObject(arg0)
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1)
  return addHeapObject(ret)
}

export function __wbg_buffer_a448f833075b71ba(arg0) {
  const ret = getObject(arg0).buffer
  return addHeapObject(ret)
}

export function __wbg_newwithbyteoffsetandlength_d0482f893617af71(arg0, arg1, arg2) {
  const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0)
  return addHeapObject(ret)
}

export function __wbg_new_8f67e318f15d7254(arg0) {
  const ret = new Uint8Array(getObject(arg0))
  return addHeapObject(ret)
}

export function __wbg_set_2357bf09366ee480(arg0, arg1, arg2) {
  getObject(arg0).set(getObject(arg1), arg2 >>> 0)
}

export function __wbg_length_1d25fa9e4ac21ce7(arg0) {
  const ret = getObject(arg0).length
  return ret
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1))
}

export function __wbindgen_memory() {
  const ret = wasm.memory
  return addHeapObject(ret)
}
