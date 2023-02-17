import React, { Component, useCallback, useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import { color, PopUpClass } from "./Define"
import $ from 'jquery'

const DescriptionDiv = styled.div<{[key : string] : any}>`
    max-width: calc(65vw + 100px);
    width : auto;
    height: auto;
    background-color: ${props=>props.color? props.color : "white"};
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    margin : 15vh 0;
    position: relative;
`
const CloseButton = styled.div<{[key : string] : any}>`
    z-index: 1;
    position : absolute;
    right : -16px;
    top : -16px;
    width : 32px;
    height : 32px;
    border-radius: 16px;
    background-color: ${props=>props.color ? props.color : "white"};
    color : ${color.gray};
    filter: drop-shadow(rgba(0, 0, 0, 0.3) 0px 0px 0.5vw);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &::before{
        content : "X"
    }
`
const ModalDiv = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: start;
    z-index: 2;
    overflow-y: scroll;
    background-color: rgba(0,0,0,0.5);
`


function scrollDisable(){
    $('body').addClass('scrollDisable')
}
function scrollAble(){
    $('body').removeClass('scrollDisable')
}

export const Modal =({content, onClick, color = "white",...rest} : {onClick? : any,color? : string, content : {check : boolean, data : (string | JSX.Element)}, [key : string] : any})=>{
    const modalContent = useRef<HTMLDivElement>()
    
    useLayoutEffect(()=>{
        if(content.check) scrollDisable()
        return scrollAble
    })

    return (
        content.check?
        <ModalDiv onClick={(e : React.MouseEvent<HTMLDivElement>)=>{
            if(e.target == e.currentTarget || (e.target as HTMLDivElement).id == "close"){
                onClick()
            }
        }} {...rest}>
            <DescriptionDiv color={color} className={PopUpClass} ref={modalContent}>
                <CloseButton color={color} id="close"/>
                {content.data}
            </DescriptionDiv>
        </ModalDiv>
        :<></>
    )
}

export const ModalPre = styled.pre<{textColor? : string}>`
    color : ${props=>props.textColor? props.textColor : "black"};
    width: calc(30vw + 200px);
    min-height: calc(30vw + 200px);
    display: flex;
    justify-content: center;
    text-align : center;
    padding : 5vw;
    white-space: pre-wrap;
    align-items: center;
`

export const useModal = ()=>{
    const [content, setContent] = useState<{check : boolean, data : (string | JSX.Element)}>({check : false, data : ''})
    const modalHandler = useCallback((data)=>{
        setContent((content)=>{
            return {
                data : data,
                check : !content.check
            }
        })
    },[])

    return {content, modalHandler}
}