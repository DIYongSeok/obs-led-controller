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
            if (sceneName.includes('BRIDGE')) {
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
    BRIDGE: 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/231030 - 서울대 제도혁신위원회/디자인/출력/간지',
};
const SceneGenerator = async (OBS) => {
    const data = await OBS.call('GetSceneList');
    let scenes = data.scenes.map(val => val.sceneName);
    let deleteSceneList = scenes.filter(val => val.includes('BRIDGE'));
    for (let key of Object.keys(exports.PATH)) {
        for (let fileName of fs.readdirSync(exports.PATH[key])) {
            const sceneName = `[${key}] ${fileName.split('.')[0]}`;
            deleteSceneList = deleteSceneList.filter(val => val != sceneName);
            if (scenes.includes(sceneName))
                continue;
            await OBS.call('CreateScene', {
                sceneName: sceneName
            });
            scenes = [sceneName, ...scenes];
            await OBS.call('CreateInput', {
                sceneName: sceneName,
                inputName: fileName,
                inputKind: "image_source",
                inputSettings: {
                    "file": `${exports.PATH[key]}/${fileName}`,
                }
            });
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
