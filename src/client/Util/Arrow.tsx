import React from "react";
import styled from "styled-components";

const Line = styled.span`
    display: block;
    width: 100%;
    height: 2px;
    background: #636363;
    border-radius: 3px;
    position: absolute;
`

const Box = styled.div<{size? : string, side : "left" | "right"}>`
    position: absolute;
    top : 50%;
    ${props=>props.side} : 4vw;
    display: block;
    width: ${props=>props.size?props.size:"10px"};
    height: calc(${props=>props.size?"2*"+props.size:"20px"});
    align-self: center;
    justify-self: center;
    cursor: pointer;
`

export default function Arrow({size, side, onClick,...rest} : {size? : string, side : "right" | "left", onClick? : any, [key : string]:any}){
    return (
        <Box {...rest} size={size} side={side} onClick={onClick}>
            <Line style={side=="right"?{
                transform: "rotate(45deg)",
                top : "35%"
            }:{
                transform: "rotate(45deg)",
                top : "70%"
            }} />
            <Line style={side=="right"?{
                transform: "rotate(-45deg)",
                position : "relative",
                top: "70%"
            }:{
                transform: "rotate(-45deg)",
                position : "relative",
                top: "35%"
            }} />
        </Box>
    )
}

