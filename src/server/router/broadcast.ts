import * as express from 'express';
import { BROADCAST } from '../app';
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

export default router;
