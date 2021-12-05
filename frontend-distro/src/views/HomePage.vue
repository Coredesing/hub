<template>
  <div class="home-wrapper flex flex-col justify-center items-center">
    <!-- connect wallet -->
    <wallet-connector :show="state.showConnectWallet" @close="state.showConnectWallet = false"/>
    <!-- confirm option 1 -->
    <modal :show="state.showConfirmOption1" @close="state.showConfirmOption1 = false">
      <template #header>
        <div>Confirm vesting option</div>
      </template>
      <template #body>
        <div>
          You are choosing <span class="font-medium text-gamefiGreen-400">Option 1</span>
          <ul class="list-disc mx-4 mt-2">
            <li><div class="text-white font-light">December 10, 2021: Claim 25%</div></li>
            <li><div class="text-white mt-1 font-light">The remaining 50% will claim block-by-block in 6 months</div></li>
          </ul>
          <hr class="mt-5 border-gray-600">
          <label class="inline-flex items-center">
            <div class="form-control">
              <label class="cursor-pointer flex align-middle items-center select-none mt-3 text-gray-400 text-sm">
                <div><input v-model="state.agree1" type="checkbox" class="cursor-pointer mr-2 mt-1 bg-gray-400 shadow-none"></div>
                <div>I have read and agree to this option</div>
              </label>
            </div>
          </label>
        </div>
      </template>
      <template #footer>
        <div class="grid lg:grid-cols-2 gap-4">
          <button @click.prevent="state.showConfirmOption1 = false" class="px-2 py-1 lg:px-4 lg:py-2 bg-gray-600 text-white font-medium rounded-sm hover:opacity-90">
            Cancel
          </button>
          <button
            :disabled="!state.agree1"
            class="px-2 py-1 lg:px-4 lg:py-2 bg-gamefiGreen-400 text-black font-medium rounded-sm hover:opacity-90"
            :class="{'bg-gray-600 cursor-not-allowed text-white hover:opacity-100': !state.agree1}"
            @click.prevent="confirmOption(1)"
          >
            Confirm
          </button>
        </div>
      </template>
    </modal>
    <!-- confirm option 2 -->
    <modal :show="state.showConfirmOption2" @close="state.showConfirmOption2 = false">
      <template #header>
        <div>Confirm vesting option</div>
      </template>
      <template v-if="!state.reconfirm" #body>
        <div>
          You are choosing <span class="font-medium text-gamefiGreen-400">Option 2</span>
          <ul class="list-disc mx-4 mt-2">
            <li><div class="text-white font-light">December 10, 2021: Claim 25%</div></li>
            <li><div class="text-white mt-1 font-light">After that, get 25% Airdrop immediately and the remaining 25% will be burned</div></li>
          </ul>
          <hr class="mt-5 border-gray-600">
          <label class="inline-flex items-center">
            <div class="form-control">
              <label class="cursor-pointer flex align-middle items-center select-none mt-3 text-gray-400 text-sm">
                <div><input v-model="state.agree2" type="checkbox" class="cursor-pointer mr-2 mt-1 bg-gray-400 shadow-none"></div>
                <div>I have read and agree to this option</div>
              </label>
            </div>
          </label>
        </div>
      </template>
      <template v-else #body>
        <div>
          By choosing this option, the remain 25% will be <span class="uppercase">burned</span>. Are you sure?
        </div>
      </template>
      <template #footer>
        <div class="grid lg:grid-cols-2 gap-4">
          <button
            class="px-2 py-1 lg:px-4 lg:py-2 bg-gray-600 text-white font-medium rounded-sm hover:opacity-90"
            @click.prevent="() => {
              state.showConfirmOption2 = false
              state.reconfirm = false
            }"
          >
            Cancel
          </button>
          <button
            :disabled="!state.reconfirm && !state.agree2"
            class="px-2 py-1 lg:px-4 lg:py-2 bg-gamefiGreen-400 text-black font-medium rounded-sm hover:opacity-90"
            :class="{'bg-gray-600 cursor-not-allowed text-white hover:opacity-100': !state.agree2}"
            @click.prevent="confirmOption(2)"
          >
            Confirm
          </button>
        </div>
      </template>
    </modal>
    <!-- countdown -->
    <div class="container text-center uppercase flex justify-center align-middle items-center text-sm">
      Registration ends in
      <img
        class="ml-2"
        src="@/assets/images/icons/dot.svg"
      >
    </div>
    <countdown :deadline="new Date('2021/12/07 23:59:59')" />
    <div class="main-content">
      <gamefi-box>
        <template #body>
          <div class="font-bold">
            Changing the vesting schedule of $GAFI Public Sale
          </div>
          <div class="text-sm mt-3">
            Please read carefully the information about the two new vesting options and choose one of them. You will not be able to change the selected option after signing confirmation.
          </div>
          <div class="text-sm mt-2">
            After the registration period expires, if you do not choose any option, we will default to change your vesting schedule according to <span class="text-gamefiGreen-400 font-medium">Option 1</span>
          </div>
          <div class="font-medium mt-4">Select Pool (Only pools you have claimable GAFI)</div>
          <div class="mt-4">
            <!-- <div>Your current options:</div>
            <ul class="list-disc text-xs">
              <li><div>Option 1: {{state.selectedOption.option1 }}</div></li>
              <li><div>Option 2: {{ state.selectedOption.option2 }}</div></li>
            </ul> -->
            <div class="flex items-center align-middle">
              <div class="mr-3">
                <button
                  class="cursor-pointer h-12 p-4 bg-gray-900 rounded flex flex-col items-center align-middle justify-center select-none"
                  :class="{
                    'border border-gamefiGreen-400 hover:opacity-90': isActivePool('GameFi'),
                    'border border-gray-700 hover:opacity-90': !isActivePool('GameFi'),
                    'border border-gamefiGreen-400 opacity-50 cursor-not-allowed': selectedInfo
                  }"
                  @click.prevent="selectPool('GameFi')"
                >
                  <img class="h-full" src="@/assets/images/gamefi.png">
                </button>
              </div>
              <div class="mr-3">
                <button
                  class="cursor-pointer h-12 p-3 bg-gray-900 rounded flex flex-col items-center align-middle justify-center select-none"
                  :class="{
                    'border border-gamefiGreen-400 hover:opacity-90': isActivePool('RedKite'),
                    'border border-gray-700 hover:opacity-90': !isActivePool('RedKite'),
                    'border border-gamefiGreen-400 opacity-50 cursor-not-allowed': selectedInfo
                  }"
                  @click.prevent="selectPool('RedKite')"
                >
                  <img class="h-full" src="@/assets/images/logo-red-kite.svg">
                </button>
              </div>
              <div class="mr-3">
                <button
                  class="cursor-pointer h-12 p-3 bg-gray-900 rounded flex flex-col items-center align-middle justify-center select-none"
                  :class="{
                    'border border-gamefiGreen-400 hover:opacity-90': isActivePool('DAO'),
                    'border border-gray-700 hover:opacity-90': !isActivePool('DAO'),
                    'border border-gamefiGreen-400 opacity-50 cursor-not-allowed hover:opacity-10': selectedInfo
                  }"
                  @click.prevent="selectPool('DAO')"
                >
                  <img class="h-full" src="@/assets/images/DAO-Maker.svg">
                </button>
              </div>
            </div>
          </div>
          <div class="font-medium mt-4">Select Option</div>
          <div class="grid lg:grid-cols-2 mt-4 gap-4">
            <!-- option 1 -->
            <box-option :is-active="state.activeOption === 1">
              <template #header>
                <div>New vesting schedule</div>
                <div class="text-gamefiGreen-400 font-bold text-2xl">
                  Option 1
                </div>
              </template>
              <template #body>
                <div>
                  <div class="inline-flex">
                    <img
                      class="w-2 h-2 lg:w-4 lg:h-4"
                      src="@/assets/images/icons/tick.svg"
                    >
                    <div class="ml-2">
                      December 10, 2021: Claim 25% on GameFi
                    </div>
                  </div>
                  <div class="inline-flex mt-2">
                    <img
                      class="w-2 h-2 lg:w-4 lg:h-4"
                      src="@/assets/images/icons/tick.svg"
                    >
                    <div class="ml-2">
                      The ramaining 50% will claim block-by-block in 6 months start in 10/12/2021
                    </div>
                  </div>
                  <div class="flex items-center justify-center mt-5 w-full">
                    <button
                      class="px-2 py-1 lg:px-4 lg:py-2 w-full font-medium rounded-sm hover:opacity-90"
                      :class="{
                        'bg-gray-500 text-white cursor-not-allowed hover:opacity-100': selectedInfo,
                        'bg-gamefiGreen-400 text-black': !selectedInfo
                      }"
                      :disabled="selectedInfo"
                      @click.prevent="toggleOptionModal(1)"
                    >
                      {{ walletShort ? 'I choose Option 1' : 'Connect Wallet' }}
                    </button>
                  </div>
                </div>
              </template>
            </box-option>
            <!-- option 2 -->
            <box-option :is-active="state.activeOption === 2">
              <template #header>
                <div>New vesting schedule</div>
                <div class="text-gamefiGreen-400 font-bold text-2xl">
                  Option 2
                </div>
              </template>
              <template #body>
                <div>
                  <div class="inline-flex">
                    <img
                      class="w-2 h-2 lg:w-4 lg:h-4"
                      src="@/assets/images/icons/tick.svg"
                    >
                    <div class="ml-2">
                      December 10, 2021: Claim 25% on GameFi
                    </div>
                  </div>
                  <div class="inline-flex mt-2">
                    <img
                      class="w-2 h-2 lg:w-4 lg:h-4"
                      src="@/assets/images/icons/tick.svg"
                    >
                    <div class="ml-2">
                      After that, get 25% Airdrop within 3 days and the remaining 25% will be burned
                    </div>
                  </div>
                  <div class="flex items-center justify-center mt-5 w-full">
                    <button
                      class="px-2 py-1 lg:px-4 lg:py-2 w-full font-medium rounded-sm hover:opacity-90"
                      :class="{
                        'bg-gray-500 text-white cursor-not-allowed hover:opacity-100': selectedInfo,
                        'bg-gamefiGreen-400 text-black': !selectedInfo
                      }"
                      :disabled="selectedInfo"
                      @click.prevent="toggleOptionModal(2)">
                      {{ walletShort ? 'I choose Option 2' : 'Connect Wallet' }}
                    </button>
                  </div>
                </div>
              </template>
            </box-option>
          </div>
        </template>
      </gamefi-box>
    </div>
  </div>
