<template>
  <div class="home">
    <banner-slider />
    <section style="margin-top: 100px">
      <div class="row align-center justify-between">
        <h1 class="title">Top Favorites</h1>
        <div class="view-all" @click="openList">View all <img alt src="../assets/images/arrow_green.svg"/></div>
      </div>
      <div class="row align-center">
        <div class="prev-btn" style="margin: auto 0" @click="prevFav">
          <img alt src="../assets/images/arrow-left_round.svg"/>
        </div>
        <div ref="favorite" class="section-favorite">
          <div v-for="(item, i) in listFavorite" :key="i">
            <favorite :slug="item.slug" :game_name="item.game_name"
                      :icon="item.icon" :verified="item.verified"
                      :liked="item.liked" :likes="item.likes"
                      @like="($event) => likeGame(item, $event)"/>
          </div>
        </div>
        <div class="next-btn" style="margin: auto 0" @click="nextFav">
          <img alt src="../assets/images/arrow-right_round.svg"/>
        </div>
      </div>
      <mask-dot color="rgba(114, 243, 75)" top="200"/>
    </section>
    <section v-if="(mainUpcoming && mainUpcoming.id) || (subUpcoming  && subUpcoming.length)">
      <h1 class="title">Upcoming IGOs</h1>
      <upcoming-section :main-item="mainUpcoming" :sub-items="subUpcoming"/>
    </section>
    <section @click="openBanner" class="row align-center justify-center overflow-hidden" style="cursor: pointer">
      <img alt src="../assets/images/bannerforgamefi.png"/>
      <mask-dot color="rgba(115, 83, 229)" right/>
    </section>
    <section>
      <div class="row align-center justify-between">
        <h1 class="title">Latest</h1>
        <div class="view-all" @click="openList">View all <img alt src="../assets/images/arrow_green.svg"/></div>
      </div>
      <div class="row align-center outside">
        <div class="prev-btn" @click="prevLatest">
          <img alt src="../assets/images/arrow-left_round.svg"/>
        </div>
        <div ref="latest" class="section-latest">
          <latest-item v-for="(item, i) in listLatest" :key="i"
                       :game_name="item.game_name" :verified="item.verified" :category="item.category"
                       :desc="item.desc" :thumbnail="item.thumbnail" :ticker="item.ticker"
                       :slug="item.slug" :sponsor="item.sponsor" :tokenomic="item.tokenomic"
                       :token_price="item.token_price" :icon_token_link="item.icon_token_link"
          />
        </div>
        <div class="next-btn" @click="nextLatest">
          <img alt src="../assets/images/arrow-right_round.svg"/>
        </div>
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
    user() {
      return this.$store.state.user
    },
    listFavorite() {
      return this.$store.state.listFavorite
    },
    listLatest() {
      if(window.innerWidth < 600) {
        return this.$store.state.listLatest.slice(0, 3)
      }
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
      if(!this.user || !this.user.address) return
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
    },
    async openBanner() {
      window.open('https://mechmaster.io/');
    },
    nextLatest() {
      const latest = this.$refs.latest
      const left = latest.scrollLeft + latest.offsetWidth + 23
      latest.scroll({ left, behavior: 'smooth'})
    },
    prevLatest() {
      const latest = this.$refs.latest
      const left = latest.scrollLeft - (latest.offsetWidth + 23)
      latest.scroll({ left, behavior: 'smooth'})
    },
    nextFav() {
      const favorite = this.$refs.favorite
      const left = favorite.scrollLeft + (favorite.offsetWidth)
      favorite.scroll({ left, behavior: 'smooth'})
    },
    prevFav() {
      const favorite = this.$refs.favorite
      const left = favorite.scrollLeft - (favorite.offsetWidth)
      favorite.scroll({ left, behavior: 'smooth'})
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
      margin-bottom: 12px;
    }

    .prev-btn,
    .next-btn {
      flex: 0 0 32px;
      padding: 4px;
      margin-bottom: 140px;
      cursor: pointer;

      img {
        width: 24px;
      }
    }

    .outside {
      margin: 0 -32px;
    }
  }

  .section {
    &-favorite {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: auto;
      z-index: 2;
      padding-top: 24px;

      & > div {
        flex: 0 0 20%;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &-latest {
      display: flex;
      overflow: auto;

      & > div {
        flex: 0 0 calc(33% - 12px);
        margin-right: calc(0.5% + 18px);

        ::v-deep .item-image {
          height: 223px;

          img {
            height: 100%;
            width: 100%;
          }
        }

        &:last-child {
         margin-right: 0;
        }
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .home {
    section {

      .prev-btn,
      .next-btn {
        display: none;
      }

      .outside {
        margin: 0;
      }
    }

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
          margin-bottom: 40px;
        }
      }
    }
  }
}
</style>
