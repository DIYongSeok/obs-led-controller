import ReactDOM from 'react-dom';
import styled from 'styled-components';
import React, { useLayoutEffect, useRef, useState } from 'react';
import axios from 'axios';
import {color} from './Util/Define'
import StyledButton, { ContentButton } from './Util/Input/Button';
import { Title } from './Util/TextStyle';

const StyledBg = styled.div`
    background-color: ${color.box};
    min-height: 100vh;
`
const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 200px 100px;
`

export default function Music(){
    const [volume, setVolume] = useState<string>();
    useLayoutEffect(()=>{
        axios.get(`/music/get`).then(({data})=>{
            setVolume(data.toString())
        })
    },[])
    const onChangeHandler = (e : React.ChangeEvent<HTMLInputElement>)=>{
        setVolume(e.target.value)
        axios.post(`/music/set`, {volume : e.target.value})
    }
    return(
        <>
            <Title style={{margin : "30px"}}>음악 볼륨 조절</Title>
            <input onChange={onChangeHandler} type="range" min="0" max="1" step="0.01" value={volume} />
        </>
    )
}