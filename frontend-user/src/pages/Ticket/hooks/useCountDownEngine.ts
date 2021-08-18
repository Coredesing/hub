import {useCallback, useEffect} from 'react';
import moment from "moment";

const useCountDownEngine = (inputParams: any) => {
  const {
    name = 'count-down-engine',
    intervalTime = 1000, // miliseconds
    endTime = 0,    // Miliseconds - Unix Time. Eg: 1626348310000
    triggerCondition = () => true, // Function. Default is auto active/run
    onFinish = () => {}, // Function
    onEachInterval = () => {}, // Function
    onParamChange = () => {},  // Function
  } = inputParams;

  const onFinishCountDown = useCallback((params = {}) => {
    onFinish && onFinish(params);
  }, [endTime, onFinish]);

  const onEachIntervalCountDown = useCallback((params = {}) => {
    onEachInterval && onEachInterval(params);
  }, []);

  const onParamChangeCountDown = useCallback((params = {}) => {
    onParamChange && onParamChange(params);
  }, [inputParams]);

  const nowTime = (moment().unix() * 1000);

  useEffect(() => {
    let clockInterval: any = undefined;
    const clearIntervalResources = () => {
      clockInterval && clearInterval(clockInterval);
    };

    if (triggerCondition()) {
      if (endTime && nowTime < endTime) {
        clockInterval = setInterval(() => {
          const now = moment();
          const nowUnix = now.unix() * 1000;
          const params = {
            nowUnix,
            name,
            intervalTime,
            endTime,
            triggerCondition,
            onFinish,
            onEachInterval,
            onParamChange,
          };

          if (nowUnix >= endTime) {
            onFinishCountDown(params);
            clearIntervalResources();
            return;
          }
          onEachIntervalCountDown(params);
        }, intervalTime);
      }
    }

    return () => {
      clearIntervalResources();
    }
  }, [intervalTime, endTime, triggerCondition]);

  return {
    nowTime,
    onFinishCountDown,
    onEachIntervalCountDown,
    onParamChangeCountDown,
  }
};

export default useCountDownEngine;
