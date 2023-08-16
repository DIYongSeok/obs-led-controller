import * as express from 'express'
const router = express.Router()
import { BROADCAST, LED, SceneGenerator } from '../app'

BROADCAST.connect('ws://127.0.0.1:4444', "snulive")

router.get('/', (req, res, next)=>{
    res.render('index', {reactFile : 'broadcast'})
})
router.get('/get', async (req,res,next)=>{
    res.send(await SceneGenerator(BROADCAST))
    SceneGenerator(LED)
})
router.post('/set', (req,res,next)=>{
    const {scene} = req.body
    BROADCAST.call('SetCurrentProgramScene',{
        "sceneName" : scene
    }).then(()=>{
        res.send(true)
    }).catch(()=>{
        res.status(404).send(false)
    })
})

export default router;