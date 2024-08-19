<script setup lang="ts">
import { ref, reactive, computed, onUpdated, nextTick } from 'vue'
import VueDrag from 'vuedraggable'
// type
import { Column, ColumnSetting } from '@/types/CustomColumns'
import type { VxeTableInstance } from 'vxe-table'
type GetArrType<T> = T extends Array<infer R> ? R : never
// props
const props = defineProps<{
  columns: ColumnSetting
  tableKey: string
  instance?: VxeTableInstance
}>()

const map = reactive(new Map())
const visible = ref(false)
const select = ref<string[]>([])
const deepClone = ref<Column[]>([])

// 初始化
const init = () => {
  const arr = Object.values(props.columns)
  deepClone.value = JSON.parse(JSON.stringify(arr))
  deepClone.value.forEach((item) => {
    map.set(item.name, item)
  })
  select.value = deepClone.value.filter((item) => item.show).map((item) => item.name)
}
init()

// 所有列
const columns = computed(() => {
  const arr = Object.values(props.columns)
  return arr.map((item) => item.name)
})

// 勾选列
const list = computed<Column[]>({
  get() {
    return select.value.map((item) => map.get(item))
  },
  set(nVal) {
    select.value = nVal.map((item) => item.name)
  }
})

// 取消全选/全选
const selectAll = () => {
  select.value = columns.value.length === select.value.length ? [] : [...columns.value]
}

// close
const closeItem = (name: string) => {
  const index = select.value.findIndex((item) => item === name)
  index > -1 && select.value.splice(index, 1)
}

// 置顶
const putTop = (name: string) => {
  const index = select.value.findIndex((item) => item === name)
  const fixIndex = findFixIndex()
  if (index > -1) {
    select.value.splice(index, 1)
    select.value.splice(fixIndex, 0, name)
  }
}

// 固定
const fixed = (name: string, fix: boolean) => {
  const fixNum = list.value.filter((item) => item.fixed).length
  // 取消固定
  if (fix) {
    const item = list.value.find((item) => item.name === name)
    const index = select.value.findIndex((item) => item === name)
    if (index > -1) {
      select.value.splice(index, 1)
      select.value.push(name)
    }
    item && (item.fixed = !fix)
  }
  // 固定
  else if (fixNum < 5) {
    putTop(name)
    const item = list.value.find((item) => item.name === name)
    item && (item.fixed = !fix)
  }
}

// 固定下标
const findFixIndex = () => {
  let index = -1
  for (let i = list.value.length - 1; i >= 0; i--) {
    if (list.value[i].fixed) {
      index = i
      break
    }
  }
  return index === -1 ? 0 : index + 1
}

// footer
const reset = () => {
  init()
  save()
}
const cancel = (flag = false) => {
  visible.value = flag
}
const save = () => {
  Object.values(props.columns).forEach((item) => {
    item.show = select.value.includes(item.name)
  })
  nextTick(() => {
    const { collectColumn = [] } = props.instance?.getTableColumn() || {}

    type T = GetArrType<typeof collectColumn>
    const map = new Map<string, T>()
    const newColumns: T[] = []
    collectColumn.forEach((item) => {
      item.title ? map.set(item.title, item) : newColumns.push(item)
    })

    list.value.forEach((item) => {
      const fixed = item.fixed
      const name = item.name
      const column = map.get(name)!
      column.fixed = fixed ? 'left' : column.fixed
      newColumns.push(column)
    })
    if (map.get('操作')) {
      newColumns.push(map.get('操作')!)
    }
    props.instance?.reloadColumn(newColumns)
  })
  cancel()
}

onUpdated(() => {
  if (props.instance) {
  }
})
</script>

