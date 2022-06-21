import { ObjectType } from '@/utils/types'
import { useContext, createContext } from 'react'

export type HubDetailContextProps = {
  hubData: ObjectType | null;
}

export const HubDetailContext = createContext<HubDetailContextProps>({
  hubData: {}
})

export const useHubDetailContext = () => {
  const values = useContext(HubDetailContext)
  return values
}
