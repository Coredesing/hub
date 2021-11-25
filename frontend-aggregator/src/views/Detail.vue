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
                <div id="video-container">
                  <video ref="video" @ended="next" :controls="false" :src="displayItem.data"
                         @timeupdate="runProgress" @loadedmetadata="initializeVideo"
                         :poster="displayItem.thumbnail"/>
                  <div v-if="!played" class="content-media_main--play" @click="playVideo">
                    <img alt style="margin-left: 6px" src="../assets/images/play.png"/>
                  </div>
                  <div v-show="played" class="video-toolbar">
                    <div class="video-progress">
                      <progress ref="progress" value="0" min="0"></progress>
                      <input class="seek" ref="seek" :value="time" @input="skipTo" min="0" type="range" step="1">
                    </div>
                    <div class="video-action">
                      <img v-if="playing" alt src="../assets/images/pause.svg" @click="toggleVideo"/>
                      <img v-else alt src="../assets/images/play.svg" @click="toggleVideo" style="width: 20px;margin-right: 12px"/>
                      <img v-if="muted" alt src="../assets/images/mute.svg" @click="toggleMute"/>
                      <img v-else alt src="../assets/images/speaker.svg" @click="toggleMute"/>
                      <input class="volume" ref="volume" v-model="volume" min="0" type="range" step="0.01" max="1">
                      <div class="time">
                        <time ref="timer">00:00</time>
                        <span> / </span>
                        <time ref="duration">00:00</time>
                      </div>
                      <div class="spacer"></div>
                      <img v-if="fullscreen" alt src="../assets/images/fullscreen-out.svg" style="width: 20px" @click="toggleFullScreen"/>
                      <img v-else alt src="../assets/images/fullscreen-in.svg" style="width: 20px" @click="toggleFullScreen"/>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <img alt :src="displayItem.data" @click="openBigPicture(displayItem.data)" style="cursor: zoom-in"/>
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
                Current Price (% Chg 24H)
                <a :href="game.coinmarketcap" target="_blank" class="btn btn-cmc">
                  <img alt src="../assets/images/direct.svg">
                </a>
                <div class="tooltip">View on Coinmarketcap</div>
              </div>
              <div class="price">
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
              <template v-if="game.tokenInfo" class="price-sub">
                <div v-if="game.tokenInfo.ido_price" class="info">
                  <div>IDO Price</div>
                  <div>$ {{ game.tokenInfo.ido_price }}</div>
                </div>
                <div v-if="game.tokenInfo.ido_roi" class="info">
                  <div>IDO ROI</div>
                  <div>{{ game.tokenInfo.ido_roi.toFixed(2) }}x</div>
                </div>
                <div v-if="game.tokenInfo.volume" class="info">
                  <div>Volume (24h)</div>
                  <div>$ {{ game.tokenInfo.volume | abbreviateNumber }}
                    <span v-if="game.tokenInfo.volume_change"
                          :style="{color: game.tokenInfo.volume_change > 0 ? '#458531' : '#F24B4B'}">
                    {{ game.tokenInfo.volume_change > 0 ? '+' : '' }}
                    {{ game.tokenInfo.volume_change.toFixed(2) }}%
                  </span>
                  </div>
                </div>
                <div v-if="game.tokenInfo.market_cap" class="info">
                  <div>Market Cap</div>
                  <div>$ {{ game.tokenInfo.market_cap | abbreviateNumber }}
                    <span v-if="game.tokenInfo.market_cap_change"
                          :style="{color: game.tokenInfo.market_cap_change > 0 ? '#458531' : '#F24B4B'}">
                    {{ game.tokenInfo.market_cap_change > 0 ? '+' : '' }}
                    {{ game.tokenInfo.market_cap_change.toFixed(2) }}%
                  </span>
                  </div>
                </div>
                <div v-if="game.tokenInfo.fully_diluted_market_cap" class="info">
                  <div>Fully Diluted Market Cap</div>
                  <div>$ {{ game.tokenInfo.fully_diluted_market_cap | abbreviateNumber }}
                    <span v-if="game.tokenInfo.fully_diluted_market_cap_change"
                          :style="{color: game.tokenInfo.fully_diluted_market_cap_change > 0 ? '#458531' : '#F24B4B'}">
                    {{ game.tokenInfo.fully_diluted_market_cap_change > 0 ? '+' : '' }}
                    {{ game.tokenInfo.fully_diluted_market_cap_change.toFixed(2) }}%
                  </span>
                  </div>
                </div>
              </template>
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
              <div v-if="game.ido.date" class="ido-title">${{ game.token }} IGO on {{ game.ido.date }}</div>
              <countdown v-if="game.ido_date" :deadline="game.ido_date"/>
              <div v-if="game.ido.chain" class="ido-chain">{{ game.ido.chain }}</div>
              <div v-if="game.ido.price" class="ido-price">
                Price per token: <span>$ {{ game.ido.price }}</span>
              </div>
              <div class="divider" v-if="game.developer || game.publisher || game.category || game.language || game.community"></div>
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
              <div v-if="game.community && game.community.length" class="info">
                <div>Community</div>
                <div class="community">
                  <a v-for="(item, i) in game.community" :key="i" :href="item.link" target="_blank">
                    <img alt :src="getCommunityImg(item.type)"/>
                  </a>
                </div>
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
            <template v-if="game.downloads && game.downloads.length && game.ido_type === 'launched'">
              <template v-if="game.downloads.length === 1">
                <a class="btn btn-download" :href="game.downloads[0].link" target="_blank"
                   style="text-decoration: none">
                  Play
                </a>
              </template>
              <template v-else>
                <div class="download">
                  <div class="btn btn-download" @click="show.download = !show.download">
                    Play
                    <img :style="!show.download && { transform: 'rotate(180deg)'}" alt src="../assets/images/up.svg"/>
                  </div>
                  <transition name="slide-down">
                    <div v-show="show.download" class="download-list">
                      <a v-for="(item, i) in game.downloads" :key="i" :href="item.link" target="_blank">
                        {{ item.type }}</a>
                    </div>
                  </transition>
                </div>
              </template>
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
                <img style="cursor: zoom-in" @click="openBigPicture(game.team.roadmap)" alt :src="game.team.roadmap"/>
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
              Current Price (% Chg 24H)
              <a :href="game.coinmarketcap" target="_blank" class="btn btn-cmc">
                <img alt src="../assets/images/direct.svg">
              </a>
              <div class="tooltip">View on Coinmarketcap</div>
            </div>
            <div class="price">
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
            <template v-if="game.tokenInfo" class="price-sub">
              <div v-if="game.tokenInfo.ido_price" class="info">
                <div>IDO Price</div>
                <div>$ {{ game.tokenInfo.ido_price }}</div>
              </div>
              <div v-if="game.tokenInfo.ido_roi" class="info">
                <div>IDO ROI</div>
                <div>{{ game.tokenInfo.ido_roi.toFixed(2) }}x</div>
              </div>
              <div v-if="game.tokenInfo.volume" class="info">
                <div>Volume (24h)</div>
                <div>$ {{ game.tokenInfo.volume | abbreviateNumber }}
                  <span v-if="game.tokenInfo.volume_change"
                        :style="{color: game.tokenInfo.volume_change > 0 ? '#458531' : '#F24B4B'}">
                    {{ game.tokenInfo.volume_change > 0 ? '+' : '' }}
                    {{ game.tokenInfo.volume_change.toFixed(2) }}%
                  </span>
                </div>
              </div>
              <div v-if="game.tokenInfo.market_cap" class="info">
                <div>Market Cap</div>
                <div>$ {{ game.tokenInfo.market_cap | abbreviateNumber }}
                  <span v-if="game.tokenInfo.market_cap_change"
                        :style="{color: game.tokenInfo.market_cap_change > 0 ? '#458531' : '#F24B4B'}">
                    {{ game.tokenInfo.market_cap_change > 0 ? '+' : '' }}
                    {{ game.tokenInfo.market_cap_change.toFixed(2) }}%
                  </span>
                </div>
              </div>
              <div v-if="game.tokenInfo.fully_diluted_market_cap" class="info">
                <div>Fully Diluted Market Cap</div>
                <div>$ {{ game.tokenInfo.fully_diluted_market_cap | abbreviateNumber }}
                  <span v-if="game.tokenInfo.fully_diluted_market_cap_change"
                        :style="{color: game.tokenInfo.fully_diluted_market_cap_change > 0 ? '#458531' : '#F24B4B'}">
                    {{ game.tokenInfo.fully_diluted_market_cap_change > 0 ? '+' : '' }}
                    {{ game.tokenInfo.fully_diluted_market_cap_change.toFixed(2) }}%
                  </span>
                </div>
              </div>
            </template>
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
            <div v-if="game.community && game.community.length" class="info">
              <div>Community</div>
              <div class="community">
                <a v-for="(item, i) in game.community" :key="i" :href="item.link" target="_blank">
                  <img alt :src="getCommunityImg(item.type)"/>
                </a>
              </div>
            </div>
          </template>
          <template v-else-if="game.ido">
            <div v-if="game.ido.date" class="ido-title">${{ game.token }} IGO on {{ game.ido.date }}</div>
            <countdown v-if="game.ido.date && game.ido_date" :deadline="game.ido_date"/>
            <div v-if="game.ido.chain" class="ido-chain">{{ game.ido.chain }}</div>
            <div v-if="game.ido.price" class="ido-price">
              Price per token: <span>$ {{ game.ido.price }}</span>
            </div>
            <div class="divider" v-if="game.developer || game.publisher || game.category || game.language || game.community"></div>
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
            <div v-if="game.community && game.community.length" class="info">
              <div>Community</div>
              <div class="community">
                <a v-for="(item, i) in game.community" :key="i" :href="item.link" target="_blank">
                  <img alt :src="getCommunityImg(item.type)"/>
                </a>
              </div>
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
          <template v-if="game.downloads && game.downloads.length && game.ido_type === 'launched'">
            <template v-if="game.downloads.length === 1">
              <a class="btn btn-download" :href="game.downloads[0].link" target="_blank" style="text-decoration: none">
                Play
              </a>
            </template>
            <template v-else>
              <div class="download">
                <div class="btn btn-download" @click="show.download = !show.download">
                  Play
                  <img :style="!show.download && { transform: 'rotate(180deg)'}" alt src="../assets/images/up.svg"/>
                </div>
                <transition name="slide-down">
                  <div v-show="show.download" class="download-list">
                    <a v-for="(item, i) in game.downloads" :key="i" :href="item.link" target="_blank">
                      {{ item.type }}</a>
                  </div>
                </transition>
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
    <template v-else-if="loading">
      <div class="not-found">
        <img alt src="../assets/images/404.png"/>
        <h3>Sorry, we were unable to find that page</h3>
        <a href="/" class="btn">Back to Home page</a>
      </div>
    </template>
    <div v-if="show.bigImg" class="dialog-img" @click="show.bigImg = false">
      <img alt :src="bigPicture"/>
    </div>
  </div>
