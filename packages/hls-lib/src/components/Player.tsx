import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';

export const VideoPlayer = ({ src }: { src: string }) => {
    const videoRef = useRef<any>(null);

    useEffect(() => {
        const videoPlayer = videojs(videoRef.current, {
            html5: {
                hls: {
                    withCredentials: true
                }
            }
        });

        videoPlayer.src({
            src,
            type: 'application/x-mpegURL'
        });

        return () => {
            videoPlayer.dispose();
        };
    }, [src]);

    return (
        <div data-vjs-player>
            <video ref={videoRef} className="video-js vjs-default-skin" />
        </div>
    );
};