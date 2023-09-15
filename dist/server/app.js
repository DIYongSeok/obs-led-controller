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
(async function init() {
    try {
        await exports.LED.connect('ws://localhost:5555', "snulive");
        await exports.BROADCAST.connect('ws://localhost:4444', "snulive");
        exports.LED.on('CurrentProgramSceneChanged', async ({ sceneName }) => {
            if (sceneName.includes('BRIDGE') || sceneName.includes('LOOPING')) {
                await exports.BROADCAST.call('SetCurrentProgramScene', { sceneName });
            }
            else {
                await exports.BROADCAST.call('SetCurrentProgramScene', { sceneName: "카메라 화면 - 풀샷" });
            }
        });
    }
    catch (err) {
        console.error(err);
    }
})();
exports.BROADCAST = new obs_websocket_js_1.default();
exports.PATH = {
    BRIDGE: 'C:/Users/dydtj/Desktop/중계파일/230906 - 문화예술원/BRIDGE',
    LOOPING: 'C:/Users/dydtj/Desktop/중계파일/230906 - 문화예술원/LOOPING'
};
const SceneGenerator = async (OBS) => {
    const data = await OBS.call('GetSceneList');
    let scenes = data.scenes.map(val => val.sceneName);
    let deleteSceneList = scenes.filter(val => val.includes('BRIDGE') || val.includes('LOOPING'));
    for (let key of Object.keys(exports.PATH)) {
        for (let videoName of fs.readdirSync(exports.PATH[key])) {
            const sceneName = `[${key}] ${videoName.split('.')[0]}`;
            deleteSceneList = deleteSceneList.filter(val => val != sceneName);
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
                    "local_file": `${exports.PATH[key]}/${videoName}`,
                    "looping": key == 'LOOPING'
                }
            });
            if (key == 'LOOPING' && OBS == exports.BROADCAST) {
                await OBS.call('DuplicateSceneItem', {
                    sceneName: 'PIP',
                    destinationSceneName: sceneName,
                    sceneItemId: 1
                });
            }
            if (OBS == exports.LED) {
                await OBS.call('CreateSourceFilter', {
                    sourceName: videoName,
                    filterKind: "audio_monitor",
                    filterName: "Audio Monitor",
                    filterSettings: {
                        "deviceName": "스피커(Realtek(R) Audio)",
                        "device": "{0.0.0.00000000}.{23d43edf-c25a-4d6b-b3c9-7a5abcf7679d}"
                    }
                });
            }
        }
    }
    for (let deleteScene of deleteSceneList) {
        try {
            await OBS.call('RemoveScene', { sceneName: deleteScene });
            scenes = scenes.filter(val => val != deleteScene);
        }
        catch (err) { }
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
const ws_1 = require("ws");
const wsBroadcast = new ws_1.WebSocketServer({ port: 8001 });
wsBroadcast.on("connection", (ws, req) => {
    if (req.url.includes('broadcast')) {
        exports.BROADCAST.call('GetCurrentProgramScene').then(result => {
            setTimeout(() => {
                ws.send(result.currentProgramSceneName);
            }, 500);
        });
        exports.BROADCAST.on('CurrentProgramSceneChanged', ({ sceneName }) => {
            ws.send(sceneName);
        });
    }
    else {
        exports.LED.call('GetCurrentProgramScene').then(result => {
            setTimeout(() => {
                ws.send(result.currentProgramSceneName);
            }, 500);
        });
        exports.LED.on('CurrentProgramSceneChanged', ({ sceneName }) => {
            ws.send(sceneName);
        });
    }
});
