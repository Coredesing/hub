import { CountDownTimeType } from "./types";

export const caclDiffTime = (time: CountDownTimeType): CountDownTimeType => {
    if (time.seconds === 0) {
        time.seconds = 59;
        if (time.minutes === 0) {
            time.minutes = 59;
            if (time.hours === 0) {
                if (time.days > 0) {
                    time.days -= 1;
                    time.hours = 23;
                }
            } else {
                time.hours -= 1;
            }
        } else {
            time.minutes -= 1;
        }
    } else {
        time.seconds -= 1;
    }

    return time;
}