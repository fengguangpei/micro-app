<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
const date = new Date()
const h = date.getHours()
const m = date.getMinutes()
const s = date.getSeconds()
const hour = ref(h)
const minute = ref(m)
const second = ref(s)
const flag = ref(true)
const time = ref('')
const pause = (bool: boolean) => {
  flag.value = bool
  time.value = `${hour.value}:${minute.value}:${second.value}`
}

const timer = setInterval(() => {
  if (second.value < 59) {
    second.value++
    return
  }
  second.value = 0
  if (minute.value < 59) {
    minute.value++
    return
  }
  minute.value = 0
  hour.value = hour.value + 1 === 24 ? 0 : hour.value + 1
}, 1000)

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<script lang="ts">
export default {
  name: 'CarLog'
}
</script>

<template>
  <h1 @mouseenter="pause(false)" @mouseleave="pause(true)">
    <span v-if="flag">{{ hour }} : {{ minute }} : {{ second }}</span>
    <span v-else>
      {{ time }}
    </span>
  </h1>
</template>

<style scoped lang="scss"></style>
