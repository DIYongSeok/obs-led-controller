import * as express from 'express';
import * as fs from 'fs';
import OBSWebSocket from 'obs-websocket-js';
import { BROADCAST, LED } from '../app';
import { INPUT_TYPE, PATH, SCENE_TYPE } from '../util/constants';
const router = express.Router();

export const SceneGenerator = async (OBS: OBSWebSocket) => {
  const data = await OBS.call('GetSceneList');
  let scenes = data.scenes.map((val) => val.sceneName) as string[];
  let deleteSceneList = scenes.filter((val) => val.includes(SCENE_TYPE.BRIDGE));
  for (let key of Object.keys(PATH)) {
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
      }
    } catch (err) {
      console.error(err);
    }
  }

  for (let deleteScene of deleteSceneList) {
    try {
      await OBS.call('RemoveScene', { sceneName: deleteScene });
      scenes = scenes.filter((val) => val != deleteScene);
    } catch (err) {}
  }
  return scenes;
};

router.get('/', (req, res, next) => {
  res.render('index', { reactFile: 'led' });
});
router.get('/get', async (req, res, next) => {
  try {
    res.send(await SceneGenerator(LED));
    SceneGenerator(BROADCAST);
  } catch (err) {
    res.status(404).send(false);
  }
});
router.post('/set', async (req, res, next) => {
  const { scene }: { scene: string } = req.body;
  try {
    await LED.call('SetCurrentProgramScene', {
      sceneName: scene,
    });
    res.send(true);
  } catch (err) {
    res.status(404).send(false);
  }
});

export default router;