</template>

<script setup>
import GamefiBox from '@/components/GamefiBox.vue'
import BoxOption from '@/components/BoxOption.vue'
import Countdown from '@/components/Countdown.vue'
import Modal from '@/components/Modal.vue'
import WalletConnector from '@/components/WalletConnector.vue'
import { reactive, watch } from 'vue'
import useStore from '@/composables/useStore'
import { storeToRefs } from 'pinia'
import useWeb3 from '@/composables/useWeb3'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL
const USER_MESSAGE_SIGNATURE = import.meta.env.VITE_USER_MESSAGE_SIGNATURE

const toast = useToast()
const store = useStore()
const { wallet, walletShort, selectedInfo } = storeToRefs(store)

const { account, library } = useWeb3()

const state = reactive({
  showConfirmOption1: false,
  showConfirmOption2: false,
  agree1: false,
  agree2: false,
  activeOption: 1,
  reconfirm: false,
  showConnectWallet: false,
  pools: ['GameFi'],
  rawSignature: ''
})

watch([selectedInfo], () => {
  state.pools = (selectedInfo && selectedInfo.value && selectedInfo.value.pools.split(',')) || []
  state.activeOption = selectedInfo && selectedInfo.value && selectedInfo.value.option
})
function selectPool (pool) {
  if (selectedInfo && selectedInfo.value) {
    return
  }
  const index = state.pools ? state.pools.indexOf(pool) : -1
  return index === -1 ? state.pools.push(pool) : state.pools.splice(index, 1)
}

