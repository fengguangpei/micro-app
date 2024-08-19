// 列配置
interface Column {
  name: string // 列名称
  field: string // 列字段
  show: boolean // 是否显示
  fixed?: boolean // 是否固定
  title?: string // 分组
}
// 列配置数组
type ColumnSetting = Record<string, Column>

export { ColumnSetting, Column }
