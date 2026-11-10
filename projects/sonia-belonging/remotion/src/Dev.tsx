import React from 'react';
import {InkBed, InkCorridor, InkDoor, InkHall, InkMirror, InkRoom, InkWindow} from './ink';

export const Dev: React.FC<{scene: string}> = ({scene}) => {
	switch (scene) {
		case 'room':
			return <InkRoom dur={150} phase="talk" />;
		case 'close':
			return <InkRoom dur={150} phase="close" at={10} />;
		case 'yes':
			return <InkRoom dur={150} phase="yes" />;
		case 'window':
			return <InkWindow dur={150} />;
		case 'corridor':
			return <InkCorridor dur={150} />;
		case 'bed':
			return <InkBed dur={150} lines={[{t: 'ఇటలీలో పుట్టి పెరిగిన నువ్వు?', at: 5, side: 'l'}, {t: 'ఇది నీ దేశం.', at: 20, side: 'r'}]} />;
		case 'door':
			return <InkDoor dur={150} />;
		case 'hall':
			return <InkHall dur={150} />;
		case 'surge':
			return <InkHall dur={150} surge={10} />;
		default:
			return <InkMirror dur={150} showRight={20} />;
	}
};
