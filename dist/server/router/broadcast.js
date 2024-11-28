"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("../app");
const constants_1 = require("../util/constants");
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
router.get('/edit-point', async (req, res) => {
    try {
        const currentSceneData = await app_1.BROADCAST.call('GetCurrentProgramScene');
        const currentSceneName = currentSceneData.currentProgramSceneName;
        const editPointerSourceName = constants_1.EDIT_POINTER.NAME;
        await app_1.BROADCAST.call('CreateInput', {
            sceneName: currentSceneName,
            inputKind: 'ffmpeg_source',
            inputName: editPointerSourceName,
            inputSettings: {
                local_file: constants_1.EDIT_POINTER.PATH,
            },
        });
        await app_1.BROADCAST.call('SetInputAudioTracks', {
            inputName: editPointerSourceName,
            inputAudioTracks: constants_1.EDIT_POINTER.TRACK,
        });
        await app_1.BROADCAST.call('SetCurrentProgramScene', {
            sceneName: currentSceneName,
        });
        await new Promise((resolve) => setTimeout(resolve, constants_1.EDIT_POINTER.TIME));
        await app_1.BROADCAST.call('RemoveInput', { inputName: editPointerSourceName });
        await app_1.BROADCAST.call('SetCurrentProgramScene', {
            sceneName: currentSceneName,
        });
        res.send('Edit point completed successfully.');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Failed to edit point.');
    }
});
exports.default = router;
