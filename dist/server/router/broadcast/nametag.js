"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const app_1 = require("../../app");
const code_1 = require("../../constant/code");
const name_1 = require("../../constant/modify/name");
const path_1 = require("../../constant/modify/path");
const router = express.Router();
router.get('/generate', async (req, res) => {
    try {
        const sceneItems = await app_1.BROADCAST.call('GetSceneItemList', {
            sceneName: name_1.NAME.NAMETAG.DUPLICATE_SCENE,
        });
        await app_1.BROADCAST.call('CreateScene', {
            sceneName: name_1.NAME.NAMETAG.NEW_SCENE,
        });
        for (const item of sceneItems.sceneItems) {
            await app_1.BROADCAST.call('DuplicateSceneItem', {
                sceneName: name_1.NAME.NAMETAG.DUPLICATE_SCENE,
                sceneItemId: item.sceneItemId,
                destinationSceneName: name_1.NAME.NAMETAG.NEW_SCENE,
            });
        }
        for (let fileName of fs.readdirSync(path_1.PATH.NAMETAG)) {
            await app_1.BROADCAST.call('CreateInput', {
                sceneName: name_1.NAME.NAMETAG.NEW_SCENE,
                inputName: fileName,
                inputKind: 'image_source',
                sceneItemEnabled: false,
                inputSettings: {
                    file: `${path_1.PATH.NAMETAG}/${fileName}`,
                    local_file: `${path_1.PATH.NAMETAG}/${fileName}`,
                },
            });
        }
        res.status(code_1.CODE.OK).json({ message: 'generating nametag success!' });
    }
    catch (err) {
        console.error(err);
        res
            .status(code_1.CODE.INTERNAL_SERVER_ERROR)
            .json({ message: 'generating nametag failed' });
    }
});
exports.default = router;
