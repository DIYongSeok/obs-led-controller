"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const app_1 = require("../app");
const code_1 = require("../util/code");
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
router.get('/nametag-generate', async (req, res) => {
    try {
        const sceneItems = await app_1.BROADCAST.call('GetSceneItemList', {
            sceneName: constants_1.NAMETAG.DUPLICATE_SCENE_NAME,
        });
        await app_1.BROADCAST.call('CreateScene', {
            sceneName: constants_1.NAMETAG.NEW_SCENE_NAME,
        });
        for (const item of sceneItems.sceneItems) {
            await app_1.BROADCAST.call('DuplicateSceneItem', {
                sceneName: constants_1.NAMETAG.DUPLICATE_SCENE_NAME,
                sceneItemId: item.sceneItemId,
                destinationSceneName: constants_1.NAMETAG.NEW_SCENE_NAME,
            });
        }
        for (let fileName of fs.readdirSync(constants_1.NAMETAG.PATH)) {
            await app_1.BROADCAST.call('CreateInput', {
                sceneName: constants_1.NAMETAG.NEW_SCENE_NAME,
                inputName: fileName,
                inputKind: 'image_source',
                sceneItemEnabled: false,
                inputSettings: {
                    file: `${constants_1.NAMETAG.PATH}/${fileName}`,
                    local_file: `${constants_1.NAMETAG.PATH}/${fileName}`,
                },
            });
        }
        res.status(code_1.CODE.OK).send('generating nametag success!');
    }
    catch (err) {
        res.status(code_1.CODE.INTERNAL_SERVER_ERROR).send('generating nametag failed');
    }
});
exports.default = router;
