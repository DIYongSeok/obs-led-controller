import axios from 'axios';
import * as express from 'express';
import * as nunjucks from 'nunjucks'
import * as path from 'path'
import * as fs from 'fs'
import OBSWebSocket from 'obs-websocket-js';
import {ADDRESS, INPUT_TYPE, NEXT_SCENE, PASSWORD, PATH, PORT, SCENE_TYPE, TYPE_OF_SCENE} from './util/constants'

export const LED = new OBSWebSocket();
export const BROADCAST = new OBSWebSocket();
(async function init(){
    try{
        await LED.connect(ADDRESS.LED, PASSWORD.LED)
        await BROADCAST.connect(ADDRESS.BROADCAST, PASSWORD.BROADCAST)
        LED.on('CurrentProgramSceneChanged', async ({sceneName})=>{
            try{
                if (sceneName.includes(SCENE_TYPE.BRIDGE) || sceneName.includes(SCENE_TYPE.VIDEO)) {
                    await BROADCAST.call('SetCurrentProgramScene', {sceneName})
                }
                else{
                    await BROADCAST.call('SetCurrentProgramScene', {sceneName : NEXT_SCENE.BRIDGE}) // you can cutomize next scene
                }
            }catch(err){
                console.error(err)
            }
        })
    }catch(err){console.error(err)}
})()


export const SceneGenerator = async (OBS : OBSWebSocket)=>{
    const data = await OBS.call('GetSceneList')
    let scenes = data.scenes.map(val=>val.sceneName) as string[]
    let deleteSceneList = scenes.filter(val=>val.includes(SCENE_TYPE.BRIDGE))
    for(let key of Object.keys(PATH)){
        try{
            for(let fileName of fs.readdirSync(PATH[key])){
                const sceneName = `[${key}] ${fileName.split('.')[0]}`
                deleteSceneList = deleteSceneList.filter(val=>val != sceneName)
                if(scenes.includes(sceneName)) continue;
                await OBS.call('CreateScene', {
                    sceneName: sceneName
                })  
                scenes = [sceneName, ...scenes]
                await OBS.call('CreateInput', {
                    sceneName: sceneName,
                    inputName: fileName,
                    inputKind: INPUT_TYPE[key],
                    inputSettings: {
                        "file": `${PATH[key]}/${fileName}`,
                        "local_file": `${PATH[key]}/${fileName}`,
                    }
                })
                //BROADCAST needs creation of sound source 
            }
        }
        catch(err){
            console.error(err)
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
        axios.get(`http://localhost:${PORT.WEBPACK}/${req.params.fileName}`)
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

app.listen(PORT.SERVER, () => {})



import {WebSocketServer} from 'ws'
const wsBroadcast = new WebSocketServer({port : PORT.WEBSOCKET})
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