<template>
  <t-popup
    trigger="click"
    :visible="visible"
    placement="bottom-left"
    :overlay-inner-style="{ padding: '0px' }"
  >
    <template #content>
      <div class="custom-column">
        <div class="body">
          <div class="left">
            <div class="title">
              商品信息
              <t-button
                @click="selectAll"
                variant="text"
                theme="primary"
                size="small"
                class="oa-fz-12"
              >
                {{ columns.length === select.length ? '取消全选' : '全选' }}
              </t-button>
            </div>
            <t-checkbox-group v-model="select" :options="columns"></t-checkbox-group>
          </div>
          <div class="right">
            <div class="title">最多固定五项</div>
            <vue-drag
              v-model="list"
              animation="300"
              ghost-class="ghost"
              filter=".unmove"
              :force-fallback="true"
              item-key="name"
            >
              <template #item="{ element }">
                <div :class="{ 'select-item': true, unmove: element.fixed }">
                  <t-icon name="move" class="oa-mg-right-4"></t-icon>
                  <span>
                    {{ element.name }}
                  </span>
                  <t-icon
                    @click="closeItem(element.name)"
                    name="close-circle"
                    class="oa-fz-16 oa-mg-left-8"
                  ></t-icon>
                  <t-tooltip content="置顶">
                    <t-icon
                      @click="putTop(element.name)"
                      name="backtop"
                      class="oa-fz-16 oa-mg-left-8"
                    ></t-icon>
                  </t-tooltip>
                  <t-tooltip content="固定">
                    <t-icon
                      @click="fixed(element.name, element.fixed)"
                      :name="element.fixed ? 'pin-filled' : 'pin'"
                      :class="['oa-fz-16', 'oa-mg-left-8', element.fixed ? 'fixed' : '']"
                    ></t-icon>
                  </t-tooltip>
                </div>
              </template>
            </vue-drag>
          </div>
        </div>
        <div class="footer">
          <t-button @click="reset" theme="default" variant="outline">恢复默认</t-button>
          <t-button @click="cancel(false)" theme="default" variant="outline">取 消</t-button>
          <t-button @click="save" theme="primary" variant="outline" class="oa-mg-left-8"
            >保 存</t-button
          >
        </div>
      </div>
    </template>
    <t-button shape="square" theme="default" variant="text" @click="cancel(true)">
      <t-tooltip content="列配置">
        <t-icon name="setting" />
      </t-tooltip>
    </t-button>
  </t-popup>
</template>

<style scoped lang="scss">
:deep(.t-popup__content) {
  padding: 0 !important;
}

.custom-column {
  width: 680px;
  min-height: 350px;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    display: flex;
    max-height: 400px;
    overflow: hidden;

    .left {
      flex: 2;
      padding: 20px 16px 0;
      overflow: auto;
      margin-right: -20px;

      .title {
        font-size: 12px;
        font-weight: bold;
        color: #0b1019;
        margin-bottom: 8px;

        .t-button {
          margin-top: -2px;
        }
      }

      :deep(.t-checkbox-group) {
        row-gap: 10px;
        column-gap: 3px;
        margin-bottom: 32px;

        .t-checkbox {
          width: 95px;

          &__input {
            width: 14px;
            height: 14px;
          }

          &__label {
            font-size: 12px !important;
          }
        }
      }
    }

    .right {
      flex: 1;
      position: relative;
      z-index: 2;
      padding: 20px 0;
      overflow: auto;
      background-color: #fff;
      border-left: 1px solid #e6e8eb;
      margin-right: -5px;

      .ghost {
        opacity: 0 !important;
      }

      .title {
        margin-bottom: 8px;
        color: #a6abb4;
        font-size: 12px;
        padding: 0 16px;
      }

      .select-item {
        font-size: 12px;
        color: #33363c;
        padding: 0 16px;
        display: flex;
        height: 32px;
        align-items: center;
        cursor: grab;

        span {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .fixed {
          opacity: 1 !important;
        }

        svg {
          cursor: pointer;
          opacity: 0;

          &:hover {
            color: #0052d5;
          }

          &:first-child {
            opacity: 1;
          }
        }

        &:hover {
          svg {
            opacity: 1;
          }
          // background-color: rgb(0 91 245 / 4%);
        }
      }
    }
  }

  .footer {
    display: flex;
    padding: 16px;
    border-top: 1px solid #e6e8eb;

    .t-button {
      height: auto;
      padding: 0 8px;
      font-size: 12px;

      &:nth-child(2) {
        margin-left: auto;
      }
    }
  }
}
</style>
