import * as express from 'express';
import { BROADCAST, LED, SceneGenerator } from '../app';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { reactFile: 'led' });
});
router.get('/get', async (req, res, next) => {
  res.send(await SceneGenerator(LED));
  SceneGenerator(BROADCAST);
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
