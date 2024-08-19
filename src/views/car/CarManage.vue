<script setup lang="ts">
import { ref, reactive, defineProps } from 'vue'

/** TS */
import type { PageInfo } from 'tdesign-vue-next'
import type { TableItem, CarClass, CarStatusItem, CarClassItem } from '@/types/car/CarManage'
import { ColumnSetting } from '@/types/CustomColumns'
import type { VxeTableInstance, VxeTableEvents } from 'vxe-table'

/** Component */
import AddCar from '@/components/car/AddCar.vue'
import RefreshPage from '@/components/RefreshPage.vue'
import TableDownload from '@/components/TableDownload.vue'
import CustomColumns from '@/components/CustomColumns.vue'
enum CarStatus {
  onFree = '空闲',
  onUsed = '使用中'
}

/** props */
const props = defineProps({
  id: String
})
// eslint-disable-next-line no-console
console.log(props)

/** 搜索 */
const carStatus = ref<string[]>([])
const carClass = ref<string[]>([])
const columns: ColumnSetting = reactive({
  avatar: {
    name: '图片',
    field: 'avatar',
    show: true,
    fixed: false,
    title: '基础信息'
  },
  car_name: {
    name: '车辆名称',
    field: 'car_name',
    show: true,
    fixed: false,
    title: '基础信息'
  },
  car_number: {
    name: '车牌号',
    field: 'car_number',
    show: true,
    fixed: false,
    title: '基础信息'
  },
  car_type: {
    name: '车型',
    field: 'car_type',
    show: true,
    fixed: false,
    title: '基础信息'
  },
  branch_number: {
    name: '品牌型号',
    field: 'branch_number',
    show: true,
    fixed: false,
    title: '基础信息'
  },
  price: {
    name: '裸车价',
    field: 'price',
    show: true,
    fixed: false,
    title: '基础信息'
  },
  seat_num: {
    name: '座位数量',
    field: 'seat_num',
    show: true,
    fixed: false,
    title: '基础信息'
  },
  status: {
    name: '状态',
    field: 'status',
    show: true,
    fixed: false,
    title: '基础信息'
  }
})

/** 表格 */
const obj = {
  avatar: '这是图片',
  car_name: '这是汽车名称',
  car_number: '这是汽车车牌号码',
  car_type: '这是汽车类型',
  branch_number: '这是汽车型号',
  price: 300000,
  seat_num: 4,
  status: CarStatus.onFree
}
const tableData = ref<TableItem[]>(
  new Array(200).fill(obj).map((item, index) => ({ id: index, ...item }))
)
const tableInstance = ref<VxeTableInstance>()
const getParams = () => {
  return {
    car_status: carStatus.value.join(','),
    car_class: carClass.value.join(','),
    page: currentPage.value,
    length: pageSize.value
  }
}
const checkHandler: VxeTableEvents.CheckboxChange = () => {
  const records: TableItem[] = tableInstance.value?.getCheckboxRecords() || []
}

/** 分页 */
const pageSize = ref(20)
const total = ref(0)
const currentPage = ref(1)
const paginationHandler = (info: PageInfo) => {
  const { pageSize, current } = info
}

/** 下拉Options */
const statusOptions: Array<CarStatusItem> = [
  { label: '空闲', value: 'onFree' as CarStatus },
  { label: '使用中', value: 'onUsed' as CarStatus }
]
const classOptions: Array<CarClassItem> = [
  { label: '轿车', value: 'first' as CarClass },
  { label: 'SUV', value: 'second' as CarClass },
  { label: '大巴', value: 'third' as CarClass },
  { label: '货车', value: 'forth' as CarClass }
]

/** 新增车辆 */
const visible = ref<boolean>(false)
const addCarHandler = () => {
  visible.value = true
}
</script>

<script lang="ts">
export default {
  name: 'CarManage'
}
</script>

<template>
  <div class="car-manage">
    <div id="search-section">
      <t-select
        auto-width
        clearable
        multiple
        placeholder="全部状态"
        :min-collapsed-num="1"
        :options="statusOptions"
        v-model="carStatus"
      >
        <template #valueDisplay="{ value }">
          <span class="oa-mg-left-4 oa-mg-right-4">
            {{ value.length ? value[0].label : '' }}
          </span>
        </template>
      </t-select>
      <t-select
        auto-width
        clearable
        multiple
        placeholder="全部分类"
        :min-collapsed-num="1"
        :options="classOptions"
        v-model="carClass"
      >
        <template #valueDisplay="{ value }">
          <span class="oa-mg-left-4 oa-mg-right-4">
            {{ value.length ? value[0].label : '' }}
          </span>
        </template>
      </t-select>
    </div>
    <div class="operate-section">
      <t-button @click="addCarHandler"> 新增车辆 </t-button>
      <refresh-page></refresh-page>
      <table-download></table-download>
      <custom-columns
        :columns="columns"
        table-key="CarManage"
        :instance="tableInstance"
      ></custom-columns>
    </div>
    <div class="table-section">
      <div class="vxe-table-box">
        <vxe-table
          :data="tableData"
          :border="true"
          ref="tableInstance"
          height="auto"
          auto-resize
          show-header-overflow
          :scroll-y="{ enabled: true, gt: 0 }"
          @checkbox-change="checkHandler"
        >
          <vxe-table-column
            type="checkbox"
            width="46px"
            align="center"
            fixed="left"
          ></vxe-table-column>
          <vxe-table-column
            v-if="columns.avatar.show"
            min-width="210px"
            field="avatar"
            title="图片"
          ></vxe-table-column>
          <vxe-table-column
            v-if="columns.car_name.show"
            min-width="210px"
            field="car_name"
            title="车辆名称"
          ></vxe-table-column>
          <vxe-table-column
            v-if="columns.car_number.show"
            min-width="210px"
            field="car_number"
            title="车牌号"
          ></vxe-table-column>
          <vxe-table-column
            v-if="columns.car_type.show"
            min-width="210px"
            field="car_type"
            title="车型"
          ></vxe-table-column>
          <vxe-table-column
            v-if="columns.branch_number.show"
            min-width="210px"
            field="branch_number"
            title="品牌型号"
          ></vxe-table-column>
          <vxe-table-column
            v-if="columns.price.show"
            min-width="210px"
            field="price"
            title="裸车价"
          ></vxe-table-column>
          <vxe-table-column
            v-if="columns.seat_num.show"
            min-width="210px"
            field="seat_num"
            title="座位数量"
          ></vxe-table-column>
          <vxe-table-column
            v-if="columns.status.show"
            min-width="210px"
            field="status"
            title="状态"
          ></vxe-table-column>
          <vxe-table-column
            min-width="210px"
            field="operator"
            fixed="right"
            title="操作"
          ></vxe-table-column>
        </vxe-table>
      </div>
      <div class="pagination-box">
        <t-pagination
          show-jumper
          :total="total"
          :page-size-options="[20, 50, 100, 200]"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          @on-change="paginationHandler"
        ></t-pagination>
      </div>
    </div>
    <!-- 新增车辆 -->
    <add-car v-model:visible="visible"></add-car>
  </div>
</template>

<style scoped lang="scss">
.car-manage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
