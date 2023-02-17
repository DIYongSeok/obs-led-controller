import styled from "styled-components";

const CenterAligner = styled.div<{alignType? : "around" | "between" | "evenly"}>`
    display: flex;
    align-items: center;
    justify-content: ${props=>props.alignType? "space-"+props.alignType : "space-around"};
    flex-wrap: wrap;
    padding: 0 7vw;
`
export default CenterAligner