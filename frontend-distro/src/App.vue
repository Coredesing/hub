<template>
  <div class="px-auto h-full">
    <nav class="bg-black w-full px-4 py-4">
      <div class="container flex items-center align-middle">
        <wallet-connector :show="state.showConnectWallet" @close="state.showConnectWallet = false"></wallet-connector>
        <button
          class="ml-auto bg-gray-700 px-4 py-2 rounded hover:opacity-90 flex align-middle items-center"
          @click.prevent="toggleConnectWallet(true)">
          <img src="@/assets/images/icons/bsc.svg" class="w-4 h-4 lg:w-6 lg:h-6 mr-2">
          {{walletShort || 'Connect Wallet'}}
        </button>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import useStore from '@/composables/useStore'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'
import useWeb3 from '@/composables/useWeb3'
import WalletConnector from '@/components/WalletConnector.vue'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL
const store = useStore()
const { wallet, walletShort } = storeToRefs(store)
const { eager } = useWeb3()
onMounted(async () => {
  await eager()
  await getSelectedOption()
})

const state = reactive({
  showConnectWallet: false
})

function toggleConnectWallet (value) {
  state.showConnectWallet = value
}

async function getSelectedOption () {
  if (!wallet && wallet.value) {
    return
  }
  await axios.post(`${BASE_URL}/api/v1/vesting/gamefi/${wallet.value}`).then(res => {
    if (!res || !res.data) {
      return
    }

    store.updateSelectedOption(res.data.data)
  }).catch(e => console.log(e))
}
</script>

<style>
</style>
