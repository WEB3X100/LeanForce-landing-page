import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleCheck, Clock3, Database, FileText, GitBranch, Menu, MessageSquareText, MousePointer2, Network, RotateCcw, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
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
const capabilities = [
  { icon: MessageSquareText, title: 'Customer acquisition & CRM', text: 'Capture, qualify, route, and follow up—without letting a new lead disappear between tools.' },
  { icon: GitBranch, title: 'Operations & service delivery', text: 'Coordinate requests, tasks, exceptions, and handoffs around the way your team actually works.' },
  { icon: Database, title: 'Finance & control', text: 'Organize records, prepare reconciliations, and bring exceptions to a person for review.' },
  { icon: Network, title: 'Strategy & growth', text: 'Turn customer and operational signals into a clear next action for the people who own it.' },
];
const steps = [
  ['Discover', 'Review one real workflow and its exceptions.', 'Listen first'],
  ['Scope', 'Agree on the target outcome, baseline, constraints, and owner.', 'Human gate'],
  ['Design', 'Map the future workflow, tools, data, and approval points.', 'Map the handoffs'],
  ['Build', 'Configure and connect a focused workflow in testable slices.', 'Testable slices'],
  ['Validate', 'Run real scenarios with your team and document results.', 'Human gate'],
  ['Launch', 'Release with a named owner, support plan, and rollback path.', 'Human gate'],
  ['Improve', 'Review adoption and outcome measures, then refine.', 'Keep learning'],
];
const services = ['Workflow assessment and process mapping', 'AI agent and automation design', 'CRM, email, calendar, accounting, and operations integrations', 'Knowledge and SOP systems', 'Reporting, alerts, and exception queues', 'Ongoing optimization and support'];
const faqs = [
  ['Do we need to replace our existing software?', 'Usually, no. We start with the tools you already use and look for a practical way to connect them. If a tool is a real constraint, we will make that visible before scope is agreed.'],
  ['Which workflows are a good fit for AI?', 'Work that repeats, follows understandable rules, and has clear inputs and owners is often a useful place to start. We also map exceptions before deciding what should stay with a person.'],
  ['Where do people review or approve actions?', 'People stay in control of consequential decisions. Pricing, contracts, financial actions, sensitive customer communications, and uncertain cases have explicit review points.'],
  ['How do you handle exceptions and low-confidence cases?', 'Each workflow gets a named owner and an exception path. Unclear or incomplete cases are routed for review rather than quietly pushed through.'],
  ['How is success measured?', 'We agree a baseline and a useful measure during scoping—such as response time, cycle time, rework, missed handoffs, or exception rate. We do not assume an outcome in advance.'],
  ['Can we start with one workflow?', 'Yes. A focused first workflow is often the clearest way to learn what is useful before expanding.'],
  ['What happens after launch?', 'We agree an owner and support approach before release, then review adoption and measures to decide what should be refined next.'],
];
const demoStages = [
  { label: 'Incoming signal', icon: MessageSquareText, title: 'A new travel inquiry arrives', detail: 'Sample request · Email · 9:14 AM', body: '“Looking at a week in Portugal in September for two adults. We’re flexible on dates and would love a few itinerary ideas.”' },
  { label: 'Context gathered', icon: Database, title: 'Useful context, in one place', detail: 'Sample data · Not connected to live systems', body: 'Traveler count: 2 · Destination: Portugal · Timing: September · Preferences: itinerary ideas · Missing: exact dates, budget' },
  { label: 'AI worker prepares', icon: Sparkles, title: 'A structured brief is ready', detail: 'Proposed next step · Draft only', body: 'Ask for preferred week and approximate budget. Then prepare a shortlist of suitable options for advisor review.' },
  { label: 'Person reviews', icon: UserRound, title: 'Advisor decides what happens next', detail: 'Approval point · No message sent automatically', body: 'Review the questions, adjust the tone, and decide whether to send—or take over the conversation.' },
  { label: 'Record updated', icon: CircleCheck, title: 'The handoff is recorded', detail: 'Sample outcome · Demonstration only', body: 'Inquiry summary and next-step task are ready to be saved to the team’s chosen system after approval.' },
];

