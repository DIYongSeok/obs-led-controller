import * as express from 'express';
import * as fs from 'fs';
import { BROADCAST } from '../../app';
import { CODE } from '../../constant/code';
import { NAME } from '../../constant/modify/name';
import { PATH } from '../../constant/modify/path';
const router = express.Router();

router.get('/generate', async (req, res) => {
  try {
    //#region Scene Copy
    // 1. 기존 장면의 아이템 가져오기
    const sceneItems = await BROADCAST.call('GetSceneItemList', {
      sceneName: NAME.NAMETAG.DUPLICATE_SCENE,
    });
    // 2. 새로운 장면 생성
    await BROADCAST.call('CreateScene', {
      sceneName: NAME.NAMETAG.NEW_SCENE,
    });

    // 3. 기존 장면의 아이템 복사
    for (const item of sceneItems.sceneItems) {
      await BROADCAST.call('DuplicateSceneItem', {
        sceneName: NAME.NAMETAG.DUPLICATE_SCENE as string,
        sceneItemId: item.sceneItemId as number,
        destinationSceneName: NAME.NAMETAG.NEW_SCENE,
      });
    }
    //#endregion

    //duplicate한 scene에 nametag이미지들 비활성화 한 채로 넣기
    for (let fileName of fs.readdirSync(PATH.NAMETAG)) {
      await BROADCAST.call('CreateInput', {
        sceneName: NAME.NAMETAG.NEW_SCENE,
        inputName: fileName,
        inputKind: 'image_source',
        sceneItemEnabled: false,
        inputSettings: {
          file: `${PATH.NAMETAG}/${fileName}`,
          local_file: `${PATH.NAMETAG}/${fileName}`,
        },
      });
    }
    res.status(CODE.OK).json({ message: 'generating nametag success!' });
  } catch (err) {
    console.error(err);
    res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .json({ message: 'generating nametag failed' });
  }
});

export default router;
