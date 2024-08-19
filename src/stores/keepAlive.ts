import { defineStore } from 'pinia'
import { reactive } from 'vue'
export const useKeepAlive = defineStore('keepAlive', () => {
  const excludes = reactive<string[]>([])

  const changeAlive = (name: string, flag: boolean) => {
    const index = excludes.findIndex((item) => item === name)
    if (index === -1 && !flag) {
      excludes.push(name)
    }
    if (index > -1 && flag) {
      excludes.splice(index, 1)
    }
  }

  return {
    excludes,
    changeAlive
  }
})
