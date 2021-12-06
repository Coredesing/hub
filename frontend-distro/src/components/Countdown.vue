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

<script>
export default {
  name: 'Countdown',
  props: {
    deadline: String,
    mode: {
      type: String,
      default: 'normal'
    }
  },
  data () {
    return {
      now: new Date(),
      interval: null
    }
  },
  computed: {
    diff () {
      if (new Date(this.deadline) <= this.now) return 0
      return Math.trunc((new Date(this.deadline) - this.now) / 1000)
    },
    second () {
      return this.twoDigits(Math.trunc(this.diff) % 60)
    },
    minute () {
      return this.twoDigits(Math.trunc(this.diff / 60) % 60)
    },
    hour () {
      return this.twoDigits(Math.trunc(this.diff / 60 / 60) % 24)
    },
    day () {
      return this.twoDigits(Math.trunc(this.diff / 60 / 60 / 24))
    }
  },
  created () {
    this.interval = setInterval(() => {
      this.now = new Date()
    }, 1000)
  },
  beforeUnmount () {
    clearInterval(this.interval)
  },
  methods: {
    twoDigits (v) {
      if (v < 10) return '0' + v
      return v
    }
  }
}
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
