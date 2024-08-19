<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
interface BasicForm {
  ruleName: string
  status: boolean
  stores: Array<{ id: number; name: string }>
}
interface SendTargetList {
  asins: Array<{ sid: number; val: string }>
  orders: Array<{ sid: number; val: string }>
  buyers: Array<{ sid: number; val: string }>
}
const basicForm = reactive<BasicForm>({
  ruleName: '',
  status: false,
  stores: [
    {
      id: 1,
      name: 'first'
    }
  ]
})
const basicFormRule = {
  ruleName: [
    {
      validator: (val: string) => {
        return {
          result: !!val,
          message: '请输入规则名称',
          type: 'error'
        }
      }
    }
  ],
  stores: [{ required: true, message: '请选择店铺' }]
}
// 选择店铺
const closeStore = (index: number) => basicForm.stores.splice(index, 1)

// 发送对象
const sendTargetTye = ref<number>(1)
const sendTargetList = reactive<SendTargetList>({
  asins: [],
  orders: [],
  buyers: []
})
const sendTarget = computed(() => {
  const type = sendTargetTye.value
  if (type === 1) {
    return []
  }
  if (type === 2) {
    return sendTargetList.asins
  }
  if (type === 3) {
    return sendTargetList.orders
  }
  return sendTargetList.buyers
})
// 排除对象
const excludeTargetType = ref<number>(1)
</script>

<template>
  <div class="send-target">
    <div class="send-target__left">
      <t-form
        :data="basicForm"
        :rules="basicFormRule"
        required-mark
        colon
        label-align="right"
        label-width="50px"
      >
        <t-form-item label-width="0px" name="ruleName">
          <t-textarea v-model="basicForm.ruleName" placeholder="请输入规则名称" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-switch v-model="basicForm.status" size="small"></t-switch>
        </t-form-item>
        <t-form-item label="店铺" name="stores" class="oa-mg-bottom-8">
          <t-button size="small" variant="outline" theme="primary">选择店铺</t-button>
        </t-form-item>
        <div class="store-list">
          <t-tag
            v-for="(item, index) of basicForm.stores"
            :key="item.name"
            closable
            @close="closeStore(index)"
          >
            {{ item.name }}
          </t-tag>
        </div>
      </t-form>
    </div>
    <div class="send-target__right">
      <div class="send-target-box">
        <div class="title">发送对象</div>
        <t-radio-group v-model="sendTargetTye" size="small" class="oa-mg-bottom-12 oa-mg-top-20">
          <t-radio :value="1" size="small">全部购买商品的订单</t-radio>
          <t-radio :value="2">购买指定ASIN的订单</t-radio>
          <t-radio :value="3">指定订单号</t-radio>
          <t-radio :value="4">指定买家的订单</t-radio>
        </t-radio-group>
      </div>
      <div class="exclude-target-box">
        <div class="title">排除对象</div>
        <t-radio-group
          v-model="excludeTargetType"
          size="small"
          class="oa-mg-bottom-12 oa-mg-top-20"
        >
          <t-radio :value="1">无排除对象</t-radio>
          <t-radio :value="2">有排除对象</t-radio>
        </t-radio-group>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.send-target {
  display: flex;
  height: 100%;

  &__left {
    width: 361px;
    border-right: 1px solid #e6e8eb;
    background-color: #fff;
    padding: 20px;

    :deep(.t-form) {
      .t-textarea__inner {
        height: 120px;
        font-size: 22px;
        color: #0b1019;
      }

      .t-form__label {
        padding-right: 0;
      }
    }

    .store-list {
      margin-left: 50px;
      display: flex;
      flex-wrap: wrap;
      column-gap: 8px;
    }
  }

  &__right {
    flex: 1;
    padding: 12px;

    .title {
      line-height: 20px;
      font-size: 14px;
      color: #0b1019;
      font-weight: 600;
      position: relative;
      padding-left: 8px;

      &::after {
        left: 0;
        top: 3px;
        content: ' ';
        display: block;
        position: absolute;
        height: 14px;
        width: 2px;
        background-color: #0052d5;
      }
    }

    :deep(.send-target-box) {
      padding: 20px;
      border-right: 1px solid #e6e8eb;
      background-color: #fff;

      .t-radio__input {
        width: 14px;
        height: 14px;
      }

      .t-radio__label {
        font-size: 12px;
      }
    }

    :deep(.exclude-target-box) {
      padding: 20px;
      margin-top: 20px;
      border: 1px solid #e6e8eb;
      background-color: #fff;

      .t-radio__input {
        width: 14px;
        height: 14px;
      }

      .t-radio__label {
        font-size: 12px;
      }
    }
  }
}
</style>
