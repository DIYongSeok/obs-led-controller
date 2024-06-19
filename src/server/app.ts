import axios from 'axios';
import * as express from 'express';
import * as nunjucks from 'nunjucks'
import * as path from 'path'
import OBSWebSocket from 'obs-websocket-js';
import {ADDRESS, PASSWORD, PORT} from './util/constants'

export const BROADCAST = new OBSWebSocket();
(async function init(){
    try{
        await BROADCAST.connect(ADDRESS.BROADCASAT, PASSWORD.BROADCAST)
    }catch(err){console.error(err)}
    
})()

export const SceneGenerator = async (OBS : OBSWebSocket)=>{
    const data = await OBS.call('GetSceneList')
    let scenes = data.scenes.map(val=>val.sceneName) as string[]
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

import broadcast from './router/broadcast'
app.use('/broadcast', broadcast)
import music from './router/music'
app.use('/music', music)
app.listen(PORT.SERVER, () => {})



import {WebSocketServer} from 'ws'
const wsBroadcast = new WebSocketServer({port : PORT.WEBSOCKET})
wsBroadcast.on("connection", (ws, req)=>{
    BROADCAST.call('GetCurrentProgramScene').then(result=>{
        setTimeout(()=>{
            ws.send(result.currentProgramSceneName)
        },500)
    })
    BROADCAST.on('CurrentProgramSceneChanged',({sceneName})=>{
        ws.send(sceneName)
    })
})