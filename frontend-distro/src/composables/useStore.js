import { ref } from 'vue'
import { defineStore } from 'pinia'
import { shorten } from '@/utils/utils'

export default defineStore('main', {
  state: () => {
    return {
      mobileMenu: ref(false),
      wallet: null,
      chainID: null,
      balances: null,
      selectedOption: null
    }
  },
  getters: {
    walletShort (state) {
      return state.wallet && shorten(state.wallet, 16)
    },
    selectedInfo (state) {
      return state.selectedOption
    }
  },
  actions: {
    toggleMobileMenu () {
      this.mobileMenu = !this.mobileMenu
    },
    connected ({ account, chainId }) {
      this.wallet = account
      this.chainID = chainId
    },
    updateSelectedOption (data) {
      this.selectedOption = data
    }
  }
})
