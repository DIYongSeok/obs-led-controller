import React from "react";
import styled from "styled-components";
import { fadeInClass } from "./Define";
import { useState, useRef } from "react";
import { color, fontSize } from "./Define";

const StyledDiv = styled.div`
    background-color: ${color.white};
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom : calc(1vw + 15px);
    cursor: auto;
    &::before{
        content:"";
        position: absolute;
        width: 0;
        height: 0;
        border-top: 10px solid ${color.white};
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        bottom: -10px;
    }
`

const StyledI = styled.div`
    border: 2px solid ${color.gray};
    border-radius: 50%;
    font-size: ${fontSize.small};
    color : ${color.gray};
    text-align: center;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: calc(0.4vw + 8px);
    height: calc(0.4vw + 8px);
    font-weight: bolder;
    cursor: pointer;
    position: relative;
`

export default function({content, style} : {content : JSX.Element, style? : React.CSSProperties}){ //{isShow = false, content} : {isShow : boolean, content : JSX.Element}
    const [isShow, setIsShow] = useState(false);
    return(
        <>
            <StyledI style={style} onClick={(e)=>{e.preventDefault()}} onMouseOver={()=>{setIsShow(true);}} onMouseLeave={()=>{setIsShow(false);}}>
                {isShow?
                <StyledDiv className={fadeInClass}>
                    {content}
                </StyledDiv>
                :<></>}
                ?
            </StyledI>
        </>
    )
}

export const StyledLine = styled.div`
    margin : 5px 0;
    text-align: left;
    &::before{
        content: "-";
        position: absolute;
        transform: translateX(-10px);
    }
`
