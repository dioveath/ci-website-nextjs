'use client';

import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadFull } from 'tsparticles';

import { particleConfig } from '../../lib/particle_config';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

// tsparticles v4 initialises the engine through a provider rather than the
// per-instance `init` prop of v2. The provider renders its children only once
// the engine is ready, so no extra loading guard is needed here.
//
// The init callback MUST be a stable reference -- the provider throws
// "init callback must be stable across the app lifecycle" if it changes
// identity between renders, so it lives at module scope, not inline.
const initEngine = (engine: Engine) => loadFull(engine);

export default function ParticlesBackground(
  { options = particleConfig as ISourceOptions, ...rest }: { options?: ISourceOptions } & Record<string, unknown>
) {
  return (
    <ParticlesProvider init={initEngine}>
      <Particles options={options} {...rest} />
    </ParticlesProvider>
  );
}
