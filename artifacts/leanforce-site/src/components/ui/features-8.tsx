import type { ReactNode } from 'react';
import { ArrowRight, Inbox, RefreshCw, UserRound } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const glow = {
  borderRadius: 22,
  backgroundColor: '#070b10',
  glowRadius: 10,
  glowIntensity: 0.42,
  coneSpread: 16,
  animated: true,
};

function GlassCard({ className, children }: { className: string; children: ReactNode }) {
  return (
    <BorderGlow className={`approach-glow ${className}`} {...glow}>
      <article className="approach-card">
        <span className="approach-bloom" aria-hidden="true" />
        {children}
      </article>
    </BorderGlow>
  );
}

export function Features() {
  return (
    <div className="relative mx-auto w-full">
      <div className="grid grid-cols-6 items-stretch gap-4">
        <GlassCard className="col-span-full lg:col-span-2">
          <div className="approach-figure">
            <span className="approach-orbit approach-orbit-wide" />
            <Inbox className="approach-mark" size={28} strokeWidth={1.5} />
          </div>
          <div className="approach-copy approach-copy-center">
            <h3>Leads wait between systems</h3>
          </div>
        </GlassCard>

        <GlassCard className="col-span-full sm:col-span-3 lg:col-span-2">
          <div className="approach-figure">
            <span className="approach-orbit approach-orbit-ring" />
            <span className="approach-orbit approach-orbit-ring approach-orbit-inner" />
            <RefreshCw className="approach-mark" size={32} strokeWidth={1.5} />
          </div>
          <div className="approach-copy approach-copy-center">
            <h3>Teams repeat the same updates and checks</h3>
          </div>
        </GlassCard>

        <GlassCard className="col-span-full sm:col-span-3 lg:col-span-2">
          <svg className="approach-spark" viewBox="0 0 320 96" fill="none" aria-hidden="true">
            <path d="M8 78C28 78 36 64 52 62C74 59 82 40 104 38C126 36 134 58 156 54C178 50 190 22 214 24C238 26 250 48 272 44C292 41 304 28 312 22" stroke="#19c3dc" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8 78C28 78 36 64 52 62C74 59 82 40 104 38C126 36 134 58 156 54C178 50 190 22 214 24C238 26 250 48 272 44C292 41 304 28 312 22V96H8V78Z" fill="#19c3dc" fillOpacity="0.16" />
          </svg>
          <div className="approach-copy approach-copy-center">
            <h3>Owners lack a clear view of what needs attention</h3>
          </div>
        </GlassCard>

        <GlassCard className="col-span-full lg:col-span-3">
          <div className="approach-split">
            <div className="approach-copy">
              <span className="approach-icon"><ArrowRight size={20} strokeWidth={1.5} /></span>
              <h3>The work falls between the tools</h3>
            </div>
            <div className="approach-flow" aria-hidden="true">
              <span className="approach-chip">Inbox</span>
              <span className="approach-line" />
              <span className="approach-chip approach-chip-gap">Gap</span>
              <span className="approach-line approach-line-arrow" />
              <span className="approach-chip">Next step</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="col-span-full lg:col-span-3">
          <div className="approach-split">
            <div className="approach-copy">
              <span className="approach-icon"><UserRound size={20} strokeWidth={1.5} /></span>
              <h3>Someone still has to see it</h3>
            </div>
            <div className="approach-roles">
              {['Request', 'Operator', 'Owner'].map((role, index) => (
                <div key={role} className={index === 1 ? 'approach-role approach-role-shift' : 'approach-role'}>
                  <span className="approach-chip">{role}</span>
                  <span className="approach-icon approach-icon-sm"><UserRound size={14} /></span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
