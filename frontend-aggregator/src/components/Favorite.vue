<template>
  <div class="favorite">
    <div class="favorite-image" @click.stop="viewDetail">
      <img alt :src="icon"/>
      <div class="favorite-like" @click.stop.prevent="clickLike">
        <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.23591 2.44151C9.53332 2.09272 9.81481 1.70631 10.1527 1.37851C12.092 -0.502909 15.1016 -0.462386 16.9367 1.5283C18.5974 3.32867 18.9165 5.41053 17.9997 7.6704C17.512 8.87668 16.7377 9.89771 15.8722 10.8543C14.4655 12.4065 12.8468 13.7112 11.1253 14.8936C10.6187 15.2409 10.0963 15.5615 9.58107 15.8944C9.48491 15.9629 9.37008 16.0004 9.25199 16.0019C9.1339 16.0033 9.0182 15.9685 8.92041 15.9023C6.70757 14.552 4.64019 13.0165 2.84778 11.1329C1.88174 10.1133 1.04162 9.00548 0.475744 7.70658C-0.541668 5.36928 0.171099 2.84674 1.69722 1.37489C3.64665 -0.502185 6.61784 -0.442848 8.48768 1.5254C8.76411 1.81702 8.99711 2.14772 9.23591 2.44151Z"
                :fill="liked ? '#FFFFFF': '#FFFFFF99'"/>
        </svg>
        <div v-if="liked">{{ likes }}</div>
      </div>
    </div>
    <div class="favorite-info">
      <span>{{ game_name }}</span>
      <img v-if="verified" alt src="../assets/images/tick_green.svg"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Favorite",
  props: {
    icon: null,
    liked: Boolean,
    likes: [Number, String],
    game_name: String,
    verified: Boolean,
    slug: String
  },
  methods: {
    clickLike() {
      this.$emit('like', !this.liked)
    },
    viewDetail() {
      this.$router.push({ path: '/game/' + this.slug})
    }
  }
}
</script>

<style scoped lang="scss">
  .favorite {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-image {
      box-sizing: border-box;
      width: 180px;
      height: 180px;
      border-radius: 28px;
      background: linear-gradient(180deg, #303136 0%, rgba(48, 49, 54, 0) 100%);
      position: relative;
      border: 4px solid #d1d1d155;
      transition: all 0.2s;

      & > img {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: auto;
        border-radius: 30px;
        image-rendering: pixelated
      }
    }

    &-info {
      margin-top: 8px;
      font-size: 18px;
      line-height: 36px;
      font-weight: 600;

      span {
        white-space: normal;
        max-width: 150px;
        text-overflow: ellipsis;
      }

      img {
        margin-left: 8px;
        display: inline;
      }
    }

    &:hover {
      cursor: pointer;

      .favorite-image {
        border-color: #72F34B99;
      }
    }

    &-like {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;

      div {
        margin-top: 4px;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }

  @media screen and (max-width: 600px){
    .favorite {
      width: 160px;

      &-image {
        width: 120px;
        height: 120px;
      }

      &-info {
        font-size: 16px;

        img {
          margin-left: 4px;
          width: 14px;
        }
      }
    }
  }

  @media screen and (max-width: 374px) {
    .favorite {
      width: 130px;

      &-info {
        font-size: 13px;

        img {
          margin-left: 2px;
          width: 12px;
        }
      }
    }
  }
</style>