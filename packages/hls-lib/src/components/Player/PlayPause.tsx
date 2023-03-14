import { FunctionComponent, MouseEventHandler } from "react";
import PlayIcon from "../../assets/start-video.svg";
import PauseIcon from "../../assets/pause-video.svg";
import styled from "styled-components";

const PlayPauseContainer = styled.div`
margin-left: 2vw;
margin-right: 2vw;

`

const PlayPauseIcon = styled.img`
cursor: pointer;
`
interface PlayPauseControlProps {
    state: "playing" | "paused";
    handlePlayPause: MouseEventHandler<HTMLImageElement>;
}

const PlayPauseControl: FunctionComponent<PlayPauseControlProps> = ({ state, handlePlayPause }) => {
    return state == "playing" ? <PlayPauseIcon src={PauseIcon} onClick={handlePlayPause} /> : <PlayPauseIcon src={PlayIcon} onClick={handlePlayPause} />
}

export default PlayPauseControl;