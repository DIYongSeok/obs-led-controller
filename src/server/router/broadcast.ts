import * as express from 'express';
import * as fs from 'fs';
import { BROADCAST } from '../app';
import { CODE } from '../util/code';
import { EDIT_POINTER, NAMETAG } from '../util/constants';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { reactFile: 'broadcast' });
});

router.get('/get', async (req, res, next) => {
  const data = await BROADCAST.call('GetSceneList');
  res.send(data.scenes.map((val) => val.sceneName) as string[]);
});

router.post('/set', (req, res, next) => {
  const { scene } = req.body;
  BROADCAST.call('SetCurrentProgramScene', {
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
    // 현재 장면 정보 가져오기
    const currentSceneData = await BROADCAST.call('GetCurrentProgramScene');
    const currentSceneName = currentSceneData.currentProgramSceneName;

    // editPointer.wav를 현재 장면에 추가
    const editPointerSourceName = EDIT_POINTER.NAME;
    await BROADCAST.call('CreateInput', {
      sceneName: currentSceneName,
      inputKind: 'ffmpeg_source', // ffmpeg_source는 미디어 파일에 사용
      inputName: editPointerSourceName,
      inputSettings: {
        local_file: EDIT_POINTER.PATH, // 적절한 파일 경로 입력
      },
    });

    // editPointer.wav의 트랙을 3으로 설정
    await BROADCAST.call('SetInputAudioTracks', {
      inputName: editPointerSourceName,
      inputAudioTracks: EDIT_POINTER.TRACK,
    });

    // 현재 장면으로 화면 전환 (변경이 필요한 경우 호출)
    await BROADCAST.call('SetCurrentProgramScene', {
      sceneName: currentSceneName,
    });

    // 일정 시간 대기 (예: 3초 동안 실행)
    await new Promise((resolve) => setTimeout(resolve, EDIT_POINTER.TIME));

    // editPointer.wav 삭제
    await BROADCAST.call('RemoveInput', { inputName: editPointerSourceName });

    // 현재 장면으로 다시 화면 전환
    await BROADCAST.call('SetCurrentProgramScene', {
      sceneName: currentSceneName,
    });

    res.send('Edit point completed successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to edit point.');
  }
});

router.get('/nametag-generate', async (req, res) => {
  try {
    //#region Scene Copy
    // 1. 기존 장면의 아이템 가져오기
    const sceneItems = await BROADCAST.call('GetSceneItemList', {
      sceneName: NAMETAG.DUPLICATE_SCENE_NAME,
    });
    // 2. 새로운 장면 생성
    await BROADCAST.call('CreateScene', {
      sceneName: NAMETAG.NEW_SCENE_NAME,
    });

    // 3. 기존 장면의 아이템 복사
    for (const item of sceneItems.sceneItems) {
      await BROADCAST.call('DuplicateSceneItem', {
        sceneName: NAMETAG.DUPLICATE_SCENE_NAME as string,
        sceneItemId: item.sceneItemId as number,
        destinationSceneName: NAMETAG.NEW_SCENE_NAME,
      });
    }
    //#endregion

    //duplicate한 scene에 nametag이미지들 비활성화 한 채로 넣기
    for (let fileName of fs.readdirSync(NAMETAG.PATH)) {
      await BROADCAST.call('CreateInput', {
        sceneName: NAMETAG.NEW_SCENE_NAME,
        inputName: fileName,
        inputKind: 'image_source',
        sceneItemEnabled: false,
        inputSettings: {
          file: `${NAMETAG.PATH}/${fileName}`,
          local_file: `${NAMETAG.PATH}/${fileName}`,
        },
      });
      //BROADCAST needs creation of sound source
    }
    res.status(CODE.OK).send('generating nametag success!');
  } catch (err) {
    res.status(CODE.INTERNAL_SERVER_ERROR).send('generating nametag failed');
  }
});

export default router;
