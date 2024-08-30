const {utils, console} = iina;


const TEMP_DIR_NAME = ".cache/subtitle_nexus";
const {generateRandomFilename} = require('./commons.js');


function getHome() {
    const file = utils.resolvePath("@data/")
    return file.substring(0, file.indexOf("/", 8) + 1);
}

async function makeTempDir() {
    await deleteTempDir();
    const path = `${getHome()}${TEMP_DIR_NAME}`;
    const {status, stdout, stderr} = utils.exec("mkdir", ["-p", path]);
    return path;
}

async function deleteTempDir() {
    const path = `${getHome()}${TEMP_DIR_NAME}`;
    await utils.exec("rm", ["-r", path]);
}


async function unzipFile(filePath, zipFile) {
    const {status, stdout, stderr} = await utils.exec("unzip", [filePath + zipFile, "-d", filePath]);
    let l = stdout.toString();
    let a = l.split("\n")[2].split(":")[1]
    a = a.substring(0, a.length - 1);
    let i = a.lastIndexOf('/');
    let folder = a.substring(i + 3).trim();


    let b = l.split("\n")[4].split(":")[1];
    let j = b.lastIndexOf('/');
    let subtitleFile = b.substring(j + 3).trim();

    const path = `${getHome()}${TEMP_DIR_NAME}`;
    const ext = subtitleFile.substring(subtitleFile.lastIndexOf(".") + 1);

    let newSubFile = `${generateRandomFilename()}.${ext}`;
    console.log(`MV: ${path}/${folder}/${subtitleFile} ${path}/${folder}/../${newSubFile}`);
    console.log(`rm: ${path}/${folder}`);

    await utils.exec("rm", ["-r", filePath + zipFile]).then(async (_) => {
        await utils.exec("mv", [`${path}/${folder}/${subtitleFile}`,
            `${path}/${folder}/../${newSubFile}`]).then(async (_) => {
                await utils.exec("rm", ["-r", `${path}/${folder}`]);
            });
    });

    return newSubFile;
}

module.exports = {
    getHome, makeTempDir, deleteTempDir, unzipFile
}
