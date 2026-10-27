import { Fragment } from 'react';

const bundles = [
  {
    id: 'capture',
    name: 'Capture & Qualify',
    signal: 'Leads leak. Follow-up is manual and inconsistent.',
    gate: 'Sandbox before any CRM write. A person approves outreach or booking.',
    steps: ['Capture the inquiry', 'Qualify and record consent', 'Person approves outreach'],
  },
  {
    id: 'content',
    name: 'Content Machine',
    signal: 'No consistent content. The founder is the bottleneck.',
    gate: 'Draft only until approval. No claim without evidence. No publishing without owner sign-off.',
    steps: ['Research the topic', 'Draft for review', 'Owner signs off'],
  },
  {
    id: 'fulfillment',
    name: 'Fulfillment OS',
    signal: 'Intake is scattered. Exceptions sit in inboxes.',
    gate: 'A person accepts the packet. Nothing is committed or closed on its own.',
    steps: ['Check required fields', 'Queue the exceptions', 'Staff accepts the packet'],
  },
] as const;

export function BundleWorkflows() {
  return (
    <div className="bundle-flows">
      <div className="bundle-flows-head">
        <p className="bundle-kicker">Three workflows</p>
        <p>Each one stops for a person. These are scoped examples, not a live system or a promised result.</p>
      </div>
      {bundles.map((bundle) => (
        <article className="bundle-row" key={bundle.id} aria-labelledby={`${bundle.id}-title`}>
          <div className="bundle-copy">
            <h3 id={`${bundle.id}-title`}>{bundle.name}</h3>
            <p className="bundle-signal">{bundle.signal}</p>
            <p className="bundle-gate"><span>First gate</span>{bundle.gate}</p>
          </div>
          <div className="bundle-track" role="list" aria-label={`${bundle.name} workflow`}>
            {bundle.steps.map((step, index) => (
              <Fragment key={step}>
                {index > 0 && <span className="bundle-wire" aria-hidden="true" />}
                <div className="bundle-step holo-card" role="listitem">
                  <span className="bundle-index">{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
