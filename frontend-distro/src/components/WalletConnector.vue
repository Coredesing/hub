<template>
  <modal :show="props.show" @close="close()">
    <template #header>
      <div class="font-medium uppercase text-lg">Connect Wallet</div>
    </template>
    <template #body>
      <!-- <div class="font-medium">Choose wallet</div> -->
      <div class="mx-auto grid md:grid-cols-3 gap-4 mt-4">
        <button
          class="cursor-pointer p-6 hover:bg-gray-900 rounded flex flex-col items-center align-middle justify-center select-none"
          @click.prevent="login('injected')"
        >
          <img class="w-8 h-8 lg:w-10 lg:h-10" src="@/assets/images/icons/metamask.svg">
          <div class="mt-4 text-xs text-gray-400">Metamask</div>
        </button>
        <button
          class="cursor-pointer p-6 hover:bg-gray-900 hover:opacity-95 rounded flex flex-col items-center align-middle justify-center"
        >
          <img class="w-8 h-8 lg:w-10 lg:h-10" src="@/assets/images/icons/bsc-wallet.svg">
          <div class="mt-4 text-xs text-gray-400">BSC Wallet</div>
        </button>
        <button
          class="cursor-pointer p-6 hover:bg-gray-900 hover:opacity-95 rounded flex flex-col items-center align-middle justify-center"
        >
          <img class="w-8 h-8 lg:w-10 lg:h-10" src="@/assets/images/icons/wallet-connect.svg">
          <div class="mt-4 text-xs text-gray-400">WalletConnect</div>
        </button>
      </div>
    </template>
  </modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue'
import useStore from '@/composables/useStore'
import { onMounted, watch } from 'vue'
import useWeb3 from '@/composables/useWeb3'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL
const store = useStore()
const { login, error } = useWeb3()
const { wallet } = storeToRefs(store)

const { active, account, chainId } = useWeb3()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

function close () {
  emit('close')
}

onMounted(() => {
  if (wallet && wallet.value) {
    getSelectedOption()
  }
})
watch([active, account, chainId], () => {
  store.connected({ account: account.value, chainId: chainId.value })
  getSelectedOption()
})

async function getSelectedOption () {
  if (!wallet) {
    return
  }
  await axios.post(`${BASE_URL}/api/v1/vesting/gamefi/${wallet.value}`).then(res => {
    if (!res || !res.data) {
      return
    }

    store.updateSelectedOption(res.data.data)
  }).catch(e => console.log(e))
}

watch([wallet, error], () => {
  emit('close')
})

</script>
