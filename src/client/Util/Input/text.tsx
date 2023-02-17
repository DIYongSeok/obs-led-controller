import React from "react";
import { useState } from "react";
import styled from "styled-components";

export const StyledInputText = styled.input<{width? : string, color? : string}>`
    border-radius: 7px;
    border-width: 2px;
    border-color: ${props=>props.color?props.color:"white"};
    border-style: solid;
    background-color: rgba(0,0,0,0);
    color: ${props=>props.color?props.color:"white"};;
    width: ${props=>props.width?props.width:"calc(8vw + 40px)"};
    height: calc(1vw + 11px);
    padding: 0 0.5vw;
    font-size: calc(0.5vw + 8px);
    text-align: center;
    &::-webkit-calendar-picker-indicator {
        color: rgba(0, 0, 0, 0); //숨긴다
        opacity: 1;
        display: block;
        background: url("/image/calendar.png") no-repeat right center; // 대체할 아이콘
        background-size: calc(0.8vw + 6px);
        border-width: thin;
    }
`

export const StyledTextArea = styled.textarea<{width? : string, color? : string, height? : string}>`
    border-radius: 7px;
    border-width: 2px;
    border-color: white;
    border-style: solid;
    width: ${props=>props.width?props.width:"calc(8vw + 40px)"};
    height: ${props=>props.height?props.height:"auto"};
    background-color: rgba(0,0,0,0);
    color: white;
    font-size: calc(0.5vw + 8px);
`

export const ValueInput = ({value,onChange = (e)=>{}, ...rest} : {value? : number | string, onChange? : any, [key:string] : any})=>{
    const [val, setVal] = useState(value)
    return(
        <StyledInputText {...rest} value={val} onChange={(e)=>{setVal(e.target.value as any); onChange(e)}}/>
    )
}

export const ValueTextArea = ({value,onChange = ()=>{}, ...rest} : {value? : number | string, onChange? : any, [key:string] : any})=>{
    const [val, setVal] = useState(value)
    return(
        <StyledTextArea {...rest} value={val} onChange={(e)=>{setVal(e.target.value as any); onChange()}}/>
    )
}