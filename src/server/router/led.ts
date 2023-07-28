
import * as express from 'express'
const router = express.Router()
import { LED } from '../app'

let scenes : string[] = []
LED.connect('ws://127.0.0.1:4444', "snulive")

router.get('/get', async (req,res,next)=>{
    const data = await LED.call('GetSceneList')
    scenes = data.scenes.map(val=>val.sceneName) as string[]
    res.send(scenes)
})
router.post('/set', (req,res,next)=>{
    const {scene} = req.body
    LED.call('SetCurrentProgramScene',{
        "sceneName" : scene
    }).then(()=>{
        res.send(true)
    }).catch(()=>{
        res.status(404).send(false)
    })
})

export default router;