"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INPUT_TYPE = exports.PATH = exports.NEXT_SCENE = exports.SCENE_TYPE = exports.PORT = exports.PASSWORD = exports.ADDRESS = void 0;
exports.ADDRESS = {
    BROADCAST: 'ws://localhost:4444',
    LED: 'ws://localhost:5555'
};
exports.PASSWORD = {
    BROADCAST: 'snulive',
    LED: 'snulive'
};
exports.PORT = {
    SERVER: 80,
    WEBSOCKET: 8001,
    WEBPACK: 8080
};
exports.SCENE_TYPE = {
    BRIDGE: 'BRIDGE',
    VIDEO: 'VIDEO'
};
exports.NEXT_SCENE = {
    BRIDGE: '카메라 화면 - 풀샷',
    VIDEO: '카메라 화면 - 풀샷'
};
exports.PATH = {
    BRIDGE: 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/230818 - Junction Asia/temp/브릿지영상',
    VIDEO: 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/230818 - Junction Asia/temp/루핑영상'
};
exports.INPUT_TYPE = {
    BRIDGE: 'image_source',
    VIDEO: 'ffmpeg_source'
};
