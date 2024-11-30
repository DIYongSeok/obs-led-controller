"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneGenerator = void 0;
const express = require("express");
const fs = require("fs");
const app_1 = require("../app");
const code_1 = require("../constant/code");
const name_1 = require("../constant/modify/name");
const path_1 = require("../constant/modify/path");
const types_1 = require("../constant/types");
const router = express.Router();
const sceneGenerator = async (OBS) => {
    const data = await OBS.call('GetSceneList');
    let scenes = data.scenes.map((val) => val.sceneName);
    let deleteSceneList = scenes.filter((val) => val.includes(types_1.SCENE_TYPE.BRIDGE));
    for (let key of Object.keys(types_1.SCENE_TYPE)) {
        try {
            for (let fileName of fs.readdirSync(path_1.PATH[key])) {
                const sceneName = `[${key}] ${fileName.split('.')[0]}`;
                deleteSceneList = deleteSceneList.filter((val) => val != sceneName);
                if (scenes.includes(sceneName))
                    continue;
                await OBS.call('CreateScene', {
                    sceneName: sceneName,
                });
                scenes = [sceneName, ...scenes];
                await OBS.call('CreateInput', {
                    sceneName: sceneName,
                    inputName: fileName,
                    inputKind: types_1.INPUT_TYPE[key],
                    inputSettings: {
                        file: `${path_1.PATH[key]}/${fileName}`,
                        local_file: `${path_1.PATH[key]}/${fileName}`,
                    },
                });
                if (OBS == app_1.BROADCAST) {
                    const { sceneItemId } = await OBS.call('GetSceneItemId', {
                        sourceName: name_1.NAME.AUDIO_SOURCE.ITEM,
                        sceneName: name_1.NAME.AUDIO_SOURCE.SCENE,
                    });
                    await OBS.call('DuplicateSceneItem', {
                        sceneItemId,
                        sceneName: name_1.NAME.AUDIO_SOURCE.SCENE,
                        destinationSceneName: sceneName,
                    });
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    for (let deleteScene of deleteSceneList) {
        try {
            await OBS.call('RemoveScene', { sceneName: deleteScene });
            scenes = scenes.filter((val) => val != deleteScene);
        }
        catch (err) {
            console.error(err);
        }
    }
    return scenes;
};
exports.sceneGenerator = sceneGenerator;
router.get('/', (req, res, next) => {
    res.render('index', { reactFile: 'led' });
});
router.get('/get', async (req, res, next) => {
    try {
        res.send(await (0, exports.sceneGenerator)(app_1.LED));
        try {
            await (0, exports.sceneGenerator)(app_1.BROADCAST);
        }
        catch (err) {
            console.error(err);
        }
    }
    catch (err) {
        console.error(err);
        res
            .status(code_1.CODE.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to get scenes of LED' });
    }
});
router.post('/set', async (req, res, next) => {
    const { scene } = req.body;
    try {
        await app_1.LED.call('SetCurrentProgramScene', {
            sceneName: scene,
        });
        res.json({ message: 'Successfully set the scene' });
    }
    catch (err) {
        console.error(err);
        res
            .status(code_1.CODE.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to set the scene of LED' });
    }
});
exports.default = router;