function isActivePool (pool) {
  return state.pools && state.pools.indexOf(pool) !== -1
}
async function confirmOption (option) {
  switch (option) {
    case 1:
      if (!state.agree1) {
        return
      }

      await submitOption(1)

      state.showConfirmOption1 = false
      break
    case 2:
      if (!state.reconfirm && !state.agree2) {
        return
      }

      if (!state.reconfirm) {
        state.reconfirm = true
        return
      }

      await submitOption(2)

      state.showConfirmOption2 = false
      break
    default:
      break
  }
}

function toggleOptionModal (option) {
  if (!walletShort.value) {
    state.showConnectWallet = true
    return
  }

  switch (option) {
    case 1:
      state.showConfirmOption1 = true
      break
    case 2:
      state.showConfirmOption2 = true
      break
  }
}

function signMessage () {
  return library.value.getSigner(account.value).signMessage(USER_MESSAGE_SIGNATURE)
}

async function getSelectedOption () {
  if (!wallet || !wallet.value) {
    return
  }
  await axios.post(`${BASE_URL}/api/v1/vesting/gamefi/${wallet.value}`).then(res => {
    if (!res || !res.data) {
      return
    }

    store.updateSelectedOption(res.data.data)
  })
}

async function submitOption (option) {
  if (!state.pools.length) {
    toast.error('Choose at least one pool!')
    return
  }

  await signMessage().then(rawSignature => {
    state.rawSignature = rawSignature
  }).catch(e => {
    toast.error(e.message)
  })

  const payload = {
    option,
    pools: state.pools.join(',')
  }

  const config = {
    headers: {
      msgsignature: USER_MESSAGE_SIGNATURE
    }
  }

  toast.info('Submitting...')
  await axios.post(`${BASE_URL}/api/v1/vesting/gamefi?signature=${state.rawSignature}&wallet_address=${wallet.value}`, payload, config)
    .then(res => {
      if (!res || res.status !== 200) {
        toast.error('Something wrong')
        return
      }

      toast.success('Success')
      getSelectedOption()
    })
    .catch(e => {
      toast.error(e.message)
    })
}
</script>

<style lang="scss" scoped>
.home-wrapper {
  margin-top: 3rem;
}

.main-content {
  max-width: 50rem;
}

.list-disc {
  color: #72F34B !important;
}
</style>
