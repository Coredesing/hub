<template>
  <div :class="`upcoming ${!mainItem ? 'upcoming-row' : (subItems && subItems.length ? '' : 'upcoming-only')}`">
    <div v-if="mainItem" :class="`upcoming-main ${playing && 'playing'}`">
      <template v-if="mainItem.video">
        <video v-show="!ended" ref="video" @ended="playing = false; ended = true" @canplay="playable = true"
               :controls="false" muted :src="mainItem.video" :poster="mainItem.thumbnail"/>
        <img v-show="ended" alt :src="mainItem.thumbnail"/>
        <div class="upcoming-main_play" @click="toggleVideo">
          <template v-if="playing">
            <img alt src="../assets/images/pause.png"/>
          </template>
          <template v-else>
            <img alt style="margin-left: 6px" src="../assets/images/play.png"/>
          </template>
        </div>
      </template>
      <template v-else>
        <img alt :src="mainItem.thumbnail"/>
      </template>
      <div class="upcoming-main_title" @click.stop.prevent="viewDetail(mainItem)">
        {{ mainItem.game_name }}
        <img v-if="mainItem.verified" alt src="../assets/images/tick_green.svg"/>
      </div>
      <div v-if="mainItem.sponsor" class="upcoming-main_sponsor">Sponsor</div>
      <div class="upcoming-main_countdown">
        <p>Countdown to IDO Date <img src="../assets/images/dot_green.svg"></p>
        <countdown :deadline="mainItem.deadline"/>
      </div>
    </div>
    <template v-if="subItems && subItems.length">
      <div v-for="(item, i) in subItems" class="upcoming-item" :key="i" @click="viewDetail(item)">
        <img alt :src="item.thumbnail"/>
        <div class="upcoming-item_title">
          <span>{{ item.game_name }}</span>
          <img alt v-if="item.verified" src="../assets/images/tick_green.svg"/>
        </div>
        <div class="upcoming-item_countdown">
          <p>Countdown to IDO Date <img src="../assets/images/dot_green.svg"></p>
          <countdown :deadline="item.deadline" mode="small"/>
        </div>
        <div v-if="item.sponsor" class="upcoming-item_sponsor">Sponsor</div>
      </div>
    </template>
  </div>
</template>

<script>

import Countdown from "@/components/Countdown";

export default {
  name: "UpcomingSection",
  components: {Countdown},
  props: {
    mainItem: Object,
    subItems: Array
  },
  data() {
    return {
      playing: false,
      ended: false
    }
  },
  mounted() {
  },
  methods: {
    toggleVideo() {
      const video = this.$refs.video
      if (video.paused || video.ended) {
        video.play();
        this.playing = true
        this.ended = false
      } else {
        video.pause();
        this.playing = false
      }
    },
    viewDetail(item) {
      this.$router.push({ path: '/game/' + item.id})
    }
  }
}
</script>

<style scoped lang="scss">
.upcoming {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 32px;

  &-main {
    grid-area: 1/1/3/3;
    padding: 20px;
    position: relative;
    border: 2px solid #d1d1d144;
    border-radius: 32px;
    background: linear-gradient(180deg, rgba(81, 81, 81, 0.43) 0%, rgba(81, 81, 81, 0) 100%);
    cursor: pointer;

    video {
      width: 100%;
      height: 100%;
      border-radius: 32px;
      display: block;
      object-fit: fill;
    }

    & > img {
      width: 100%;
      object-fit: fill;
    }

    &_title {
      position: absolute;
      top: 60px;
      left: 60px;
      font-weight: bold;
      font-size: 24px;
      line-height: 26px;
      display: flex;
      align-items: center;

      img {
        width: 20px;
        margin-left: 8px;
      }
    }

    &_countdown {
      position: absolute;
      left: 60px;
      bottom: 48px;

      p {
        text-transform: uppercase;
        margin: 6px 0;
        display: flex;
        align-items: center;

        img {
          margin-left: 8px;
        }
      }
    }

    &_play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #72F34B;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 0 0 10px #72F34B55;
    }

    &_sponsor {
      position: absolute;
      top: 32px;
      right: 32px;
      padding: 2px 16px;
      background: #0A0A0Aaa;
      border-radius: 4px;
    }

    &.playing > *:not(video) {
      opacity: 0;
      transition: opacity 0.2s;
    }

    &.playing:hover > *:not(video) {
      opacity: 1;
    }
  }

  &-item {
    padding: 20px;
    position: relative;
    border: 2px solid #d1d1d144;
    border-radius: 32px;
    background: linear-gradient(180deg, rgba(81, 81, 81, 0.43) 0%, rgba(81, 81, 81, 0) 100%);
    cursor: pointer;

    & > img {
      width: 100%;
      object-fit: fill;
      image-rendering: pixelated
    }

    &_title {
      position: absolute;
      top: 30px;
      left: 30px;
      font-weight: bold;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;

      img {
        width: 16px;
        margin-left: 8px;
      }
    }

    &_countdown {
      position: absolute;
      left: 30px;
      bottom: 30px;

      p {
        text-transform: uppercase;
        font-size: 12px;
        line-height: 16px;
        margin: 6px 0;
        display: flex;
        align-items: center;

        img {
          margin-left: 8px;
        }
      }
    }

    &_sponsor {
      position: absolute;
      top: 32px;
      right: 32px;
      padding: 2px 16px;
      background: #0A0A0Aaa;
      border-radius: 4px;
    }
  }

  &-main:hover,
  &-item:hover {
    border-color: #72F34B55;
  }

  &-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }

  &-only {
    display: block;
  }
}

@media screen and (max-width: 600px) {
  .upcoming {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-main,
    &-item {
      padding: 12px;
      border-radius: 12px;

      &_title {
        top: 24px;
        left: 24px;
        font-size: 24px;

        img {
          width: 16px;
          margin-left: 4px;
        }
      }

      &_countdown {
        left: 24px;
        bottom: 20px;

        p {
          font-size: 12px;
          line-height: 16px;
          margin: 0;
        }
      }

      &_play {
        transform: scale(0.5) translate3d(-50%, -50%, 0);
        transform-origin: top left;
      }

      &_sponsor {
        top: 24px;
        right: 24px;
        padding: 0 6px;
      }
    }
  }
}
</style>