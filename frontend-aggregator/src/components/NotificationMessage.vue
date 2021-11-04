<template>
  <transition name="slide-left">
    <div v-show="show" class="notification-message" :style="{background: color}">
      {{msg}}
    </div>
  </transition>
</template>

<script>
export default {
  name: "NotificationMessage",
  computed: {
    show() {
      return this.$store.state.notification.show
    },
    msg() {
      return this.$store.state.notification.message
    },
    color() {
      if(this.$store.state.notification.type) {
        switch (this.$store.state.notification.type) {
          case 'info':
            return '#2B892F';
          case 'error':
            return '#fa4a4a';
          case 'warning':
            return '#FFE42F';
          default:
            return '#1994FC';
        }
      }
      return '#1994FC'
    }
  }
}
</script>

<style scoped lang="scss">
  .notification-message {
    position: fixed;
    bottom: 32px;
    right: 32px;
    padding: 8px 12px;
    border-radius: 8px;
    color: #FFFFFF;
    box-shadow: 0px 4px 60px rgba(204, 204, 204, 0.3);
    border-radius: 8px;
    z-index: 10000;
  }

  .slide-left {
    &-enter {
      transform: translateX(100%);
      opacity: 0;

      &-active {
        transition: all 0.4s;
      }

      &-to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }
</style>