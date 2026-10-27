import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Route, Switch } from 'wouter';
import { ArrowRight, Check, ChevronDown, CircleCheck, Clock3, Database, MessageSquareText, RotateCcw, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import BorderGlow from './components/BorderGlow';
import { BentoItem } from './components/ui/holographic-interface';
import InkOrbitFeatures from './components/ui/ink-orbit-features';
import { OpeningSequence } from './components/OpeningSequence';
import { CursorGrid } from './components/CursorGrid';
import { SiteFrame } from './components/SiteFrame';
import EngagementsPage from './pages/EngagementsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import { validateInquiry } from './lib/inquiry';
import './index.css';

const industries = [
  { label: 'Travel', icon: '01', examples: [
    ['New trip inquiry', 'Gather dates, traveler count, and preferences into a structured brief.', 'An advisor confirms fit and sends the right options.', 'Time to first useful response'],
    ['Booking change', 'Collect itinerary details and surface supplier rules for the requested change.', 'A person approves any fee or itinerary change.', 'Change cycle time'],
    ['Supplier reconciliation', 'Match supplier statements against booking records and flag differences.', 'Finance reviews exceptions before posting.', 'Unmatched items per period'],
  ]},
  { label: 'Clinics', icon: '02', examples: [
    ['Appointment request', 'Route intent, preferred times, and existing patient context to the right queue.', 'Staff confirms availability and patient-specific details.', 'Time to confirmed appointment'],
    ['Recall reminder', 'Prepare a due list and draft a reminder using clinic-approved language.', 'The care team reviews sensitive or uncertain cases.', 'Recall follow-up completion'],
    ['Claims follow-up', 'Organize claim status and payer correspondence into an exception queue.', 'Billing staff decides next action and verifies records.', 'Aging claims needing review'],
  ]},
  { label: 'Real Estate', icon: '03', examples: [
    ['New property lead', 'Summarize budget, location, timing, and property preferences.', 'An agent qualifies the lead and chooses what to share.', 'Time to meaningful follow-up'],
    ['Transaction checklist', 'Track milestones and request missing documents from the right owner.', 'The transaction lead approves client-facing updates.', 'Overdue handoffs'],
    ['Maintenance request', 'Classify a request, capture key details, and route by property.', 'A manager reviews urgency and authorizes vendor action.', 'Time to assigned owner'],
  ]},
  { label: 'Restaurants', icon: '04', examples: [
    ['Catering inquiry', 'Capture event date, guest count, dietary needs, and service style.', 'A manager reviews availability, menu, and quote.', 'Time to complete proposal'],
    ['Order recovery', 'Collect order context and prepare a response for a service issue.', 'Staff chooses the remedy and sends the response.', 'Time to resolved issue'],
    ['Inventory reorder', 'Compare stock notes with reorder thresholds and draft a purchase list.', 'A manager checks quantities and places the order.', 'Stock exceptions reviewed'],
  ]},
  { label: 'Automotive', icon: '05', examples: [
    ['Missed-call follow-up', 'Create a callback task with caller details and likely service intent.', 'A team member confirms needs and scheduling.', 'Missed calls reached'],
    ['Service scheduling', 'Gather vehicle, issue, and availability before proposing appointment slots.', 'Service staff confirms the right slot and work type.', 'Time from request to booking'],
    ['Sales handoff', 'Summarize a lead’s vehicle interests and prior conversation.', 'A salesperson decides the next conversation.', 'Lead handoff completion'],
  ]},
  { label: 'Professional Services', icon: '06', examples: [
    ['Client onboarding', 'Turn a signed engagement into a checklist of owners and missing inputs.', 'The lead reviews scope and sends the welcome note.', 'Time to onboarding ready'],
    ['Knowledge routing', 'Find relevant approved SOP or project context for a team question.', 'A subject-matter owner validates the answer when needed.', 'Repeat questions routed'],
    ['Reporting prep', 'Gather source updates into a draft weekly status with open items.', 'The account owner edits and shares the report.', 'Time spent preparing updates'],
  ]},
];
const faqs = [
  ['What does each phase include?', 'Assessment & Map delivers the current-state map, a priority, a measurement plan, a future-state workflow, an agent blueprint, the approval points, and a Sprint Build proposal. Sprint Build delivers the tested workflow, agent limits, an operating guide, and a handoff. Managed Run covers monitoring, triage, an agreed review cadence, and improvement recommendations for the workflows named in the support agreement. The full list is on the Focused Workflow page.'],
  ['Do we have to replace our software?', 'No. The work starts with the tools you already use. If a tool is blocking the workflow, that shows up in the assessment before any build is scoped.'],
  ['Which agents are included?', 'Assessment designs an agent. It does not deploy one. Sprint Build includes only the agent roles written into the proposal, each with allowed actions, inputs, outputs, limits, and an escalation path. Managed Run covers the production agents named in the support agreement. A new agent is priced separately.'],
  ['What still needs a person’s approval?', 'A person approves pricing, contracts, financial actions, sensitive communications, and any case the workflow cannot resolve. The agent can prepare the step. It does not make those decisions.'],
  ['How are the fees calculated?', 'There is no published rate. Assessment & Map is a one-time fee based on workflow count, complexity, stakeholders, systems, and mapping depth. Sprint Build is a separate one-time fee based on the agreed scope. Managed Run is a recurring fee based on the workflows in support, volume, coverage, response expectation, and change cadence. A fixed scope and fee are confirmed after assessment.'],
  ['Who pays for third-party software and usage?', 'Platform, API, and software usage charges belong to those providers. They are not included in the LeanForce fee. The assessment names the tools a workflow would use before a build is agreed.'],
  ['What do we need to provide?', 'Access to the people who run the process, a walkthrough of how it works today, and the tools it already touches. Sensitive records stay with your team unless a later scope says otherwise.'],
  ['What happens after launch?', 'The named owner runs the workflow. You can stop there, or add Managed Run for an agreed review cadence. A major change is a new scope, not an automatic part of support.'],
];
const osGlow = {
  borderRadius: 18,
  backgroundColor: '#070b10',
  glowRadius: 10,
  glowIntensity: 0.42,
  coneSpread: 16,
  animated: true,
};

type AgentMark = 'crm' | 'strategy' | 'ops' | 'finance';

function OsCard({ title }: { title: string }) {
  return (
    <BorderGlow className="os-glow" {...osGlow}>
      <article className="os-card">
        <span className="os-bloom" aria-hidden="true" />
        <h3>{title}</h3>
      </article>
    </BorderGlow>
  );
}

function ClassAgent({ mark }: { mark: AgentMark }) {
  const name = { crm: 'CRM', strategy: 'Growth', ops: 'Delivery', finance: 'Finance' }[mark];
  return (
    <span className={`os-agent os-agent-${mark}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <ellipse cx="32" cy="60" rx="12" ry="2.2" fill="#061a35" opacity=".15" />
        <path d="M32 14V8" stroke="#19c3dc" strokeWidth="2" strokeLinecap="round" />
        {mark === 'strategy' ? <path d="M32 4l2.2 2.2L32 8.4 29.8 6.2z" fill="#7ee7f5" /> : <circle cx="32" cy="6" r="3" fill="#19c3dc" />}
        <rect x="16" y="16" width="32" height="36" rx="16" fill="#061a35" />
        <path d="M18 28c6-10 22-10 28 0" stroke="#19c3dc" strokeOpacity=".55" strokeWidth="6" strokeLinecap="round" />
        <circle cx="26" cy="31" r="2.3" fill="#7ee7f5" />
        <circle cx="38" cy="31" r="2.3" fill="#7ee7f5" />
        <circle cx="26.8" cy="30.2" r=".7" fill="#f6f5ef" />
        <circle cx="38.8" cy="30.2" r=".7" fill="#f6f5ef" />
        <path d="M28 37c1.3 1.2 6.7 1.2 8 0" stroke="#19c3dc" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {mark === 'crm' && <path d="M26 43h12v5h-7l-3 2.4V48h-2z" fill="#7ee7f5" />}
        {mark === 'strategy' && <path d="M24 45h5v5h-5zM35 45h5v5h-5zM29 47.5h6" stroke="#7ee7f5" strokeWidth="1.6" fill="none" />}
        {mark === 'ops' && <path d="M24 44l8 6 8-6" stroke="#7ee7f5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
        {mark === 'finance' && <path d="M26 50v-4M32 50v-7M38 50v-5" stroke="#7ee7f5" strokeWidth="1.8" strokeLinecap="round" />}
      </svg>
      <span className="os-agent-name">{name}</span>
    </span>
  );
}

function AgentLane({ mark, title, tasks }: { mark: AgentMark; title: string; tasks: string[] }) {
  const [open, setOpen] = useState(false);
  const panelId = `os-tasks-${mark}`;
  return (
    <div className={open ? 'os-lane open' : 'os-lane'}>
      <span className="os-lane-line" aria-hidden="true" />
      <button type="button" className="os-agent-btn" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((current) => !current)}>
        <ClassAgent mark={mark} />
        <span className="sr-only">{open ? 'Hide' : 'Show'} {title} tasks</span>
      </button>
      <div className="os-tasks" id={panelId} role="region" aria-label={`${title} thought tasks`} aria-hidden={!open} inert={open ? undefined : true}>
        <ol>
          {tasks.map((task) => <li key={task}>{task}</li>)}
        </ol>
      </div>
    </div>
  );
}

const demoStages = [
  { label: 'Input', icon: MessageSquareText, title: 'A new travel inquiry arrives', detail: 'Sample request · Email · 9:14 AM', body: '“Looking at a week in Portugal in September for two adults. We’re flexible on dates and would love a few itinerary ideas.”' },
  { label: 'Context gathered', icon: Database, title: 'Useful context, in one place', detail: 'Sample data · Not a live system', body: 'Traveler count: 2 · Destination: Portugal · Timing: September · Preferences: itinerary ideas · Missing: exact dates, budget' },
  { label: 'Agent prepares', icon: Sparkles, title: 'A structured brief is drafted', detail: 'Preparation only · Nothing is sent', body: 'Ask for the preferred week and an approximate budget. Then prepare a shortlist for the advisor to review.' },
  { label: 'Human review', icon: UserRound, title: 'The advisor decides what happens next', detail: 'Approval point · No message is sent', body: 'Review the questions, adjust the tone, and decide whether to send or take over the conversation.' },
  { label: 'Handoff', icon: CircleCheck, title: 'The next step is ready for the owner', detail: 'Sample outcome · Not a client result', body: 'The inquiry summary and the next-step task are ready for the team’s own system, after the advisor approves them.' },
];

function moveTab(event: KeyboardEvent<HTMLElement>, index: number, count: number, select: (next: number) => void) {
  const key = event.key;
  if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') return;
  event.preventDefault();
  const next = key === 'ArrowRight' ? (index + 1) % count : key === 'ArrowLeft' ? (index - 1 + count) % count : key === 'Home' ? 0 : count - 1;
  select(next);
  const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  tabs[next]?.focus();
}

function HomePage() {
  const [industry, setIndustry] = useState(0);
  const [demo, setDemo] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openExamples, setOpenExamples] = useState<number[]>([0]);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [contactMethod, setContactMethod] = useState('Email');
  const successRef = useRef<HTMLDivElement>(null);
  const errorFocus = useRef<string | null>(null);
  useEffect(() => {
    if (formStatus === 'sent') successRef.current?.focus();
  }, [formStatus]);
  useEffect(() => {
    const field = errorFocus.current;
    if (!field) return;
    const ids: Record<string, string> = {
      name: 'inquiry-name',
      company: 'inquiry-company',
      industry: 'inquiry-industry',
      workflow: 'inquiry-workflow',
      contactDetail: 'inquiry-detail',
    };
    const target = field === 'consent'
      ? document.querySelector<HTMLElement>('input[name="consent"]')
      : document.getElementById(ids[field] ?? '');
    target?.focus();
    errorFocus.current = null;
  }, [formErrors]);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? ''),
      role: String(data.get('role') ?? ''),
      industry: String(data.get('industry') ?? ''),
      workflow: String(data.get('workflow') ?? ''),
      tools: String(data.get('tools') ?? ''),
      contactMethod,
      contactDetail: String(data.get('contactDetail') ?? ''),
      consent: data.get('consent') === 'on',
    };
    const { errors, value } = validateInquiry(payload);
    setFormErrors(errors);
    if (!value) {
      setFormStatus('idle');
      errorFocus.current = Object.keys(errors)[0] ?? null;
      return;
    }
    setFormStatus('sending');
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { errors?: Record<string, string> } | null;
        if (body?.errors) setFormErrors(body.errors);
        throw new Error('Inquiry was not saved');
      }
      setFormStatus('sent');
    } catch {
      setFormStatus('error');
    }
  };
  const selectedIndustry = industries[industry];
  const activeDemo = demoStages[demo];
  const Icon = activeDemo.icon;
  return (
    <SiteFrame>
        <section className="hero">
          <div className="hero-backdrop" aria-hidden="true" />
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>Scale your operations without scaling the <span>busywork.</span></h1>
              <p className="hero-lede">LeanForce maps a workflow, connects the tools you already use, and puts AI workers on the repetitive steps. Your team still reviews exceptions and approves what goes out.</p>
              <div className="hero-actions"><a href="#contact" className="button button-primary">Talk through a workflow <ArrowRight size={17} /></a><a href="#how-it-works" className="button button-quiet">See how it works <ArrowRight size={15} /></a></div>
              <div className="hero-proofline"><ShieldCheck size={17} /><span>Practical workflows. Clear owners. People decide what matters.</span></div>
            </div>
            <BorderGlow className="flow-art" borderRadius={16} backgroundColor="#000" aria-label="Illustration of a customer inquiry moving through connected systems to a human approval point" animated>
              <div className="flow-heading"><span className="tiny-label">A WORKFLOW, MADE VISIBLE</span><span className="live-pill"><i /> SAMPLE FLOW</span></div>
              <div className="flow-track">
                <div className="flow-node signal-node"><span className="node-icon"><MessageSquareText size={22} /></span><small>INQUIRY</small><b>New request</b><span>Email · 9:14</span></div>
                <div className="flow-wire" />
                <div className="flow-node system-node"><span className="node-icon"><Database size={22} /></span><small>CONTEXT</small><b>Details gathered</b><span>Existing tools</span></div>
                <div className="flow-wire" />
                <div className="flow-node ai-node"><span className="node-icon"><Sparkles size={22} /></span><small>AI WORKER</small><b>Next step drafted</b><span>Ready for review</span></div>
                <div className="flow-wire" />
                <div className="flow-node approval-node"><span className="node-icon"><UserRound size={22} /></span><small>HUMAN APPROVAL</small><b>A person decides</b><span>What goes out</span><Check size={16} className="approval-check" /></div>
              </div>
              <div className="flow-bottom"><span><span className="status-dot" /> Clear handoff</span><span>Sample workflow · not live</span></div>
            </BorderGlow>
          </div>
        </section>

        <OpeningSequence />

        <div className="night-band">
        <CursorGrid />
        <section className="explorer section-pad" id="workflows">
          <div className="section-heading"><h2>Start with one workflow that is <em>slowing you down.</em></h2><p className="section-intro">Choose an industry to see practical examples—not a promise that every workflow is already deployed.</p></div>
          <div className="industry-layout">
            <div className="industry-tabs" role="tablist" aria-label="Choose an industry" onKeyDown={(event) => moveTab(event, industry, industries.length, (next) => { setIndustry(next); setOpenExamples([0]); })}>{industries.map((item, i) => <button type="button" role="tab" id={`industry-tab-${i}`} aria-selected={industry === i} aria-controls="industry-panel" tabIndex={industry === i ? 0 : -1} className={industry === i ? 'industry-tab active' : 'industry-tab'} key={item.label} onClick={() => { setIndustry(i); setOpenExamples([0]); }}><span>{item.icon}</span>{item.label}</button>)}</div>
            <div className="industry-content" role="tabpanel" id="industry-panel" aria-labelledby={`industry-tab-${industry}`}>
              <div className="industry-title"><div><span className="tiny-label">ILLUSTRATIVE EXAMPLES / {selectedIndustry.icon}</span><h3>{selectedIndustry.label}</h3></div><span className="example-note">NOT A CLIENT RESULT</span></div>
              <div className="workflow-accordion">
                {selectedIndustry.examples.map(([trigger, prep, review, outcome], i) => {
                  const open = openExamples.includes(i);
                  const panelId = `workflow-example-${industry}-${i}`;
                  return (
                    <div className={open ? 'workflow-acc open' : 'workflow-acc'} key={trigger}>
                      <button type="button" className="workflow-acc-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpenExamples((current) => current.includes(i) ? current.filter((item) => item !== i) : [...current, i])}>
                        <span className="workflow-acc-mark" aria-hidden="true">{open ? '−' : '+'}</span>
                        <span>{trigger}</span>
                      </button>
                      <div className="workflow-acc-panel" id={panelId} role="region" aria-label={trigger}>
                        <div className="workflow-acc-body">
                          <p><span>AI worker prepares</span>{prep}</p>
                          <p><span>Person reviews</span>{review}</p>
                          <p><span>Measure</span>{outcome}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="industry-disclaimer"><ShieldCheck size={15} /> Illustrative examples. Not connected to a client system. A real workflow is scoped around your tools, constraints, and team.</p>
            </div>
          </div>
        </section>
        </div>

        <section className="implementation section-pad" id="how-it-works">
          <div className="section-heading"><h2>From process walkthrough to a workflow <em>your team can trust.</em></h2><p className="section-intro">These four areas are where repeated work usually sits. LeanForce maps one process, connects the tools already in use, and prepares the next step. Click an agent to see that step. A person still decides what moves.</p></div>
          <div className="os-split">
            <div className="os-origin">
              <p className="os-origin-label">Your operations</p>
              <span className="os-mark" role="img" aria-label="Mirrored LeanForce mark connecting customer, growth, delivery, and finance work." />
            </div>
            <div className="os-branches">
              <div className="os-branch">
                <span className="os-tag">Distribution</span>
                <div className="os-stream">
                  <OsCard title="Customer acquisition & CRM" />
                  <AgentLane mark="crm" title="Customer acquisition and CRM" tasks={['Qualify the lead', 'Draft the follow-up', 'Hand off for review']} />
                </div>
              </div>
              <div className="os-branch">
                <span className="os-tag">Production and distribution</span>
                <div className="os-stream">
                  <OsCard title="Strategy & growth" />
                  <AgentLane mark="strategy" title="Strategy and growth" tasks={['Read the signal', 'Draft the next move', 'Owner reviews']} />
                </div>
              </div>
              <div className="os-branch">
                <span className="os-tag">Production</span>
                <div className="os-stack">
                  <div className="os-stream">
                    <OsCard title="Operations & service delivery" />
                    <AgentLane mark="ops" title="Operations and service delivery" tasks={['Sort the request', 'Prepare the handoff', 'Queue the exception']} />
                  </div>
                  <div className="os-stream">
                    <OsCard title="Finance & control" />
                    <AgentLane mark="finance" title="Finance and control" tasks={['Match the record', 'Flag the difference', 'Hold for review']} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="demo-section section-pad" aria-labelledby="sample-workflow-heading">
          <div className="demo-copy">
            <h2 id="sample-workflow-heading">One workflow, <em>step by step.</em></h2>
            <p>A sample travel inquiry. It shows the input, the context gathered, what an agent prepares, where a person reviews, and the handoff that follows. It is not connected to a client system.</p>
            <span className="sample-tag"><span /> ILLUSTRATIVE · NOT A CLIENT SYSTEM</span>
          </div>
          <BentoItem className="demo-panel">
            <svg className="animated-border" aria-hidden="true"><rect width="100%" height="100%" rx="16" /></svg>
            <div className="demo-rail" role="tablist" aria-label="Sample travel inquiry steps" onKeyDown={(event) => moveTab(event, demo, demoStages.length, setDemo)}>{demoStages.map((stage, i) => <button type="button" key={stage.label} role="tab" id={`demo-tab-${i}`} aria-selected={demo === i} aria-controls="demo-panel" tabIndex={demo === i ? 0 : -1} onClick={() => setDemo(i)} className={demo === i ? 'demo-step active' : 'demo-step'}><span className="demo-step-number">{String(i + 1).padStart(2, '0')}</span><span>{stage.label}</span>{i < demoStages.length - 1 && <span className="rail-connector" />}</button>)}</div>
            <div className="demo-screen" role="tabpanel" id="demo-panel" aria-labelledby={`demo-tab-${demo}`}><div className="demo-screen-head"><span className="demo-screen-icon"><Icon size={20} /></span><span className="tiny-label">{activeDemo.detail}</span><span className="demo-reset"><button type="button" onClick={() => setDemo(0)} aria-label="Reset workflow demo"><RotateCcw size={15} /></button></span></div><h3>{activeDemo.title}</h3><div className="demo-content">{activeDemo.body}</div><div className="demo-screen-footer"><span><Clock3 size={14} /> Step {demo + 1} of {demoStages.length}</span><button type="button" onClick={() => setDemo((demo + 1) % demoStages.length)}>{demo === demoStages.length - 1 ? 'Start again' : 'Next handoff'} <ArrowRight size={15} /></button></div></div>
            <div className="demo-caveat"><ShieldCheck size={16} /> Illustrative sample. No client system, customer data, or live message is connected.</div>
          </BentoItem>
        </section>

        <section className="engagement section-pad" id="engagement">
          <div className="section-heading"><h2>Start with one workflow. <em>Add a phase when it earns it.</em></h2></div>
          <div className="phase-row">
            <article className="phase-card">
              <svg className="animated-border" aria-hidden="true"><rect width="100%" height="100%" rx="16" /></svg>
              <p className="phase-billing">One-time</p>
              <h3>Assessment &amp; Map</h3>
              <p>Map the work. No live agent.</p>
            </article>
            <article className="phase-card">
              <svg className="animated-border" aria-hidden="true"><rect width="100%" height="100%" rx="16" /></svg>
              <p className="phase-billing">One-time</p>
              <h3>Sprint Build</h3>
              <p>Build it and hand it over.</p>
            </article>
            <article className="phase-card">
              <svg className="animated-border" aria-hidden="true"><rect width="100%" height="100%" rx="16" /></svg>
              <p className="phase-billing">Recurring</p>
              <h3>Managed Run</h3>
              <p>Support only launched workflows.</p>
            </article>
          </div>
          <p className="phase-actions"><a className="button button-primary" href="/engagements">See what each phase includes <ArrowRight size={16} /></a></p>
        </section>

        <section className="account-band" id="measure" aria-labelledby="account-heading">
          <InkOrbitFeatures
            theme="dark"
            brand="LeanForce"
            headingId="account-heading"
            tag="Three bundles"
            title={"One operating layer.\n*A person still decides.*"}
            lede="Distribution, production, and security. Each bundle stops for a person. These are scoped products, not a live system or a promised result."
            collaboration={{
              title: 'Distribution · Capture & Qualify',
              description: 'Leads leak. The first response takes hours, and follow-up is manual and inconsistent. LeanForce routes and qualifies each inquiry, then records consent and disposition in the CRM.',
              repos: ['Twenty', 'Comp AI CRM', 'n8n', 'Activepieces', 'n8n-MCP', 'Chatwoot', 'ChatbotX', 'zernflow', 'cal.diy', 'android-sms-gateway', 'agentphone MCP', 'Composio', 'Mem0', 'Graphiti'],
            }}
            reports={{
              title: 'First gate',
              description: 'Prototype in an isolated environment with test credentials. Sandbox before any CRM write. A person approves outreach or booking.',
            }}
            integrations={{
              title: 'Production · Fulfillment OS',
              description: 'Intake is chaotic, rework piles up, and exceptions age in inboxes with no single work packet. Intake becomes one packet: required fields checked, documents extracted, exceptions queued, and staff accepts. Narrow the input, sanitize files, and do not commit or close anything without a person.',
              tools: ['MarkItDown', 'ToolJet', 'qmd', 'graphify', 'LightRAG', 'RAGFlow', 'ScrapeGraphAI', 'browser-harness', 'n8n', 'Dify, bounded', 'Sim'],
            }}
            insights={{
              title: 'Security · Identity & posture',
              description: 'Inconsistent MFA, unmanaged credentials, unknown assets, weak endpoint visibility, and no actionable baseline. Assess the gaps, then produce a prioritized remediation plan, owner-approved changes, and a recurring posture report. Begin read-only, with a consented audit and test accounts. No identity change, blocking rule, or endpoint agent without authorized change control. Validate retention, backups, and operative ownership.',
              values: [5, 6, 4, 7, 5, 6, 4, 5],
              forecastFrom: 6,
              stages: ['Inventory', 'MFA', 'Credentials', 'Assets', 'Endpoints', 'Plan', 'Owner', 'Report'],
              marker: 'OWNER',
              repos: ['Keycloak', 'Wazuh', 'Trivy', 'OpenBao', 'CrowdSec'],
            }}
          />
        </section>

        <section className="faq section-pad" id="faq">
          <div className="faq-heading"><h2>Questions before you <em>start.</em></h2><p>What each phase includes, what you keep, and how a fee is set. The <a href="/engagements">Focused Workflow page</a> has the full scope.</p></div>
          <div className="faq-list">{faqs.map(([q, a], i) => <article className={openFaq === i ? 'faq-item open' : 'faq-item'} key={q}><button type="button" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{q}</span><ChevronDown size={18} /></button><div className="faq-answer"><p>{a}</p></div></article>)}</div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="contact-top"><div><h2>Talk through <em>a workflow.</em></h2><p>Send one recurring process. LeanForce reads it and replies about whether an assessment is a fit. That reply is not a quote. A scope and a fee come after the process is understood.</p></div><div className="contact-aside"><b>What happens next</b><span>You get a reply about this workflow. Nothing is sold, and nothing here sets a price or a timeline.</span></div></div>
          <div className="form-wrap"><div className="form-heading"><span className="tiny-label">ONE WORKFLOW</span><p>Tell us where the work gets stuck.</p></div>
            {formStatus === 'sent' ? <div className="submit-message" role="status" tabIndex={-1} ref={successRef}><ShieldCheck size={22} /><div><b>We have your note.</b><p>LeanForce will reply about this workflow. The details stay with this site and are used only to respond.</p><button type="button" className="button button-primary" onClick={() => { setFormStatus('idle'); setFormErrors({}); }}>Send another note</button></div></div> : <form onSubmit={handleSubmit} noValidate>
              {formStatus === 'error' && <p className="form-alert" role="alert">We could not save this note. Check the fields and try again.</p>}
              <div className="form-grid">
                <label htmlFor="inquiry-name">Name <input id="inquiry-name" name="name" autoComplete="name" placeholder="Your name" data-testid="input-name" aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? 'inquiry-name-error' : undefined} />{formErrors.name && <span className="field-error" id="inquiry-name-error">{formErrors.name}</span>}</label>
                <label htmlFor="inquiry-company">Company <input id="inquiry-company" name="company" autoComplete="organization" placeholder="Company name" data-testid="input-company" aria-invalid={Boolean(formErrors.company)} aria-describedby={formErrors.company ? 'inquiry-company-error' : undefined} />{formErrors.company && <span className="field-error" id="inquiry-company-error">{formErrors.company}</span>}</label>
                <label htmlFor="inquiry-role"><span>Your role <span className="optional">Optional</span></span><input id="inquiry-role" name="role" placeholder="Owner, operations lead…" data-testid="input-role" /></label>
                <label htmlFor="inquiry-industry">Industry <select id="inquiry-industry" name="industry" defaultValue="" data-testid="select-industry" aria-invalid={Boolean(formErrors.industry)} aria-describedby={formErrors.industry ? 'inquiry-industry-error' : undefined}><option value="">Select an industry</option>{industries.map((i) => <option key={i.label}>{i.label}</option>)}<option>Other</option></select>{formErrors.industry && <span className="field-error" id="inquiry-industry-error">{formErrors.industry}</span>}</label>
                <label className="full-field" htmlFor="inquiry-workflow">Workflow to improve <textarea id="inquiry-workflow" name="workflow" rows={3} placeholder="What keeps repeating, waiting, or falling between the cracks?" data-testid="input-workflow" aria-invalid={Boolean(formErrors.workflow)} aria-describedby={formErrors.workflow ? 'inquiry-workflow-error' : undefined} />{formErrors.workflow && <span className="field-error" id="inquiry-workflow-error">{formErrors.workflow}</span>}</label>
                <label className="full-field" htmlFor="inquiry-tools"><span>Current tools <span className="optional">Optional</span></span><input id="inquiry-tools" name="tools" placeholder="Email, spreadsheets, CRM, booking system…" data-testid="input-tools" /></label>
                <fieldset className="full-field contact-method"><legend>Preferred contact method</legend><label><input type="radio" name="contactMethod" value="Email" checked={contactMethod === 'Email'} onChange={() => setContactMethod('Email')} /> Email</label><label><input type="radio" name="contactMethod" value="Phone" checked={contactMethod === 'Phone'} onChange={() => setContactMethod('Phone')} /> Phone</label><label><input type="radio" name="contactMethod" value="Either" checked={contactMethod === 'Either'} onChange={() => setContactMethod('Either')} /> Either</label><label className="contact-detail" htmlFor="inquiry-detail">{contactMethod === 'Phone' ? 'Phone number' : contactMethod === 'Email' ? 'Email address' : 'Email or phone'} <input id="inquiry-detail" name="contactDetail" type={contactMethod === 'Phone' ? 'tel' : contactMethod === 'Email' ? 'email' : 'text'} autoComplete={contactMethod === 'Phone' ? 'tel' : contactMethod === 'Email' ? 'email' : 'on'} placeholder={contactMethod === 'Phone' ? '+1 555 010 0142' : contactMethod === 'Email' ? 'name@company.com' : 'name@company.com or phone'} data-testid="input-contact-detail" aria-invalid={Boolean(formErrors.contactDetail)} aria-describedby={formErrors.contactDetail ? 'inquiry-detail-error' : undefined} />{formErrors.contactDetail && <span className="field-error" id="inquiry-detail-error">{formErrors.contactDetail}</span>}</label></fieldset>
                <label className="consent full-field"><input type="checkbox" name="consent" aria-invalid={Boolean(formErrors.consent)} aria-describedby={formErrors.consent ? 'inquiry-consent-error' : undefined} /> I agree that LeanForce may use these details only to reply to this inquiry. <a href="/privacy">How this is used</a>{formErrors.consent && <span className="field-error" id="inquiry-consent-error">{formErrors.consent}</span>}</label>
              </div>
              <div className="form-bottom"><p><ShieldCheck size={15} /> Used only to reply about this workflow. <a href="/privacy">Read the privacy note</a></p><button type="submit" className="button button-primary" disabled={formStatus === 'sending'}>{formStatus === 'sending' ? 'Saving…' : 'Talk through a workflow'} {formStatus === 'sending' ? null : <ArrowRight size={16} />}</button></div>
            </form>}
          </div>
          <div className="contact-reassure"><span><Clock3 size={15} /> No fee or timeline is set by this form.</span><span><ShieldCheck size={15} /> Sending it does not start an engagement.</span></div>
        </section>
    </SiteFrame>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/engagements" component={EngagementsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
