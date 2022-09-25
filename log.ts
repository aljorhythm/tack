export const log = console.log;
export const logError = console.error;

export function maskEveryFour(str: string) {
    let ret = "";
    for (let i = 0; i < str.length; i++) {
        if (i % 8 >= 4) {
            ret += "x";
        } else {
            ret += str.at(i);
        }
    }
    return ret;
}

export default log;
