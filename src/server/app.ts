import axios from 'axios';
import * as express from 'express';
import * as nunjucks from 'nunjucks'
import * as path from 'path'
import * as fs from 'fs'
import OBSWebSocket from 'obs-websocket-js';

export const LED = new OBSWebSocket();
export const BROADCAST = new OBSWebSocket();
export const PATH = {
    BRIDGE : 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/230818 - Junction Asia/temp/브릿지영상',
    LOOPING : 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/230818 - Junction Asia/temp/루핑영상'
}
export const SceneGenerator = async (OBS : OBSWebSocket)=>{
    const data = await OBS.call('GetSceneList')
    let scenes = data.scenes.map(val=>val.sceneName) as string[]
    let deleteSceneList = scenes.filter(val=>val.includes('BRIDGE') || val.includes('LOOPING'))
    for(let key of Object.keys(PATH)){
        for(let videoName of fs.readdirSync(PATH[key])){
            const sceneName = `[${key}] ${videoName.split('.')[0]}`
            deleteSceneList = deleteSceneList.filter(val=>val != sceneName)
            if(scenes.includes(sceneName)) continue;
            await OBS.call('CreateScene', {
                sceneName: sceneName
            })
            scenes = [sceneName, ...scenes]
            await OBS.call('CreateInput', {
                sceneName: sceneName,
                inputName: videoName,
                inputKind: "ffmpeg_source",
                inputSettings: {
                    "local_file": `${PATH[key]}/${videoName}`,
                    "looping" : key=='LOOPING'
                }
            })
            if(OBS == LED){
                await OBS.call('CreateSourceFilter', {
                    sourceName: videoName,
                    filterKind: "audio_monitor",
                    filterName: "Audio Monitor",
                    filterSettings: {
                        "device": "{0.0.0.00000000}.{a8c5e1b3-78d5-4230-bee4-b9597f0013b1}",
                        "deviceName": "스피커(Realtek USB Audio)"
                    }
                })
            }
        }
    }

    for(let deleteScene of deleteSceneList){
        try{await OBS.call('RemoveScene', {sceneName : deleteScene}); scenes = scenes.filter(val=>val != deleteScene);}
        catch(err){}
    }
    return scenes
}
const TARGET = process.env.npm_lifecycle_event;
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.set('view engine', 'html');
nunjucks.configure('./dist/client/html', {
    express : app,
    watch : true
})

app.get('/js/:fileName', (req, res, next)=>{
    if(TARGET == "server" || TARGET == "BackEnd"){
        axios.get(`http://localhost:8080/${req.params.fileName}`)
        .then(({data})=>{
            res.send(data)
        })
    }else{
        res.sendFile(path.join(__dirname, `../client/js/${req.params.fileName}`))
    }
})

app.use('/css',(req,res,next)=>{
    express.static('./dist/client/css')(req,res,next)
});

app.use('/image',(req,res,next)=>{
    express.static('./dist/client/image')(req,res,next)
});

//LED control
import led from './router/led'
app.use('/led', led)
import broadcast from './router/broadcast'
app.use('/broadcast', broadcast)
import music from './router/music'
app.use('/music', music)

app.listen(80, () => {})



import {WebSocketServer} from 'ws'
const wsBroadcast = new WebSocketServer({port : 8001})
wsBroadcast.on("connection", (ws, req)=>{
    if(req.url.includes('broadcast')){
        BROADCAST.call('GetCurrentProgramScene').then(result=>{
            setTimeout(()=>{
                ws.send(result.currentProgramSceneName)
            },500)
        })
        BROADCAST.on('CurrentProgramSceneChanged',({sceneName})=>{
            ws.send(sceneName)
        })
    }
    else{
        LED.call('GetCurrentProgramScene').then(result=>{
            setTimeout(()=>{
                ws.send(result.currentProgramSceneName)
            },500)
        })
        LED.on('CurrentProgramSceneChanged',({sceneName})=>{
            ws.send(sceneName)
        })
    }
})