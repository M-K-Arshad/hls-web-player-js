import { FunctionComponent } from "react";
import styled from "styled-components";
import Minimize from "../../assets/minimize.svg";
import Maximize from "../../assets/maximize.svg";

const Icon = styled.img`
cursor:pointer;
float: right;
`

interface MaxMinScreenProps {
    state: "FULLSCREEN" | "NORMAL";
    setFullScreen: Function;
}

const MaxMinScreen: FunctionComponent<MaxMinScreenProps> = ({ state, setFullScreen }) => {
    return (state == "FULLSCREEN" ? <Icon src={Minimize} onClick={() => {
        setFullScreen(false);
    }} /> : <Icon src={Maximize} onClick={() => {
        setFullScreen(true);
    }} />);
}

export default MaxMinScreen;