"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDIT_POINTER = exports.INPUT_TYPE = exports.PATH = exports.NEXT_SCENE = exports.SCENE_TYPE = exports.PORT = exports.PASSWORD = exports.ADDRESS = void 0;
exports.ADDRESS = {
    BROADCAST: 'ws://localhost:4444',
    LED: 'ws://localhost:5555',
};
exports.PASSWORD = {
    BROADCAST: 'snulive',
    LED: 'snulive',
};
exports.PORT = {
    SERVER: 80,
    WEBSOCKET: 8001,
    WEBPACK: 8080,
};
exports.SCENE_TYPE = {
    BRIDGE: 'BRIDGE',
    VIDEO: 'VIDEO',
};
exports.NEXT_SCENE = {
    BRIDGE: '카메라 화면 - 풀샷',
    VIDEO: '카메라 화면 - 풀샷',
};
exports.PATH = {
    BRIDGE: 'C:/Users/snuli/Desktop/SNULIVE/업무/2023/231030 - 서울대 제도혁신위원회/디자인/출력/간지',
    VIDEO: 'C:/Users/snuli/Desktop/SNULIVE/업무/2024/240531 - KOSSDA 공모전/편집/footages/intros/outputs',
};
exports.INPUT_TYPE = {
    BRIDGE: 'image_source',
    VIDEO: 'ffmpeg_source',
};
exports.EDIT_POINTER = {
    NAME: 'editPointer.wav',
    PATH: 'C:/Users/snuli/Desktop/SNULIVE/Footage/Sound Effects/MA_MotionAudio_MagicStardust_01.wav',
    TIME: 3000,
    TRACK: {
        '1': false,
        '2': false,
        '3': true,
        '4': false,
        '5': false,
        '6': false,
    },
};
