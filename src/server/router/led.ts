
import * as express from 'express'
import { LED } from '../app'
const router = express.Router()

let scenes : string[] = []
LED.connect({address: 'localhost:5555', password: "snulive"})
.then(async ()=>{
    const data = await LED.send('GetSceneList')
    data.scenes.forEach(val=>{
        scenes[val.name] = val.name
    })
    scenes = data.scenes.map(val=>val.name)
    // LED.on('MediaEnded', ()=>{
    //     LED.send('SetCurrentScene',{"scene-name" : scenes[0]})
    // })
})

router.get('/get', (req,res,next)=>{
    res.send(scenes)
})
router.post('/set', (req,res,next)=>{
    const {scene} = req.body
    LED.send('SetCurrentScene',{
        "scene-name" : scene
    }).then(()=>{
        res.send(true)
    }).catch(()=>{
        res.status(404).send(false)
    })
})

export default router;