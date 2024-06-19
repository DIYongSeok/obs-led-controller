export declare const ADDRESS: {
    BROADCAST: string;
    LED: string;
};
export declare const PASSWORD: {
    BROADCAST: string;
    LED: string;
};
export declare const PORT: {
    SERVER: number;
    WEBSOCKET: number;
    WEBPACK: number;
};
type TYPE_OF_SCENE = "BRIDGE";
export declare const SCENE_TYPE: {
    [key in TYPE_OF_SCENE]: TYPE_OF_SCENE;
};
export declare const NEXT_SCENE: {
    [key in TYPE_OF_SCENE]: string;
};
export declare const PATH: {
    [key in TYPE_OF_SCENE]: string;
};
export {};
