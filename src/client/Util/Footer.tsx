import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
    background-color: #0e1116;
    text-align: center;
    padding: 40px;
    line-height: 1.5;
    color : white;
`
const Title = styled.p`
    font-size: calc(0.5vw + 8px);
    color: rgba(255, 255, 255, 0.9);
    font-weight: bold;
    text-align: center;
`

const SubTitle = styled.p`
    font-size: calc(0.5vw + 4px);
    font-family: "KoPubDotum";
    color: rgba(255, 255, 255, 0.5);
    font-weight: bold;
    text-align: center;
`
export default React.memo(function Footer(){
    return (
        <StyledFooter>
            <Title>Phone: 010-9189-9036  |  Email: snulive20@gmail.com</Title>
            <Title>대표자: 김용석  |  사업자 등록번호: 257-65-00416</Title>
            <SubTitle>COPYRIGHT (C) SNULIVE ALL RIGHTS RESERVED.</SubTitle>
        </StyledFooter>
    )
})
