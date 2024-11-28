import styled from "styled-components";

export const BottomLine = styled.div<{width? : string, color? : string}>`
    border-bottom: 0.5px groove ${props=>props.color? props.color : "rgba(100, 100, 100,0.4)"};
    width: ${props=>props.width? props.width : "80%"};
    margin: 0 10vw;
`