<script setup lang="ts">
import type { StepListItem } from '../types/StepBar'
// props
const props = defineProps({
  stepList: {
    type: Array<StepListItem>,
    default() {
      return []
    }
  },
  currentStep: {
    type: Number,
    default: 1
  }
})
// emits
const emits = defineEmits<{
  (event: 'change', payload: number): void
}>()
const changeCurrent = (num: number): void => {
  if (num > props.currentStep + 1) {
    return
  }
  emits('change', num)
}
</script>

<template>
  <div class="step-card">
    <div
      v-for="(item, index) of stepList"
      :class="{
        'step-card-item': true,
        'step-card__active': currentStep === index + 1,
        'step-card__disabled': index >= currentStep + 1
      }"
      :key="item.value"
      @click="changeCurrent(item.value)"
    >
      <span>
        {{ index + 1 }}
      </span>
      {{ item.label }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.step-card {
  height: 40px;
  display: flex;
  background-color: #fff;
  padding: 0 20px 16px;

  .step-card-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 40px;
    cursor: pointer;
    background-color: #f5f6f9;
    color: #888c94;
    position: relative;

    span {
      display: inline-block;
      border: 1px solid #888c94;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      font-size: 12px;
      margin-right: 4px;
    }

    &:first-child {
      border-radius: 4px 0 0 4px;
    }

    &:last-child {
      border-radius: 0 4px 4px 0;
    }

    &:hover {
      background-color: #f1f1f1;
      color: #0b1019;
    }

    &:not(:last-child) {
      &::after {
        display: block;
        content: ' ';
        position: absolute;
        right: -20px;
        border-width: 20px;
        border-style: solid;
        border-color: #fff #fff #fff transparent;
      }
    }

    &:not(:first-child) {
      &::before {
        display: block;
        content: ' ';
        position: absolute;
        left: 0;
        border-width: 20px;
        border-style: solid;
        border-color: transparent transparent transparent #fff;
      }
    }
  }

  .step-card__active {
    background-color: rgb(0 66 217 / 90%);
    color: #fff;

    &:hover {
      background-color: rgb(0 66 217 / 90%);
      color: #fff;
    }

    span {
      border-color: #fff;
    }
  }

  .step-card__disabled {
    cursor: not-allowed;
  }
}
</style>
