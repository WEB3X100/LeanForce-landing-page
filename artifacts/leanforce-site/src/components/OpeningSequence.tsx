const nodes = [
  { name: 'CRM', place: 'crm' },
  { name: 'Growth', place: 'growth' },
  { name: 'Delivery', place: 'delivery' },
  { name: 'Finance', place: 'finance' },
];

function CubeFaces() {
  return (
    <>
      <span className="cube-face cube-front" />
      <span className="cube-face cube-back" />
      <span className="cube-face cube-left" />
      <span className="cube-face cube-right" />
      <span className="cube-face cube-top" />
      <span className="cube-face cube-bottom" />
    </>
  );
}

function Visor() {
  return (
    <span className="agent-visor" aria-hidden="true">
      <i />
      <i />
      <b />
    </span>
  );
}

function HeadFaces() {
  return (
    <>
      <span className="agent-face agent-front"><Visor /></span>
      <span className="agent-face agent-back"><Visor /></span>
      <span className="agent-face agent-left" />
      <span className="agent-face agent-right" />
      <span className="agent-face agent-top" />
      <span className="agent-face agent-bottom" />
    </>
  );
}

function BodyFaces() {
  return (
    <>
      <span className="body-face body-front"><i className="agent-core" /></span>
      <span className="body-face body-back"><i className="agent-core" /></span>
      <span className="body-face body-left" />
      <span className="body-face body-right" />
      <span className="body-face body-top" />
      <span className="body-face body-bottom" />
    </>
  );
}

export function OpeningSequence() {
  return (
    <section className="opening" id="approach" aria-labelledby="opening-title">
      <div className="opening-inner">
        <h2 id="opening-title">
          <span className="opening-line">The work should move.</span>
          <span className="opening-line opening-line-next">A person decides.</span>
        </h2>
        <div className="holo-stage">
          <div className="holo-floor" aria-hidden="true" />
          <svg className="holo-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <rect x="36" y="28" width="28" height="40" />
            <line x1="50" y1="18" x2="50" y2="82" />
            <line x1="36" y1="28" x2="18" y2="20" />
            <line x1="64" y1="28" x2="82" y2="20" />
            <line x1="36" y1="68" x2="18" y2="80" />
            <line x1="64" y1="68" x2="82" y2="80" />
            <circle cx="50" cy="48" r="1.3" />
          </svg>
          <div className="holo-world" aria-hidden="true">
            <div className="holo-ring holo-ring-flat" />
            <div className="holo-ring holo-ring-tilt" />
            <div className="holo-ring holo-ring-meridian" />
            <div className="holo-cube">
              <CubeFaces />
            </div>
            <div className="agent-slot">
            <div className="agent-spin">
              <div className="agent-antenna"><i /></div>
              <div className="agent-head">
                <HeadFaces />
              </div>
              <div className="agent-body">
                <BodyFaces />
              </div>
            </div>
            </div>
          </div>
          <ul className="holo-nodes">
            {nodes.map((node) => (
              <li key={node.name} className={`holo-node holo-node-${node.place}`}>{node.name}</li>
            ))}
          </ul>
          <p className="sr-only">A holographic AI agent, turning in a grid connected to CRM, Growth, Delivery, and Finance.</p>
        </div>
        <p className="opening-caption">AI prepares the next step. Your team decides what moves.</p>
      </div>
    </section>
  );
}
