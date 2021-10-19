<template>
  <div :class="`countdown-wrapper ${mode}`">
    <div>
      <div class="item">{{ day }}</div>
      <p>Days</p>
    </div>
    <span class="divider">:</span>
    <div>
      <div class="item">{{ hour }}</div>
      <p>Hours</p>
    </div>
    <span class="divider">:</span>
    <div>
      <div class="item">{{ minute }}</div>
      <p>Minutes</p>
    </div>
    <span class="divider">:</span>
    <div>
      <div class="item">{{ second }}</div>
      <p>Seconds</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Countdown",
  props: {
    deadline: String,
    mode: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {
      now: new Date(),
      interval: null
    }
  },
  created() {
    this.interval = setInterval(() => {
      this.now = new Date()
    }, 1000)
  },
  methods: {
    twoDigits(v) {
      if (v < 10)
        return '0' + v
      return v
    }
  },
  computed: {
    diff() {
      if (new Date(this.deadline) <= this.now) return 0
      return Math.trunc((new Date(this.deadline) - this.now) / 1000)
    },
    second() {
      return this.twoDigits(Math.trunc(this.diff) % 60)
    },
    minute() {
      return this.twoDigits(Math.trunc(this.diff / 60) % 60)
    },
    hour() {
      return this.twoDigits(Math.trunc(this.diff / 60 / 60) % 24)
    },
    day() {
      return this.twoDigits(Math.trunc(this.diff / 60 / 60 / 24))
    }
  },
  beforeUnmount() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped lang="scss">
.countdown-wrapper {
  display: flex;
  align-items: center;
  background: #000000a0;
  padding: 8px 16px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 0;
    border-top: 64px solid #000000a0;
    border-right: 20px solid transparent;
    transform: translateX(20px);
  }

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
    font-family: 'Space Ranger', sans-serif;
    font-size: 28px;
    line-height: 32px;
    font-weight: 500;
    font-style: italic;
  }

  p {
    margin: 0;
    text-align: center;
    font-size: 10px;
    line-height: 12px;
    text-transform: uppercase;
  }

  &.small {
    padding: 4px 12px;

    &:after {
      border-top-width: 48px;
      border-right-width: 10px;
      transform: translateX(10px);
    }

    & > div {
      padding: 0 4px;
    }

    .item {
      font-size: 24px;
      line-height: 28px;
    }

    .divider {
      font-size: 24px;
    }
  }
}
</style>