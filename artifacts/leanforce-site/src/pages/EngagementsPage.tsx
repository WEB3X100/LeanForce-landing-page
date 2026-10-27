import { ArrowRight } from 'lucide-react';
import { SiteFrame } from '@/components/SiteFrame';

const phases = [
  {
    id: 'assessment',
    step: 'Map',
    name: 'Assessment & Map',
    billing: 'One-time',
    line: 'Choose the workflow worth improving.',
    happens: 'Map the current workflow, owners, tools, delays, and exceptions.',
    receives: ['Current and future map', 'Priority', 'Baseline', 'Agent blueprint', 'Build scope'],
    agents: 'Design only. No production agent.',
    fee: 'One-time, based on workflow count, complexity, stakeholders, systems, and mapping depth.',
    alt: false,
  },
  {
    id: 'sprint',
    step: 'Build',
    name: 'Sprint Build',
    billing: 'One-time',
    line: 'Build and validate the agreed workflow.',
    happens: 'Build and test the approved workflow, automations, integrations, and review points.',
    receives: ['Tested workflow', 'Agent roles and limits', 'Operating guide', 'Acceptance review', 'Owner handoff'],
    agents: 'Roles and count are set in the proposal.',
    fee: 'One-time, based on agent roles, integrations, exceptions, data preparation, and testing.',
    alt: true,
  },
  {
    id: 'managed',
    step: 'Run',
    name: 'Managed Run',
    billing: 'Recurring',
    line: 'Support and improve what\'s live.',
    happens: 'Monitor, triage, and improve the workflows in the support agreement.',
    receives: ['Support cadence', 'Issue review', 'Measures', 'Change log', 'Improvement plan'],
    agents: 'Covers only the agents named in the agreement.',
    fee: 'Recurring, based on workflows, agents, volume, coverage, response expectation, and change cadence.',
    alt: false,
  },
] as const;

const costs = [
  ['Assessment & Map', 'One-time'],
  ['Sprint Build', 'One-time'],
  ['Managed Run', 'Recurring'],
  ['Third-party software', 'Billed separately'],
] as const;

export default function EngagementsPage() {
  return (
    <SiteFrame>
      <section className="page-hero offer-hero section-pad">
        <div className="offer-hero-copy">
          <p className="kicker">Focused Workflow</p>
          <h1>Start with one workflow. Build only what proves useful.</h1>
          <p className="lead">Map the process. Build a focused solution. Add support when it helps.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/#contact">Talk through a workflow <ArrowRight size={17} /></a>
          </div>
        </div>
        <ol className="offer-path" aria-label="Map, build, then run">
          {phases.map((phase) => (
            <li key={phase.id}>
              <a className="offer-card" href={`#${phase.id}`}>
                <span className="offer-step">{phase.step}</span>
                <span className="offer-name">{phase.name}</span>
                <span className="offer-line">{phase.line}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="fee-split section-pad" aria-labelledby="fee-heading">
        <div className="section-heading">
          <h2 id="fee-heading">Clear costs, separated by phase.</h2>
          <p className="lead">Assessment and Build are one-time fees. Managed Run is recurring and optional. Third-party software and usage are separate. No rate is published here. The scope and fee are confirmed after assessment.</p>
        </div>
        <ul className="fee-pills">
          {costs.map(([name, kind]) => (
            <li key={name}><b>{name}</b><span>{kind}</span></li>
          ))}
        </ul>
      </section>

      {phases.map((phase) => (
        <article className={phase.alt ? 'package-detail package-detail-alt section-pad' : 'package-detail section-pad'} id={phase.id} key={phase.id}>
          <div className="section-heading">
            <p className="phase-billing">{phase.billing}</p>
            <h2>{phase.name}</h2>
          </div>
          <div className="offer-grid">
            <div>
              <h3>What happens</h3>
              <p>{phase.happens}</p>
            </div>
            <div>
              <h3>What you receive</h3>
              <ul>{phase.receives.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3>Agents</h3>
              <p>{phase.agents}</p>
            </div>
            <div>
              <h3>How the fee is set</h3>
              <p>{phase.fee}</p>
            </div>
          </div>
          {phase.id === 'sprint' && (
            <div className="agent-example">
              <p className="phase-billing">Example only · not included unless the proposal says so</p>
              <h3>Inquiry preparation</h3>
              <dl>
                <div><dt>Role</dt><dd>Turn an inbound request into a brief a person can review.</dd></div>
                <div><dt>Permitted action</dt><dd>Read the request and draft the brief.</dd></div>
                <div><dt>Limit</dt><dd>Does not send a message, change a price, or update a customer record.</dd></div>
                <div><dt>Escalation</dt><dd>Missing or sensitive cases go to the named owner.</dd></div>
              </dl>
            </div>
          )}
        </article>
      ))}

      <section className="package-close section-pad">
        <h2>Bring one workflow.</h2>
        <p className="lead">Tell us where work gets stuck. We'll reply about whether an assessment fits.</p>
        <a className="button button-primary" href="/#contact">Talk through a workflow <ArrowRight size={17} /></a>
      </section>
    </SiteFrame>
  );
}
