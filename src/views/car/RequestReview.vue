<script setup lang="ts">
import { ref, computed } from 'vue'
import StepBar from '@/components/StepBar.vue'
import SelectSendTarget from '@/components/car/SelectSendTarget.vue'
import RuleConfig from '@/components/car/RuleConfig.vue'
import SendTime from '@/components/car/SendTime.vue'
import { $rootRouter } from '@/main'

/** 步骤条 */
const currentStep = ref(1)
const stepList = [
  {
    label: '选择发生对象',
    value: 1
  },
  {
    label: '设置规则',
    value: 2
  },
  {
    label: '发送时间',
    value: 3
  }
]
const stepChange = (num: number) => {
  currentStep.value = num
}
/** 操作按钮 */
const btns = computed(() => {
  const index = currentStep.value
  return {
    pre: index > 1,
    next: index < 3,
    preview: index === 3
  }
})
const cancelFn = () => null
const preFn = () => {
  currentStep.value = currentStep.value - 1
}
const nextFn = () => {
  $rootRouter.push({
    name: 'Roster'
  })
}
const saveFn = () => null
const previewFn = () => null
</script>

<script lang="ts">
export default {
  name: 'RequestReview'
}
</script>

<template>
  <div class="request-review oa-width-100p oa-height-100p">
    <!-- title -->
    <div class="request-review__title">添加Request规则</div>
    <!-- step -->
    <step-bar :step-list="stepList" :current-step="currentStep" @change="stepChange"></step-bar>
    <!-- body -->
    <div class="request-review__body">
      <select-send-target v-show="currentStep === 1"></select-send-target>
      <rule-config v-show="currentStep === 2"></rule-config>
      <send-time v-show="currentStep === 3"></send-time>
    </div>
    <!-- footer -->
    <div class="request-review__footer">
      <t-button variant="outline" @click="cancelFn">取 消</t-button>
      <t-button v-if="btns.pre" @click="preFn">上一步</t-button>
      <t-button v-if="btns.preview" variant="outline" @click="previewFn">预 览</t-button>
      <t-button v-if="btns.preview" variant="outline" @click="saveFn">保 存</t-button>
      <t-button v-if="btns.next" @click="nextFn">下一步</t-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.request-review {
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 20px;
    color: #0b1019;
    font-weight: bold;
    height: 54px;
    line-height: 54px;
    padding: 0 20px;
    background-color: #fff;
  }

  &__body {
    flex: 1;
    border-top: 1px solid #e6e8eb;
  }

  &__footer {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 8px;
    border-top: 1px solid #e6e8eb;
    background-color: #fff;
  }
}
</style>
