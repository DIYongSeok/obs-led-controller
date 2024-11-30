export type TYPE_OF_SCENE = 'BRIDGE' | 'VIDEO';

export const SCENE_TYPE: { [key in TYPE_OF_SCENE]: TYPE_OF_SCENE } = {
  //type of scene that you want to show while broadcasting
  BRIDGE: 'BRIDGE',
  VIDEO: 'VIDEO',
};

export const INPUT_TYPE: { [key in TYPE_OF_SCENE]: string } = {
  BRIDGE: 'image_source',
  VIDEO: 'ffmpeg_source',
};
