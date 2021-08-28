import { alertActions } from '../constants/alert'

export const alertSuccess = (msg: string)  => {
  return {
    type: alertActions.SUCCESS_MESSAGE,
    payload: msg
  }
}

export const alertWarning = (msg: string)  => {
  return {
    type: alertActions.WARNING_MESSAGE,
    payload: msg
  }
}

export const alertFailure = (msg: string)  => {
  return {
    type: alertActions.ERROR_MESSAGE,
    payload: msg
  }
}

export const clearAlert = ()  => {
  return {
    type: alertActions.CLEAR_MESSAGE,
  }
}

export const setTypeIsPushNoti = ({
  success = true,
  warn = true,
  failed = true,
}: {success?: boolean, warn?: boolean, failed?: boolean} = {}) => {
  return {
    type: alertActions.TYPE_IS_PUSH_NOTI,
    payload: {
      success, warn, failed,
    }
  }
}