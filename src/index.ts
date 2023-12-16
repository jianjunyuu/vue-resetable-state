import type { MaybeRef } from 'vue-demi'
import {
  computed,
  reactive,
  ref,
  shallowReactive,
  watch,
} from 'vue-demi'
import { cloneDeep, isEqual, isObject, omit } from 'lodash-es'

export type BaseTypes = string | number | boolean | undefined | null
export type ResetableStateCollections =
  | {
    [K: string | number]: ResetableStateCollections | BaseTypes
  }
  | Array<ResetableStateCollections | BaseTypes>

export type ReactiveState<T extends ResetableStateCollections> = ReturnType<typeof reactive<T>>
export interface ResetableState<T> {
  readonly value: T
  readonly changed: boolean
  reset: () => void
  commit: () => void
  pull: () => void
}

export function useResetableState<T extends ResetableStateCollections>(
  initialState: MaybeRef<T>,
  options?: {
    autoPull?: boolean
    exclued?: (keyof T)[]
  },
): ResetableState<ReactiveState<T>> {
  const excluedKeysState = (state: any): any => options?.exclued ? omit(state, options.exclued) : state
  const _initialStateRef = ref(initialState)

  // get raw value from initial state
  const _copiedInitialStateValue = () => cloneDeep(_initialStateRef.value) as T

  // local state
  const _localStateRef = ref(_copiedInitialStateValue())

  // state value that can be reset
  const value = reactive(_copiedInitialStateValue())

  const isChanged = computed(() => !isEqual(excluedKeysState(_localStateRef.value), excluedKeysState(value)))

  // revert the change
  const reset: ResetableState<T>['reset'] = () => {
    if (isChanged.value)
      updateState(value as T, cloneDeep(_localStateRef.value) as T, options?.exclued)
  }

  // commit changed
  const commit: ResetableState<T>['commit'] = () => {
    if (isChanged.value)
      updateState(_localStateRef.value as T, cloneDeep(value) as T, options?.exclued)
  }

  // pull to local
  const pull: ResetableState<T>['pull'] = () => {
    const newState = _copiedInitialStateValue()

    if (!isEqual(_localStateRef.value, newState))
      updateState(_localStateRef.value as T, newState as T, options?.exclued)
  }

  if (options?.autoPull) {
    const watchObj = computed(() => excluedKeysState(_initialStateRef.value))

    watch(watchObj, () => {
      pull()
    }, {
      flush: 'sync',
      deep: true,
    })
  }

  const state: ResetableState<ReactiveState<T>> = {
    value,
    changed: false,
    reset,
    commit,
    pull,
  }

  Object.defineProperties(state, {
    changed: {
      get() {
        return isChanged.value
      },
    },
    value: {
      get() {
        return value
      },
    },
  })

  return shallowReactive(state)
}

function updateState<T extends ResetableStateCollections, K extends keyof T>(
  target: T,
  source: T,
  excluedKeys?: K[],
): T {
  if (Array.isArray(source) && Array.isArray(target)) {
    target.splice(0, target.length, ...reactive(cloneDeep(source)))
  }
  else {
    const keys = Object.keys(target) as K[]
    keys.forEach((k) => {
      if (
        Object.hasOwn(target, k) && (!excluedKeys || excluedKeys.includes(k))
      ) {
        target[k] = isObject(source[k])
          ? reactive(cloneDeep(source[k]) as any)
          : source[k]
      }
    })
  }

  return target
}
