# vue-resetable-state [![NPM version](https://img.shields.io/npm/v/vue-resetable-state?color=a1b858&label=)](https://www.npmjs.com/package/vue-resetable-state)

make your state can be manage eazy. and it works for Vue 2 & 3!

## Usage

```ts
import { useResetableState } from 'vue-resetable-state'

const state = useResetableState({ name: 'pipi', id: 9507 })

console.log(state.value) // { name: 'pipi', id: 9507 }

state.value.name = 'didi'

console.log(state.value.changed) // true

// your can reset it!
state.reset()
```

## 📦 Install

> it works for Vue 2 & 3 by the power of [vue-demi](https://github.com/vueuse/vue-demi)!

```bash
npm i vue-resetable-state
```