import styled from "styled-components";

export const Title = styled.p<{color? : string, size? : string}>`
    font-size: ${props=>props.size?props.size:"calc(1vw + 12px);"};
    font-weight: 700;
    color: ${props=>props.color?props.color:"white"};
`

export const SubTitle = styled.p<{color? : string, size? : string}>`
    font-size: ${props=>props.size?props.size:"calc(0.5vw + 10px);"};
    font-weight: 500;
    color: ${props=>props.color?props.color:"white"};
    opacity: 0.5;
`

export const ReactiveText = styled.p<{isEssential? : boolean, fontSize? : string, color? : string, children? : any, ref? : any}>`
    font-size: ${props => props.fontSize? props.fontSize : "calc(1vw + 6px)"};
    color : ${props=>props.color? props.color : "white"};
    &::after{
        content: ${props => props.isEssential ? "'*'" : ""};
        color: #f90000;
    }
`