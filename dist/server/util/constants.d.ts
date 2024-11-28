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
export type TYPE_OF_SCENE = 'BRIDGE' | 'VIDEO';
export declare const SCENE_TYPE: {
    [key in TYPE_OF_SCENE]: TYPE_OF_SCENE;
};
export declare const NEXT_SCENE: {
    [key in TYPE_OF_SCENE]: string;
};
export declare const PATH: {
    [key in TYPE_OF_SCENE]: string;
};
export declare const INPUT_TYPE: {
    [key in TYPE_OF_SCENE]: string;
};
export declare const EDIT_POINTER: {
    NAME: string;
    PATH: string;
    TIME: number;
    TRACK: {
        '1': boolean;
        '2': boolean;
        '3': boolean;
        '4': boolean;
        '5': boolean;
        '6': boolean;
    };
};
