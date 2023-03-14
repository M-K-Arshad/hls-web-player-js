import { FunctionComponent, MouseEventHandler, useState } from "react";
import styled from "styled-components";
import Muted from "../../assets/muted.svg";
import Volume from "../../assets/volume.svg";
import VolumeUp from "../../assets/volume-up.svg";

interface VolumeControlsProps {
    muted: boolean;
    unMute: MouseEventHandler<HTMLImageElement>;
    volume: number;
    setVolume: Function;
}
const VolumeContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
`
const VolumeIcon = styled.img`
cursor: pointer;
`
const Slider = styled.div`
    display: flex;
  align-items: center;
  width: 100%;
  margin-left: 1vw;
`
const SliderInput = styled.input`
  -webkit-appearance: none;
  height: 4px;
  border-radius: 5px;
  background-color: #ddd;
  outline: none;
  margin: 0;
  padding: 0;
  width: 7vw;
  cursor:pointer;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background-color: #ffff;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background-color: #ffff;
    border-radius: 50%;
    cursor: pointer;
  }
`
const VolumeControls: FunctionComponent<VolumeControlsProps> = ({ muted, unMute, volume, setVolume }) => {
    const [showVolumeBar, setVolumeBarVisibility] = useState<boolean>(false);
    return muted ? <VolumeContainer>
        <VolumeIcon src={Muted} onClick={unMute} />
    </VolumeContainer>
        : <VolumeContainer onMouseLeave={(event) => {
            event.preventDefault(); setVolumeBarVisibility(false);
        }} >
            {volume >= 0.5 ? <VolumeIcon src={VolumeUp} height="22px" onMouseEnter={(event) => { event.preventDefault(); setVolumeBarVisibility(true); }} /> : <VolumeIcon src={Volume} onMouseEnter={(event) => { event.preventDefault(); setVolumeBarVisibility(true); }} />}
            {showVolumeBar && <Slider>
                <SliderInput type="range" min="0" max="100" id="volume-slider" value={volume * 100} onChange={(event) => {
                    setVolume(parseInt(event.target.value) / 100);
                }} />
            </Slider>}
        </VolumeContainer>;
}

export default VolumeControls;