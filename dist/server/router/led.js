"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("../app");
const router = express.Router();
let scenes = [];
app_1.LED.connect({ address: 'localhost:5555', password: "snulive" })
    .then(async () => {
    const data = await app_1.LED.send('GetSceneList');
    data.scenes.forEach(val => {
        scenes[val.name] = val.name;
    });
    scenes = data.scenes.map(val => val.name);
});
router.get('/get', (req, res, next) => {
    res.send(scenes);
});
router.post('/set', (req, res, next) => {
    const { scene } = req.body;
    app_1.LED.send('SetCurrentScene', {
        "scene-name": scene
    }).then(() => {
        res.send(true);
    }).catch(() => {
        res.status(404).send(false);
    });
});
exports.default = router;
