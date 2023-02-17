import React from "react";
import styled from "styled-components";
import { animatedClass, fadeInClass } from "../Define";

const StyledDiv = styled.div<{position : {y : string }}>`
    width : 80px;
    height: auto;
    background-color: white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top : ${props=>props.position.y};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export default function DropDown({position, isShow = false, children, ...rest} : {position : {y : string }, isShow : boolean, children? : any, [key : string] : any}){
    return(
        isShow?
            <StyledDiv {...rest} position={position} className={fadeInClass}>
                {children}
            </StyledDiv>
            :<></>
    )
}
