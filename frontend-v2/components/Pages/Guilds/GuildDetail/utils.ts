import { ObjectType } from '@/utils/types'
import { useContext, createContext } from 'react'

export type GuildDetailContextProps = {
  guildData: ObjectType | null;
}

export const GuildDetailContext = createContext<GuildDetailContextProps>({
  guildData: null
})

export const useGuildDetailContext = () => {
  const values = useContext(GuildDetailContext)
  return values
}
