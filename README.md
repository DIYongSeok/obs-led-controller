## Introduction
- This project is designed to control two OBS programs simultaneously for a broadcasting system. Especially, One OBS program is for YouTube streaming and the other is for offline led prompt.
- If you want to control only one OBS program, check out the obs-controller branch in this project, which is for controlling a single OBS program.

    ![video](https://github.com/DIYongSeok/obs-led-controller/assets/146920174/14d37f38-caa7-4fc0-b517-42b3cd1c4f6b)

## Requirements
- Node.js
    - [Window Download](https://nodejs.org/en)
    - Linux Download

        ```
        brew install node
        ```
- TypeScript

    ```
    npm install -g typescript
    ```
- Webpack

    ```
    npm install -g webpack webpack-cli
    ```

## To Start
1. Download [OBS](https://obsproject.com/)

2. Open obs and [Portable OBS](https://youtu.be/zxM-TpOmdfc)

3. Set the OBS websocket port to 4444 and the portable OBS websocket port to 5555

4. Download this project
    ```
    git clone https://github.com/DIYongSeok/obs-led-controller.git
    cd obs-led-controller/
    npm install
    ```

5. Open this project and adjust the variables in a file (/src/server/util/constants.ts).

6. Launch the project
    ```
    npm run build
    npm start
    ```

## Reference
- [OBS WEBSOCKET](https://github.com/obsproject/obs-websocket)