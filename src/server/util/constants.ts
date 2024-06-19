export const ADDRESS = {
    BROADCAST : 'ws://localhost:4444',
    LED : 'ws://localhost:5555'
}
export const PASSWORD = {
    BROADCAST : 'snulive',
    LED : 'snulive'
}

export const PORT = {
    SERVER : 80,
    WEBSOCKET : 8001,
    WEBPACK : 8080
}

export type TYPE_OF_SCENE = "BRIDGE" | "VIDEO"

export const SCENE_TYPE : {[key in TYPE_OF_SCENE] : TYPE_OF_SCENE} = {
    BRIDGE : 'BRIDGE',
    VIDEO : 'VIDEO'
}

export const NEXT_SCENE : {[key in TYPE_OF_SCENE] : string} = {
    BRIDGE : '카메라 화면 - 풀샷',
    VIDEO : '카메라 화면 - 풀샷'
}

export const PATH : {[key in TYPE_OF_SCENE] : string} = {
    BRIDGE : 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/230818 - Junction Asia/temp/브릿지영상', //route for bridge image
    VIDEO : 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/230818 - Junction Asia/temp/루핑영상' //route for bridge video
}

export const INPUT_TYPE : {[key in TYPE_OF_SCENE] : string} = {
    BRIDGE : 'image_source',
    VIDEO : 'ffmpeg_source'
}