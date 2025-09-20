import EnergyCostSimulation from '@/components/slides/EnergyCostSimulation';
import A3Guard from '@/components/dev/A3Guard';

export default function TestEnergySimulationPage() {
  return (
    <A3Guard>
      <EnergyCostSimulation />
    </A3Guard>
  );
}