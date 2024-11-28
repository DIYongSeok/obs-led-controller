export const ADDRESS = {
  //websocket address
  BROADCAST: 'ws://localhost:4444',
  LED: 'ws://localhost:5555',
};
export const PASSWORD = {
  //password of OBS websocket
  BROADCAST: 'snulive',
  LED: 'snulive',
};

export const PORT = {
  //port number of every servers
  SERVER: 80,
  WEBSOCKET: 8001,
  WEBPACK: 8080,
};

export type TYPE_OF_SCENE = 'BRIDGE' | 'VIDEO';

export const SCENE_TYPE: { [key in TYPE_OF_SCENE]: TYPE_OF_SCENE } = {
  //type of scene that you want to show while broadcasting
  BRIDGE: 'BRIDGE',
  VIDEO: 'VIDEO',
};

export const NEXT_SCENE: { [key in TYPE_OF_SCENE]: string } = {
  //scene name that you want to show after showing bridge image or video
  BRIDGE: '카메라 화면 - 풀샷',
  VIDEO: '카메라 화면 - 풀샷',
};

export const PATH: { [key in TYPE_OF_SCENE]: string } = {
  //path of bridge image folder and video folder
  BRIDGE:
    'C:/Users/snuli/Desktop/SNULIVE/업무/2023/231030 - 서울대 제도혁신위원회/디자인/출력/간지', //route for bridge image
  VIDEO:
    'C:/Users/snuli/Desktop/SNULIVE/업무/2024/240531 - KOSSDA 공모전/편집/footages/intros/outputs', //route for bridge video
};

export const INPUT_TYPE: { [key in TYPE_OF_SCENE]: string } = {
  BRIDGE: 'image_source',
  VIDEO: 'ffmpeg_source',
};

export const EDIT_POINTER = {
  NAME: 'editPointer.wav',
  PATH: 'C:/Users/snuli/Desktop/SNULIVE/Footage/Sound Effects/MA_MotionAudio_MagicStardust_01.wav',
  TIME: 1000,
  TRACK: {
    '1': false,
    '2': false,
    '3': true,
    '4': false,
    '5': false,
    '6': false,
  },
};
