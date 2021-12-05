<template>
  <div :class="{ 'box-option-wrapper rounded-sm': true, 'active': props.isActive }">
    <div class="option-header text-sm px-4 py-2 lg:px-6 lg:py-4">
      <slot name="header" />
    </div>
    <div class="option-body text-sm px-4 py-2 lg:px-6 lg:py-4">
      <slot name="body" />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

</script>
<style lang="scss" scoped>
.box-option-wrapper {
  background: #1D1D1D;
  border: 1px solid #686868;
}

.active {
  border: 1px solid #72F34B !important;
}

.option-header {
  background: #171717;
  color: #AEAEAE;
}
</style>
