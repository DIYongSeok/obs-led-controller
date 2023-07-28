import * as express from 'express'
import { LED } from '../app'
const router = express.Router()

router.get('/', (req,res,next)=>{
    res.render('index', {reactFile : 'music'})
})
router.get('/get', async (req,res,next)=>{
    LED.call('GetInputList', {inputKind : "ffmpeg_source"})
    .then(async data=>{
        const result = await Promise.all(data.inputs.map(async (val)=>{
            const volume = (await LED.call('GetInputVolume', {inputName : val.inputName as string})).inputVolumeDb
            return {inputName : val.inputName, volume}
        }))
        res.send(result)
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/set', (req,res,next)=>{
    const {volume, inputName} = req.body
    LED.call('SetInputVolume',{inputName, inputVolumeDb : parseFloat(volume)})
    res.end()
})

export default router;