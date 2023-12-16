import { describe, expect, it } from 'vitest'
import { ref } from 'vue-demi'
import { useResetableState } from '../src'

describe('useResetableState', () => {
  it('should not be modifiy for the changed prop of state', () => {
    const state = useResetableState({})
    expect(state.changed).toEqual(false)

    expect(() => (state as any).changed = true).toThrowError()

    expect(state.changed).toEqual(false)
  })

  it('should not be modifiy for the changed value of state', () => {
    const state = useResetableState({})
    expect(state.changed).toEqual(false)

    expect(() => (state as any).changed = true).toThrowError()

    expect(state.changed).toEqual(false)
  })

  it('should not be modifiy for the value prop of state', () => {
    const obj = {}
    const state = useResetableState(obj)
    expect(state.value).toEqual(obj)

    expect(() => (state as any).value = {}).toThrowError()

    expect(state.value).toEqual(obj)
  })

  it('should be commit', () => {
    const obj = { a: 1 }
    const state = useResetableState(obj)

    state.value.a = 2

    expect(state.value).toEqual({ a: 2 })
    expect(state.changed).toEqual(true)
    state.commit()
    expect(state.value).toEqual({ a: 2 })
    expect(state.changed).toEqual(false)
  })

  it('should be reset', () => {
    const obj = { a: 1 }
    const state = useResetableState(obj)

    state.value.a = 2

    expect(state.value).toEqual({ a: 2 })
    expect(state.changed).toEqual(true)
    state.reset()
    expect(state.value).toEqual({ a: 1 })
    expect(state.changed).toEqual(false)
  })

  it('should be pull', () => {
    const obj = { a: 1 }
    const state = useResetableState(obj)

    expect(state.value).not.toBe(obj)

    obj.a = 2
    expect(state.value).toEqual({ a: 1 })
    expect(state.changed).toEqual(false)

    state.pull()
    expect(state.value).toEqual({ a: 1 })
    expect(state.changed).toBe(true)

    state.value.a = 2
    expect(state.changed).toBe(false)
  })

  it('the changed value should be change when value is modifiy.', () => {
    const obj = { a: 1 }
    const state = useResetableState(obj)

    state.value.a = 2
    expect(state.value.a).toEqual(2)
    expect(state.changed).toEqual(true)

    state.value.a = 1
    expect(state.value.a).toEqual(1)
    expect(state.changed).toEqual(false)

    obj.a = 3
    expect(state.value.a).not.toBe(3)
    expect(state.changed).not.toBe(true)
  })

  it('works for array', () => {
    const arr = [{ a: 1 }, { a: 2 }]
    const state = useResetableState(arr)

    expect(state.value).toEqual(arr)

    arr[0].a = 3

    expect(state.value).not.toEqual(arr)
    expect(state.changed).not.toBe(true)

    state.pull()
    expect(state.value).not.toEqual(arr)
    expect(state.changed).toBe(true)

    state.reset()
    expect(state.value).toEqual(arr)
    expect(state.changed).toBe(false)

    state.value[0].a = 44
    expect(state.value).not.toEqual(arr)
    expect(state.changed).toBe(true)
  })

  it('works for Ref', () => {
    const f = ref({ a: 1 })

    const state = useResetableState(f)

    f.value.a = 2
    expect(state.value.a).not.toBe(f.value.a)
  })

  it('should be auto pull when the initialState changed', () => {
    const initialState = ref({ a: 1 })
    const state = useResetableState(initialState, { autoPull: true })

    initialState.value.a = 2
    expect(state.changed).toEqual(true)
  })

  it('should not be auto pull when the initialState changed value was exclued', () => {
    const initialState = ref({ a: 1, exclued: 1 })
    const state = useResetableState(initialState, { autoPull: true, exclued: ['exclued'] })

    initialState.value.exclued = 2
    expect(state.changed).not.toBe(true)
  })
})
