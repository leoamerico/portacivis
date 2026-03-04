'use client';

import { useState } from 'react';
import DemoScenarioController from './DemoScenarioController';
import ComplianceScorePanel from './ComplianceScorePanel';
import AlertsPanel from './AlertsPanel';
import CitizenAgentPanel from './CitizenAgentPanel';
import ProvenanceSection from './ProvenanceSection';
import type { DemoScenario } from '../../src/transparency/types';

type Props = {
  presentationMode: boolean;
};

export default function AuroraDemoWrapper({ presentationMode }: Props) {
  const [scenario, setScenario] = useState<DemoScenario>('compliant');

  return (
    <>
      <DemoScenarioController
        onScenarioChange={setScenario}
        presentationMode={presentationMode}
      />

      <div id="demo-section-compliance">
        <ComplianceScorePanel />
      </div>

      <div id="demo-section-alerts">
        <AlertsPanel />
      </div>

      <div id="demo-section-agent">
        <CitizenAgentPanel
          cityName="Cidade Aurora"
          uf="MG"
          population={120000}
          region="Sudeste — Minas Gerais"
        />
      </div>

      <div id="demo-section-provenance">
        <ProvenanceSection
          hasTerritory={true}
          cidade="Cidade Aurora"
          uf="MG"
          layers={['public_services', 'compliance', 'alerts']}
        />
      </div>
    </>
  );
}
