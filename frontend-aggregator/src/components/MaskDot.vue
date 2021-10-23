<template>
  <div class="mask-dot" :style="computedStyle"></div>
</template>

<script>
export default {
  name: "MaskDot",
  props: {
    color: String,
    size: [Number, String],
    right: Boolean,
    top: [Number, String],
    bottom: [Number, String]
  },
  computed: {
    computedStyle() {
      let style = {}
      if(this.color) {
        style.background = this.color
      }
      if(this.size) {
        style.width = `${this.size}px`
        style.height = `${this.size}px`
      }
      if(this.right) {
        style.right = 0
        style.transform = 'translateX(50%)'
      } else {
        style.left = 0
        style.transform = 'translateX(-50%)'
      }
      if(this.top) {
        style.top = `${this.top}px`
      }
      if(this.bottom) {
        style.bottom = `${this.bottom}px`
      }
      return style
    }
  }
}
</script>

<style scoped lang="scss">
.mask-dot {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #E33A63;
  filter: blur(100px);
}


@media screen and (max-width: 600px) {
  .mask-dot {
    display: none;
  }
}
</style>