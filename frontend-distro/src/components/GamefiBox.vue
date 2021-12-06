<template>
  <div class="box-wrapper px-6 py-4 lg:px-10 lg:py-8 rounded-sm">
    <slot name="body" />
  </div>
</template>

<script setup>
</script>
<style lang="scss" scoped>
.box-wrapper {
  background: radial-gradient(78.47% 153.74% at 32.67% 6.61%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(80px);
  border: 1px solid #686868;
}
</style>
