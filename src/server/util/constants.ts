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

type TYPE_OF_SCENE = "BRIDGE"

export const SCENE_TYPE : {[key in TYPE_OF_SCENE] : TYPE_OF_SCENE} = {
    BRIDGE : 'BRIDGE'
}

export const NEXT_SCENE : {[key in TYPE_OF_SCENE] : string} = {
    BRIDGE : '카메라 화면 - 풀샷'
}

export const PATH : {[key in TYPE_OF_SCENE] : string} = {
    BRIDGE : 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/231030 - 서울대 제도혁신위원회/디자인/출력/간지',
}