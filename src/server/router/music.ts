import * as express from 'express'
import { LED } from '../app'
const router = express.Router()

router.get('/', (req,res,next)=>{
    res.render('index', {reactFile : 'music'})
})
router.get('/get', (req,res,next)=>{
    LED.send('GetVolume', {source : "music"})
    .then(data=>{
        res.send(data.volume.toString())
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/set', (req,res,next)=>{
    const {volume} = req.body
    LED.send('SetVolume',{source : "music", volume : parseFloat(volume)})
    res.end()
})

export default router;