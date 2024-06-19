"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneGenerator = exports.BROADCAST = exports.LED = void 0;
const axios_1 = require("axios");
const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");
const obs_websocket_js_1 = require("obs-websocket-js");
const constants_1 = require("./util/constants");
exports.LED = new obs_websocket_js_1.default();
exports.BROADCAST = new obs_websocket_js_1.default();
(async function init() {
    try {
        await exports.LED.connect(constants_1.ADDRESS.LED, constants_1.PASSWORD.LED);
        await exports.BROADCAST.connect(constants_1.ADDRESS.BROADCAST, constants_1.PASSWORD.BROADCAST);
        exports.LED.on('CurrentProgramSceneChanged', async ({ sceneName }) => {
            try {
                if (sceneName.includes(constants_1.SCENE_TYPE.BRIDGE) || sceneName.includes(constants_1.SCENE_TYPE.VIDEO)) {
                    await exports.BROADCAST.call('SetCurrentProgramScene', { sceneName });
                }
                else {
                    await exports.BROADCAST.call('SetCurrentProgramScene', { sceneName: constants_1.NEXT_SCENE.BRIDGE });
                }
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    catch (err) {
        console.error(err);
    }
})();
const SceneGenerator = async (OBS) => {
    const data = await OBS.call('GetSceneList');
    let scenes = data.scenes.map(val => val.sceneName);
    let deleteSceneList = scenes.filter(val => val.includes(constants_1.SCENE_TYPE.BRIDGE));
    for (let key of Object.keys(constants_1.PATH)) {
        try {
            for (let fileName of fs.readdirSync(constants_1.PATH[key])) {
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
                    inputKind: constants_1.INPUT_TYPE[key],
                    inputSettings: {
                        "file": `${constants_1.PATH[key]}/${fileName}`,
                        "local_file": `${constants_1.PATH[key]}/${fileName}`,
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
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
        axios_1.default.get(`http://localhost:${constants_1.PORT.WEBPACK}/${req.params.fileName}`)
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
app.listen(constants_1.PORT.SERVER, () => { });
const ws_1 = require("ws");
const wsBroadcast = new ws_1.WebSocketServer({ port: constants_1.PORT.WEBSOCKET });
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
