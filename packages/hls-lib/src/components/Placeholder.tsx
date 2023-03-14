import React, { useEffect, useState } from 'react';
import { hexToRgb } from './utils';

type Props = {
    bgColor?: string;
    spinnerColor?: string;
    loading: boolean;
};

const Placeholder: React.FC<Props> = ({ bgColor = '#000', spinnerColor = '#fff', loading }) => {
    const [gradientBg, setGradientBg] = useState<string>('');

    const getRgba = (rgb: number[], alpha: number): string => {
        const [r, g, b] = rgb;

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    useEffect(() => {
        const rgb = hexToRgb(bgColor);

        setGradientBg(
            `linear-gradient(0deg, ${getRgba(rgb, 1)} 50%, ${getRgba(rgb, 0.9)} 100%), linear-gradient(90deg, ${getRgba(
                rgb,
                0.9,
            )} 0%, ${getRgba(rgb, 0.6)} 100%), linear-gradient(180deg, ${getRgba(rgb, 0.6)} 0%, ${getRgba(
                rgb,
                0.3,
            )} 100%), linear-gradient(360deg, ${getRgba(rgb, 0.3)} 0%, ${getRgba(rgb, 0)} 100%)`,
        );
    }, [bgColor]);

    return (
        <div className="Placeholder" style={{ background: bgColor }}>
            <div className="Placeholder-content">
                {loading && (
                    <div className="Placeholder-spinner" style={{ background: spinnerColor }}>
                        <div
                            className="Placeholder-gradient"
                            style={{ backgroundImage: gradientBg }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Placeholder;
