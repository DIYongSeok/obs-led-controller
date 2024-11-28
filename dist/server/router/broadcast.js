"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("../app");
const router = express.Router();
router.get('/', (req, res, next) => {
    res.render('index', { reactFile: 'broadcast' });
});
router.get('/get', async (req, res, next) => {
    const data = await app_1.BROADCAST.call('GetSceneList');
    res.send(data.scenes.map((val) => val.sceneName));
});
router.post('/set', (req, res, next) => {
    const { scene } = req.body;
    app_1.BROADCAST.call('SetCurrentProgramScene', {
        sceneName: scene,
    })
        .then(() => {
        res.send(true);
    })
        .catch(() => {
        res.status(404).send(false);
    });
});
exports.default = router;
