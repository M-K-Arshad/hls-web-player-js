import React from 'react';

import { CONTROLS } from './config';
import importedIcons from "../assets/icons";

const PlayerControls = (props: { controls: any; muted: any; onClose: any; onMute: any; onResize: any; }) => {
    const { controls, muted, onClose, onMute, onResize } = props;

    const renderControl = (control: any, key: React.Key | null | undefined) => {
        let Icon;
        let callback;

        switch (control) {
            case CONTROLS.close:
                Icon = importedIcons.Close;
                callback = onClose;
                break;
            case CONTROLS.mute:
                Icon = muted ? importedIcons.VolumeOff : importedIcons.VolumeUp;
                callback = onMute;
                break;
            case CONTROLS.resize:
                Icon = importedIcons.AspectRatio;
                callback = onResize;
                break;
            default:
                return null;
        }

        return (
            <button key={key} className="PlayerControls-button" onClick={callback}>
                <Icon />
            </button>
        );
    };

    return (
        <div className="PlayerControls">
            {controls.map((control: any, i: any) => renderControl(control, i))}
        </div>
    );
};

export default PlayerControls;