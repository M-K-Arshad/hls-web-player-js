// import { FunctionComponent, useEffect, useRef } from "react";
// import styled from 'styled-components';

// const WebPlayerContainer = styled.div`

// `
// const VideoContainer = styled.video`

// `
// const VideoSource = styled.source`

// `
// export interface HLSVideoPlayerProps {
//     src: string;
// }

// const HLSVideoPlayer = (props: HLSVideoPlayerProps) => {
//     const videoRef = useRef(null);

//     const loadVideoSrc = async (masterUrl: string) => {
//         if (videoRef.current) {
//             const video: HTMLVideoElement = videoRef.current;
//             const mediaSource = new MediaSource();
//             let sourceBuffer: any = null;
//             video.src = URL.createObjectURL(mediaSource);
//             mediaSource.addEventListener('sourceopen', () => {
//                 sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
//             });

//             /*Section: Helping Functions*/
//             const extractSubManifests = async (line: string) => {
//                 const response = await fetch(line);
//                 const subManifest = await response.text();
//                 const segments = subManifest.trim().split('\n').filter(line => !line.startsWith('#'));
//                 segments.map(async (segment) => {
//                     const url = `${line.substring(0, line.lastIndexOf('/') + 1)}${segment}`;
//                     const response = await fetch(url);
//                     const buffer = await response.arrayBuffer()
//                     sourceBuffer.appendBuffer(buffer);
//                 });
//             };
//             /* End of Helping Functions */
//             const response = await fetch(masterUrl);
//             const manifest = await response.text();
//             const lines = manifest.trim().split('\n');
//             const submanifests: Array<any> = await Promise.all(lines.filter((line) => line.endsWith('.m3u8')).map(extractSubManifests));
//             await Promise.all(submanifests);
//         }
//     };
//     useEffect(() => {
//         loadVideoSrc(props.src);
//     }, [])

//     return (<WebPlayerContainer>
//         {/* <VideoContainer>
//             <VideoSource src={props.src} type="application/x-mpegURL" />
//         </VideoContainer> */}
//         <video ref={videoRef} controls />
//     </WebPlayerContainer>);
// }

