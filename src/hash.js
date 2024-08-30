const {console, file} = iina;
const { hasher } = require('./hasher.js');

class AVHash {
    static #CHUNK_SIZE = 65536;
    static #SUPPORTED_AV_FILE_FORMATS = ["mp4", "avi", "mkv", "wmv", "mov", "mpg", "webm", "wav", "mp3"];

    hashFile(filePath) {
        try {
            let start, end, size;
            [start, end, size] = this.#getFileChunks(filePath);
            return hasher(start, end, size);
        } catch (e) {
            console.log(e);
        }
    }

    #getFileChunks(filePath) {
        try {
            if (!file.exists(filePath)) {
                throw new Error(`No such file: ${filePath}`);
            }
            const ext = this.#getFileExtension(filePath);
            if (!AVHash.#SUPPORTED_AV_FILE_FORMATS.includes(ext)) {
                throw new Error(`Unsupported file format: '${ext}'`);
            }
            const handler = file.handle(filePath, "read");
            const data_start = Array.from(handler.read(AVHash.#CHUNK_SIZE));
            handler.seekToEnd();
            const size = handler.offset();
            handler.seekTo(0);
            handler.seekTo(size - AVHash.#CHUNK_SIZE);
            const data_end = Array.from(handler.read(AVHash.#CHUNK_SIZE));
            handler.close();
            return [data_start, data_end, size];
        } catch (e) {
            console.error(`Error in GET CHUNKS: ${e} ${e.message}`);
            throw new Error(`Unable to get file chunks: ${e.message}`);
        }
    }

    #getFileExtension(filePath) {
        return filePath.split('.').pop();
    }
}

function getHash(filePath) {
    try {
        return new AVHash().hashFile(filePath);
    } catch (e) {
        console.log("[GET HASH METHOD, HASH.js] ERROR: " + e);
    }
}

module.exports = {
    getHash
};
// console.log(getHash("/Users/w1zard/Documents/Ozin.ai/nexus_backend/avhash/tests/samples/git_video1.mp4"));
