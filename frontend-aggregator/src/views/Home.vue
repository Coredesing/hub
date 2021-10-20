<template>
  <div class="home">
    <banner-slider />
    <section style="margin-top: 100px">
      <h1 class="title">Top Favorites</h1>
      <div class="section-favorite">
        <favorite v-for="(item, i) in listFavorite" :key="i" v-bind="item" @like="($event) => likeGame(item, $event)"/>
      </div>
      <mask-dot color="rgba(114, 243, 75)" top="200"/>
    </section>
    <section v-if="(mainUpcoming && mainUpcoming.id) || (subUpcoming  && subUpcoming.length)">
      <h1 class="title">Upcoming IGOs</h1>
      <upcoming-section :main-item="mainUpcoming" :sub-items="subUpcoming"/>
    </section>
    <section class="row align-center justify-center overflow-hidden">
      <img alt src="../assets/images/bannerforgamefi.png"/>
      <mask-dot color="rgba(115, 83, 229)" right/>
    </section>
    <section>
      <h1 class="title">Latest</h1>
      <div class="section-latest">
        <latest-item v-for="(item, i) in listLatest" :key="i" v-bind="item"/>
      </div>
      <mask-dot color="#E553CE"/>
    </section>
    <section style="margin-bottom: 100px">
      <div class="row align-center justify-between">
        <h1 class="title">Trending</h1>
        <div class="view-all" @click="openList">View all <img alt src="../assets/images/arrow_green.svg"/></div>
      </div>
      <trending-section :main-item="mainTrending" :sub-items="subTrending"/>
    </section>
  </div>
</template>

<script>
import Favorite from "@/components/Favorite";
import BannerSlider from "@/components/BannerSlider";
import TrendingSection from "@/components/TrendingSection";
import LatestItem from "@/components/LatestItem";
import MaskDot from "@/components/MaskDot";
import UpcomingSection from "@/components/UpcomingSection";

export default {
  name: "Home",
  components: {
    UpcomingSection,
    MaskDot,
    LatestItem,
    TrendingSection,
    BannerSlider,
    Favorite
  },
  data() {
    return {}
  },
  async created() {
    await this.$store.dispatch('getListAll')
    await this.$store.dispatch('getListTrending')
    await this.$store.dispatch('getListFavorite')
    await this.$store.dispatch('getListLatest')
    await this.$store.dispatch('getListUpcoming')
  },
  computed: {
    listFavorite() {
      return this.$store.state.listFavorite
    },
    listLatest() {
      return this.$store.state.listLatest
    },
    mainUpcoming() {
      return this.$store.state.mainUpcoming
    },
    subUpcoming() {
      return this.$store.state.subUpcoming
    },
    mainTrending() {
      return this.$store.state.mainTrending
    },
    subTrending() {
      return this.$store.state.subTrending
    },
  },
  methods: {
    async likeGame(item, val) {
      const index = this.listFavorite.findIndex(g => g.id === item.id)
      this.listFavorite.splice(index, 1, {
        ...item,
        likes: +item.likes + val ? 1 : -1,
        liked: val,
      })

      await this.$store.dispatch('likeGame', { id: item.id, value: val})
    },
    async openList() {
      await this.$store.dispatch('getListAll')
      await this.$router.push({ path: 'list'})
    }
  }
};
</script>

<style scoped lang="scss">
.home {

  section {
    padding: 40px var(--padding-section);
    position: relative;

    h1.title {
      font-weight: bold;
      font-size: 28px;
      line-height: 36px;
      margin-bottom: 24px;
    }
  }

  .section {
    &-favorite {
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 2;
      padding-top: 24px;
    }

    &-latest {
      display: flex;
      align-items: center;
      overflow: auto;

      & > div {
        flex: 0 0 calc(33% - 24px);
        margin-right: 24px;

        ::v-deep .item-image {
          height: 223px;

          img {
            height: 100%;
            width: 100%;
          }
        }
      }

      &::-webkit-scrollbar {
        background: #2E2E2E;
        height: 6px;
        border-radius: 8px;
        cursor: pointer;
      }

      &::-webkit-scrollbar-thumb {
        background: #72F34Baa;
        border-radius: 8px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .home {
    .section {
      &-favorite {
        flex-wrap: wrap;
        align-items: flex-start;

        .favorite {
          margin-bottom: 24px;
        }
      }

      &-latest {
        flex-direction: column;

        .item {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
