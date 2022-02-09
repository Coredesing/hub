import { initReducer } from "../utils";
import { marketActivitiesActions } from "./constant";

const tiersReducer = (state, action) => {
    return initReducer(
        state,
        action,
        {
            loading: marketActivitiesActions.LOADING,
            success: marketActivitiesActions.SUCCESS,
            failure: marketActivitiesActions.FAILURE,
        })
};

export default tiersReducer;