<template>
  <div class="countdown-wrapper">
    <div>
      <div class="item">{{ day }}</div>
      <p class="text-gray-400">Days</p>
    </div>
    <span class="divider">:</span>
    <div>
      <div class="item">{{ hour }}</div>
      <p class="text-gray-400">Hours</p>
    </div>
    <span class="divider">:</span>
    <div>
      <div class="item">{{ minute }}</div>
      <p class="text-gray-400">Minutes</p>
    </div>
    <span class="divider">:</span>
    <div>
      <div class="item">{{ second }}</div>
      <p class="text-gray-400">Seconds</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
const emit = defineEmits(['timeout'])

const props = defineProps({
  deadline: String,
  mode: {
    type: String,
    default: 'normal'
  }
})

const state = reactive({
  now: new Date(),
  interval: null
})

function twoDigits (v) {
  if (v < 10) return '0' + v
  return v
}

const diff = computed(() => new Date(props.deadline) <= state.now ? 0 : Math.trunc((new Date(props.deadline) - state.now) / 1000))
const second = computed(() => twoDigits(Math.trunc(diff.value) % 60))
const minute = computed(() => twoDigits(Math.trunc(diff.value / 60) % 60))
const hour = computed(() => twoDigits(Math.trunc(diff.value / 60 / 60) % 24))
const day = computed(() => twoDigits(Math.trunc(diff.value / 60 / 60 / 24)))

watch([diff], () => {
  if (diff.value === 0) {
    emit('timeout')
  }
})

onMounted(() => {
  if (diff.value === 0) {
    emit('timeout')
    return
  }

  state.interval = setInterval(() => {
    state.now = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(state.interval)
})
</script>

<style scoped lang="scss">
.countdown-wrapper {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  position: relative;

  .divider {
    margin: 12px 8px;
    font-size: 32px;
  }

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    line-height: 32px;
    font-weight: 500;
  }

  p {
    margin: 0;
    text-align: center;
    font-size: 10px;
    line-height: 12px;
    font-weight: 400;
    text-transform: uppercase;
  }
}

@media screen and (max-width: 600px) {
  .countdown-wrapper {
    padding: 4px 8px;

    &:after {
      border-top-width: 48px;
      border-right-width: 10px;
      transform: translateX(10px);
    }

    .divider {
      font-size: 28px;
      margin: 0 0 18px;
    }

    & > div {
      padding: 0 4px;
    }

    .item {
      font-size: 20px;
      line-height: 28px;
      font-weight: 400;
    }
  }
}
</style>
