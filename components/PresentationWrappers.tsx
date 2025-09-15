'use client';

import React from 'react';
import Presentation2CrownUnified from './Presentation2CrownUnified';
import Presentation3Interactive from './Presentation3Interactive';
import Presentation5RunningCost from './Presentation5RunningCost';

// Presentation2のラッパー
export function Presentation2Wrapper({ projectId }: { projectId: string }) {
  return <Presentation2CrownUnified projectId={projectId} />;
}

// Presentation3のラッパー
export function Presentation3Wrapper({ }: { projectId: string }) {
  return <Presentation3Interactive />;
}

// Presentation5のラッパー
export function Presentation5Wrapper({ }: { projectId: string }) {
  return <Presentation5RunningCost />;
}