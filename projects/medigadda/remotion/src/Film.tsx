import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ChA} from './chA';
import {ChB} from './chB';
import {ChC} from './chC';
import {ChD} from './chD';
import {ChE} from './chE';
import {ChF} from './chF';
import {ChG} from './chG';

// The sound (public/media/mix.wav from tools/mix.py) is laid under the picture at the join, not inside the composition.
export const Film: React.FC = () => (
	<AbsoluteFill style={{background: '#17110A'}}>
		<ChA />
		<ChB />
		<ChC />
		<ChD />
		<ChE />
		<ChF />
		<ChG />
	</AbsoluteFill>
);
