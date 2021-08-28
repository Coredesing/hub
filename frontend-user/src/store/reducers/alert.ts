import { AnyAction } from 'redux'
import { alertActions } from '../constants/alert'

type StateType = {
  type: string;
  message: string;
}

const initialState = {
  type: '',
  message: ''
}

export const alertReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {
    case alertActions.SUCCESS_MESSAGE: {
      return {
        type: 'success',
        message: action.payload
      }
    }

    case alertActions.WARNING_MESSAGE: {
      return {
        type: 'warning',
        message: action.payload
      }
    }

    case alertActions.ERROR_MESSAGE: {
      return {
        type: 'error',
        message: action.payload
      }
    }

    case alertActions.CLEAR_MESSAGE: {
      return {
        type: "",
        message: ""
      }
    }

    default: {
      return state;
    }
  }
}
type TypeIsPushNoti = {
  success: boolean,
  warn: boolean,
  failed: boolean
}
export const getTypeIsPushNotiReducer = (state: TypeIsPushNoti = {success: true, warn: true, failed: true}, action: AnyAction) => {
  switch(action.type) {
    case alertActions.TYPE_IS_PUSH_NOTI: {
      return {
        ...(action.payload || {})
      }
    }
    default: {
      return state;
    }
  }
}