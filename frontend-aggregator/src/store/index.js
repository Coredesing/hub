import Vue from "vue";
import Vuex from "vuex";
import {URL} from "@/constant/api";
import axios from "axios";
import dayjs from "dayjs";

Vue.use(Vuex);

const mapLikes = (items, likes) => {
  if (Array.isArray(items)) {
    return items.map(item => ({
      ...item,
      liked: !!likes.find(id => id === item.id)
    }))
  } else {
    return {
      ...items,
      liked: !!likes.find(id => id === items.id)
    }
  }
}

export default new Vuex.Store({
  state: {
    user: {
      address: '',
      signature: '',
      likes: []
    },
    category: '',
    listAll: [],
    listTopGame: [],
    listFavorite: [],
    listLatest: [],
    mainTrending: {},
    subTrending: [],
    mainUpcoming: {},
    subUpcoming: [],
    game: {},
    loading: false,
  },
  mutations: {
    updateUser(state, payload) {
      Object.assign(state.user, payload)
    },
    selectCategory(state, payload) {
      state.category = payload
    },
    updateListAll(state, payload) {
      state.listAll = payload
    },
    updateListTopGame(state, payload) {
      state.listTopGame = payload
    },
    updateListFavorite(state, payload) {
      state.listFavorite = payload
    },
    updateListLatest(state, payload) {
      state.listLatest = payload
    },
    updateMainTrending(state, payload) {
      state.mainTrending = payload
    },
    updateSubTrending(state, payload) {
      state.subTrending = payload
    },
    updateMainUpcoming(state, payload) {
      state.mainUpcoming = payload
    },
    updateSubUpcoming(state, payload) {
      state.subUpcoming = payload
    },
    setGame(state, payload) {
      state.game = payload
    },
    updateLikeInfo(state, payload) {
      const likes = state.user.likes
      const index = likes.findIndex(item => item === payload)
      if (index) {
        likes.splice(index, 1)
      } else {
        likes.push(payload)
      }
      Object.assign(state.user, {likes})
    },
    changeLoadingStatus(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    async getListAll({ commit }) {
      let url = URL.CATEGORY.slice(0, URL.CATEGORY.length - 1)
      const response = await axios.get(url)
      if (response && response.data) {
        const list = response.data.data.map(item => ({
          ...item,
          thumbnail: item.screen_shots_1,
          verified: !!item.verified
        }))
        commit('updateListAll', list)
      }
    },
    async searchByCategory({ commit }, payload) {
      commit('changeLoadingStatus', true)
      commit('selectCategory', payload)

      let url;
      if (payload === 'All categories') {
        url = URL.CATEGORY.slice(0, URL.CATEGORY.length - 1)
      } else {
        url = URL.CATEGORY + payload
      }

      const response = await axios.get(url)
      if (response && response.data) {
        const list = response.data.data.map(item => ({
          ...item,
          thumbnail: item.screen_shots_1,
          verified: !!item.verified
        }))
        commit('updateListAll', list)
      }
      commit('changeLoadingStatus', false)
    },
    async getListFavorite({ state, commit }) {
      const url = URL.DISPLAY + 'Favourite'
      const response = await axios.get(url)
      if (response && response.data) {
        const ids = response.data.data.map(item => item.id)
        let url = URL.GET_LIKE + ids.join(',')
        const response2 = await axios.get(url)
        const listLike = response2.data.data
        const list = response.data.data.map(item => ({
          ...item,
          icon: item.top_favourite_link,
          verified: !!item.verified,
          liked: !!state.user.likes.find(id => id === item.id),
          likes: listLike.find(it => it.game_id === item.id)?.total_like || 0,
        }))
        commit('updateListFavorite', list.splice(0, 6))
      }
    },
    async getListTopGame({ state, commit }) {
      commit('changeLoadingStatus', true)
      let url = URL.DISPLAY + 'Top%20Game'
      const response = await axios.get(url)
      if (response && response.data) {
        const ids = response.data.data.map(item => item.id)
        let url = URL.GET_LIKE + ids.join(',')
        const response2 = await axios.get(url)
        const listLike = response2.data.data
        const list = response.data.data.map(item => ({
          ...item,
          thumbnail: item.screen_shots_1,
          verified: !!item.verified,
          video: item.intro_video || item.upload_video,
          like: listLike.find(it => it.game_id === item.id)?.total_like || 0,
          liked: !!state.user.likes.find(id => id === item.id),
          title: item.game_name,
          description: item.short_description
        }))
        commit('updateListTopGame', list.splice(0, 4))
      }

      commit('changeLoadingStatus', false)
    },
    async getListLatest({ commit }) {
      let url = URL.CATEGORY.slice(0, URL.CATEGORY.length - 1)
      const response = await axios.get(url)
      if (response && response.data) {
        const list = response.data.data.map(item => ({
          ...item,
          thumbnail: item.screen_shots_1,
          verified: !!item.verified
        }))
        commit('updateListLatest', list)
      }
    },
    async getListTrending({ commit }) {
      const url = URL.DISPLAY + 'Trending'
      const response = await axios.get(url)
      if (response && response.data) {
        const mainItem = response.data.data[0]
        const subItems = [response.data.data[1], response.data.data[2]]
        commit('updateMainTrending', {...mainItem, thumbnailSquare: mainItem.top_favourite_link})
        commit('updateSubTrending', subItems.map(item => ({...item, thumbnailSquare: item.top_favourite_link})))
      }
    },
    async getListUpcoming({ commit }) {
      const url = URL.UPCOMING
      const response = await axios.get(url)
      if (response && response.data && response.data.data) {
        let mainItem, subItems
        if(response.data.data.length === 3) {
          mainItem = {
            ...response.data.data[0],
            video: response.data.data[0].intro_video,
            thumbnail: response.data.data[0].screen_shots_1,
            deadline: response.data.data[0].ido_date
          }
          subItems = [response.data.data[1], response.data.data[2]].map(item => ({...item, thumbnail: item.screen_shots_1, deadline: item.ido_date}))
        } else if (response.data.data.length === 2) {
          subItems = [response.data.data[0], response.data.data[1]].map(item => ({...item, thumbnail: item.screen_shots_1, deadline: item.ido_date}))
        } else {
          mainItem = {
            ...response.data.data[0],
            video: response.data.data[0].intro_video,
            thumbnail: response.data.data[0].screen_shots_1,
            deadline: response.data.data[0].ido_date
          }
        }

        commit('updateMainUpcoming', mainItem)
        commit('updateSubUpcoming', subItems)
      }
    },
    async likeGame({ state, commit }, payload) {
      const {id, value} = payload
      const url = URL.LIKE + id
      const {address, signature} = state.user
      await axios.post(url, {address, signature, status: value ? '1' : '0'})

      commit('updateLikeInfo', id)
    },
    async getGameDetail({ state, commit }, payload) {
      commit('changeLoadingStatus', true)
      const id = payload
      const urls = [URL.DETAIL + id, URL.INFO + id, URL.TOKENOMIC + id]
      const responses = await Promise.all(urls.map(url => axios.get(url)))
      const detail = responses[0].data
      const info = responses[1].data
      const tokenomic = responses[2].data

      let game = {
        id: detail.id,
        game_name: detail.game_name,
        verified: detail.verified,
        ido_type: detail.ido_type,
        ticker: tokenomic.ticker,
        developer: detail.developer,
        publisher: detail.publisher,
        language: detail.language,
        category: detail.category.split(',').join(', '),
        token_price: detail.ido_type === 'upcoming' ? detail.token_price : tokenomic.price,
        token_icon: detail.icon_token_link,
        coinmarketcap: info.coinmartketcap_link,
        downloads: [
          {type: 'Browser Game', link: detail.web_game_link},
          {type: 'PC Game', link: detail.game_pc_link},
          {type: 'Mobile iOS', link: detail.ios_link},
          {type: 'Android', link: detail.android_link},
        ].filter(item => !!item.link),
        ido: {
          date: detail.ido_date ? dayjs(detail.ido_date).format('MMM DD, YYYY') : '',
          price: detail.token_price,
          chain: detail.network_available,
          currency: detail.accept_currency,
          link: {
            redkite: detail.redkite_ido_link,
            gamefi: detail.gamefi_ido_link
          }
        },
        information: {
          introduction: detail.game_intro,
          highlightFeatures: detail.game_features,
          systemRequirement: detail.system_require,
          community: [
            {type: 'website', link: info.official_website},
            {type: 'discord', link: info.discord_link},
            {type: 'telegram', link: info.official_telegram_link},
            {type: 'twitter', link: info.twitter_link},
            {type: 'facebook', link: info.facebook_link},
            {type: 'instagram', link: info.instagram_link},
            {type: 'tiktok', link: info.tiktok_link},
            {type: 'youtube', link: info.youtube_link},
            {type: 'twitch', link: info.twitch_link},
            {type: 'reddit', link: info.reddit_link},
          ].filter(item => !!item.link),
          license: detail.license,
          tags: detail.hashtags.split(',').map(item => item.replace('#', '')),
        },
        tokenomic: {
          detail: {
            network_chain: tokenomic.network_chain,
            token_supply: tokenomic.token_supply,
            project_valuation: tokenomic.project_valuation,
            initial_token_cir: tokenomic.initial_token_cir,
            initial_token_market: tokenomic.initial_token_market
          },
          usability: tokenomic.token_utilities,
          economy: tokenomic.token_economy,
          distribution: tokenomic.token_distribution,
          schedule: tokenomic.token_release,
          metric: tokenomic.token_metric
        },
        team: {
          roadmap: info.roadmap.replace('<p>', '').replace('</p>', ''),
          partner: info.investors,
          technology: detail.technology,
          team: info.technologist,
          advisor: info.advisors,
        },
        media: [
          {
            type: 'video',
            data: detail.intro_video,
            thumbnail: detail.screen_shots_1
          },
          {
            type: 'video',
            data: detail.upload_video,
            thumbnail: detail.screen_shots_2
          },
          {
            type: 'image',
            data: detail.screen_shots_3
          },
          {
            type: 'image',
            data: detail.screen_shots_4
          },
          {
            type: 'image',
            data: detail.screen_shots_5
          }
        ].filter(item => !!item.data),
        liked: !!state.user.likes.find(id => id === detail.id),
        tokenInfo: {
          btc: +tokenomic.price_btc,
          btcChange: +tokenomic.price_btc_change_24h,
          eth: +tokenomic.price_eth,
          ethChange: +tokenomic.price_eth_change_24h
        },
        tokenChange: +tokenomic.price_change_24h
      }
      commit('setGame', game)
      commit('changeLoadingStatus', false)
    },
    async updateUserInfo({ state, commit }, payload) {
      const {address, signature} = payload
      let likes = []
      const url = URL.USER_LIKE + address
      const response = await axios.get(url)
      if (response && response.data) {
        const list = response.data.data
        likes = list.map(item => item.game_id)
        const { listTopGame, listFavorite, game } = state
        commit('updateListTopGame', mapLikes(listTopGame, likes))
        commit('updateListFavorite', mapLikes(listFavorite, likes))
        commit('setGame', mapLikes(game, likes))
      }

      commit('updateUser', {address, signature, likes})
    }
  },
  modules: {},
});
