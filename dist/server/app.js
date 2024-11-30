"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROADCAST = exports.LED = void 0;
const axios_1 = require("axios");
const express = require("express");
const nunjucks = require("nunjucks");
const obs_websocket_js_1 = require("obs-websocket-js");
const path = require("path");
const address_1 = require("./constant/address");
const name_1 = require("./constant/modify/name");
const port_1 = require("./constant/port");
const time_1 = require("./constant/time");
const types_1 = require("./constant/types");
const TARGET = process.env.npm_lifecycle_event;
const app = express();
exports.LED = new obs_websocket_js_1.default();
exports.BROADCAST = new obs_websocket_js_1.default();
(async function init() {
    try {
        await exports.BROADCAST.connect(address_1.ADDRESS.BROADCAST, address_1.PASSWORD.BROADCAST);
        exports.BROADCAST.on('ConnectionClosed', () => {
            const connectionInterval = setInterval(async () => {
                try {
                    await exports.BROADCAST.connect(address_1.ADDRESS.BROADCAST, address_1.PASSWORD.BROADCAST);
                    console.log('broadcast-connection success!');
                }
                catch (err) {
                    console.log('broadcast-connection failed');
                }
                finally {
                    clearInterval(connectionInterval);
                }
            }, time_1.TIME.TRY_CONNECTION_INTERVAL);
        });
    }
    catch (err) {
        console.log('obs-broadcast connection failed');
    }
    try {
        await exports.LED.connect(address_1.ADDRESS.LED, address_1.PASSWORD.LED);
        exports.LED.on('CurrentProgramSceneChanged', async ({ sceneName }) => {
            try {
                if (sceneName.includes(types_1.SCENE_TYPE.BRIDGE) ||
                    sceneName.includes(types_1.SCENE_TYPE.VIDEO)) {
                    await exports.BROADCAST.call('SetCurrentProgramScene', { sceneName });
                }
                else {
                    await exports.BROADCAST.call('SetCurrentProgramScene', {
                        sceneName: name_1.NAME.NEXT_SCENE.BRIDGE,
                    });
                }
            }
            catch (err) {
                console.error(err);
            }
        });
        exports.LED.on('ConnectionClosed', () => {
            const connectionInterval = setInterval(async () => {
                try {
                    await exports.LED.connect(address_1.ADDRESS.LED, address_1.PASSWORD.LED);
                    console.log('led-connection success!');
                }
                catch (err) {
                    console.log('led-connection failed');
                }
                finally {
                    clearInterval(connectionInterval);
                }
            }, time_1.TIME.TRY_CONNECTION_INTERVAL);
        });
    }
    catch (err) {
        console.log('obs-led connection failed');
    }
})();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'html');
nunjucks.configure('../client/html', {
    express: app,
    watch: true,
});
app.get('/js/:fileName', (req, res, next) => {
    if (TARGET == 'server' || TARGET == 'BackEnd') {
        axios_1.default
            .get(`http://localhost:${port_1.PORT.WEBPACK}/${req.params.fileName}`)
            .then(({ data }) => {
            res.send(data);
        });
    }
    else {
        res.sendFile(path.join(__dirname, `../client/js/${req.params.fileName}`));
    }
});
app.use('/css', (req, res, next) => {
    express.static('../client/css')(req, res, next);
});
app.use('/image', (req, res, next) => {
    express.static('../client/image')(req, res, next);
});
const broadcast_1 = require("./router/broadcast/broadcast");
const led_1 = require("./router/led");
const music_1 = require("./router/music");
app.use('/led', led_1.default);
app.use('/broadcast', broadcast_1.default);
app.use('/music', music_1.default);
app.listen(port_1.PORT.SERVER, () => { });
const ws_1 = require("ws");
const wsBroadcast = new ws_1.WebSocketServer({ port: port_1.PORT.WEBSOCKET });
wsBroadcast.on('connection', (ws, req) => {
    if (req.url.includes('broadcast')) {
        exports.BROADCAST.call('GetCurrentProgramScene').then((result) => {
            setTimeout(() => {
                ws.send(result.currentProgramSceneName);
            }, 500);
        });
        exports.BROADCAST.on('CurrentProgramSceneChanged', ({ sceneName }) => {
            ws.send(sceneName);
        });
    }
    else {
        exports.LED.call('GetCurrentProgramScene').then((result) => {
            setTimeout(() => {
                ws.send(result.currentProgramSceneName);
            }, 500);
        });
        exports.LED.on('CurrentProgramSceneChanged', ({ sceneName }) => {
            ws.send(sceneName);
        });
    }
});