</template>

<script>
// import {gameSample} from "@/data/mock";
import Breadcrumb from "../components/Breadcrumb";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import MaskDot from "../components/MaskDot";
import Countdown from "../components/Countdown";

function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}

export default {
  name: "Detail",
  components: {Countdown, MaskDot, Breadcrumb},
  filters: {
    displayNumber(val) {
      if (!val) {
        return ''
      }
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    abbreviateNumber(num) {
      if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(2) + 'K';
      } else if (num > 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
      } else {
        return num;
      }
    }
  },
  data() {
    return {
      defaultTitle: 'GameFi Aggregator',
      defaultPrefixBannerImage: 'https://gamefi-public.s3.amazonaws.com/aggregator/images/',
      defaultBannerImage: 'https://gamefi-public.s3.amazonaws.com/aggregator/images/launchpad.png',
      id: 0,
      show: {
        download: false,
        bigImg: false
      },
      tokenInfo: null,
      tab: 0,
      display: 0,
      played: false,
      playing: false,
      muted: false,
      loading: false,
      bigPicture: '',
      volume: 0.2,
      tempVol: 0.2,
      time: 0,
      fullscreen: false,
    }
  },
  head: {
    title() {
      return this.getTitleFromPath()
    },
    meta() {
      return this.getMetadata()
    },
    link() {
      return this.getLinks()
    }
  },
  async created() {
    this.id = this.$route.params.id
    await this.$store.dispatch('getGameDetail', this.id)

    this.$emit('updateHead')
    this.loading = true
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    game() {
      return this.$store.state.game
    },
    displayItem() {
      if (this.game.media && this.game.media.length)
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
      if (val) {
        this.$nextTick(() => {
          const sideEl = this.$refs.side
          if (window.innerWidth > 600 && sideEl) {
            const top = 254
            document.addEventListener('scroll', (e) => {
              const height = e.target.scrollingElement.scrollHeight,
                  scrollTop = e.target.scrollingElement.scrollTop
              if (scrollTop > top && (window.innerHeight + scrollTop + 100) < height) {
                sideEl.style.paddingTop = `${scrollTop - top}px`
              } else if (scrollTop < top) {
                sideEl.style.paddingTop = ''
              }
            })
          }
        })
      }
    },
    volume(val) {
      const video = this.$refs.video
      if (video.muted) {
        video.muted = false;
      }

      this.muted = +val === 0

      video.volume = +val;
    },
    display() {
      if(this.displayItem.type === 'video') {
        this.played = false
        this.playing = false
        const video = this.$refs.video
        if(video) {
          video.pause()
          video.fastSeek(0)
        }
        this.time = 0;
      }
    },
  },
  methods: {
    async like() {
      if (!this.user || !this.user.address) return
      await this.$store.dispatch('likeGame', {id: this.game.id, value: !this.game.liked})
      const game = {...this.game, liked: !this.game.liked}
      this.$store.commit('setGame', game)
    },
    getCommunityImg(name) {
      return require(`@/assets/images/community/${name}.svg`)
    },
    initializeVideo() {
      const video = this.$refs.video
      if(video) {
        const videoDuration = Math.round(video.duration)
        const seek = this.$refs.seek
        seek.setAttribute('max', videoDuration)
        const progressBar = this.$refs.progress
        progressBar.setAttribute('max', videoDuration)
        const time = formatTime(videoDuration);
        const duration = this.$refs.duration
        duration.innerText = `${time.minutes}:${time.seconds}`
        duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
      }
    },
    runProgress() {
      const video = this.$refs.video
      const progress = this.$refs.progress
      const timeElapsed = this.$refs.timer
      if(video && progress && timeElapsed) {
        progress.value = Math.floor(video.currentTime)
        this.time = progress.value
        const time = formatTime(progress.value)
        timeElapsed.innerText = `${time.minutes}:${time.seconds}`
      }
    },
    playVideo() {
      this.played = true
      this.playing = true
      const video = this.$refs.video
      video.play();
    },
    skipTo(e) {
      const value = e.target.value
      this.time = value
      const video = this.$refs.video
      video.currentTime = value
      const progress = this.$refs.progress
      progress.value = value
      const time = formatTime(value)
      const timeElapsed = this.$refs.timer
      timeElapsed.innerText = `${time.minutes}:${time.seconds}`
    },
    toggleVideo() {
      const video = this.$refs.video
      if (video.paused || video.ended) {
        video.play()
        this.playing = true
      } else {
        video.pause()
        this.playing = false
      }
    },
    toggleMute() {
      this.muted = !this.muted

      if (this.muted) {
        this.tempVol = +this.volume
        this.volume = 0
      } else {
        this.volume = this.tempVol
      }
    },
    toggleFullScreen() {
      const videoContainer = document.getElementById('video-container')
      this.fullscreen = !this.fullscreen
      if(document.fullscreenElement) {
        document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else {
        videoContainer.requestFullscreen();
      }
    },
    next() {
      const slide = this.$refs.slide
      if (this.display + 1 < this.game.media.length) {
        slide.scroll({left: (this.display + 1) * 118, behavior: 'smooth'})
        this.display++
      } else {
        slide.scroll({left: 0, behavior: 'smooth'})
        this.display = 0
      }
    },
    openBigPicture(data) {
      this.bigPicture = data
      this.show.bigImg = true
    },
    prev() {
      const slide = this.$refs.slide
      if (this.display - 1 >= 0) {
        slide.scroll({left: (this.display - 1) * 118, behavior: 'smooth'})
        this.display--
      } else {
        slide.scroll({left: (this.game.media.length - 1) * 118, behavior: 'smooth'})
        this.display = this.game.media.length - 1
      }
    },
    getLinks() {
      return [
        {rel: 'icon', href: 'https://gamefi.org/favicon.ico', sizes: '16x16', type: 'image/png'},
        {rel: 'preload', href: this.getImageFromPath(), type: 'image/png'}
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

      const newTitle = name.split(/[-_]+/).map((data) => {
        if (!data) {
          return ''
        }
        return data.charAt(0).toUpperCase() + data.slice(1)
      }).join(' ')

      return {
        inner: newTitle
      }
    },
    getImageFromPath() {
      if (this.game && Array.isArray(this.game.media)) {
        const firstItem = this.game.media.find((item) => {
          return item.type === 'image'
        })
        if (firstItem && firstItem.data) {
          return firstItem.data
        }
      }

      const name = this.getDetailFromPath()
      if (!name) {
        return this.defaultBannerImage
      }
      return `${this.defaultPrefixBannerImage}${name.split('-').join('_')}.png`
    },
    getDescription() {
      if (!this.game || !this.game.short_description) {
        return this.defaultTitle
      }

      return this.game.short_description
    },
    getMetadata() {
      return [
        {name: 'description', content: this.getDescription(), id: 'description'},

        // Twitter
        {
          name: 'twitter:title',
          content: `${this.getTitleFromPath().inner} | ${this.defaultTitle}`,
          id: 'twitter:title'
        },
        {name: 'twitter:description', content: this.getDescription(), id: 'twitter:description'},
        {name: 'twitter:image', content: this.getImageFromPath(), id: 'twitter:image'},

        // Google +
        {itemprop: 'name', content: this.getTitleFromPath().inner, id: 'name'},
        {itemprop: 'og:description', content: this.getDescription(), id: 'og:description'},
        {itemprop: 'og:desc', content: this.getDescription(), id: 'og:desc'},

        // Facebook
        {property: 'og:title', content: `${this.getTitleFromPath().inner} | ${this.defaultTitle}`, id: 'og:title'},
        {property: 'og:image', content: this.getImageFromPath(), id: 'og:image'}
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
          left: 99px;
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
        margin-bottom: 16px;

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
        margin: 8px 0;

        div:first-child {
          color: #AEAEAE;
        }

        div:last-child {
          font-weight: 600;
          text-align: right;

          span {
            font-size: 10px;
            font-weight: 400;
            margin-left: 4px;
          }
        }

        .community {
          display: flex;
          align-items: center;

          a {
            width: 24px;
            height: 24px;
            border-radius: 24px;
            background: #4F4F4F;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;

            img {
              max-width: 16px;
              max-height: 16px;
            }
          }
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
          margin-top: 32px;

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
            font-size: 14px;
            padding: 8px;
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
          margin-top: 0;
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

      .divider {
        margin: 24px 0;
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

            & > div {
              width: 100%;
              height: 100%;
            }

            video,
            & > img {
              width: 100%;
              height: 100%;
              object-fit: fill;
              border-radius: 18px;
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

            &.playing div > div {
              opacity: 0;
              transition: opacity 0.2s;
            }

            &.playing:hover div > div {
              opacity: 1;
            }

            .video-toolbar {
              position: absolute;
              bottom: 20px;
              left: 20px;
              right: 20px;
              background: #00000088;
            }

            .video-progress {
              position: relative;

              .video-progress {
                position: relative;
                height: 8.4px;
                margin-bottom: 10px;
              }

              progress {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                border-radius: 2px;
                width: 100%;
                height: 8.4px;
                pointer-events: none;
                position: absolute;
                top: 0;

                &::-webkit-progress-bar {
                  background-color: #474545;
                  border-radius: 2px;
                }

                &::-webkit-progress-value {
                  background: #72F34B;
                  border-radius: 2px;
                }

                &::-moz-progress-bar {
                  border: 1px solid #72F34B;
                  background: #72F34B;
                }
              }

              .seek {
                position: absolute;
                top: 0;
                width: 100%;
                cursor: pointer;
                margin: 0;
              }

            }

            .video-action {
              display: flex;
              align-items: center;
              padding: 24px 8px 12px;

              & > * {
                margin-right: 8px;
              }

              img {
                cursor: pointer;
              }
            }

            #video-container:fullscreen .video-toolbar {
              bottom: 0;
              left: 0;
              right: 0;
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
            font-size: 18px;
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
            font-family: Helvetica, sans-serif;
            font-size: 16px;

            & > div {
              margin-top: 32px;
            }

            .title {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 12px;
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

.not-found {
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

.dialog-img {
  position: fixed;
  z-index: 10000;
  background: #000a;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
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
          padding-top: 24px;

          .btn-like {
            margin-top: 40px;
          }
        }
      }

      &_content {
        .content-media {

          &_main {
            height: 210px;
            padding: 24px;
            max-width: calc(100vw - 24px);
            border-radius: 32px;

            video,
            & > img {
              border-radius: 24px;
              max-width: 100%;
            }

            .video-toolbar {
              left: 8px;
              right: 8px;
              bottom: 8px;

              progress,
              input[type=range] {
                height: 6px;
              }
            }

            .video-action {
              padding: 12px 8px 2px;

              input.volume {
                width: 60px;
              }

              img {
                border-radius: unset;
                width: 18px;

                &:first-child {
                  width: 14px !important;
                }

                &:last-child {
                  display: none;
                }
              }
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
            font-size: 16px;
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