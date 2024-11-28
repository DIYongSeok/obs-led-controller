import styled from 'styled-components';
import { color } from '../define';

export const StyledButton = styled.button`
  width: 200px;
  padding: 15px 0;
  text-align: center;
  margin: 30px 30px;
  border-radius: 25px;
  font-weight: bold;
  border: 2px solid ${color.white};
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: calc(0.5vw + 12px);
  position: relative;
  overflow: hidden;
  transition: 0.8s;
  &:hover {
    background: #1e335e;
    border: 2px solid ${color.blue};
  }
`;

export let WhiteBorderButton = styled.input<{ width?: string }>`
  border-width: 2px;
  border-color: white;
  border-style: solid;
  border-radius: 10px;
  width: ${(props) => (props.width ? props.width : 'calc(8vw + 35px)')};
  padding: 10px 0;
  background-color: transparent;
  margin: 3vh 0px;
  &:hover {
    background-color: ${color.blue};
    border-color: ${color.blue};
  }
  transition: 0.5s all;
  font-size: calc(1vw + 6px);
  font-weight: 700;
  color: white;
  cursor: pointer;
`;
export const ContentButton = styled.button<{
  width?: string;
  color?: string;
  borderColor?: string;
  fontSize?: string;
  hoverColor?: string;
}>`
  border-radius: 7px;
  border-width: 2px;
  border-color: ${(props) =>
    props.borderColor ? props.borderColor : props.color || 'white'};
  border-style: solid;
  background-color: rgba(0, 0, 0, 0);
  color: ${(props) => (props.color ? props.color : 'white')};
  width: ${(props) => (props.width ? props.width : 'calc(8vw + 40px)')};
  height: calc(1vw + 15px);
  // margin: 0.5vw;
  font-size: ${(props) =>
    props.fontSize ? props.fontSize : 'calc(0.5vw + 8px)'};
  text-align: center;
  &:hover {
    background-color: ${(props) =>
      props.hoverColor ? props.hoverColor : color.blue};
    cursor: pointer;
    border-color: ${(props) =>
      props.hoverColor ? props.hoverColor : color.blue};
    color: white;
  }
  transition: 0.5s all;
`;

export default StyledButton;
