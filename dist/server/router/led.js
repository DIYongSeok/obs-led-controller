"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const app_1 = require("../app");
let scenes = [];
app_1.LED.connect('ws://127.0.0.1:4444', "snulive");
router.get('/get', async (req, res, next) => {
    const data = await app_1.LED.call('GetSceneList');
    scenes = data.scenes.map(val => val.sceneName);
    res.send(scenes);
});
router.post('/set', (req, res, next) => {
    const { scene } = req.body;
    app_1.LED.call('SetCurrentProgramScene', {
        "sceneName": scene
    }).then(() => {
        res.send(true);
    }).catch(() => {
        res.status(404).send(false);
    });
});
exports.default = router;
