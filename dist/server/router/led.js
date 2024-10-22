"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const app_1 = require("../app");
router.get('/', (req, res, next) => {
    res.render('index', { reactFile: 'led' });
});
router.get('/get', async (req, res, next) => {
    res.send(await (0, app_1.SceneGenerator)(app_1.LED));
    (0, app_1.SceneGenerator)(app_1.BROADCAST);
});
router.post('/set', async (req, res, next) => {
    const { scene } = req.body;
    try {
        await app_1.LED.call('SetCurrentProgramScene', {
            "sceneName": scene
        });
        res.send(true);
    }
    catch (err) {
        res.status(404).send(false);
    }
});
exports.default = router;
