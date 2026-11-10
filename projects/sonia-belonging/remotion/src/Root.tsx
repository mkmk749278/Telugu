import React from 'react';
import {Composition} from 'remotion';
import {Dev} from './Dev';
import {Film} from './Film';
import {loadFilmFonts} from './fonts';
import {END} from './shots';
import {FPS} from './timing';

loadFilmFonts();

export const Root: React.FC = () => (
	<>
		<Composition id="Sonia" component={Film} durationInFrames={END} fps={FPS} width={1920} height={1080} />
		<Composition id="Dev" component={Dev} durationInFrames={150} fps={30} width={1920} height={1080} defaultProps={{scene: 'room'}} />
	</>
);
