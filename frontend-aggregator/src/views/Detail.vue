<template>
  <div class="detail">
    <mask-dot color="rgba(114, 243, 75, 0.7)" top="140"/>
    <mask-dot color="rgba(115, 83, 229, 0.7)" bottom="100" right/>
    <template v-if="game && game.id">
      <breadcrumb :items="breadcrumb"/>
      <div class="detail-title">
        {{ game.game_name }}
        <img alt v-if="game.verified" src="../assets/images/tick_green.svg"/>
      </div>
      <div class="detail-main">
        <div class="detail-main_content">
          <div class="content-media">
            <div :class="`content-media_main ${playing && 'playing'}`">
              <template v-if="displayItem.type === 'video'">
                <video ref="video" @ended="next" :controls="false" :src="displayItem.data" :poster="displayItem.thumbnail"/>
                <div class="content-media_main--play" @click="toggleVideo">
                  <template v-if="playing">
                    <img alt src="../assets/images/pause.png"/>
                  </template>
                  <template v-else>
                    <img alt style="margin-left: 6px" src="../assets/images/play.png"/>
                  </template>
                </div>
              </template>
              <template v-else>
                <img alt :src="displayItem.data"/>
              </template>
            </div>
            <div class="content-media_slide">
              <div class="content-media_slide--prev" @click="prev">
                <img alt src="../assets/images/arrow-left_round.svg"/>
              </div>
              <div class="content-media_slide--main">
                <div class="slide" ref="slide">
                  <div :class="`slide-item ${display === i ? 'selected' : ''}`"
                       v-for="(item, i) in game.media" :key="i" @click="display = i">
                    <img alt :src="item.type === 'video' ? item.thumbnail : item.data"/>
                  </div>
                </div>
              </div>
              <div class="content-media_slide--next" @click="next">
                <img alt src="../assets/images/arrow-right_round.svg"/>
              </div>
            </div>
          </div>
          <div class="detail-main_side mobile">
            <template v-if="game.ido_type === 'launched'">
              <div class="title">
                Current Price
                <a :href="game.coinmarketcap" target="_blank" class="btn btn-cmc">
                  <img alt src="../assets/images/direct.svg">
                </a>
                <div class="tooltip">View on Coinmarketcap</div>
              </div>
              <div class="price" style="margin-bottom: 24px">
                <img alt :src="game.token_icon"/>
                <div class="price-detail_value">
                  <span>$ {{ (+game.token_price).toFixed(3) }}</span>
                  <span v-if="game.tokenChange"
                        :class="game.tokenChange > 0 ? 'increased' : 'decreased'">
                <img v-if="game.tokenChange > 0" src="../assets/images/up.svg"/>
                <img v-if="game.tokenChange < 0" src="../assets/images/down.svg"/>
                {{ Math.abs(game.tokenChange.toFixed(2)) }}%
              </span>
                </div>
              </div>
              <div v-if="game.tokenInfo" class="price-sub">
                <span>&lt;{{ game.tokenInfo.btc.toFixed(9) }} BTC</span>
                <span :class="game.tokenInfo.btcChange > 0 ? 'increased' : 'decreased'">
              <template v-if="game.tokenInfo.btcChange > 0">
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.3962 0.514683C3.19605 0.254679 2.80395 0.254679 2.6038 0.514683L0.155585 3.695C-0.0975138 4.02379 0.136868 4.5 0.551788 4.5L5.44821 4.5C5.86313 4.5 6.09751 4.02379 5.84441 3.695L3.3962 0.514683Z"
                      fill="#72F34B"/>
                </svg>
              </template>
              <template v-else>
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.3962 4.48532C3.19605 4.74532 2.80395 4.74532 2.6038 4.48532L0.155585 1.305C-0.0975138 0.976212 0.136868 0.5 0.551788 0.5L5.44821 0.5C5.86313 0.5 6.09751 0.976213 5.84441 1.305L3.3962 4.48532Z"
                      fill="#F24B4B"/>
                </svg>
              </template>
              {{ Math.abs(game.tokenInfo.btcChange.toFixed(2)) }}%
            </span>
                <span>&lt;{{ game.tokenInfo.eth.toFixed(9) }} ETH</span>
                <span :class="game.tokenInfo.ethChange > 0 ? 'increased' : 'decreased'">
              <template v-if="game.tokenInfo.ethChange > 0">
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.3962 0.514683C3.19605 0.254679 2.80395 0.254679 2.6038 0.514683L0.155585 3.695C-0.0975138 4.02379 0.136868 4.5 0.551788 4.5L5.44821 4.5C5.86313 4.5 6.09751 4.02379 5.84441 3.695L3.3962 0.514683Z"
                      fill="#72F34B"/>
                </svg>
              </template>
              <template v-else>
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.3962 4.48532C3.19605 4.74532 2.80395 4.74532 2.6038 4.48532L0.155585 1.305C-0.0975138 0.976212 0.136868 0.5 0.551788 0.5L5.44821 0.5C5.86313 0.5 6.09751 0.976213 5.84441 1.305L3.3962 4.48532Z"
                      fill="#F24B4B"/>
                </svg>
              </template>
              {{ Math.abs(game.tokenInfo.ethChange.toFixed(2)) }}%
            </span>
              </div>
              <div v-if="tokenInfo" class="price-range">
                <span>Low: <b>${{ tokenInfo.low }}</b></span>
                <div class="progress"></div>
                <span>High: <b>${{ tokenInfo.high }}</b></span>
              </div>
              <div class="divider"/>
              <div v-if="game.developer" class="info">
                <div>Developer</div>
                <div>{{ game.developer }}</div>
              </div>
              <div v-if="game.publisher" class="info">
                <div>Publisher</div>
                <div>{{ game.publisher }}</div>
              </div>
              <div v-if="game.category" class="info">
                <div>Category</div>
                <div>{{ game.category }}</div>
              </div>
              <div v-if="game.language" class="info">
                <div>Language</div>
                <div>{{ game.language }}</div>
              </div>
            </template>
            <template v-else-if="game.ido">
              <div class="ido-title">${{ game.token }} IDO on {{ game.ido.date }}</div>
              <div class="ido-chain">{{ game.ido.chain }}</div>
              <div class="ido-price">
                Price per token: <span>$ {{ game.ido.price }}</span>
                <div class="ido-price_currency">{{ game.ido.currency }}</div>
              </div>
              <div class="divider" style="margin-bottom: 40px"/>
              <template v-if="game.ido.link.redkite || game.ido.link.gamefi">
                <a v-if="game.ido.link.redkite" class="btn ido-redkite" :href="game.ido.link.redkite">
                  <img alt src="../assets/images/redkite.svg"/>
                </a>
                <a v-if="game.ido.link.gamefi" class="btn ido-gamefi" :href="game.ido.link.gamefi">
                  <img alt src="../assets/images/gamefi.svg"/>
                </a>
                <div class="divider" style="margin: 40px 0 28px"/>
              </template>
            </template>
            <div :class="`btn btn-like ${game.liked ? 'liked' : ''}`" @click="like">
              <template v-if="game.liked">
                <img alt src="../assets/images/heart_black.svg"/>
                <span>Remove from Favourite List</span>
              </template>
              <template v-else>
                <img alt src="../assets/images/heart_green.svg"/>
                <span>Add to Favourite List</span>
              </template>
            </div>
            <template v-if="game.downloads && game.downloads.length && game.type === 'Launched'">
              <div class="download">
                <div class="btn btn-download" @click="show.download = !show.download">
                  Download
                  <img :style="!show.download && { transform: 'rotate(180deg)'}" alt src="../assets/images/up.svg"/>
                </div>
                <transition name="slide-down">
                  <div v-show="show.download" class="download-list">
                    <a v-for="(item, i) in game.downloads" :key="i" :href="item.link" target="_blank">Download for
                      {{ item.type }}</a>
                  </div>
                </transition>
              </div>
            </template>
          </div>
          <div class="content-tab">
            <div :class="`content-tab_item ${tab === 0 ? 'selected' : ''}`" @click="tab = 0">About game</div>
            <div :class="`content-tab_item ${tab === 1 ? 'selected' : ''}`" @click="tab = 1">Tokenomics</div>
            <div :class="`content-tab_item ${tab === 2 ? 'selected' : ''}`" @click="tab = 2">Team</div>
          </div>
          <div class="content-tab-view" :key="tab">
            <template v-if="tab === 0 && game.information">
              <div v-if="game.information.introduction">
                <div class="title">Introduction</div>
                <div class="info" v-html="game.information.introduction"></div>
              </div>
              <div v-if="game.information.highlightFeatures">
                <div class="title">Highlight Features</div>
                <div class="info" v-html="game.information.highlightFeatures"></div>
              </div>
              <div v-if="game.information.systemRequirement">
                <div class="title">System Requirements</div>
                <div class="info" v-html="game.information.systemRequirement"></div>
              </div>
              <div v-if="game.information.community && game.information.community.length">
                <div class="title">Community Groups</div>
                <div class="community">
                  <a v-for="(item, i) in game.information.community" :key="i" :href="item.link" target="_blank">
                    <img alt :src="getCommunityImg(item.type)"/>
                  </a>
                </div>
              </div>
              <div v-if="game.information.license">
                <div class="title">Licensing Terms & Privacy Policy</div>
                <div class="info" v-html="game.information.license"></div>
              </div>
              <div v-if="game.information.tags && game.information.tags.length">
                <div class="title">Tags</div>
                <div class="tags">
                  <div class="tag" v-for="(item, i) in game.information.tags" :key="i">
                    {{ item }}
                  </div>
                </div>
              </div>
            </template>
            <template v-if="tab === 1 && game.tokenomic">
              <div class="tokenomic" v-if="game.tokenomic.detail">
                <div class="tokenomic-title">
                  {{ game.game_name }} ({{ game.ticker }})
                </div>
                <div class="tokenomic-info">
                  <span>Ticker:</span>
                  <span>{{ game.ticker }}</span>
                </div>
                <div class="tokenomic-info">
                  <span>Blockchain Network:</span>
                  <span>{{ game.tokenomic.detail.network_chain }}</span>
                </div>
                <div class="tokenomic-info">
                  <span>Token Supply:</span>
                  <span>{{ game.tokenomic.detail.token_supply | displayNumber }}</span>
                </div>
                <div class="tokenomic-info">
                  <span>Initial Project Valuation:</span>
                  <span>{{ game.tokenomic.detail.project_valuation | displayNumber }}</span>
                </div>
                <div v-if="game.tokenomic.detail.initial_token_cir" class="tokenomic-info">
                  <span>Initial Token Circulation:</span>
                  <span>{{ game.tokenomic.detail.initial_token_cir | displayNumber }}</span>
                </div>
                <div v-if="game.tokenomic.detail.initial_token_market" class="tokenomic-info">
                  <span>Initial Market Cap:</span>
                  <span>${{ game.tokenomic.detail.initial_token_market | displayNumber }}</span>
                </div>
              </div>
              <div v-if="game.tokenomic.usability">
                <div class="title">How tokens are used in game</div>
                <div class="info" v-html="game.tokenomic.usability"/>
              </div>
              <div v-if="game.tokenomic.economy">
                <div class="title">Token Economy</div>
                <div class="info" v-html="game.tokenomic.economy"/>
              </div>
              <div v-if="game.tokenomic.metric">
                <div class="title">Token Metrics</div>
                <div v-html="game.tokenomic.metric"></div>
              </div>
              <div v-if="game.tokenomic.distribution">
                <div class="title">Token Distribution</div>
                <div v-html="game.tokenomic.distribution"></div>
              </div>
              <div v-if="game.tokenomic.schedule && game.tokenomic.schedule.length">
                <div class="title">Token Release Schedule</div>
                <!--              <div class="schedule-header">-->
                <!--                <span>Allocation</span>-->
                <!--                <span>Vesting Schedule</span>-->
                <!--              </div>-->
                <!--              <div class="schedule-info" v-for="(item, i) in game.tokenomic.schedule" :key="i">-->
                <!--                <span>{{ item.text }}</span>-->
                <!--                <span>{{ item.value }}</span>-->
                <!--              </div>-->
                <div class="info" v-html="game.tokenomic.schedule"/>
              </div>
            </template>
            <template v-if="tab === 2 && game.team">
              <div v-if="game.team.roadmap">
                <div class="title">Roadmap</div>
                <img class="zoom" alt :src="game.team.roadmap"/>
              </div>
              <div v-if="game.team.partner">
                <div class="title">Partner</div>
                <!--              <img alt :src="game.team.partner"/>-->
                <div class="info" v-html="game.team.partner"/>
              </div>
              <div v-if="game.team.technology">
                <div class="title">Technology</div>
                <div class="info" v-html="game.team.technology"/>
              </div>
              <div v-if="game.team.team">
                <div class="title">Team</div>
                <div class="info" v-html="game.team.team"/>
              </div>
              <div v-if="game.team.advisor">
                <div class="title">Advisors</div>
                <div class="info" v-html="game.team.advisor"/>
              </div>
            </template>
          </div>
        </div>
        <div ref="side" class="detail-main_side">
          <template v-if="game.ido_type === 'launched'">
            <div class="title">
              Current Price
              <a :href="game.coinmarketcap" target="_blank" class="btn btn-cmc">
                <img alt src="../assets/images/direct.svg">
              </a>
              <div class="tooltip">View on Coinmarketcap</div>
            </div>
            <div class="price" style="margin-bottom: 24px">
              <img alt :src="game.token_icon"/>
              <div class="price-detail_value">
                <span>$ {{ (+game.token_price).toFixed(3) }}</span>
                <span v-if="game.tokenChange"
                      :class="game.tokenChange > 0 ? 'increased' : 'decreased'">
                <img v-if="game.tokenChange > 0" src="../assets/images/up.svg"/>
                <img v-if="game.tokenChange < 0" src="../assets/images/down.svg"/>
                {{ Math.abs(game.tokenChange.toFixed(2)) }}%
              </span>
              </div>
            </div>
            <div v-if="game.tokenInfo" class="price-sub">
              <span>&lt;{{ game.tokenInfo.btc.toFixed(9) }} BTC</span>
              <span :class="game.tokenInfo.btcChange > 0 ? 'increased' : 'decreased'">
              <template v-if="game.tokenInfo.btcChange > 0">
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.3962 0.514683C3.19605 0.254679 2.80395 0.254679 2.6038 0.514683L0.155585 3.695C-0.0975138 4.02379 0.136868 4.5 0.551788 4.5L5.44821 4.5C5.86313 4.5 6.09751 4.02379 5.84441 3.695L3.3962 0.514683Z"
                      fill="#72F34B"/>
                </svg>
              </template>
              <template v-else>
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.3962 4.48532C3.19605 4.74532 2.80395 4.74532 2.6038 4.48532L0.155585 1.305C-0.0975138 0.976212 0.136868 0.5 0.551788 0.5L5.44821 0.5C5.86313 0.5 6.09751 0.976213 5.84441 1.305L3.3962 4.48532Z"
                      fill="#F24B4B"/>
                </svg>
              </template>
              {{ Math.abs(game.tokenInfo.btcChange.toFixed(2)) }}%
            </span>
              <span>&lt;{{ game.tokenInfo.eth.toFixed(9) }} ETH</span>
              <span :class="game.tokenInfo.ethChange > 0 ? 'increased' : 'decreased'">
              <template v-if="game.tokenInfo.ethChange > 0">
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.3962 0.514683C3.19605 0.254679 2.80395 0.254679 2.6038 0.514683L0.155585 3.695C-0.0975138 4.02379 0.136868 4.5 0.551788 4.5L5.44821 4.5C5.86313 4.5 6.09751 4.02379 5.84441 3.695L3.3962 0.514683Z"
                      fill="#72F34B"/>
                </svg>
              </template>
              <template v-else>
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.3962 4.48532C3.19605 4.74532 2.80395 4.74532 2.6038 4.48532L0.155585 1.305C-0.0975138 0.976212 0.136868 0.5 0.551788 0.5L5.44821 0.5C5.86313 0.5 6.09751 0.976213 5.84441 1.305L3.3962 4.48532Z"
                      fill="#F24B4B"/>
                </svg>
              </template>
              {{ Math.abs(game.tokenInfo.ethChange.toFixed(2)) }}%
            </span>
            </div>
            <div v-if="tokenInfo" class="price-range">
              <span>Low: <b>${{ tokenInfo.low }}</b></span>
              <div class="progress"></div>
              <span>High: <b>${{ tokenInfo.high }}</b></span>
            </div>
            <div class="divider"/>
            <div v-if="game.developer" class="info">
              <div>Developer</div>
              <div>{{ game.developer }}</div>
            </div>
            <div v-if="game.publisher" class="info">
              <div>Publisher</div>
              <div>{{ game.publisher }}</div>
            </div>
            <div v-if="game.category" class="info">
              <div>Category</div>
              <div>{{ game.category }}</div>
            </div>
            <div v-if="game.language" class="info">
              <div>Language</div>
              <div>{{ game.language }}</div>
            </div>
          </template>
          <template v-else-if="game.ido">
            <div class="ido-title">${{ game.token }} IDO on {{ game.ido.date }}</div>
            <countdown :deadline="game.ido_date"/>
            <div class="ido-chain">{{ game.ido.chain }}</div>
            <div class="ido-price">
              Price per token: <span>$ {{ game.ido.price }}</span>
            </div>
            <div class="divider" style="margin-bottom: 40px"/>
            <a v-if="game.ido.link.redkite" class="btn ido-redkite" target="_blank" :href="game.ido.link.redkite">
              <img alt src="../assets/images/redkite.svg"/>
              <div v-if="game.ido.link.redkite.total">
                <p>Total Raise</p>
                <p>$ {{ game.ido.link.redkite.total }}</p>
              </div>
            </a>
            <a v-if="game.ido.link.gamefi" class="btn ido-gamefi" target="_blank" :href="game.ido.link.gamefi">
              <img alt src="../assets/images/gamefi.svg"/>
              <div v-if="game.ido.link.gamefi.total">
                <p>Total Raise</p>
                <p>$ {{ game.ido.link.gamefi.total }}</p>
              </div>
            </a>
            <div class="divider" style="margin: 40px 0 28px"/>
          </template>
          <div :class="`btn btn-like ${game.liked ? 'liked' : ''}`" @click="like">
            <template v-if="game.liked">
              <img alt src="../assets/images/heart_black.svg"/>
              <span>Remove from Favourite List</span>
            </template>
            <template v-else>
              <img alt src="../assets/images/heart_green.svg"/>
              <span>Add to Favourite List</span>
            </template>
          </div>
          <template v-if="game.downloads && game.downloads.length && game.type === 'Launched'">
            <div class="download">
              <div class="btn btn-download" @click="show.download = !show.download">
                Download
                <img :style="!show.download && { transform: 'rotate(180deg)'}" alt src="../assets/images/up.svg"/>
              </div>
              <transition name="slide-down">
                <div v-show="show.download" class="download-list">
                  <a v-for="(item, i) in game.downloads" :key="i" :href="item.link" target="_blank">Download for
                    {{ item.type }}</a>
                </div>
              </transition>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="not-found">
        <img alt src="../assets/images/404.png"/>
        <h3>Sorry, we were unable to find that page</h3>
        <a href="/" class="btn">Back to Home page</a>
      </div>
    </template>
  </div>
