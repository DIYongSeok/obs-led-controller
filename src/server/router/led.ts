import * as express from 'express';
import * as fs from 'fs';
import OBSWebSocket from 'obs-websocket-js';
import { BROADCAST, LED } from '../app';
import { CODE } from '../constant/code';
import { NAME } from '../constant/modify/name';
import { PATH } from '../constant/modify/path';
import { INPUT_TYPE, SCENE_TYPE } from '../constant/types';
const router = express.Router();

export const sceneGenerator = async (OBS: OBSWebSocket) => {
  const data = await OBS.call('GetSceneList');
  let scenes = data.scenes.map((val) => val.sceneName) as string[];
  let deleteSceneList = scenes.filter((val) => val.includes(SCENE_TYPE.BRIDGE));
  for (let key of Object.keys(SCENE_TYPE)) {
    try {
      for (let fileName of fs.readdirSync(PATH[key])) {
        const sceneName = `[${key}] ${fileName.split('.')[0]}`;
        deleteSceneList = deleteSceneList.filter((val) => val != sceneName);
        if (scenes.includes(sceneName)) continue;
        await OBS.call('CreateScene', {
          sceneName: sceneName,
        });
        scenes = [sceneName, ...scenes];
        await OBS.call('CreateInput', {
          sceneName: sceneName,
          inputName: fileName,
          inputKind: INPUT_TYPE[key],
          inputSettings: {
            file: `${PATH[key]}/${fileName}`,
            local_file: `${PATH[key]}/${fileName}`,
          },
        });

        //BROADCAST needs creation of sound source
        if (OBS == BROADCAST) {
          const { sceneItemId } = await OBS.call('GetSceneItemId', {
            sourceName: NAME.AUDIO_SOURCE.ITEM,
            sceneName: NAME.AUDIO_SOURCE.SCENE,
          });
          await OBS.call('DuplicateSceneItem', {
            sceneItemId,
            sceneName: NAME.AUDIO_SOURCE.SCENE,
            destinationSceneName: sceneName,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  for (let deleteScene of deleteSceneList) {
    try {
      await OBS.call('RemoveScene', { sceneName: deleteScene });
      scenes = scenes.filter((val) => val != deleteScene);
    } catch (err) {
      console.error(err);
    }
  }

  return scenes;
};

router.get('/', (req, res, next) => {
  res.render('index', { reactFile: 'led' });
});

router.get('/get', async (req, res, next) => {
  try {
    res.send(await sceneGenerator(LED));
    try {
      await sceneGenerator(BROADCAST);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
    res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to get scenes of LED' });
  }
});

router.post('/set', async (req, res, next) => {
  const { scene }: { scene: string } = req.body;
  try {
    await LED.call('SetCurrentProgramScene', {
      sceneName: scene,
    });
    res.json({ message: 'Successfully set the scene' });
  } catch (err) {
    console.error(err);
    res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to set the scene of LED' });
  }
});

export default router;
