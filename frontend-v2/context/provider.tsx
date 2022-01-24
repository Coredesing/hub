import AppContext from './index';
import tiersContext from './tiers';

const AppProvider = (props: any) => {
    const tiers = tiersContext();
    return (
        <AppContext.Provider value={{
            tiers
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppProvider;