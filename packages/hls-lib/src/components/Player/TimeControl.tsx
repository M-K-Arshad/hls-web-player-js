import { FunctionComponent } from "react";
import styled from "styled-components";
interface TimeControllerProps {
    time: number;
    duration: number;
}
const VideoTimeContainer = styled.div`
font-family: 'Montserrat';
font-style: normal;
font-weight: 500;
font-size: 1.1rem;
text-align: center;
color: #FFFFFF;
`
const TimeController: FunctionComponent<TimeControllerProps> = ({ time, duration }) => {
    function secondsToHms(d: any) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor((d % 3600) / 60);
        var s = Math.floor((d % 3600) % 60);

        var hDisplay = h ? (h < 10 ? `0${h}` : h) + ":" : "";
        var mDisplay = (m < 10 ? `0${m}` : m) + ":";
        var sDisplay = (s < 10 ? `0${s}` : s);

        return hDisplay + mDisplay + sDisplay;
    }
    return <VideoTimeContainer>
        {`${secondsToHms(time)}/${secondsToHms(duration)}`}
    </VideoTimeContainer>;
}

export default TimeController;