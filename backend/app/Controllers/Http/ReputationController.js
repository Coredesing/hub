'use strict'

const HelperUtils = use('App/Common/HelperUtils');
const ReputationService = use('App/Services/ReputationService')

class ReputationController {
    async indexStakeInfo({ request, params }) {
        try {
            const inputParams = request.only(['event', 'params', 'txHash']);
            console.log('[Webhook] - [Reputation] - [indexStakeInfo] - request Params: ', request.all(), params);

            const reputationLog = (new ReputationService).indexStakeInfo(inputParams.event, inputParams.params, inputParams.txHash);

            return HelperUtils.responseSuccess(reputationLog);
        } catch (e) {
            console.log('[Webhook] - [Reputation] - [indexStakeInfo] - Error: ', e);
            return false;
        }
    }
    async getReputationPoint({ request, params }) {
        try {
            const { walletAddress } = params
            const data = await (new ReputationService).getReputationPoint(walletAddress)

            return HelperUtils.responseSuccess(data);
        } catch (error) {
            return HelperUtils.responseErrorInternal('ERROR: Get reputation point fail !');
        }
    }
    async getReputationHistory({ request, params }) {
        try {
            const { walletAddress } = params
            const page = request.input('page') ? +request.input('page') : 1;
            const pageSize = request.input('limit') ? +request.input('limit') : 10;
            const hideZeroTx = request.input('hideZeroTx') ? request.input('hideZeroTx') : false;

            const data = await (new ReputationService).getReputationHistory({ walletAddress, page, pageSize, hideZeroTx })

            return HelperUtils.responseSuccess(data)
        } catch (error) {
            return HelperUtils.responseErrorInternal('ERROR: Get reputation history fail !');
        }
    }
}

module.exports = ReputationController;
