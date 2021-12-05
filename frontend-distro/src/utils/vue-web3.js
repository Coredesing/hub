import { normalizeAccount, normalizeChainId } from './normalizers'
import { ConnectorEvent } from '@web3-react/types'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

export class UnsupportedChainIdError extends Error {
  constructor (unsupportedChainId, supportedChainIds) {
    super()
    this.name = this.constructor.name
    this.message = `Unsupported chain id: ${unsupportedChainId}. Supported chain ids are: ${supportedChainIds}.`
  }
}

const connector = ref()
const chainId = ref()
const account = ref()
const provider = ref()
const error = ref()
const active = computed(() => connector.value !== undefined && chainId.value !== undefined && account.value !== undefined && !error.value)

let getLibrary = (provider, connector) => () => null

export const setWeb3LibraryCallback = (cb) => {
  getLibrary = cb
}

export const useWeb3 = () => {
  const onErrorCb = ref()

  const activate = async (c, onError, throwErrors = false) => {
    let activated = false

    try {
      const update = await c.activate().then((update) => {
        activated = true
        return update
      })

      const augmentedUpdate = await augmentConnectorUpdate(c, update)
      connector.value = c
      provider.value = augmentedUpdate.provider
      chainId.value = augmentedUpdate.chainId
      account.value = augmentedUpdate.account
      onErrorCb.value = onError
      error.value = undefined
    } catch (e) {
      if (throwErrors) {
        activated && c.deactivate()
        throw e
      } else if (onError) {
        activated && c.deactivate()
        onError(e)
        return
      }

      connector.value = c
      error.value = e
    }
  }

  const deactivate = () => {
    connector.value?.deactivate()

    handleDeactivate()
  }

  const handleUpdate = async (update) => {
    if (error.value) {
      // UPDATE_FROM_ERROR
      try {
        const augmentedUpdate = await augmentConnectorUpdate(connector.value, update)
        chainId.value = augmentedUpdate.chainId
        provider.value = augmentedUpdate.provider
        account.value = augmentedUpdate.account
        error.value = undefined
      } catch (e) {
        error.value = e
      }

      return
    }

    if (!connector.value) {
      handleDeactivate()
      return
    }

    const cId = update.chainId === undefined ? undefined : normalizeChainId(update.chainId)
    if (cId !== undefined && !!connector.value.supportedChainIds && !connector.value.supportedChainIds.includes(cId)) {
      const e = new UnsupportedChainIdError(cId, connector.value.supportedChainIds)
      onErrorCb.value ? onErrorCb.value(e) : handleError(e)
      return
    }

    if (cId) {
      chainId.value = cId
    }

    if (update.provider) {
      provider.value = update.provider
    }

    const acc = typeof update.account === 'string' ? normalizeAccount(update.account) : update.account
    if (acc) {
      account.value = acc
    }
  }

  const handleError = (e) => {
    if (onErrorCb.value) {
      onErrorCb.value(e)
      return
    }

    account.value = undefined
    error.value = e
    active.value && connector.value?.deactivate() && handleDeactivate()
  }

  const handleDeactivate = () => {
    connector.value = undefined
    chainId.value = undefined
    provider.value = undefined
    account.value = undefined
    onErrorCb.value = undefined
  }

  const library = computed(() => active.value ? getLibrary(provider.value, connector.value) : undefined)

  watch(connector, () => {
    if (connector.value) {
      connector.value
        .on(ConnectorEvent.Update, handleUpdate)
        .on(ConnectorEvent.Error, handleError)
        .on(ConnectorEvent.Deactivate, handleDeactivate)
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (connector.value) {
      connector.value
        .off(ConnectorEvent.Update, handleUpdate)
        .off(ConnectorEvent.Error, handleError)
        .off(ConnectorEvent.Deactivate, handleDeactivate)
    }
  })

  return {
    library,
    active,
    activate,
    deactivate,
    connector,
    chainId,
    account,
    provider,
    error
  }
}

async function augmentConnectorUpdate (connector, update) {
  const provider =
    update.provider === undefined
      ? await connector.getProvider()
      : update.provider
  const [_chainId, _account] = await Promise.all([
    update.chainId === undefined ? connector.getChainId() : update.chainId,
    update.account === undefined ? connector.getAccount() : update.account
  ])

  const chainId = normalizeChainId(_chainId)
  if (
    !!connector.supportedChainIds &&
    !connector.supportedChainIds.includes(chainId)
  ) {
    throw new UnsupportedChainIdError(chainId, connector.supportedChainIds)
  }
  const account = _account === null ? _account : normalizeAccount(_account)

  return { provider, chainId, account }
}
