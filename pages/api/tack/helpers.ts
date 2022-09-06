function removeFirstHash(rawTag: string) {
    const first = [...rawTag].findIndex((char) => char !== "#");
    return rawTag.slice(first);
}
export function sanitizeTag(rawTag: string) {
    return removeFirstHash(rawTag).toLowerCase();
}

const e = { sanitizeTag };
export default e;
