export const isImageFile = (str: string) => (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(str);
export const isVideoFile = (str: string) => (/\.(mp4)$/i).test(str);

export const getDiffTime = (date1: number, date2: number) => {
    let difftime = date1 - date2;
    const days = Math.floor(difftime / 1000 / 60 / (60 * 24));
    difftime = difftime - days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(difftime / 1000 / 60 / 60);
    difftime = difftime - hours * 1000 * 60 * 60;
    const minutes = Math.floor(difftime / 1000 / 60);
    difftime = difftime - minutes * 1000 * 60;
    const seconds = Math.floor(difftime / 1000);
    return {
        days, hours, minutes, seconds,
    }
}


export const caclDiffTime = (time: { [k in string]: any }): { [k in string]: any } => {
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

export const formatHumanReadableTime = (timeInput: number, timeToCheck: number) => {
    if (timeInput >= timeToCheck) return 'a few seconds ago';
    const { days, hours, seconds, minutes } = getDiffTime(timeToCheck, timeInput);
    let str = '';
    if (days && days > 7) {
        return new Date(timeInput).toUTCString();
    }
    if (days) {
        str += `${days} day${days > 1 ? 's' : ''} `;
    } else {
        if (hours) {
            str += `${hours} hour${hours > 1 ? 's' : ''} `;
        }
        else if (minutes) {
            str += `${minutes} minute${minutes > 1 ? 's' : ''} `;
        }
        else if (seconds) {
            str += `${seconds} second${seconds > 1 ? 's' : ''} `;
        }
    }
    str += 'ago';
    return str;
}

export const debounce = (fn: Function, timer: number) => {
    let timeout: any;
    return function (args?: any) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(args);
        }, timer)
    }
}

export const formatNumber = (num: number, range: number = 2) => {
    const lengNum = String(num).length;
    if (lengNum < range) {
        const arr = new Array(range - lengNum).fill('0', 0, range - lengNum);
        return arr.join('') + num;
    }
    return num;
}

export const shortenAddress = (address: string, symbol: string = '*', lengHide = 14) => {
    let stars = '';
    for (let i = 0; i < 10; i++) {
      stars += symbol;
    }
    return address.slice(0, lengHide) + stars + address.slice(-(lengHide));
  }