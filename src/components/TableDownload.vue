<script setup lang="ts">
const emits = defineEmits(['download'])
</script>

<template>
  <t-tooltip content="导出">
    <t-button @click="emits('download')" shape="square" theme="default" variant="text">
      <t-icon name="download" />
    </t-button>
  </t-tooltip>
</template>

<style scoped lang="scss">
.t-button {
  &:hover {
    background-color: #e7e7e7;
  }
}
</style>
