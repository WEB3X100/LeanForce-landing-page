import { ArrowUpRight } from 'lucide-react';
import BorderGlow from '@/components/BorderGlow';
import { SiteFrame } from '@/components/SiteFrame';
import { BentoItem } from '@/components/ui/holographic-interface';
import './AboutPage.css';

type TeamProfile = {
  name: string;
  initials: string;
  role: string;
  headline: string;
  bio: string;
  href: string;
  accent: 'cyan' | 'teal' | 'violet';
};

const team: TeamProfile[] = [
  {
    name: 'Irfan Bhimani',
    initials: 'IB',
    role: 'Enterprise Transformation & Delivery',
    headline: 'Turn large transformations into work teams can deliver.',
    bio: 'Irfan is an engagement and transformation leader with experience in global implementations, CRM, project management, and advisory work, including roles at TCS and EY.',
    href: 'https://www.linkedin.com/in/irfan-bhimani/',
    accent: 'teal',
  },
  {
    name: 'Ammar Khalid',
    initials: 'AK',
    role: 'Practical AI for SMB Operations',
    headline: 'Put practical AI to work on everyday operations.',
    bio: 'Ammar is the founder of AgenticSync. He helps small and midsize businesses improve lead follow-up, reporting, and operations with practical AI-native systems.',
    href: 'https://www.linkedin.com/in/ammar-khalid-automates/',
    accent: 'violet',
  },
];

const glowColors: Record<TeamProfile['accent'], [string, string, string]> = {
  cyan: ['#19c3dc', '#8deaf7', '#3786ff'],
  teal: ['#27c9bd', '#a5f0de', '#167e83'],
  violet: ['#9578ff', '#38c8de', '#d49aff'],
};

function TeamCard({ profile }: { profile: TeamProfile }) {
  return (
    <BorderGlow
      className={`about-team-glow about-team-glow--${profile.accent}`}
      colors={glowColors[profile.accent]}
      backgroundColor="#07111f"
      borderRadius={22}
      glowRadius={18}
      glowIntensity={0.58}
      fillOpacity={0.08}
    >
      <BentoItem className="about-team-card">
        <article className="about-team-card__content">
          <div className="about-team-card__topline">
            <span className="about-team-card__index">LEANFORCE / TEAM</span>
            <span className={`about-team-card__avatar about-team-card__avatar--${profile.accent}`} aria-hidden="true">
              {profile.initials}
            </span>
          </div>

          <div className="about-team-card__copy">
            <p className="about-team-card__role">{profile.role}</p>
            <h2>{profile.name}</h2>
            <h3>{profile.headline}</h3>
            <p className="about-team-card__bio">{profile.bio}</p>
          </div>

          <a
            className="about-team-card__link"
            href={profile.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${profile.name}'s LinkedIn profile (opens in a new tab)`}
            data-testid={`link-linkedin-${profile.initials.toLowerCase()}`}
          >
            View LinkedIn profile <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </article>
      </BentoItem>
    </BorderGlow>
  );
}

export default function AboutPage() {
  return (
    <SiteFrame>
      <section className="page-hero section-pad about-page" aria-labelledby="about-heading">
        <div className="about-page__intro">
          <p className="kicker">ABOUT LEANFORCE</p>
          <h1 id="about-heading">Meet the people behind the workflow.</h1>
          <p className="lead">
            LeanForce helps growing teams find the workflows slowing them down, then improve those workflows with practical systems and AI-assisted automation. We start by understanding how the work happens today, choose one valuable process, and build a solution with the people who will use it.
          </p>
        </div>
      </section>

      <section className="about-team section-pad" aria-label="The LeanForce team">
        <div className="about-team__heading">
          <span>THE PEOPLE BEHIND THE WORK</span>
          <span>01 — 02</span>
        </div>
        <div className="about-team__grid">
          {team.map((profile) => <TeamCard key={profile.initials} profile={profile} />)}
        </div>
      </section>
    </SiteFrame>
  );
}
