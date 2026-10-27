import { SiteFrame } from '@/components/SiteFrame';

export default function NotFoundPage() {
  return (
    <SiteFrame>
      <article className="privacy-page section-pad">
        <h1>This page is not available</h1>
        <p className="lead">The link does not match a LeanForce page.</p>
        <p><a className="button button-primary" href="/">Back to the home page</a></p>
      </article>
    </SiteFrame>
  );
}
