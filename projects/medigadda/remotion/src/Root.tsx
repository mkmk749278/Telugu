import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {loadFilmFonts} from './fonts';
import {DURATION, FPS} from './t';

loadFilmFonts();

export const Root: React.FC = () => <Composition id="Medigadda" component={Film} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />;
