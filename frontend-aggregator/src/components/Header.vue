<template>
  <div class="header">
    <a class="header-logo" @click="goToHome">
      <img alt src="../assets/images/logo.svg"/>
    </a>
    <div :class="`header-nav ${show.nav ? 'show' : ''}`">
      <div class="header-list">
        <a class="header-list_item" href="https://hub.gamefi.org/" target="_blank">Launchpad</a>
        <a class="header-list_item" href="https://hub.gamefi.org/#/mystery-boxes" target="_blank">Mystery Box</a>
      </div>
      <div class="spacer"/>
<!--      <div :class="`search ${show.search ? 'show' : ''}`">-->
<!--        <input ref="search-input" type="text" v-model="searchText" v-click-outside="blur"/>-->
<!--        <img alt src="../assets/images/search.svg" @click.stop="openSearchBar"/>-->
<!--        <transition name="slide-down">-->
<!--          <div v-if="show.search && listSearch" class="search-result">-->
<!--            <template v-if="listSearch.length">-->
<!--              <div v-for="(item ,i) in listSearch" :key="i" class="search-result_item" @click="viewDetail(item)">-->
<!--                {{ item.game_name }}-->
<!--              </div>-->
<!--            </template>-->
<!--            <template v-else>-->
<!--              <div class="search-result_item" @click="viewList">Search all game</div>-->
<!--            </template>-->
<!--          </div>-->
<!--        </transition>-->
<!--      </div>-->
<!--      <div class="category">-->
<!--        <div class="category-title" @click="show.category = !show.category">-->
<!--          Category-->
<!--          <img alt src="../assets/images/arrow_right.svg" :style="{transform: show.category ? 'rotate(-90deg)' : 'rotate(90deg)'}"/>-->
<!--        </div>-->
<!--        <transition name="slide-down">-->
<!--          <div v-if="show.category" class="category-list">-->
<!--            <div class="category-list_item" v-for="(item, i) in CATEGORY_LIST" :key="i" @click="selectCategory(item)">-->
<!--              {{ item }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </transition>-->
<!--      </div>-->
      <template v-if="user && user.address">
        <div class="address">{{ user.address | compressAddress}}</div>
      </template>
      <template v-else>
        <div class="btn" @click="connectWallet">Connect Wallet</div>
      </template>
    </div>
    <div class="header-toggle" @click="show.nav = !show.nav">
      <template v-if="show.nav">
        <img alt src="../assets/images/close.svg"/>
      </template>
      <template v-else>
        <img style="width: 20px" alt src="../assets/images/menu.svg"/>
      </template>
    </div>
  </div>
</template>

<script>
import { CATEGORY_LIST } from "@/constant/category";
import ClickOutside from 'vue-click-outside'
import {SIGNATURE_MESSAGE} from "@/constant/api";

export default {
  name: "Header",
  directives: {
    ClickOutside
  },
  filters: {
    compressAddress(val) {
      return val.substr(0, 4) + '...' + val.substr(val.length-4, 4)
    }
  },
  data() {
    return {
      CATEGORY_LIST,
      show: {
        category: false,
        search: false,
        nav: false,
      },
      searchText: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    listSearch() {
      const searchText = this.searchText.toLowerCase()
      const listAll = this.$store.state.listAll
      console.log(listAll)
      return listAll.filter(item => (item.game_name.toLowerCase().includes(searchText))).slice(0, 5)
    }
  },
  methods: {
    goToHome() {
      this.$router.push({ path: '/'})
    },
    async connectWallet() {
      const ethereum = window.ethereum
      if(ethereum) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const address = await ethereum.request({ method: 'eth_accounts'})
        const msg = SIGNATURE_MESSAGE
        const params = [address[0], msg]
        const method = 'personal_sign'
        const signature = await window.ethereum.request({method, params})
        await this.$store.dispatch('updateUserInfo', {address: address[0], signature})
      }
    },
    async selectCategory(item) {
      await this.$store.dispatch('searchByCategory', item)
      this.show.category = false
      if(this.$route.name !== 'List') {
        await this.$router.push({ path : '/list' })
      }
    },
    blur() {
      setTimeout(() => {
        this.show.search = false
      }, 100)
    },
    openSearchBar() {
      this.show.search = true
      this.$refs['search-input'].focus()
    },
    viewDetail(item) {
      this.$router.push({ path: `/detail/${item.id}` })
    },
    viewList() {
      this.$router.push({ path: '/list'})
    }
  }
}
</script>

<style scoped lang="scss">
  .header {
    display: flex;
    align-items: center;
    padding: 20px var(--padding-section);
    background: #000000;

    &-logo {
      cursor: pointer;
    }

    &-nav {
      flex: 1;
      display: flex;
      align-items: center;
    }

    &-list {
      display: flex;
      align-items: center;
      margin-left: 32px;

      &_item {
        color: white;
        text-decoration: none;
        margin-right: 32px;
      }
    }

    .search {
      position: relative;
      display: flex;
      align-items: center;
      padding: 12px;
      transition: all 0.5s;
      border-radius: 4px;

      img {
        margin-left: 8px;
        cursor: pointer;
      }

      input {
        background: transparent;
        border: none;
        outline: none;
        padding: 0;
        margin: 0;
        color: white;
        width: 0;
        transition: all 0.5s;
      }

      &.show {
        background: #2E2E2E;
        border: 1px solid #44454B;

        input {
          width: 200px;
        }
      }

      &-result {
        position: absolute;
        top: 48px;
        left: 0;
        display: flex;
        flex-direction: column;
        background: #2E2E2E;
        border: 1px solid #44454B;
        border-radius: 4px;
        padding: 0;
        width: 100%;
        z-index: 10;
        overflow: hidden;

        &_item {
          text-decoration: none;
          color: #FFFFFF;
          font-size: 14px;
          padding: 4px;
          border-bottom: 1px solid #44454B;
          cursor: pointer;
          position: relative;

          &:last-child {
            border-bottom: none;
          }

          &:hover:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #fff2;
          }
        }
      }
    }

    .category {
      position: relative;

      &-title {
        display: flex;
        align-items: center;
        padding: 12px 24px;
        cursor: pointer;
        user-select: none;

        img {
          margin-left: 12px;
          transition: all 0.3s;
        }
      }

      &-list {
        position: absolute;
        top: 60px;
        display: flex;
        flex-direction: column;
        background: #2E2E2E;
        border: 1px solid #44454B;
        border-radius: 4px;
        padding: 0;
        width: 100%;
        z-index: 10;
        overflow: hidden;

        &_item {
          text-decoration: none;
          color: #FFFFFF;
          font-size: 14px;
          padding: 4px;
          border-bottom: 1px solid #44454B;
          text-align: center;
          cursor: pointer;
          position: relative;

          &:last-child {
            border-bottom: none;
          }

          &:hover:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #fff2;
          }
        }
      }
    }

    .address {
      border-radius: 4px;
      background: #2E2E2E;
      padding: 4px 12px;
    }

    .btn {
      background: #72F34B;
      border-radius: 4px;
      color: #000000;
      font-weight: 600;
      font-size: 14px;
      line-height: 24px;
      padding: 8px 36px;
      cursor: pointer;
    }

    &-toggle {
      display: none;
      cursor: pointer;
    }
  }

  @media screen and (max-width: 600px) {
    .header {
      justify-content: space-between;

      &-nav {
        display: none;
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000000;
        flex-direction: column;
        z-index: 1000;

        &.show {
          display: flex;
        }

        .spacer {
          display: none;
        }
      }

      &-list {
        flex-direction: column;
        margin: 0;

        &_item {
          margin: 16px 0;
        }
      }

      &-toggle {
        display: block;
      }
    }
  }
</style>