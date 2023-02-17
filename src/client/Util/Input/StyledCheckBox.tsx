import React, { useState } from "react"
import styled from "styled-components"

const CheckBox = styled.input`
    display: none;
`

const StyledLabel = styled.label<{checked? : boolean, [key : string] : any}>`
    &::before{
        width: calc(0.5vw + 6px);
        height: calc(0.5vw + 6px);
        font-size: calc(0.5vw + 5px);
        border-width: 2px;
        border-color: white;
        border-style: solid;
        border-radius: calc(0.2vw);
        content : "";
        background: ${props=>props.checked?"url('/image/check_mark.png') center center/auto no-repeat" : "white"};
        background-size: calc(0.5vw + 4px);
        background-color: rgba(0,0,0,0);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        margin: 0.5vw;
    }
    color: white;
    font-size: calc(0.5vw + 6px);
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
        cursor: pointer;
    }
`

export const StyledCheckBox = (({name ,value, children,onChange,...rest} : {name?: string ,value?: string,children? : any, onChange? : any,[key : string] : any})=>{
    const [check, setCheck] = useState(false)
    return (
        <StyledLabel checked={check} onClick={e=>{
            e.preventDefault();
            setCheck(!check)
            onChange()
        }}>
            <CheckBox {...rest} type="checkbox" checked={check} name={name as string}/>
            {children}
        </StyledLabel>
    )
})