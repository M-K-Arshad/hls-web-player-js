export * as AspectRatio from './aspect_ratio.svg';
export * as Close from './close.svg';
export * as VolumeOff from './volume_off.svg';
export * as VolumeUp from './volume_up.svg';

import { ReactElement, SVGProps } from 'react';
import * as AspectRatio from './aspect_ratio.svg';
import * as Close from './close.svg';
import * as VolumeOff from './volume_off.svg';
import * as VolumeUp from './volume_up.svg';
const importedIcons = {
    AspectRatio,
    Close,
    VolumeOff,
    VolumeUp
};

type IconName = keyof typeof importedIcons;
type ReactComponent = (props: SVGProps<SVGElement>) => ReactElement;
export default importedIcons as unknown as Record<IconName, ReactComponent>;