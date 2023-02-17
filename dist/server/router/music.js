"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("../app");
const router = express.Router();
router.get('/', (req, res, next) => {
    res.render('index', { reactFile: 'music' });
});
router.get('/get', (req, res, next) => {
    app_1.LED.send('GetVolume', { source: "music" })
        .then(data => {
        res.send(data.volume.toString());
    })
        .catch(err => {
        console.log(err);
    });
});
router.post('/set', (req, res, next) => {
    const { volume } = req.body;
    app_1.LED.send('SetVolume', { source: "music", volume: parseFloat(volume) });
    res.end();
});
exports.default = router;
