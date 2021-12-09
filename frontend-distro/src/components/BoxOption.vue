<template>
  <div :class="{ 'box-option-wrapper rounded-sm border border-transparent': true, 'hover-active': !selectedInfo , 'active': props.active }">
    <div class="option-header text-sm px-4 py-2 lg:px-6 lg:py-4">
      <slot name="header" />
    </div>
    <div class="option-body text-sm px-4 py-2 lg:px-6 lg:py-4">
      <slot name="body" />
    </div>
  </div>
</template>

<script setup>
import useStore from '@/composables/useStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
const store = useStore()
const { selectedInfo } = storeToRefs(store)
</script>
<style lang="scss" scoped>
.box-option-wrapper {
  background: #1D1D1D;
}

.active {
  border: 1px solid #72F34B !important;
}

.hover-active {
  &:hover {
    border: 1px solid #72F34B !important;
  }
}

.option-header {
  background: #171717;
  color: #AEAEAE;
}
</style>
