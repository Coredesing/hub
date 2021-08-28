import useCountDownEngine from "./useCountDownEngine";

const useCountDownFreeBuyTime = (
  poolDetails: any,
) => {

  // console.log('[useCountDownEngine]: poolDetails: ', poolDetails?.freeBuyTimeSetting?.start_buy_time);
  const countdown = useCountDownEngine({
    name: 'countdown-free-buy-time',
    intervalTime: 1000,
    // endTime: 1626322173000, // Thursday, 15 July 2021 04:09:33
    endTime: (poolDetails?.freeBuyTimeSetting?.start_buy_time || 0) * 1000,
    triggerCondition: () => {
      return !!poolDetails?.freeBuyTimeSetting?.start_buy_time;
    },
    onFinish: (data: any) => {
      // console.log('[useCountDownEngine]: Countdown Finish. Reached Free Buy Time !!!');
      // console.log('[useCountDownEngine]: Page will reload in 1 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    },
    onEachInterval: (data: any) => {
      const {
        name,
        nowUnix,
        endTime
      } = data;
      // console.log('[useCountDownEngine]: ', name,  nowUnix, (nowUnix - endTime)/1000);
      // console.log('[useCountDownEngine]: onEachInterval');
    },
    onParamChange: (data: any) => {
      // console.log('[useCountDownEngine]:onParamChange');
    },
  });

  return {
    countdown,
  }
};

export default useCountDownFreeBuyTime;