// export default HLSVideoPlayer;
import { createRef, FunctionComponent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PlayPauseControl from "./components/Player/PlayPause";
import VolumeControls from "./components/Player/VolumeControl";
import Backward from "./assets/backward.svg";
import TimeController from "./components/Player/TimeControl";
import TimeActions from "./components/Player/TimeControls";
import MaxMinScreen from "./components/Player/MaxMinScreen";

interface PlayerProps {
    url: string;
}
const SideCanvas = styled.canvas`
width: 100%;
height: 100%;
cursor:pointer;
`
const MainCanvas = styled.canvas`
flex: 1 0%;
height:100%;
width: 75%;
`
const Timebar = styled.div<any>`
    z-index: 100;
    width: 98%;
    height: 4px;
    cursor:pointer;
    border: 1px solid black;
    ${(props: any) => `
    background: -webkit-linear-gradient(left, red ${props.videoTime}%, white ${props.videoTime}%);`}
    ${(props: any) => `
    background: -moz-linear-gradient(left,red ${props.videoTime}%, white ${props.videoTime}%);`}
     ${(props: any) => `
    background: -ms-linear-gradient(left,red ${props.videoTime}%, white ${props.videoTime}%;`}
    ${(props: any) => `
    background: linear-gradient(left,red ${props.videoTime}%, white ${props.videoTime}%);`}
`

const ControlsContainer = styled.div`
    position: absolute;
    z-index: 100;
    width: 100%;
    bottom: 5%;
    display: flex;
    flex-direction: column;
`
const PlayerContainer = styled.div`
position: relative;
min-width: 320px;
`

const ControlContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    place-content: center space-evenly;
    justify-content: space-around;
    flex: 0.4;
    min-width: 250px;
`

const ControlBar = styled.div`
    display: flex;
    width: 99%;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    place-content: center space-around;
    justify-content: space-between;
`

const Player: FunctionComponent<PlayerProps> = (props) => {
    const { IVSPlayer } = window as any;
    const { isPlayerSupported } = IVSPlayer;
    const [sideViewCount, setSideViewCount] = useState<number>(4);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mainCanvas = useRef<HTMLCanvasElement>(null);
    const [sideRefs, setSideRefs] = useState<Array<any>>([]);
    const currentCanvas = useRef<number>(0);
    const fullScreen = useRef<boolean>(false);
    const [player, setPlayer] = useState<any>(null);
    const playerContainer = useRef<HTMLDivElement>(null);
    const [videoTime, setCurrentTime] = useState<any>(0);
    const timebarRef = useRef<HTMLDivElement>(null);

    const setFullScreen = (state: boolean) => {
        fullScreen.current = state;
    }

    useEffect(() => {
        if (timebarRef.current && videoRef.current) {
            const videoEl = videoRef.current;
            const handleTimeUpdate = (event: any) => {
                var rect = event.target.getBoundingClientRect();
                var x = event.clientX - rect.left; //x position within the element.
                var y = event.clientY - rect.top;  //y position within the element.
                console.log(x, y);
                const totalWidth = timebarRef.current?.offsetWidth ?? 1;
                const width = x ?? 0;
                console.log("widths", width, totalWidth);
                videoEl.currentTime = (width / totalWidth) * videoEl.duration;
            }
            timebarRef.current.addEventListener('click', handleTimeUpdate);
            return () => {
                timebarRef?.current?.removeEventListener('click', handleTimeUpdate);
            }
        }

    }, [timebarRef?.current, videoRef.current])

    useEffect(() => {
        let i = 0;
        const refsList = [];
        while (i < sideViewCount) {
            refsList.push(createRef());
            i++;
        }
        setSideRefs(refsList);
    }, [sideViewCount])
    useEffect(() => {
        if (player) {
            const PlayerState = IVSPlayer.PlayerState;
            const canvas = mainCanvas.current;
            const videoEl = videoRef.current;
            if (canvas && videoEl) {
                const ctx = canvas.getContext('2d');
                const canvasListener = () => {
                    const can = () => {
                        const width = canvas.parentElement?.offsetWidth;
                        const height = canvas.parentElement?.clientHeight;
                        //ctx?.drawImage(videoEl, 0, 0, canvas.width, canvas.height, 0, 0, videoEl.offsetWidth / 2, videoEl.offsetHeight / 2);
                        //ctx?.drawImage(videoEl, 0, 0, canvas.width / 2, canvas.height / 2);
                        const [sectionWidth, sectionHeight] = [videoEl.videoWidth / 2, videoEl.videoHeight / 2];
                        let ci = parseInt(Math.floor(currentCanvas.current / 2).toFixed(0));
                        let cj = currentCanvas.current % 2;
                        ctx?.drawImage(videoEl, ci * sectionWidth, cj * sectionHeight, videoEl.videoWidth / 2, videoEl.videoHeight / 2, 0, 0, canvas.width, canvas.height);
                        sideRefs.forEach((sideRef: any, index: number) => {
                            const sideCan = sideRef.current;
                            const sideContext = sideRef.current.getContext('2d');
                            let i = parseInt(Math.floor(index / 2).toFixed(0));
                            let j = index % 2;
                            const [sx, sy, ex, ey] = [(i * sectionWidth), (j * sectionHeight), (i * sectionWidth) + sectionWidth, (j * sectionHeight) + sectionHeight];
                            sideContext.drawImage(videoEl, sx, sy, videoEl.videoWidth / 2, videoEl.videoHeight / 2, 0, 0, sideCan.width, sideCan.height);
                        });
                        // ctx?.drawImage(videoEl, canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
                        // ctx?.drawImage(videoEl, canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
                        // ctx?.drawImage(videoEl, canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
                        requestAnimationFrame(can);
                    }
                    requestAnimationFrame(can);
                };
                player.addEventListener(PlayerState.PLAYING, canvasListener);
                return () => {
                    player.removeEventListener(PlayerState.PLAYING, canvasListener);
                    window.onresize = () => { };
                }

            }
        }
    }, [player, mainCanvas.current, videoRef.current, currentCanvas])

    useEffect(() => {
        sideRefs.forEach((sideRef: any, index: number) => {
            const sideCan = sideRef.current;
            const handleClick = () => {
                console.log('called for ', index);
                currentCanvas.current = index;
            }
            sideCan.addEventListener('click', handleClick, false);
        })
        return () => {
            sideRefs.forEach((sideRef: any, index: number) => {
                const sideCan = sideRef.current;
                const handleClick = () => {
                    console.log('called for ', index);
                    currentCanvas.current = index;
                }
                sideCan.removeEventListener('click', handleClick, false);
            })
        }
    }, [sideRefs.length])

    useEffect(() => {
        try {
            if (mainCanvas.current && sideRefs.length && sideRefs[0].current && videoRef.current) {
                if (IVSPlayer.isPlayerSupported) {
                    const player = IVSPlayer.create();
                    const videoEl = videoRef.current;
                    if (videoEl) {
                        player.attachHTMLVideoElement(videoEl);
                        videoEl.ontimeupdate = (event: any) => {
                            setCurrentTime(((videoEl.currentTime / videoEl.duration) * 100));
                        };
                        player.load(props.url);
                        player.play();
                        player.setVolume(1);
                        setPlayer(player);
                        // Video to canvas
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }, [sideRefs, mainCanvas, videoRef])
    useEffect(() => {
        if (playerContainer.current) {
            const container = playerContainer.current;
            if (fullScreen.current) {
                container.style.height = "100vh";
                container.style.width = "100vw";
                container.style.position = "absolute";
                container.style.top = "0";
                container.style.left = "0";
            }
            else {
                container.style.height = "";
                container.style.width = "";
                container.style.position = "";
                container.style.top = "";
                container.style.left = "";
            }
        }
    }, [fullScreen.current, playerContainer.current])
    const isVideoPlaying = (video: HTMLVideoElement) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    return (<PlayerContainer ref={playerContainer}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, display: "none", zIndex: -1 }}>
            <video ref={videoRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'none' }} controls></video>
        </div>
        <div style={{
            position: 'relative', width: '100%', height: '100%', display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            <MainCanvas ref={mainCanvas} />
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexWrap: "nowrap",
                flex: "0.25",
                height: "100%",
                width: "25%"
            }}>
                {sideRefs.map((ref: any, index: number) => <SideCanvas key={'canvas' + index} ref={ref} />)}
            </div>
        </div>

        <ControlsContainer>
            <Timebar ref={timebarRef} videoTime={videoTime} />
            <ControlBar>
                <ControlContainer>
                    <img src={Backward} style={{ minWidth: "16px", minHeight: "16px", maxWidth: "16px", maxHeight: "16px" }} />
                    <PlayPauseControl state={videoRef.current && isVideoPlaying(videoRef.current) ? "playing" : "paused"} handlePlayPause={() => {
                        if (videoRef.current && isVideoPlaying(videoRef.current)) {
                            videoRef.current.pause();
                        }
                        else if (videoRef.current) {
                            videoRef.current.play()
                        }
                    }} />
                    <TimeActions forwardSeconds={(seconds: number) => {
                        if (videoRef.current) {
                            if (videoRef.current.currentTime + seconds <= (videoRef.current.duration - seconds)) {
                                videoRef.current.currentTime += seconds;
                            }
                        }
                    }}
                        rewindSeconds={(seconds: number) => {
                            if (videoRef.current) {
                                if (videoRef.current.currentTime - seconds >= 0) {
                                    videoRef.current.currentTime -= seconds;
                                }
                            }
                        }} />
                    <VolumeControls muted={videoRef.current?.muted ?? false} unMute={() => {
                        if (videoRef.current) {
                            videoRef.current.muted = false;
                        }
                    }} setVolume={(value: number) => {
                        console.log('request change volume', value);
                        if (videoRef.current) {
                            if (!value) {
                                videoRef.current.muted = true;
                            }
                            videoRef.current.volume = value;
                        }
                    }} volume={videoRef.current ? videoRef.current.volume : 0} />
                    <TimeController time={videoRef.current ? videoRef.current.currentTime : 0} duration={videoRef.current ? videoRef.current.duration : 0} />
                </ControlContainer>
                <MaxMinScreen state={fullScreen.current ? "FULLSCREEN" : "NORMAL"} setFullScreen={setFullScreen} />
            </ControlBar>
        </ControlsContainer>
    </PlayerContainer>);
}

export default Player;