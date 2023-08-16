import ReactDOM from 'react-dom';
import styled from 'styled-components';
import React, { useLayoutEffect, useRef, useState } from 'react';
import axios from 'axios';
import {color} from './Util/Define'
import StyledButton, { ContentButton } from './Util/Input/Button';
import { Title } from './Util/TextStyle';
import Music from './music'

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
function Controller(){
    const [scenes, setScenes] = useState<string[]>([]);
    const [curScene, setCurScene] = useState('');
    useLayoutEffect(()=>{
        axios.get(`/led/get`).then(({data})=>{
            setScenes(data)
        })
    },[])

    const onClickHandler = (scene)=>{
        axios.post('/led/set', {scene})
        .then(({data})=>{
            if(data){
                setCurScene(scene)
            }
        })
    }
    return(
        <StyledBg>
            <StyledDiv>
                <Title style={{marginBottom : "30px"}}>화면 : {curScene}</Title>
                {scenes.map(scene=><StyledButton onClick={(e)=>{onClickHandler(scene)}} style={{margin : "30px 0"}}>{scene}</StyledButton>)}
            </StyledDiv>
            {/* <StyledDiv>
                <Music/>
            </StyledDiv> */}
        </StyledBg>
    )
}

ReactDOM.render(<Controller />, document.getElementById('root'));