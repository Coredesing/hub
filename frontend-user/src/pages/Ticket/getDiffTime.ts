
export const caclDiffTime = (time: {[k in string]: any}): {[k in string]: any} => {
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