<template>
  <div class="item" @click.stop="viewDetail">
    <div class="item-image">
      <img alt :src="thumbnail"/>
      <div v-if="sponsor" class="item-sponsor">Sponsor</div>
    </div>
    <div class="item-detail">
      <div class="item-detail_title">
        {{ game_name }}
        <img v-if="verified" src="../assets/images/tick_green.svg"/>
      </div>
      <div class="price">
        <img alt :src="icon_token_link"/>
        <div class="price-detail">
          <div class="price-detail_token">{{ ticker }}</div>
          <div class="price-detail_value">
            <span v-if="tokenomic && tokenomic.price > 0">$ {{ (+tokenomic.price).toFixed(3) }}</span>
            <span v-else>$ {{ token_price }}</span>
            <span v-if="tokenomic && tokenomic.price_change_24h"
                  :class="tokenomic.price_change_24h > 0 ? 'increased' : 'decreased'">
                <img v-if="tokenomic.price_change_24h > 0" src="../assets/images/up.svg"/>
                <img v-if="tokenomic.price_change_24h < 0" src="../assets/images/down.svg"/>
                {{ Math.abs(tokenomic.price_change_24h).toFixed(3) }}%
              </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LatestItem",
  props: {
    game_name: String,
    thumbnail: null,
    desc: String,
    ticker: String,
    verified: Boolean,
    sponsor: Boolean,
    icon_token_link: null,
    token_price: [Number, String],
    tokenomic: Object,
    slug: String
  },
  methods: {
    viewDetail() {
      this.$router.push({ path: '/game/' + this.slug})
    }
  }
}
</script>

<style scoped lang="scss">
.item {

  &-image {
    position: relative;
    padding: 16px;
    border: 2px solid #d1d1d144;
    border-radius: 32px;
    background: linear-gradient(180deg, rgba(81, 81, 81, 0.43) 0%, rgba(81, 81, 81, 0) 100%);

    img {
      border-radius: 12px;
      image-rendering: pixelated
    }

    &:hover {
      border-color: #72F34B99;
      cursor: pointer;
    }
  }

  &-sponsor {
    position: absolute;
    top: 20px;
    right: 24px;
    background: #0A0A0A66;
    border-radius: 4px;
    padding: 0 12px;
  }

  &-detail {
    padding: 20px;

    &_title {
      font-weight: 600;
      font-size: 16px;
      line-height: 32px;
      display: flex;
      align-items: center;

      img {
        margin-left: 8px;
        display: block;
      }
    }
  }
}
</style>