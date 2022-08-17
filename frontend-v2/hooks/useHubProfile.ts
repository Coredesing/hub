import { useHubContext } from '@/context/hubProvider'

const useHubProfile = () => {
  const { accountHub } = useHubContext()

  return {
    accountHub
  }
}

export default useHubProfile
