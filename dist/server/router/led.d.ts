import OBSWebSocket from 'obs-websocket-js';
declare const router: import("express-serve-static-core").Router;
export declare const sceneGenerator: (OBS: OBSWebSocket) => Promise<string[]>;
export default router;