</template>

<script>
// import {gameSample} from "@/data/mock";
import Breadcrumb from "../components/Breadcrumb";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import MaskDot from "../components/MaskDot";
import Countdown from "../components/Countdown";

export default {
  name: "Detail",
  components: {Countdown, MaskDot, Breadcrumb},
  filters: {
    displayNumber(val) {
      if (!val) {
        return ''
      }
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  data() {
    return {
      defaultTitle: 'GameFi Aggregator',
      defaultPrefixBannerImage: 'https://gamefi-public.s3.amazonaws.com/aggregator/images/',
      defaultBannerImage: 'https://gamefi-public.s3.amazonaws.com/aggregator/images/default.png',
      id: 0,
      show: {
        download: false,
      },
      tokenInfo: null,
      tab: 0,
      display: 0,
      playing: false,
    }
  },
  // comment for testing
  head: {
    // To use "this" in the component, it is necessary to return the object through a function
    title () {
      return this.getTitleFromPath()
    },
    meta () {
      return this.getMetadata()
    },
    link () {
      return this.getLinks()
    }
  },
  async created() {
    this.id = this.$route.params.id
    await this.$store.dispatch('getGameDetail', this.id)
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    game() {
      return this.$store.state.game
    },
    displayItem() {
      if(this.game.media && this.game.media.length)
        return this.game.media[this.display]
      return {}
    },
    breadcrumb() {
      return [
        {
          text: 'Game List',
          href: '/list'
        },
        {
          text: this.game.game_name,
          href: '/game/' + this.id
        }
      ]
    },
  },
  watch: {
    // tab(val) {
    //   if (val === 1) {
    //     this.$nextTick(() => {
    //
    //       let chart = am4core.create("chart", am4charts.PieChart);
    //
    //       chart.data = this.game.tokenomic.distribution;
    //
    //       let pieSeries = chart.series.push(new am4charts.PieSeries());
    //       pieSeries.dataFields.category = "text";
    //       pieSeries.dataFields.value = "value";
    //
    //       pieSeries.slices.template.tooltipText = "{category}: {value.percent.formatNumber('#.#')}%"
    //
    //       pieSeries.labels.template.fill = am4core.color('#FFFFFF')
    //       pieSeries.ticks.template.stroke = am4core.color('#FFFFFF')
    //     })
    //   }
    // }
    game(val) {
      if(val) {
        this.$nextTick(() => {
          const sideEl = this.$refs.side
          if(window.innerWidth > 600 && sideEl) {
            const top = 254
            document.addEventListener('scroll', (e) => {
              const height = e.target.scrollingElement.scrollHeight,
                  scrollTop = e.target.scrollingElement.scrollTop
              if(scrollTop > top && (window.innerHeight + scrollTop + 20) < height) {
                sideEl.style.paddingTop = `${scrollTop - top}px`
              } else if (scrollTop < top) {
                sideEl.style.paddingTop = ''
              }
            })
          }
        })
      }
    }
  },
  methods: {
    async like() {
      if(!this.user || !this.user.address) return
      await this.$store.dispatch('likeGame', { id: this.game.id, value: !this.game.liked })
      const game = {...this.game, liked: !this.game.liked}
      this.$store.commit('setGame', game)
    },
    getCommunityImg(name) {
      return require(`@/assets/images/community/${name}.svg`)
    },
    toggleVideo() {
      const video = this.$refs.video
      if (video.paused || video.ended) {
        video.volume = 0.1
        video.play();
        this.playing = true
      } else {
        video.pause();
        this.playing = false
      }
    },
    next() {
      const slide = this.$refs.slide
      if(this.display + 1 < this.game.media.length) {
        slide.scroll({ left: (this.display + 1) * 118, behavior: 'smooth'})
        this.display++
      } else {
        slide.scroll({ left: 0, behavior: 'smooth'})
        this.display = 0
      }
    },
    prev() {
      const slide = this.$refs.slide
      if(this.display - 1 >= 0) {
        slide.scroll({ left: (this.display - 1) * 118, behavior: 'smooth'})
        this.display--
      } else {
        slide.scroll({ left: (this.game.media.length - 1) * 118, behavior: 'smooth'})
        this.display = this.game.media.length - 1
      }
    },
    getLinks() {
      return [
        { rel: 'icon', href: 'https://gamefi.org/favicon.ico', sizes: '16x16', type: 'image/png' },
        { rel: 'preload', href: this.getImageFromPath(), type: 'image/png' }
      ]
    },
    getDetailFromPath() {
      const baseRoute = this.$route
      if (!baseRoute || !baseRoute.params || !baseRoute.params.id) {
        return ''
      }
      return baseRoute.params.id
    },
    getTitleFromPath() {
      const name = this.getDetailFromPath()
      if (!name) {
        return {
          inner: this.defaultTitle
        }
      }

      const newTitle = name.split('-').map((data) => {
        if (!data) {
          return ''
        }
        return data.charAt(0).toUpperCase()+data.slice(1)
      }).join(' ')

      return {
        inner: newTitle
      }
    },
    getImageFromPath() {
      const name = this.getDetailFromPath()
      if (!name) {
        return this.defaultBannerImage
      }
      return `${this.defaultPrefixBannerImage}${name.split('-').join('_')}.png`
    },
    getDescription() {
      return 'GameFi description'
    },
    getMetadata() {
      return [
        { name: 'description', content: this.getDescription(), id: 'desc' },

        // Twitter
        { name: 'twitter:title', content: this.getTitleFromPath().inner },
        { name: 'twitter:description', content: this.getDescription()},

        // Google +
        { itemprop: 'name', content: this.getTitleFromPath().inner },
        { itemprop: 'description', content: this.getDescription() },

        // Facebook
        { property: 'og:title', content: this.getTitleFromPath().inner },
        { property: 'og:image', content: this.getImageFromPath() }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  padding: 40px var(--padding-section);
  position: relative;
  overflow-x: hidden;

  &-title {
    margin: 48px 0 32px;
    font-weight: bold;
    font-size: 28px;
    line-height: 36px;
    display: flex;
    align-items: center;

    img {
      margin-left: 8px;
      width: 24px;
    }
  }

  &-main {
    display: flex;

    &_side {
      flex: 0 0 384px;
      margin-left: 64px;

      .title {
        display: flex;
        align-items: center;
        color: #AEAEAE;
        margin-top: 40px;
        margin-bottom: 8px;
        position: relative;

        .btn-cmc {
          margin-left: 8px;
          cursor: pointer;

          &:hover ~ .tooltip {
            display: block;
          }
        }

        .tooltip {
          display: none;
          position: absolute;
          top: -32px;
          left: 12px;
          background: #4F4F4F;
          border-radius: 4px;
          padding: 0 12px;
          color: #FFFFFF;

          &:before {
            content: '';
            position: absolute;
            top: 100%;
            left: calc(50% - 2px);
            width: 0;
            height: 0;
            border-top: 4px solid #4F4F4F;
            border-right: 4px solid transparent;
            border-bottom: 4px solid transparent;
            border-left: 4px solid transparent;
          }
        }
      }

      .price {
        margin-bottom: 8px;

        &-detail_value {
          margin-left: 4px;
          display: flex;
          align-items: center;

          span:first-child {
            font-weight: bold;
            font-size: 28px;
            line-height: 36px;
          }

          .increased, .decreased {
            font-weight: 400;
          }
        }

        &-sub {
          display: flex;
          align-items: center;
          font-size: 12px;

          .increased {
            color: #72F34B;
          }

          .decreased {
            color: #F24B4B;
          }

          span:nth-child(2) {
            display: flex;
            align-items: center;
            margin-left: 8px;
            margin-right: 24px;
          }

          span:nth-child(4) {
            display: flex;
            align-items: center;
            margin-left: 8px;
          }
        }

        &-range {
          display: flex;
          align-items: center;
          margin-bottom: 24px;

          .progress {
            margin: 0 8px;
            width: 100px;
            height: 4px;
            background: linear-gradient(to right, #c4c4c4 30%, #565656 30%);
          }
        }
      }

      .info {
        display: flex;
        justify-content: space-between;
        margin: 16px 0;

        div:first-child {
          color: #AEAEAE;
        }

        div:last-child {
          font-weight: 600;
          text-align: right;
        }
      }

      .btn {
        border-radius: 2px;

        &-like {
          padding: 12px;
          font-weight: 600;
          font-size: 16px;
          color: #72F34B;
          border: 1px solid #72F34B;
          margin-bottom: 16px;

          img {
            margin-right: 8px;
          }

          &.liked {
            color: black;
            background: #72F34B;
          }
        }

        &-download {
          background: #72F34B;
          color: black;
          padding: 12px;
          font-weight: 600;
          font-size: 16px;

          img {
            margin-left: 4px;
            transition: all 0.4s;
          }
        }
      }

      .download {
        position: relative;

        &-list {
          position: absolute;
          top: 60px;
          display: flex;
          flex-direction: column;
          background: #2E2E2E;
          border: 1px solid #44454B;
          border-radius: 4px;
          padding: 0 16px;
          width: 100%;

          a {
            text-decoration: none;
            color: #FFFFFF;
            font-weight: 600;
            font-size: 16px;
            padding: 16px;
            border-bottom: 1px solid #44454B;
            text-align: center;
          }

          a:last-child {
            border-bottom: none;
          }
        }
      }

      .ido {

        &-title {
          margin-top: 40px;
          margin-bottom: 8px;
          font-weight: bold;
          font-size: 24px;
          line-height: 36px;
        }

        &-chain {
          width: fit-content;
          margin-top: 12px;
          margin-bottom: 16px;
          background: #4F4F4F;
          border-radius: 4px;
          padding: 0 12px;
          color: #FFFFFF;
        }

        &-price {
          display: flex;
          align-items: center;
          font-size: 12px;
          margin-bottom: 36px;

          span {
            font-weight: 600;
            margin-left: 4px;
          }

          &_currency {
            padding: 2px 8px;
            border-radius: 4px;
            background: #4F4F4F;
            margin-left: 24px;
          }
        }

        &-redkite,
        &-gamefi {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 69px;
          border-radius: 2px;
          color: white;
          text-decoration: none;
          margin: 12px 0;

          div {
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            p {
              margin: 0;

              &:first-child {
                font-weight: 600;
              }

              &:last-child {
                font-weight: bold;
                font-size: 24px;
                line-height: 36px;
              }
            }
          }
        }

        &-redkite {
          border: 1px solid #F24B4B
        }

        &-gamefi {
          border: 1px solid #72F34B
        }
      }

      &.mobile {
        display: none;
      }
    }

    &_content {
      flex: 1;

      .content {

        &-media {

          &_main {
            height: 378px;
            padding: 20px;
            border: 2px solid #d1d1d144;
            border-radius: 32px;
            background: linear-gradient(180deg, rgba(81, 81, 81, 0.43) 0%, rgba(81, 81, 81, 0) 100%);
            position: relative;

            video,
            & > img {
              width: 100%;
              height: 100%;
              object-fit: fill;
              border-radius: 2px;
              image-rendering: pixelated;
            }

            &--play {
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
              z-index: 2;
            }

            &.playing > div {
              opacity: 0;
              transition: opacity 0.2s;
            }

            &.playing:hover > div {
              opacity: 1;
            }
          }

          &_slide {
            margin-top: 16px;
            height: 86px;
            display: flex;
            align-items: center;
            overflow: hidden;

            &--prev,
            &--next {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 8px;
              cursor: pointer;
            }

            &--main {
              flex: 1;

              .slide {
                display: flex;
                align-items: stretch;
                overflow: auto;
                max-width: 100%;
                scroll-snap-type: x mandatory;
                padding: 8px;
                justify-content: center;

                &::-webkit-scrollbar {
                  display: none;
                }

                &-item {
                  flex: 0 0 calc(20% - 8px);
                  margin-right: 10px;
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
                    box-shadow: 0 0 6px #FFFFFF;
                  }
                }
              }
            }
          }
        }

        &-tab {
          margin-top: 64px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #FFFFFF25;

          &_item {
            font-weight: 600;
            font-size: 16px;
            color: #AEAEAE;
            padding: 8px 16px;
            position: relative;
            cursor: pointer;
            text-transform: uppercase;
            text-align: center;

            &:before {
              content: '';
              position: absolute;
              left: 0;
              bottom: 0;
              height: 2px;
              width: 0;
              background: #72F34B;
              transition: width 0.4s;
            }

            &.selected {
              color: #72F34B;

              &:before {
                width: 100%;
              }
            }
          }

          &-view {
            min-height: 700px;

            & > div {
              margin-top: 32px;
            }

            .title {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 12px;
            }

            .community {
              display: flex;
              align-items: center;

              a {
                width: 32px;
                height: 32px;
                border-radius: 32px;
                background: #4F4F4F;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 16px;
              }
            }

            .tags {
              display: flex;
              align-items: center;
              flex-wrap: wrap;

              .tag {
                background: #72F34B70;
                padding: 0 12px;
                color: #72F34B;
                border-radius: 4px;
                margin-right: 8px;
                margin-bottom: 8px;
              }
            }

            #chart {
              height: 375px;
            }

            #chart::v-deep g[opacity='0.4'] {
              display: none;
            }

            .schedule-header {
              font-weight: 600;
              padding: 4px 0;
              border-bottom: 1px solid #FFFFFF25;
            }

            .schedule-header,
            .schedule-info {
              display: flex;
              align-items: center;
              margin: 4px 0;

              span:first-child {
                flex: 0 0 35%
              }

              span:last-child {
                flex: 1;
              }
            }

            .tokenomic {
              padding: 32px 40px;
              background: black;
              border-radius: 4px;

              &-title {
                margin-bottom: 24px;
                font-weight: 600;
                font-size: 18px;
                line-height: 22px;
              }

              &-info {
                display: flex;
                align-items: center;
                margin-bottom: 12px;

                span {
                  flex: 0 0 50%;

                  &:last-child {
                    font-weight: 600;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.not-found{
  height: calc(100vh - 540px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    margin: 16px 0;
    text-align: center;
  }

  .btn {
    background: #72F34B;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
    color: black;
    font-weight: 600;
  }
}

@media screen and (max-width: 600px) {
  .detail {
    padding-right: 12px;
    padding-left: 12px;

    &-title {
      margin: 24px 0 16px;
      font-size: 24px;
      line-height: 28px;

      img {
        width: 16px;
        margin-left: 4px;
      }
    }

    &-main {

      &_side {
        display: none;

        &.mobile {
          display: block;
          margin: 0;
        }
      }

      &_content {
        .content-media {

          &_main {
            height: 184px;
            padding: 8px;
            max-width: calc(100vw - 24px);
            border-radius: 12px;

            video,
            img {
              border-radius: 12px;
              max-width: 100%;
            }
          }

          &_slide {
            margin-top: 8px;

            &--prev,
            &--next {
              padding: 4px;
            }

            &--main {
              .slide {
                padding: 4px;
                justify-content: flex-start;

                &-item {
                  flex: 0 0 110px
                }
              }
            }
          }
        }

        .content-tab {
          margin-top: 32px;
          align-items: stretch;

          &_item {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          &-view {
            .tokenomic {
              padding: 16px;

              span:first-child {
                flex: 1;
              }

              span:last-child {
                flex: 0 0 40%;
              }
            }
          }
        }
      }
    }
  }
}
</style>