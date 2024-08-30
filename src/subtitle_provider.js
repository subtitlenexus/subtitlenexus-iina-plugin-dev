const {console, subtitle, core, preferences, http, file, utils} = iina;
const {getHash} = require('./hash.js');
const {getSearchEndpoint, getDownloadEndpoint, getHeader} = require("./constant.js");
const {makeTempDir, deleteTempDir, unzipFile} = require("./unzip.js");
const {generateRandomFilename} = require('./commons.js');

function register() {
    console.log("Registering Nexus Subtitle Provider");
    subtitle.registerProvider("subtitlenexus-iina-plugin", {
        search: async () => {
            let filePath = getFilePath(core.status.url);
            return search(filePath);
        },
        description: (item) => {
            item = item.data;
            return {
                name: item.title,
                left: `${item.language}`,
                right: "",
            }
        },
        download: async (item) => {
            return downloadSubtitle(item.data.id, item.data.data);
        },
    });
    console.log("Nexus Subtitle Provider Register");
}

async function search(filePath) {
    try {
        core.osd("Searching Subtitle...");
        const hash = getHash(filePath);
        const apiKey = preferences.get('local-api-key');
        console.log(getSearchEndpoint());
        const searchResponse = await http.get(getSearchEndpoint(), {
            headers: {
                "X-API-KEY": apiKey
            },
            params: {"file_hash": hash}
        }
        );
        const subtitleIds = JSON.parse(searchResponse.text).subtitle_ids;
        console.log(subtitleIds);
        let results = []
        let data = subtitleIds[0].split(":")
        let id = data[1]
        let language = data[3]
        results.push(
            {
                id: id,
                title: "Sample Title",
                language: language,
                data: subtitleIds[0]
            }
        );
        return results.map((x) => subtitle.item(x));
    } catch (e) {
        console.log("[SEARCH METHOD] ERROR : " + e.message);
    }
}

async function downloadSubtitle(id, subtitleId) {
    const apiKey = preferences.get('local-api-key');
    const downloadResponse = await http.get(getDownloadEndpoint(), {
        headers: {
            "X-API-KEY": apiKey
        },
        params: {
            "subtitle_id": subtitleId,
        }
    }
    );
    const link = JSON.parse(downloadResponse.text);
    const tempDir = await makeTempDir();
    const zipFile = generateRandomFilename() + ".zip";
    await http.download(link.download_link, tempDir + "/" + zipFile);
    const subtitleFile = await unzipFile(tempDir + "/", zipFile);
    return [`${tempDir}/${subtitleFile}`];
}


function getFilePath(file_url) {
    return file_url.substring(7);
}

module.exports = {
    register,
};
