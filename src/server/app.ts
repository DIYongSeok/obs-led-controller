import axios from 'axios';
import * as express from 'express';
import * as nunjucks from 'nunjucks'
import * as path from 'path'

import * as OBSWebSocket from 'obs-websocket-js'
export const LED = new OBSWebSocket()

const TARGET = process.env.npm_lifecycle_event;
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.set('view engine', 'html');
nunjucks.configure('./dist/client/html', {
    express : app,
    watch : true
})

app.get('/', (req, res, next)=>{
    res.render('index', {reactFile : 'controller'})
})

app.get('/js/:fileName', (req, res, next)=>{
    if(TARGET == "server"){
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
import music from './router/music'
app.use('/music', music)

app.listen(80, () => {})