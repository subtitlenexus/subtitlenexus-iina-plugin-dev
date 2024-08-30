const {register} = require("./subtitle_provider.js");
const {console, event, file, utils} = iina;
const {getHome, deleteTempDir} = require('./unzip.js');

event.on("iina.window-will-close", async () => {
    await deleteTempDir();
});

register();
