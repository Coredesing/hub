import AppContext from './index'
import marketActivitiesContext from './market-activities'
import tiersContext from './tiers'

const AppProvider = (props: any) => {
  const tiers = tiersContext()
  const marketActivities = marketActivitiesContext()
  return (
    <AppContext.Provider value={{
      tiers,
      marketActivities
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppProvider
