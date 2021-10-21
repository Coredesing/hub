<template>
  <div class="slider">
    <template v-if="selectedItem">
      <div class="slider-wrapper">
        <template v-if="selectedItem.video">
          <video ref="video" muted autoplay :src="selectedItem.video" @ended="nextItem(selectedItem)"
                 :poster="selectedItem.thumbnail" @timeupdate="runProgress" @loadedmetadata="initializeVideo"/>
          <progress ref="progress" class="video-progress" value="0"></progress>
        </template>
        <template v-else>
          <img alt :src="selectedItem.thumbnail"/>
        </template>
      </div>
      <div class="slider-delimiter">
        <div class="slider-delimiter_prev" @click="prevItem">
          <img alt src="../assets/images/arrow-left_round.svg"/>
        </div>
        <div ref="delimiter" class="slider-delimiter_main">
          <div v-for="(item, i) in selectedList" :key="i"
               :class="`slider-delimiter_item ${selectedItem.id === item.id && 'selected'}`" @click="selectItem(item)">
            <img alt :src="item.thumbnail"/>
          </div>
        </div>
        <div class="slider-delimiter_next" @click="nextItem">
          <img alt src="../assets/images/arrow-right_round.svg"/>
        </div>
      </div>
      <div class="slider-info">
        <div class="slider-info_title">
          {{ selectedItem.title }}
          <img v-if="selectedItem.verified" alt src="../assets/images/tick_green.svg"/>
        </div>
        <div class="slider-info_number">
          <img alt src="../assets/images/heart.svg"/>
          <span>{{ selectedItem.like }}</span>
          <template v-if="selectedItem.developer">
            <img alt src="../assets/images/controller.svg"/>
            <span>{{ selectedItem.developer }}</span>
          </template>
        </div>
        <div class="slider-info_desc">{{ selectedItem.description }}</div>
        <div class="btn btn-like" @click="viewMore(selectedItem)">
          <span>View more</span>
        </div>
<!--        <div :class="`btn btn-like ${selectedItem.liked ? 'liked' : ''}`" @click="likeGame">-->
<!--          <template v-if="selectedItem.liked">-->
<!--            <img alt src="../assets/images/heart_black.svg"/>-->
<!--            <span>Remove from Favourite List</span>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <img alt src="../assets/images/heart_green.svg"/>-->
<!--            <span>Add to Favourite List</span>-->
<!--          </template>-->
<!--        </div>-->
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "BannerSlider",
  data() {
    return {
      selectedItem: {
        id: 0,
        video: ''
      },
      first: 0,
      last: 5,
    }
  },
  async created() {
    await this.$store.dispatch('getListTopGame')
    this.selectItem(this.list[0])
  },
  computed: {
    list() {
      return this.$store.state.listTopGame
    },
    selectedList() {
      return this.list.slice(this.first, this.last)
    }
  },
  watch: {
    list(val) {
      this.selectItem(val[0])
    }
  },
  methods: {
    selectItem(item) {
      this.selectedItem = item
    },
    nextItem() {
      let index = this.list.findIndex(it => it.id === this.selectedItem.id)
      if (index === this.list.length - 1) {
        index = -1
      }
      this.selectedItem = this.list[index + 1]
      const delimiter = this.$refs.delimiter
      delimiter.scroll({left: (index + 1) * 96, behavior: 'smooth'})
    },
    prevItem() {
      let index = this.list.findIndex(it => it.id === this.selectedItem.id)
      if (index === 0) {
        index = this.list.length
      }
      this.selectedItem = this.list[index - 1]
      const delimiter = this.$refs.delimiter
      delimiter.scroll({left: (index - 1) * 96, behavior: 'smooth'})
    },
    initializeVideo() {
      const video = this.$refs.video
      const progress = this.$refs.progress
      if(video && progress) {
        const videoDuration = Math.round(video.duration);
        progress.setAttribute('max', videoDuration);
      }
    },
    runProgress() {
      const video = this.$refs.video
      const progress = this.$refs.progress
      if(video && progress) {
        progress.value = Math.floor(video.currentTime);
      }
    },
    async likeGame() {
      this.selectedItem.liked = !this.selectedItem.liked
      await this.$store.dispatch('likeGame', { id: this.selectedItem.id, value: this.selectedItem.liked })
    },
    async viewMore(selectedItem) {
      this.$router.push({ path: '/game/' + selectedItem.id})
    }
  }
}
</script>

<style scoped lang="scss">
.slider {
  position: relative;
  height: calc(100vh - 94px);

  &-wrapper {
    height: 100%;

    video,
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: fill;
      image-rendering: pixelated
    }

    progress {
      appearance: none;
      display: block;
      width: 100%;
      height: 6px;
      color: #72F34B;

      &::-webkit-progress-bar {
        background-color: #44454B;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
      }

      &::-webkit-progress-value {
        background: #72F34B;
      }

      &::-moz-progress-bar {
        background: #72F34B;
      }
    }

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 15%, rgba(0, 0, 0, 0) 60%);
    }
  }

  &-delimiter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    bottom: 88px;
    right: 160px;
    opacity: 0;
    transition: opacity 0.4s;

    &_prev,
    &_next {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    &_prev {
      transform: translateX(10px);
    }

    &_next {
      transform: translateX(-10px);
    }

    &_main {
      display: flex;
      align-items: center;
      padding: 4px;
      height: 69px;
      width: 420px;
      overflow: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &_item {
      flex: 0 0 96px;
      height: 100%;
      margin-right: 12px;
      border: 1px solid #2E2E2E;
      border-radius: 12px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: fill;
        border-radius: inherit;
        image-rendering: pixelated;
      }

      &.selected {
        box-shadow: 0 0 10px #FFFFFF;
      }

      &:nth-last-child(1) {
        margin-right: 0;
      }
    }
  }

  &-info {
    position: absolute;
    bottom: 88px;
    left: 160px;
    max-width: 550px;
    opacity: 0;
    transition: opacity 0.4s;

    &_title {
      font-weight: bold;
      font-size: 36px;
      line-height: 36px;

      img {
        display: inline;
        width: 24px;
      }
    }

    &_number {
      display: flex;
      align-items: center;
      margin-top: 16px;
      margin-bottom: 24px;

      img {
        margin-right: 8px;
      }

      span {
        margin-right: 24px;
      }
    }

    &_desc {
      color: #C4C4C4;
      mix-blend-mode: normal;
      margin-bottom: 48px;
    }

    .btn {
      border-radius: 2px;
      width: fit-content;

      &-like {
        padding: 12px 24px;
        font-weight: 600;
        font-size: 16px;
        color: #72F34B;
        border: 1px solid #72F34B;

        img {
          margin-right: 8px;
        }

        &.liked {
          color: black;
          background: #72F34B;
        }
      }
    }
  }

  &:hover &-info,
  &:hover &-delimiter {
    opacity: 1;
  }

  &:hover &-wrapper:before {
    content: '';
  }
}

@media screen and (max-width: 600px) {
  .slider {
    height: auto;

    &-wrapper {

      video,
      img {
        height: 210px;
      }

      &:before {
        display: none;
      }
    }

    &-delimiter {
      opacity: 1;
      position: static;
      margin-top: 16px;
      height: 54px;

      &_item {
        flex: 1 1 0;
        margin-right: 8px;
      }
    }

    &-info {
      opacity: 1;
      position: static;
      padding: 32px var(--padding-section);

      &_title {
        font-size: 24px;
        line-height: 24px;

        img {
          width: 16px;
        }
      }
    }
  }
}
</style>