function hasher(start, end, size) {
    try {
        let lo = size;
        const MAX_SIZE = 4294967296;
        let hi = 0;
        const hashData = start.concat(end);
        for (let i = 0; i < hashData.length; i += 8) {
            const [a, b, c, d, e, f, g, h] = Array.from({length: 8}, (_, j) => hashData[i + j] !== undefined ? hashData[i + j] : 0);
            lo += a + b * 256 + c * 65536 + d * 16777216;
            hi += e + f * 256 + g * 65536 + h * 16777216;

            if (lo > MAX_SIZE) {
                const overflow = Math.floor(lo / MAX_SIZE);
                lo -= overflow * MAX_SIZE;
                hi += overflow;
            }

            if (hi > MAX_SIZE) {
                const overflow = Math.floor(hi / MAX_SIZE);
                hi -= overflow * MAX_SIZE;
            }
        }
        return `${hi.toString(16).padStart(8, '0')}${lo.toString(16).padStart(8, '0')}`;
    } catch (e) {
        throw new Error(`Unable to hash the file ${e.message}`, e);
    }
}

module.exports = {
    hasher
}