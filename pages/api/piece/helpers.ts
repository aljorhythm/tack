export function sanitizeTag(rawTag: string) {
    const first = [...rawTag].findIndex((char) => char !== "#");
    return rawTag.slice(first);
}

const e = { sanitizeTag };
export default e;
