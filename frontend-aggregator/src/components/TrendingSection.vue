<template>
  <div class="trending">
    <div class="trending-main" @click="viewDetail(mainItem)">
      <img alt :src="mainItem.thumbnailSquare"/>
      <div v-if="mainItem.sponsor" class="trending-main_sponsor">Sponsor</div>
      <div class="trending-main_detail">
        <div class="trending-main_detail--title">
          <span>{{ mainItem.game_name }}</span>
          <img v-if="mainItem.verified" alt src="../assets/images/tick_green.svg"/>
        </div>
        <div class="trending-main_detail--desc">{{ mainItem.short_description }}</div>
        <div class="price">
          <img alt :src="mainItem.icon_token_link"/>
          <div class="price-detail">
            <div class="price-detail_token">{{ mainItem.ticker }}</div>
            <div class="price-detail_value">
              <span v-if="mainItem.tokenomic && mainItem.tokenomic.price > 0">$ {{ (+mainItem.tokenomic.price).toFixed(3) }}</span>
              <span v-else>$ {{ mainItem.token_price }}</span>
              <span v-if="mainItem.tokenomic && mainItem.tokenomic.price_change_24h"
                    :class="mainItem.tokenomic.price_change_24h > 0 ? 'increased' : 'decreased'">
                <img v-if="mainItem.tokenomic.price_change_24h > 0" src="../assets/images/up.svg"/>
                <img v-if="mainItem.tokenomic.price_change_24h < 0" src="../assets/images/down.svg"/>
                {{ Math.abs(mainItem.tokenomic.price_change_24h).toFixed(3) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="trending-item" v-for="(item, i) in subItems" :key="i" @click="viewDetail(item)">
      <div class="trending-item_image">
        <img alt :src="item.thumbnailSquare"/>
        <div v-if="item.sponsor" class="trending-item--sponsor">Sponsor</div>
      </div>
      <div class="trending-item_detail">
        <div class="name">{{ item.game_name }}</div>
        <div class="description">{{ item.short_description }}</div>
        <div class="price">
          <img alt :src="item.icon_token_link"/>
          <div class="price-detail">
            <div class="price-detail_token">{{ item.ticker }}</div>
            <div class="price-detail_value">
              <span v-if="item.tokenomic && item.tokenomic.price > 0">$ {{ (+item.tokenomic.price).toFixed(3) }}</span>
              <span v-else>$ {{ item.token_price }}</span>
              <span v-if="item.tokenomic && item.tokenomic.price_change_24h"
                    :class="item.tokenomic.price_change_24h > 0 ? 'increased' : 'decreased'">
                <img v-if="item.tokenomic.price_change_24h > 0" src="../assets/images/up.svg"/>
                <img v-if="item.tokenomic.price_change_24h < 0" src="../assets/images/down.svg"/>
                {{ Math.abs(item.tokenomic.price_change_24h).toFixed(3) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrendingSection",
  props: {
    mainItem: Object,
    subItems: Array
  },
  methods: {
    viewDetail(item) {
      this.$router.push({ path: '/game/' + item.id})
    }
  }
}
</script>

<style scoped lang="scss">
.trending {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 256px 256px;
  grid-gap: 32px;

  &-main {
    grid-area: 1/1/3/2;
    padding: 20px;
    position: relative;
    border: 2px solid #d1d1d144;
    border-radius: 32px;
    background: linear-gradient(180deg, rgba(81, 81, 81, 0.43) 0%, rgba(81, 81, 81, 0) 100%);
    cursor: pointer;

    & > img {
      width: 100%;
      opacity: 0.5;
      image-rendering: pixelated
    }

    &_detail {
      position: absolute;
      bottom: 0;
      padding: 28px 16px;

      &--title {
        font-weight: bold;
        font-size: 36px;
        line-height: 36px;
        display: flex;
        align-items: center;

        img {
          width: 24px;
          margin-left: 8px;
        }
      }

      &--desc {
        margin: 16px 0;
        color: #C4C4C4;
      }
    }

    &_sponsor {
      position: absolute;
      top: 30px;
      right: 30px;
      background: #0A0A0A66;
      border-radius: 4px;
      padding: 0 12px;
    }
  }

  &-item {
    display: flex;
    padding: 20px;
    border: 2px solid #d1d1d144;
    border-radius: 32px;
    background: linear-gradient(180deg, rgba(81, 81, 81, 0.43) 0%, rgba(81, 81, 81, 0) 100%);
    cursor: pointer;

    &_image {
      position: relative;
      max-width: 265px;

      .trending-item--sponsor {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #0A0A0A66;
        border-radius: 4px;
        padding: 0 12px;
      }

      img {
        border-radius: 2px;
        image-rendering: pixelated
      }
    }

    &_detail {
      padding: 20px;
      max-width: 288px;

      .name {
        font-weight: 600;
        font-size: 18px;
        line-height: 36px;
      }

      .description {
        color: #C4C4C4;
        margin-bottom: 16px;
        height: 72px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }

  &-main:hover,
  &-item:hover {
    border-color: #72F34B99;
  }
}

@media screen and (max-width: 600px) {
  .trending {
    display: flex;
    flex-direction: column;

    &-main {
      padding: 16px;

      & > img {
        border-radius: 12px;
      }

      &_detail {
        padding: 24px;
        left: 0;

        &--title {
          font-size: 24px;
          line-height: 24px;

          img {
            width: 16px;
            margin-left: 4px;
          }
        }

        &--desc {
          margin: 8px 0;
          line-height: 18px;
          height: 72px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
      }
    }

    &-item {
      padding: 16px;
      position: relative;

      &_image {
        max-width: 100%;
        max-height: 350px;

        img {
          border-radius: 12px;
          opacity: 0.5;
        }
      }

      &_detail {
        position: absolute;
        bottom: 0;
        padding: 0 8px 16px;

        .name {
          font-size: 24px;
          line-height: 24px;
        }

        .description {
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>