<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { CarClass, CarClassItem } from '@/types/car/CarManage'
import { type FormInstanceFunctions, MessagePlugin } from 'tdesign-vue-next'

/** props\emits */
const props = defineProps<{
  visible: boolean
}>()
const emit = defineEmits<{
  (event: 'update:visible', payload: boolean): void
}>()

/** 表单 */
const applyFormInstance = ref<FormInstanceFunctions>()
const carFormInstance = ref<FormInstanceFunctions>()
const carForm = reactive({
  carName: '',
  carNum: '',
  carType: '',
  branchNum: '',
  seatNum: 4,
  price: 30,
  avatar: [],
  remark: ''
})
const applyForm = reactive({
  rank: 1,
  apply: 1,
  useApproval: 1,
  returnApproval: 1
})
const carRule = {
  carName: [{ required: true, message: '请输入车辆名称', type: 'error' }],
  carNum: [{ required: true, message: '请输入车牌号', type: 'error' }],
  seatNum: [
    { required: true, message: '请输入核载人数', type: 'error' },
    { min: 2, message: '核载人数不小于2人', type: 'error' },
    { max: 30, message: '核载人数不大于30人', type: 'error' }
  ],
  price: [
    { required: true, message: '请输入车辆价格', type: 'error' },
    { min: 10, message: '裸车价不小于10万', type: 'error' },
    { max: 100, message: '裸车价不大于100万', type: 'error' }
  ],
  avatar: [{ required: true, message: '请上传车辆图片', type: 'error' }]
}
const formValidate = async (formInstance: FormInstanceFunctions | undefined) => {
  if (formInstance) {
    return (await formInstance.validate?.()) === true
  }
  return false
}
const switchLabel = ['开启', '关闭']

/** 下拉Option */
const classOptions: CarClassItem[] = [
  { label: '轿车', value: 'first' as CarClass },
  { label: 'SUV', value: 'second' as CarClass },
  { label: '大巴', value: 'third' as CarClass },
  { label: '货车', value: 'forth' as CarClass }
]

/** dialog */
const loading = ref(false)
const closeHandler = () => {
  carFormInstance.value?.reset?.({
    type: 'initial'
  })
  applyFormInstance.value?.reset?.({
    type: 'initial'
  })
  emit('update:visible', false)
}
const confirmHandler = async () => {
  const carForm = !!(await formValidate(carFormInstance.value))
  const applyForm = !!(await formValidate(applyFormInstance.value))
  if (!carForm || !applyForm) {
    return
  }
  loading.value = true
  setTimeout(() => {
    MessagePlugin.info('保存成功')
    loading.value = false
    closeHandler()
  }, 2000)
}

/** expose */
defineExpose({
  loading,
  closeHandler
})
</script>

<template>
  <t-dialog
    class="oa-dialog full-screen"
    :visible="visible"
    width="1200px"
    top="86px"
    header="新增车辆"
    cancel-btn="取 消"
    confirm-btn="保 存"
    @cancel="closeHandler"
    @close="closeHandler"
    @confirm="confirmHandler"
  >
    <template #body>
      <div class="add-car">
        <div class="line oa-mg-bottom-20">新增车辆</div>
        <t-form :data="carForm" :rules="carRule" ref="carFormInstance" colon>
          <t-row justify="start">
            <t-col :offset="1" :span="4">
              <t-form-item label="车辆名称" name="carName">
                <t-input v-model="carForm.carName" />
              </t-form-item>
            </t-col>
            <t-col :offset="1" :span="4">
              <t-form-item label="车牌号" name="carNum">
                <t-input v-model="carForm.carNum" />
              </t-form-item>
            </t-col>
          </t-row>
          <t-row justify="start">
            <t-col :offset="1" :span="4">
              <t-form-item label="车型" name="carType">
                <t-select
                  clearable
                  multiple
                  placeholder="全部分类"
                  :min-collapsed-num="3"
                  :options="classOptions"
                  v-model="carForm.carType"
                ></t-select>
              </t-form-item>
            </t-col>
            <t-col :offset="1" :span="4">
              <t-form-item label="品牌型号" name="branchNum">
                <t-input v-model="carForm.branchNum" />
              </t-form-item>
            </t-col>
          </t-row>
          <t-row justify="start">
            <t-col :offset="1" :span="4">
              <t-form-item label="核载人数" name="seatNum">
                <t-input v-model.number="carForm.seatNum" suffix="人" />
              </t-form-item>
            </t-col>
            <t-col :offset="1" :span="4">
              <t-form-item label="裸车价" name="price">
                <t-input v-model.number="carForm.price" suffix="万" />
              </t-form-item>
            </t-col>
          </t-row>
          <t-row>
            <t-col :offset="1" :span="8">
              <t-form-item label="上传图片" name="avatar">
                <t-upload
                  v-model="carForm.avatar"
                  action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                  theme="image"
                  tips="允许选择多张图片文件上传，最多只能上传 3 张图片"
                  accept="image/*"
                  multiple
                  :max="3"
                ></t-upload>
              </t-form-item>
            </t-col>
          </t-row>
          <t-row>
            <t-col :offset="1" :span="8">
              <t-form-item label="备注" name="remark">
                <t-textarea :maxlength="200" v-model="carForm.carNum" />
              </t-form-item>
            </t-col>
          </t-row>
        </t-form>
        <div class="line oa-mg-top-32 oa-mg-bottom-20">申请设置</div>
        <t-form :data="applyForm" ref="applyFormInstance" colon>
          <t-row>
            <t-col :offset="1" :span="8">
              <t-form-item label="可用范围" name="range" class="range">
                <t-radio-group default-value="1">
                  <t-radio value="1">全部成员</t-radio>
                  <t-radio value="2">指定成员</t-radio>
                  <t-button variant="text" theme="primary" size="small"> 选择成员 </t-button>
                </t-radio-group>
              </t-form-item>
            </t-col>
          </t-row>
          <t-row>
            <t-col :offset="1" :span="3">
              <t-form-item label="用车申请" name="apply">
                <t-switch
                  :custom-value="[1, 0]"
                  :label="switchLabel"
                  v-model="applyForm.apply"
                ></t-switch>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="用车审批" name="useApproval">
                <t-switch
                  :custom-value="[1, 0]"
                  :label="switchLabel"
                  v-model="applyForm.useApproval"
                ></t-switch>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="还车审批" name="returnApproval">
                <t-switch
                  :custom-value="[1, 0]"
                  :label="switchLabel"
                  v-model="applyForm.returnApproval"
                ></t-switch>
              </t-form-item>
            </t-col>
          </t-row>
        </t-form>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <t-button variant="outline" @click="closeHandler">取 消</t-button>
        <t-button @click="confirmHandler" :loading="loading">保 存</t-button>
      </div>
    </template>
  </t-dialog>
</template>

<style scoped lang="scss">
:deep(.t-dialog__body) {
  padding: 20px 24px 0;
}

:deep(.add-car) {
  .line {
    height: 22px;
    color: #0b1019;
    font-size: 14px;
    font-weight: 600;
    position: relative;
    padding-left: 8px;

    &::after {
      left: 0;
      top: 4px;
      content: ' ';
      display: block;
      position: absolute;
      height: 14px;
      width: 2px;
      background-color: #0052d5;
    }
  }

  .t-form {
    &__label {
      padding-right: 0;
    }

    .range {
      .t-button {
        padding: 0;
        margin-left: -12px;
        margin-top: 2px;
      }
    }

    .t-row {
      padding-bottom: 20px;
    }
  }
}
</style>
