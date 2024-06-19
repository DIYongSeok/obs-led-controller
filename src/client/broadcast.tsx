import ReactDOM from 'react-dom';
import styled from 'styled-components';
import React, { useLayoutEffect, useRef, useState } from 'react';
import axios from 'axios';
import {color} from './Util/Define'
import StyledButton from './Util/Input/Button';
import { Modal, useModal } from './Util/Modal';
import { Title } from './Util/TextStyle';
import Music from './music';
import {PORT} from '../server/util/constants'

const StyledBg = styled.div`
    background-color: ${color.box};
    min-height: 100vh;
`
const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 100px 100px;
`
const ws = new WebSocket(`ws://${window.location.host}:${PORT.WEBSOCKET}/broadcast`)
function Controller(){
    const [scenes, setScenes] = useState<string[]>([]);
    const [curScene, setCurScene] = useState<string>('')
    useLayoutEffect(()=>{
        axios.get(`/broadcast/get`).then(({data})=>{
            setScenes(data)
            ws.onmessage = (event)=>{
                setCurScene(event.data)
            }
        })
    },[])
    

    const onClickHandler = (scene)=>{
        // if(!confirm('장면을 변경하시겠습니까?')) return;
        axios.post('/broadcast/set', {scene})
        .then(({data})=>{
            if(data){
            }
        })
    }
    const {content, modalHandler} = useModal();
    return(
        <StyledBg>
            <Modal content={content} color={color.box} onClick={modalHandler}/>
            <StyledDiv>
                <Title style={{marginBottom : "30px"}}>현재화면 : {curScene}</Title>
                {scenes.map(scene=><StyledButton onClick={(e)=>{onClickHandler(scene)}} style={{margin : "30px 0"}}>{scene}</StyledButton>)}
            </StyledDiv>
            <StyledDiv>
                <Music/>
            </StyledDiv>
        </StyledBg>
    )
}

ReactDOM.render(<Controller />, document.getElementById('root'));