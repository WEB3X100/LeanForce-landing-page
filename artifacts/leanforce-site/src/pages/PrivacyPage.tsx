import { SiteFrame } from '@/components/SiteFrame';

export default function PrivacyPage() {
  return (
    <SiteFrame>
      <article className="privacy-page section-pad">
        <p className="kicker">Inquiries</p>
        <h1>How an inquiry is used</h1>
        <p className="lead">The contact form asks for a name, company, role, industry, the workflow you want to improve, the tools you use now, and a way to reply. Role and current tools are optional. The rest are required so LeanForce can respond.</p>
        <h2>Why it is kept</h2>
        <p>LeanForce keeps those details so someone can reply about the workflow you described. The note is stored with this site. It is not sold, and it is not used to train a public model.</p>
        <h2>What else this page does not claim</h2>
        <p>Sending the form does not create a contract, a price, or a timeline. LeanForce confirms a scope and a fee only after an assessment of the process.</p>
        <p><a className="button button-primary" href="/#contact">Back to the inquiry form</a></p>
      </article>
    </SiteFrame>
  );
}
