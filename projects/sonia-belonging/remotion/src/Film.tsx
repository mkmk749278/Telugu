import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {END, SHOTS} from './shots';

const X = 8; // crossfade frames: the incoming shot fades in over the outgoing one

const Fader: React.FC<{len: number; first: boolean; children: React.ReactNode}> = ({len, first, children}) => {
	const f = useCurrentFrame();
	const o = first ? 1 : interpolate(f, [0, X], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const Film: React.FC = () => {
	const shots = [...SHOTS].sort((a, b) => a.at - b.at);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{shots.map((s, i) => {
				const next = i + 1 < shots.length ? shots[i + 1].at : END;
				const from = Math.max(0, s.at - (i ? X : 0));
				const len = next + X - from;
				const r = (x: number) => x - from;
				return (
					<Sequence key={i} from={from} durationInFrames={len} name={`shot ${i + 1}`}>
						<Fader len={len} first={i === 0}>
							{s.render(len, r)}
						</Fader>
					</Sequence>
				);
			})}
			<Audio src={staticFile('media/mix.wav')} />
		</AbsoluteFill>
	);
};
