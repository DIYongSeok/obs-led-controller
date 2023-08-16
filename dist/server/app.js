"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneGenerator = exports.PATH = exports.BROADCAST = exports.LED = void 0;
const axios_1 = require("axios");
const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");
const obs_websocket_js_1 = require("obs-websocket-js");
exports.LED = new obs_websocket_js_1.default();
exports.BROADCAST = new obs_websocket_js_1.default();
exports.PATH = {
    BRIDGE: 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/230818 - Junction Asia/temp/브릿지영상'
};
const SceneGenerator = async (OBS) => {
    const data = await OBS.call('GetSceneList');
    let scenes = data.scenes.map(val => val.sceneName);
    for (let videoName of fs.readdirSync(exports.PATH.BRIDGE)) {
        const sceneName = `[브릿지영상] ${videoName.split('.')[0]}`;
        if (scenes.includes(sceneName))
            continue;
        await OBS.call('CreateScene', {
            sceneName: sceneName
        });
        scenes = [sceneName, ...scenes];
        await OBS.call('CreateInput', {
            sceneName: sceneName,
            inputName: videoName,
            inputKind: "ffmpeg_source",
            inputSettings: {
                "local_file": `${exports.PATH.BRIDGE}/${videoName}`
            }
        });
        if (OBS == exports.LED) {
            await OBS.call('CreateSourceFilter', {
                sourceName: videoName,
                filterKind: "audio_monitor",
                filterName: "Audio Monitor",
                filterSettings: {
                    "device": "{0.0.0.00000000}.{a8c5e1b3-78d5-4230-bee4-b9597f0013b1}",
                    "deviceName": "스피커(Realtek USB Audio)"
                }
            });
        }
    }
    return scenes;
};
exports.SceneGenerator = SceneGenerator;
const TARGET = process.env.npm_lifecycle_event;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'html');
nunjucks.configure('./dist/client/html', {
    express: app,
    watch: true
});
app.get('/js/:fileName', (req, res, next) => {
    if (TARGET == "server" || TARGET == "BackEnd") {
        axios_1.default.get(`http://localhost:8080/${req.params.fileName}`)
            .then(({ data }) => {
            res.send(data);
        });
    }
    else {
        res.sendFile(path.join(__dirname, `../client/js/${req.params.fileName}`));
    }
});
app.use('/css', (req, res, next) => {
    express.static('./dist/client/css')(req, res, next);
});
app.use('/image', (req, res, next) => {
    express.static('./dist/client/image')(req, res, next);
});
const led_1 = require("./router/led");
app.use('/led', led_1.default);
const broadcast_1 = require("./router/broadcast");
app.use('/broadcast', broadcast_1.default);
const music_1 = require("./router/music");
app.use('/music', music_1.default);
app.listen(80, () => { });
