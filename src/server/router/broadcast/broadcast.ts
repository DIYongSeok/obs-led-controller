import * as express from 'express';
import { BROADCAST } from '../../app';
import { CODE } from '../../constant/code';
import { EDIT_POINTER } from '../../constant/edit-pointer';
import { PATH } from '../../constant/modify/path';
const router = express.Router();

//routing
import nametag from './nametag';
router.use('/nametag', nametag);

router.get('/', (req, res) => {
  res.render('index', { reactFile: 'broadcast' });
});

router.get('/get', async (req, res) => {
  try {
    const data = await BROADCAST.call('GetSceneList');
    res.send(data.scenes.map((val) => val.sceneName) as string[]);
  } catch (err) {
    res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .json('message : Failed to get scenes from OBS Broadcast.');
  }
});

router.post('/set', async (req, res) => {
  const { scene } = req.body;
  try {
    await BROADCAST.call('SetCurrentProgramScene', {
      sceneName: scene,
    });
  } catch (err) {
    res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .json('message : Failed to set the scene.');
  }
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
        local_file: PATH.EDIT_POINTER, // 적절한 파일 경로 입력
      },
    });

    // editPointer.wav의 트랙을 3으로 설정
    await BROADCAST.call('SetInputAudioTracks', {
      inputName: editPointerSourceName,
      inputAudioTracks: EDIT_POINTER.RUNNING_TRACK,
    });

    // 현재 장면으로 화면 전환 (변경이 필요한 경우 호출)
    await BROADCAST.call('SetCurrentProgramScene', {
      sceneName: currentSceneName,
    });

    // 일정 시간 대기 (예: 3초 동안 실행)
    await new Promise((resolve) =>
      setTimeout(resolve, EDIT_POINTER.RUNNING_TIME),
    );

    // editPointer.wav 삭제
    await BROADCAST.call('RemoveInput', { inputName: editPointerSourceName });

    // 현재 장면으로 다시 화면 전환
    await BROADCAST.call('SetCurrentProgramScene', {
      sceneName: currentSceneName,
    });

    res.json({ message: 'Checking point completed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(CODE.INTERNAL_SERVER_ERROR).send('Failed to check the point.');
  }
});

export default router;
