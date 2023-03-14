import { FunctionComponent } from "react";
import styled from "styled-components";

import Forward15 from "../../assets/forward-15.svg";
import Rewind15 from "../../assets/rewind-15.svg";

const TimeIcon = styled.img`
cursor: pointer;
`

const Controller = styled.div`
display: flex;
flex-direction: row;
`

interface TimeActionsProps {
    forwardSeconds: Function;
    rewindSeconds: Function;
}

const TimeActions: FunctionComponent<TimeActionsProps> = ({ forwardSeconds, rewindSeconds }) => {
    return (<Controller>
        <TimeIcon src={Rewind15} onClick={() => rewindSeconds(15)} />
        <TimeIcon src={Forward15} onClick={() => forwardSeconds(15)} />
    </Controller>);
}

export default TimeActions;