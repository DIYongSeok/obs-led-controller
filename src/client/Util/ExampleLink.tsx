import React from "react";
import styled from "styled-components";

const StyledA = styled.a`
    color: rgb(75, 75, 75);
    font-size: calc(0.5vw + 5px);
    text-decoration: none;
`
const StyledButton = styled.a`
    background-color: #0e1116;
    color: #f9f9f9;
    font-size: calc(0.5vw + 4px);
    text-decoration: none;
    padding: 2px;
    border-radius: 3px;
    transition: 0.8s;
    &:hover{
        background-color: #626d7e;
    }
`

export default function ExampleLink({link, children} : {link : string, children? : string}){
    return(
        <StyledA href={link} target='_blank'>
            {children? "영상확인":"예시확인"}
        </StyledA>
    )
}

export function Examplebutton({link, children} : {link : string, children? : string}){
    return(
        <StyledButton href={link} target='_blank'>
            {children? children:"보기"}
        </StyledButton>
    )
}