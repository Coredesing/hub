import { initReducer } from "../utils";
import { tiersActions } from "./constant";

const tiersReducer = (state, action) => {
    return initReducer(
        state,
        action,
        {
            loading: tiersActions.LOADING,
            success: tiersActions.SUCCESS,
            failure: tiersActions.FAILURE,
        })
};

export default tiersReducer;