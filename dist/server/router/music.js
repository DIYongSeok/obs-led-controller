"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("../app");
const router = express.Router();
router.get('/', (req, res, next) => {
    res.render('index', { reactFile: 'music' });
});
router.get('/get', async (req, res, next) => {
    app_1.BROADCAST.call('GetInputList', { inputKind: "ffmpeg_source" })
        .then(async (data) => {
        const result = await Promise.all(data.inputs.map(async (val) => {
            const volume = (await app_1.BROADCAST.call('GetInputVolume', { inputName: val.inputName })).inputVolumeDb;
            return { inputName: val.inputName, volume };
        }));
        res.send(result);
    })
        .catch(err => {
        console.log(err);
    });
});
router.post('/set', (req, res, next) => {
    const { volume, inputName } = req.body;
    app_1.BROADCAST.call('SetInputVolume', { inputName, inputVolumeDb: parseFloat(volume) });
    res.end();
});
exports.default = router;
