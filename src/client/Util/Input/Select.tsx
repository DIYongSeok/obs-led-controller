import styled from "styled-components";

export default styled.select<{width? : string}>`
    border-radius: 7px;
    border-width: 2px;
    border-color: white;
    border-style: solid;
    background-color: rgba(0,0,0,0);
    color: white;
    width: ${props=>props.width?props.width:"calc(8vw + 40px)"};
    height: calc(1vw + 11px);
    padding: 0 0.5vw;
    margin: 0.5vw;
    font-size: calc(0.5vw + 8px);
    text-align: center;
`

export const StyledOption = styled.option`
    color : black;
    text-align: center;
`