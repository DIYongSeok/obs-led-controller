import OBSWebSocket from 'obs-websocket-js';
export declare const LED: OBSWebSocket;
export declare const BROADCAST: OBSWebSocket;
export declare const PATH: {
    BRIDGE: string;
    LOOPING: string;
};
export declare const SceneGenerator: (OBS: OBSWebSocket) => Promise<string[]>;
