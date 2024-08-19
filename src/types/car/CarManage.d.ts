export interface TableItem {
  avatar: string
  car_number: string
  car_name: string
  car_type: string
  branch_number: string
  price: number
  seat_num: number
  status: CarStatus
}
export enum CarStatus {
  onFree = '空闲',
  onUsed = '使用中'
}
export enum CarClass {
  first = '轿车',
  second = 'SUV',
  third = '大巴',
  forth = '货车'
}
export interface CarStatusItem {
  label: string
  value: CarStatus
}
export interface CarClassItem {
  label: string
  value: CarClass
}
