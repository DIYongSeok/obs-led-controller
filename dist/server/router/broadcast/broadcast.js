"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("../../app");
const code_1 = require("../../constant/code");
const edit_pointer_1 = require("../../constant/edit-pointer");
const path_1 = require("../../constant/modify/path");
const router = express.Router();
const nametag_1 = require("./nametag");
router.use('/nametag', nametag_1.default);
router.get('/', (req, res) => {
    res.render('index', { reactFile: 'broadcast' });
});
router.get('/get', async (req, res) => {
    try {
        const data = await app_1.BROADCAST.call('GetSceneList');
        res.send(data.scenes.map((val) => val.sceneName));
    }
    catch (err) {
        res
            .status(code_1.CODE.INTERNAL_SERVER_ERROR)
            .json('message : Failed to get scenes from OBS Broadcast.');
    }
});
router.post('/set', async (req, res) => {
    const { scene } = req.body;
    try {
        await app_1.BROADCAST.call('SetCurrentProgramScene', {
            sceneName: scene,
        });
    }
    catch (err) {
        res
            .status(code_1.CODE.INTERNAL_SERVER_ERROR)
            .json('message : Failed to set the scene.');
    }
});
router.get('/edit-point', async (req, res) => {
    try {
        const currentSceneData = await app_1.BROADCAST.call('GetCurrentProgramScene');
        const currentSceneName = currentSceneData.currentProgramSceneName;
        const editPointerSourceName = edit_pointer_1.EDIT_POINTER.NAME;
        const { sceneItemId } = await app_1.BROADCAST.call('CreateInput', {
            sceneName: currentSceneName,
            inputKind: 'ffmpeg_source',
            inputName: editPointerSourceName,
            inputSettings: {
                local_file: path_1.PATH.EDIT_POINTER,
            },
        });
        await app_1.BROADCAST.call('SetSceneItemIndex', {
            sceneName: currentSceneName,
            sceneItemId,
            sceneItemIndex: 0,
        });
        await app_1.BROADCAST.call('SetInputAudioTracks', {
            inputName: editPointerSourceName,
            inputAudioTracks: edit_pointer_1.EDIT_POINTER.RUNNING_TRACK,
        });
        await app_1.BROADCAST.call('SetCurrentProgramScene', {
            sceneName: currentSceneName,
        });
        await new Promise((resolve) => setTimeout(resolve, edit_pointer_1.EDIT_POINTER.RUNNING_TIME));
        await app_1.BROADCAST.call('RemoveInput', { inputName: editPointerSourceName });
        await app_1.BROADCAST.call('SetCurrentProgramScene', {
            sceneName: currentSceneName,
        });
        res.json({ message: 'Checking point completed successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(code_1.CODE.INTERNAL_SERVER_ERROR).send('Failed to check the point.');
    }
});
exports.default = router;
