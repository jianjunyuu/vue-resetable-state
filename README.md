# vue-resetable-state [![NPM version](https://img.shields.io/npm/v/vue-resetable-state?color=a1b858&label=)](https://www.npmjs.com/package/vue-resetable-state)

make your state can be manage eazy. and it works for Vue 2 & 3!


## 📦 Install

> it works for Vue 2 & 3 by the power of [vue-demi](https://github.com/vueuse/vue-demi)!

```bash
npm i vue-resetable-state
```


## Usage

```ts
import { useResetableState } from 'vue-resetable-state'

const state = useResetableState({ name: 'pipi', id: 9507 })

console.log(state.value) // { name: 'pipi', id: 9507 }

state.value.name = 'didi'

console.log(state.changed) // true

// your can reset it!
state.reset()
```

## # useResetableState

Takes an inner value and returns a reactivity and mutable、resetable object, which has a single property .value that points to the inner value.

### Type
```ts
function useResetableState<T extends ResetableStateCollections>(
  initialState: MaybeRef<T>,
  options?: {
    autoPull?: boolean
    exclued?: (keyof T)[]
  }
): ResetableState<ReactiveState<T>>

type BaseTypes = string | number | boolean | undefined | null
type ResetableStateCollections = {
  [K: string | number]: ResetableStateCollections | BaseTypes
}
| Array<ResetableStateCollections | BaseTypes>
```

### Arguments

    
#### initialState:
        
- Object of array or plain object.
- Can be a reactivity object when you configure autoPull option.

#### options: `optional`
        
- autoPull: auto merge initalState to copied state when initalState change, **need it an reactivity value**.
- exclued: A collection of properties that do not need to be observed or set.

### Returns

A `ResetableState` reactivity object.


```ts
interface ResetableState<T> {
  readonly value: T
  readonly changed: boolean
  reset: () => void
  commit: () => void
  pull: () => void
}
```

#### Props

- value: a reactivity object, can be modified and reset, but cannot be set.
- changed: a getter and return a `Boolean`, readonly prop.


#### Methods


- reset()

	reset value from copied of the initialState

	Examples
	```ts
	const obj = { a: 1 }
	const state = useResetableState(obj)

	state.value.a = 2
	console.log(state.value) // { a: 2 }

	state.reset()
	console.log(state.value) // { a: 1 }
	```

- commit()
	
	submit change to copied of the initialState

	Examples
	```ts
	const obj = { a: 1 }
	const state = useResetableState(obj)

	state.value.a = 2
	console.log(state.changed) // true

	state.commit()
	console.log(state.changed) // false
	```

- pull()
	
	pull latest initialState to the inner copied

	Examples
	```ts
 	const obj = { a: 1 }
 	const state = useResetableState(obj)

 	obj.a = 2
	console.log(state.changed) // false

	state.pull()
	console.log(state.changed) // true, because state.value !== copied state

	// your can reset it, make the state.value will equal obj.
	state.reset()
	console.log(state.changed) // false
	```
