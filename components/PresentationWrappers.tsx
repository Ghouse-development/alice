'use client';

import React from 'react';
import Presentation2CrownUnified from './Presentation2CrownUnified';
import OptionsSlideRevised from './OptionsSlideRevised';
import SolarSimulatorConclusionFirst from './SolarSimulatorConclusionFirst';

// Presentation2のラッパー
export function Presentation2Wrapper({ projectId }: { projectId: string }) {
  return <Presentation2CrownUnified projectId={projectId} />;
}

// Presentation3のラッパー
export function Presentation3Wrapper({ projectId }: { projectId: string }) {
  return <OptionsSlideRevised projectId={projectId} />;
}

// Presentation5のラッパー
export function Presentation5Wrapper({ projectId }: { projectId: string }) {
  return <SolarSimulatorConclusionFirst projectId={projectId} />;
}