<template>
  <teleport v-if="props.show" to="body">
    <div
      ref="modal-backdrop"
      class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
    >
      <div
        class="flex items-start justify-center min-h-screen pt-24 text-center"
      >
        <div
          ref="modal"
          class="modal-content rounded-lg text-left overflow-hidden shadow-xl p-8 w-full md:w-1/2 lg:w-1/3"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div @click.prevent="close" class="absolute right-3 top-3 cursor-pointer hover:opacity-90">
            <img src="@/assets/images/icons/x.svg">
          </div>
          <div class="modal-header font-medium text-xl">
            <slot name="header" />
          </div>
          <div class="text-sm mt-5">
            <slot name="body" />
          </div>
          <div class="text-sm mt-5">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>

const props = defineProps({
  show: {
    type: Boolean
  }
})

const emit = defineEmits(['close'])

function close () {
  emit('close')
}
</script>

<style lang="scss" scoped>
.modal-content {
  background: radial-gradient(78.47% 153.74% at 32.67% 6.61%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%);
  border: 1px solid #686868;
  box-sizing: border-box;
  backdrop-filter: blur(80px);
  border-radius: 4px;
}
</style>