function App() {
  const [industry, setIndustry] = useState(0);
  const [step, setStep] = useState(0);
  const [demo, setDemo] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    document.title = 'LeanForce | Scale operations without scaling the busywork';
  }, []);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  const selectedIndustry = industries[industry];
  const activeDemo = demoStages[demo];
  const Icon = activeDemo.icon;
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="LeanForce home"><img src="/brand/leanforce-logo.png" alt="LeanForce" /></a>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}><Menu size={21} /></button>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
          <a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a><a href="#workflows" onClick={() => setMenuOpen(false)}>Use cases</a><a href="#implementation" onClick={() => setMenuOpen(false)}>How it works</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Talk through a workflow <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-backdrop" aria-hidden="true" />
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> AI operations, implemented with your team</div>
              <h1>Scale your operations without scaling the <span>busywork.</span></h1>
              <p className="hero-lede">LeanForce maps the work, connects the tools you already use, and deploys AI workers for repetitive workflows—with your team in control.</p>
              <div className="hero-actions"><a href="#contact" className="button button-primary">Book a Workflow Assessment <ArrowRight size={17} /></a><a href="#workflows" className="button button-quiet">Explore Use Cases <ArrowDown size={15} /></a></div>
              <div className="hero-proofline"><ShieldCheck size={17} /><span>Practical workflows. Clear owners. People decide what matters.</span></div>
            </div>
            <div className="flow-art" aria-label="Illustration of a customer inquiry moving through connected systems to a human approval point">
              <div className="flow-heading"><span className="tiny-label">A WORKFLOW, MADE VISIBLE</span><span className="live-pill"><i /> SAMPLE FLOW</span></div>
              <div className="flow-track">
                <div className="flow-node signal-node"><span className="node-icon"><MessageSquareText size={19} /></span><small>INQUIRY</small><b>New request</b><span>Email · 9:14</span></div>
                <div className="flow-wire"><span /></div>
                <div className="flow-node system-node"><span className="node-icon"><Database size={19} /></span><small>CONTEXT</small><b>Details gathered</b><span>Existing tools</span></div>
                <div className="flow-wire"><span /></div>
                <div className="flow-node ai-node"><span className="node-icon"><Sparkles size={19} /></span><small>AI WORKER</small><b>Next step drafted</b><span>Ready for review</span></div>
              </div>
              <div className="flow-approval"><div className="approval-line" /><div className="approval-card"><span className="approval-avatar"><UserRound size={18} /></span><div><small>HUMAN APPROVAL</small><b>A person decides what goes out</b></div><Check size={17} className="approval-check" /></div></div>
              <div className="flow-bottom"><span><span className="status-dot" /> Clear handoff</span><span>Sample workflow · not live</span></div>
            </div>
          </div>
          <div className="hero-footer"><span>BUILT AROUND YOUR REAL WORK</span><span className="footer-line" /><span>Map it&nbsp; · &nbsp;Connect it&nbsp; · &nbsp;Keep people in control</span></div>
        </section>

        <section className="problem section-pad" id="approach">
          <div className="section-heading split-heading"><div><p className="kicker">THE OPERATIONAL DRAG</p><h2>Good people lose time to work that <em>should move itself.</em></h2></div><p className="section-intro">Most teams don’t need another dashboard. They need the work between the tools to stop falling on the floor.</p></div>
          <div className="problem-grid">
            {[['01', 'Leads wait between systems', 'A request lands in one place. The next step lives somewhere else.'], ['02', 'Teams repeat the same updates and checks', 'People copy, paste, chase, and double-check work that should flow.'], ['03', 'Owners lack a clear view of what needs attention', 'Exceptions hide in inboxes until someone remembers to look.']].map(([n, title, text]) => <article className="problem-item" key={n}><span className="problem-number">{n}</span><div className="problem-mark"><span /><span /><span /></div><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="explorer section-pad" id="workflows">
          <div className="section-heading"><p className="kicker">PICK A PLACE TO START</p><h2>Start with one workflow that is <em>slowing you down.</em></h2><p className="section-intro">Choose an industry to see practical examples—not a promise that every workflow is already deployed.</p></div>
          <div className="industry-layout">
            <div className="industry-tabs" role="tablist" aria-label="Choose an industry">{industries.map((item, i) => <button role="tab" aria-selected={industry === i} className={industry === i ? 'industry-tab active' : 'industry-tab'} key={item.label} onClick={() => setIndustry(i)}><span>{item.icon}</span>{item.label}<ArrowUpRight size={14} /></button>)}</div>
            <div className="industry-content" role="tabpanel">
              <div className="industry-title"><div><span className="tiny-label">WORKFLOW EXAMPLES / {selectedIndustry.icon}</span><h3>{selectedIndustry.label}</h3></div><span className="example-note">PROPOSED OPPORTUNITIES</span></div>
              <div className="workflow-table-head"><span>TRIGGER</span><span>AI WORKER PREPARES</span><span>PERSON REVIEWS</span><span>MEASURE</span></div>
              <div className="workflow-examples">{selectedIndustry.examples.map(([trigger, prep, review, outcome], i) => <article className="workflow-row" key={trigger}><div className="trigger-cell"><span className="row-index">0{i + 1}</span><b>{trigger}</b></div><div className="row-detail"><span className="mobile-label">AI WORKER PREPARES</span>{prep}</div><div className="row-detail"><span className="mobile-label">PERSON REVIEWS</span>{review}</div><div className="measure-cell"><span className="mobile-label">MEASURE</span><span>{outcome}</span></div></article>)}</div>
              <p className="industry-disclaimer"><ShieldCheck size={15} /> Each workflow is scoped around your tools, constraints, and team.</p>
            </div>
          </div>
        </section>

        <section className="capabilities section-pad">
          <div className="section-heading"><p className="kicker">THE OPERATING LAYER</p><h2>A connected operating layer for <em>everyday work.</em></h2></div>
          <div className="capability-grid">{capabilities.map(({ icon: CapIcon, title, text }, i) => <article className="capability-card" key={title}><div className="capability-top"><span className="cap-index">0{i + 1}</span><CapIcon size={22} strokeWidth={1.65} /></div><h3>{title}</h3><p>{text}</p><span className="cap-line" /></article>)}</div>
          <p className="software-note"><span className="note-rule" /> LeanForce builds on the software you already use, wherever practical.</p>
        </section>

        <section className="implementation section-pad" id="implementation">
          <div className="section-heading"><p className="kicker">A CLEAR PATH FROM DAY ONE</p><h2>From process walkthrough to a workflow <em>your team can trust.</em></h2><p className="section-intro">Every phase makes ownership and review points visible—before anything goes live.</p></div>
          <div className="stepper" role="tablist" aria-label="Implementation steps">{steps.map(([name], i) => <button role="tab" aria-selected={step === i} key={name} className={step === i ? 'step-tab active' : 'step-tab'} onClick={() => setStep(i)}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span>{name}</span></button>)}</div>
          <div className="step-detail" role="tabpanel"><div className="step-detail-main"><span className="tiny-label">PHASE {String(step + 1).padStart(2, '0')} / 07</span><h3>{steps[step][0]}</h3><p>{steps[step][1]}</p></div><div className="step-detail-aside"><span className="gate-icon"><ShieldCheck size={19} /></span><div><small>BUILT-IN CHECKPOINT</small><b>{steps[step][2]}</b><p>{step === 1 || step === 3 || step === 4 || step === 5 ? 'Your team confirms what is ready before the workflow moves forward.' : 'Clear ownership and useful context keep the workflow grounded.'}</p></div></div><div className="step-controls"><button aria-label="Previous phase" onClick={() => setStep((step + steps.length - 1) % steps.length)}><ArrowRight className="prev-arrow" size={17} /></button><span>{String(step + 1).padStart(2, '0')} <i>/</i> 07</span><button aria-label="Next phase" onClick={() => setStep((step + 1) % steps.length)}><ArrowRight size={17} /></button></div></div>
          <div className="gate-strip"><ShieldCheck size={17} /><span>Human approval gates at scoping, client-facing actions, financial actions, UAT, and release.</span></div>
        </section>

        <section className="demo-section section-pad">
          <div className="demo-intro"><p className="kicker">A SMALL, CONCRETE EXAMPLE</p><h2>See the handoffs, <em>not just the AI.</em></h2><p>Click through a sample travel inquiry to see what is gathered, what gets prepared, and where a person steps in.</p><span className="sample-tag"><span /> SAMPLE DATA · NOT CONNECTED</span></div>
          <div className="demo-panel">
            <div className="demo-rail" role="tablist" aria-label="Travel inquiry workflow steps">{demoStages.map((stage, i) => <button key={stage.label} role="tab" aria-selected={demo === i} onClick={() => setDemo(i)} className={demo === i ? 'demo-step active' : 'demo-step'}><span className="demo-step-number">{String(i + 1).padStart(2, '0')}</span><span>{stage.label}</span>{i < demoStages.length - 1 && <span className="rail-connector" />}</button>)}</div>
            <div className="demo-screen" role="tabpanel"><div className="demo-screen-head"><span className="demo-screen-icon"><Icon size={20} /></span><span className="tiny-label">{activeDemo.detail}</span><span className="demo-reset"><button onClick={() => setDemo(0)} aria-label="Reset workflow demo"><RotateCcw size={15} /></button></span></div><h3>{activeDemo.title}</h3><div className="demo-content">{activeDemo.body}</div><div className="demo-screen-footer"><span><Clock3 size={14} /> Step {demo + 1} of {demoStages.length}</span><button onClick={() => setDemo((demo + 1) % demoStages.length)}>{demo === demoStages.length - 1 ? 'Start again' : 'Next handoff'} <ArrowRight size={15} /></button></div></div>
            <div className="demo-caveat"><ShieldCheck size={16} /> Illustrative only. No real systems, customer data, or messages are connected.</div>
          </div>
        </section>

        <section className="services section-pad">
          <div className="services-heading"><div><p className="kicker">BUILT AROUND YOUR WAY OF WORKING</p><h2>Focused systems, <em>built around the way you work.</em></h2></div><p>Start with the parts that solve a real constraint. Scope is tailored after discovery.</p></div>
          <div className="service-list">{services.map((service, i) => <div className="service-row" key={service}><span className="service-number">0{i + 1}</span><span>{service}</span><ArrowUpRight size={17} /></div>)}</div>
        </section>

        <section className="trust section-pad">
          <div className="trust-visual"><div className="trust-orbit orbit-one" /><div className="trust-orbit orbit-two" /><div className="trust-center"><img src="/brand/favicon.png" alt="" /><span>PEOPLE<br />IN CONTROL</span></div><div className="trust-tag tag-top"><ShieldCheck size={14} /> Approval points</div><div className="trust-tag tag-side"><UserRound size={14} /> Named owner</div><div className="trust-tag tag-bottom"><FileText size={14} /> Reviewable actions</div></div>
          <div className="trust-copy"><p className="kicker">AUTOMATION WITH BOUNDARIES</p><h2>Good automation knows <em>when to stop.</em></h2><p className="trust-intro">Useful workflows are not black boxes. They make it clear who owns the work, what needs a review, and what happens when something is uncertain.</p><ul className="trust-list">{['People approve pricing, contracts, financial decisions, and sensitive customer communications', 'Low-confidence cases go to a named person', 'Every workflow has an owner and an exception path', 'Important actions are recorded and reviewable', 'Access is limited to the tools and information needed'].map((line) => <li key={line}><span><Check size={13} /></span>{line}</li>)}</ul></div>
        </section>

        <section className="proof section-pad">
          <div className="section-heading split-heading"><div><p className="kicker">NO CLAIMS WITHOUT EVIDENCE</p><h2>Show the work. <em>Measure the change.</em></h2></div><p className="section-intro">We make the workflow and the measure visible. Verified client results will be shared here when available.</p></div>
          <div className="proof-grid">
            <article className="proof-card featured"><div className="proof-card-top"><span className="proof-state"><span /> INTERNAL DEMONSTRATION</span><span className="proof-num">01</span></div><h3>Travel inquiry to advisor-ready brief</h3><p>A sample handoff showing how an inquiry can be structured, enriched, and prepared for a person to review.</p><div className="proof-metric"><span>MEASURE TO AGREE</span><b>Time to first useful response</b></div></article>
            <article className="proof-card"><div className="proof-card-top"><span className="proof-state proposed"><span /> PROPOSED WORKFLOW</span><span className="proof-num">02</span></div><h3>Missed call to callback task</h3><p>A possible automotive workflow to capture intent, create a clear owner, and support timely follow-up.</p><div className="proof-metric"><span>MEASURE TO AGREE</span><b>Missed calls reached</b></div></article>
            <div className="proof-note"><ShieldCheck size={18} /><div><b>Verified client work</b><p>No verified client examples are supplied yet. No customer logos, quotes, or performance claims are presented.</p></div></div>
          </div>
        </section>

        <section className="engagement section-pad">
          <div className="section-heading"><p className="kicker">A PRACTICAL STARTING POINT</p><h2>Start with a focused workflow. <em>Expand when it works.</em></h2><p className="section-intro">Not every team needs the same engagement. We’ll discuss what fits after we understand the workflow.</p></div>
          <div className="engagement-grid">
            {[['01', 'Workflow Assessment', 'Identify the first valuable process, its constraints, and the right measure.', 'Find the first opportunity'], ['02', 'Implementation Sprint', 'Design, build, and validate a bounded workflow with the people who use it.', 'Build a focused workflow'], ['03', 'Managed AI Operations', 'Ongoing support, monitoring, and improvement as the workflow becomes part of the work.', 'Keep it working well']].map(([n, title, text, cta]) => <article className="engagement-card" key={n}><span className="engagement-number">{n}</span><div><h3>{title}</h3><p>{text}</p><a href="#contact">Discuss fit <ArrowRight size={15} /></a></div><span className="engagement-footer">{cta}</span></article>)}
          </div>
        </section>

        <section className="faq section-pad" id="faq">
          <div className="faq-heading"><p className="kicker">GOOD QUESTIONS, STRAIGHT ANSWERS</p><h2>Before we talk <em>workflows.</em></h2><p>Practical by design. Clear about what we know—and what we still need to learn.</p></div>
          <div className="faq-list">{faqs.map(([q, a], i) => <article className={openFaq === i ? 'faq-item open' : 'faq-item'} key={q}><button aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span className="faq-index">0{i + 1}</span><span>{q}</span><ChevronDown size={18} /></button><div className="faq-answer"><p>{a}</p></div></article>)}</div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="contact-top"><div><p className="kicker">ONE PROCESS IS ENOUGH TO START</p><h2>Find the workflow <em>worth fixing first.</em></h2><p>Bring one recurring process. We’ll map the handoffs, identify the constraints, and agree on a practical next step.</p></div><div className="contact-aside"><div className="contact-icon"><MousePointer2 size={19} /></div><b>Start with the friction you know.</b><span>We’ll work from there, together.</span></div></div>
          <div className="form-wrap"><div className="form-heading"><span className="tiny-label">A LITTLE CONTEXT HELPS</span><p>Tell us where the work gets stuck.</p></div>
            {submitted ? <div className="submit-message" role="status"><ShieldCheck size={22} /><div><b>Your details have not been sent.</b><p>This form is not connected to a booking or contact destination yet. Please reach LeanForce through its confirmed contact channel when one is available.</p></div></div> : <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>Name <input required name="name" autoComplete="name" placeholder="Your name" data-testid="input-name" /></label>
                <label>Company <input required name="company" autoComplete="organization" placeholder="Company name" data-testid="input-company" /></label>
                <label>Your role <input name="role" placeholder="Owner, operations lead…" data-testid="input-role" /></label>
                <label>Industry <select required name="industry" defaultValue="" data-testid="select-industry"><option value="" disabled>Select an industry</option>{industries.map((i) => <option key={i.label}>{i.label}</option>)}<option>Other</option></select></label>
                <label className="full-field">Workflow to improve <textarea required name="workflow" rows={3} placeholder="What keeps repeating, waiting, or falling between the cracks?" data-testid="input-workflow" /></label>
                <label className="full-field">Current tools <input name="tools" placeholder="Email, spreadsheets, CRM, booking system…" data-testid="input-tools" /></label>
                <fieldset className="full-field contact-method"><legend>Preferred contact method</legend><label><input type="radio" name="contactMethod" value="Email" defaultChecked /> Email</label><label><input type="radio" name="contactMethod" value="Phone" /> Phone</label><label><input type="radio" name="contactMethod" value="Either" /> Either</label><input aria-label="Contact detail (placeholder)" name="contactDetail" placeholder="Contact detail (destination not configured)" data-testid="input-contact-detail" /></fieldset>
                <label className="consent full-field"><input type="checkbox" required name="consent" /> I agree that LeanForce may use these details to respond to my inquiry. <a href="#privacy">Privacy details</a> are a placeholder until the policy is supplied.</label>
              </div>
              <div className="form-bottom"><p><ShieldCheck size={15} /> No submission is sent from this form yet.</p><button type="submit" className="button button-primary">Review my workflow <ArrowRight size={16} /></button></div>
            </form>}
            <div className="form-disclaimer" id="privacy"><span>BOOKING LINK: NOT CONFIGURED</span><span>CONTACT DESTINATION: NOT CONFIGURED</span><span>PRIVACY POLICY: PLACEHOLDER</span></div>
          </div>
          <div className="contact-reassure"><span><Clock3 size={15} /> No fixed prices or timelines before discovery.</span><span><ShieldCheck size={15} /> No commitment required to explore fit.</span></div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main"><a className="footer-brand" href="#top"><img src="/brand/leanforce-logo-white.png" alt="LeanForce" /></a><p>Make the work visible.<br />Give people room to do their best work.</p><a className="footer-cta" href="#contact">Start with a workflow <ArrowUpRight size={16} /></a></div>
        <div className="footer-bottom"><span>© 2026 LeanForce. Practical AI operations.</span><span>Contact details and legal pages to be supplied.</span><a href="#privacy">Privacy placeholder <ArrowUpRight size={12} /></a></div>
      </footer>
    </div>
  );
}

export default App;
