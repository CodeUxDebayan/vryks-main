
export function RemainingSections() {
  return (
    <div style={{ backgroundColor: '#050505', color: '#f5f5f0', paddingBottom: '4rem' }}>
      
      {/* 07 · Work With Us — The Process */}
      <section style={{ padding: '8rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#eaff00', letterSpacing: '0.1em', marginBottom: '2rem' }}>
            07 · WORK WITH US — THE PROCESS
          </div>
          <h2 style={{ fontFamily: 'Gazpacho, "Space Grotesk", sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '4rem', maxWidth: '800px' }}>
            From first call to compounding growth.
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
            {[
              { step: '01', title: 'The Working Session', desc: "45 minutes. We arrive prepared with research on your brand, your competitors, and your digital presence. No pitch. No pressure. If we're not the right fit, we'll tell you — directly." },
              { step: '02', title: 'The Strategic Brief', desc: "We don't take briefs. We build them — together. Every creative decision, every line of code, every frame of footage traces back to this document. Get this right, and the work is inevitable." },
              { step: '03', title: 'Design & Build', desc: "Strategy, creative, and technology teams work in parallel on one unified roadmap — moving fast without sacrificing quality. You have direct access to your creative lead at every stage. Not a coordinator. The builder." },
              { step: '04', title: 'Review & Refine', desc: "Feedback at VRYKS is a creative conversation, not a correction exercise. The work you receive is not a draft — it's a considered position. Your feedback helps us calibrate, not restart." },
              { step: '05', title: 'Launch & Compound', desc: "We don't hand off and disappear. We stay. Post-launch monitoring, strategic consultation, iterating on what the data tells us — your investment compounds, not decays." }
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Step {item.step}</div>
                <div>
                  <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                  <p style={{ fontFamily: '"Helvetica Neue", Helvetica, sans-serif', color: 'rgba(245,245,240,0.6)', lineHeight: 1.6, maxWidth: '600px' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '5rem', fontFamily: 'Scholar, serif', fontStyle: 'italic', fontSize: '1.8rem', color: 'rgba(255,255,255,0.8)' }}>
            "At VRYKS, we don't participate in price wars. We compete on outcome."
          </div>
        </div>
      </section>

      {/* 08 · Our Works */}
      <section style={{ padding: '8rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#eaff00', letterSpacing: '0.1em', marginBottom: '2rem' }}>
            08 · OUR WORKS
          </div>
          <h2 style={{ fontFamily: 'Gazpacho, "Space Grotesk", sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '2rem', maxWidth: '800px' }}>
            The work speaks. We just make sure it never stops.
          </h2>
          <p style={{ fontFamily: '"Helvetica Neue", Helvetica, sans-serif', fontSize: '1.1rem', color: 'rgba(245,245,240,0.6)', maxWidth: '600px', marginBottom: '4rem', lineHeight: 1.6 }}>
            Every project began with a single conversation and ended with a brand the market could not ignore. Strategy, design, technology, and production — unified in outcome.
          </p>
          
          {/* Filters Placeholder */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '4rem' }}>
            {['All', 'Brand Identity', 'Web & App', 'Campaigns', 'Production', 'Packaging', 'Social Media', 'Content'].map(filter => (
              <span key={filter} style={{ padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '14px', cursor: 'pointer' }}>
                {filter}
              </span>
            ))}
          </div>

          {/* Case Study Card Placeholder */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '16px' }}>
            <h3 style={{ fontFamily: 'Gazpacho, sans-serif', fontSize: '2rem', marginBottom: '1rem' }}>[Client Name] — Industry / Category</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase' }}>The Brief</strong>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>One-line summary of what the client needed</p>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase' }}>The Outcome</strong>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>One-line summary of the measurable result</p>
              </div>
            </div>
            <div style={{ marginBottom: '2rem', fontSize: '14px', color: '#38bdf8' }}>
              Pillars Activated: Design · Technology · Marketing · Production
            </div>
            <button style={{ background: 'transparent', border: '1px solid #eaff00', color: '#eaff00', padding: '0.75rem 2rem', borderRadius: '30px', cursor: 'pointer' }}>
              View Full Case Study →
            </button>
          </div>
          
          <div style={{ marginTop: '5rem', textAlign: 'center', fontFamily: 'Scholar, serif', fontStyle: 'italic', fontSize: '2rem' }}>
            "Your brand belongs in this portfolio."
          </div>
        </div>
      </section>

      {/* 09 · Book Your Session */}
      <section style={{ padding: '8rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(to bottom, #050505, #0a0a0c)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#eaff00', letterSpacing: '0.1em', marginBottom: '2rem' }}>
            09 · BOOK YOUR SESSION
          </div>
          <h2 style={{ fontFamily: 'Gazpacho, "Space Grotesk", sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
            Let's build something that outlasts the brief.
          </h2>
          <p style={{ fontFamily: '"Helvetica Neue", Helvetica, sans-serif', fontSize: '1.2rem', color: 'rgba(245,245,240,0.6)', marginBottom: '3rem', lineHeight: 1.6 }}>
            Start with a 45-minute working session. We come prepared with questions about your brand. No pitch, no pressure — just a real conversation about what's possible and what it takes to get there.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ background: '#eaff00', color: '#000', padding: '1rem 2.5rem', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              Book Your Session →
            </button>
            <button style={{ background: 'transparent', color: '#fff', padding: '1rem 2.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
              Or request a complimentary Brand Audit →
            </button>
          </div>
        </div>
      </section>

      {/* 10 · About Us & 11 · The Origin & 12 · The Philosophy */}
      <section style={{ padding: '8rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#eaff00', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              10 · ABOUT US
            </div>
            <h2 style={{ fontFamily: 'Gazpacho, sans-serif', fontSize: '3rem', marginBottom: '1.5rem' }}>A studio builds worlds. An agency executes briefs. You chose the studio.</h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '800px' }}>
              VRYKS is a full-stack creative and media studio, born in India, operating globally. We exist for one reason: to make ambitious brands undeniable.
            </p>
          </div>

          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#eaff00', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              11 · THE ORIGIN
            </div>
            <h2 style={{ fontFamily: 'Gazpacho, sans-serif', fontSize: '3rem', marginBottom: '1.5rem' }}>Built from conviction. Not convenience.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
              <p>
                VRYKS was not born from a business plan. It was born from a frustration — the kind that comes from watching brilliant brands get dismantled by fragmented agencies, diluted by mediocre creative, and paralysed by strategies that look impressive in decks but produce nothing in markets.
              </p>
              <p>
                We built VRYKS to be the antidote. One studio. Every discipline. One voice. One result — yours. Strategy, design, production, and digital in total alignment. Never in silos. Never handed off to someone who wasn't in the room when the thinking happened.
              </p>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#eaff00', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              12 · THE PHILOSOPHY
            </div>
            <h2 style={{ fontFamily: 'Gazpacho, sans-serif', fontSize: '3rem', marginBottom: '1.5rem' }}>Strategy first. Always. Without exception.</h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '800px', marginBottom: '3rem' }}>
              Every creative decision at VRYKS traces back to a commercial outcome. We don't chase aesthetics for the sake of aesthetics. We don't build technology for the sake of technology. We build systems that compound — where brand equity grows, conversions improve, and every month your investment is worth more than the last.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {[
                { title: 'Craft Meets Commerce', desc: 'Beautiful work that converts. Aesthetics and performance weighted equally, always.' },
                { title: 'No Fragmentation', desc: 'Strategy, design, production, and digital in total alignment. Never in silos.' },
                { title: 'Humble Confidence', desc: 'Obsessed with making you look good in your boardroom, not with how we look.' }
              ].map(item => (
                <div key={item.title} style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <h4 style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', marginBottom: '1rem', color: '#fff' }}>{item.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 13 · The Founders */}
      <section style={{ padding: '8rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#eaff00', letterSpacing: '0.1em', marginBottom: '2rem' }}>
            13 · THE FOUNDERS
          </div>
          <h2 style={{ fontFamily: 'Gazpacho, "Space Grotesk", sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
            Custodians of the Craft.
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4rem', maxWidth: '600px' }}>
            The ones who understand that behind every brief is something far greater than a deliverable — and work accordingly.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Sagnik Dutta', role: 'Director of Narrative & Strategy', desc: 'The mind that decides how a brand speaks, sells, and is remembered — commanding language and strategy with a precision that shapes perception and builds lasting conviction.' },
              { name: 'Ishan Mitra', role: 'Director of Vision & Form', desc: 'The eye that determines what excellence looks like before a single element is placed — translating raw vision into an art form that is both immediately felt and enduringly remembered.' },
              { name: 'Debayan Mukherjee', role: 'Director of Stack & Framework', desc: 'The intelligence behind every system that runs without fault — engineering the invisible architecture that allows everything built upon it to perform without compromise.' }
            ].map(founder => (
              <div key={founder.name} style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <h3 style={{ fontFamily: 'Gazpacho, sans-serif', fontSize: '1.8rem', marginBottom: '0.5rem' }}>{founder.name}</h3>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#38bdf8', marginBottom: '1.5rem' }}>{founder.role}</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: '14px' }}>{founder.desc}</p>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '4rem', background: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Scholar, serif', fontStyle: 'italic', fontSize: '2rem', marginBottom: '1rem' }}>
              "You're not a brief. You're a partner."
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
              Strategy that doesn't stop at the handoff. A team that answers your call — not a support ticket. Work that gets better every time we touch it. Founder attention on every first project.
            </p>
            <button style={{ background: 'transparent', color: '#eaff00', border: '1px solid #eaff00', padding: '0.75rem 2rem', borderRadius: '30px', cursor: 'pointer' }}>
              Start a Conversation →
            </button>
          </div>
        </div>
      </section>

      {/* 14 · FAQ */}
      <section style={{ padding: '8rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#eaff00', letterSpacing: '0.1em', marginBottom: '2rem' }}>
            14 · FAQ
          </div>
          <h2 style={{ fontFamily: 'Gazpacho, "Space Grotesk", sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
            The honest answers.
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4rem' }}>
            If your question isn't here, ask us directly. We don't hide behind FAQ pages — we have conversations.
          </p>

          {[
            { category: 'General', qas: [
              { q: 'What is VRYKS?', a: 'VRYKS is a full-stack creative and media studio — strategy, design, technology, marketing, and production under one roof. Not an agency. A studio that operates as an integrated extension of your brand.' },
              { q: 'Where is VRYKS based?', a: "India. Operating globally. We work with clients across time zones — the work doesn't stop when the sun sets in one country." }
            ]},
            { category: 'Working With Us', qas: [
              { q: 'How do I start working with VRYKS?', a: "Book a 45-minute working session. We come prepared with research on your brand, competitors, and digital presence. No pitch, no pressure. If we're the right fit, a proposal follows within 24–48 hours." },
              { q: 'What is the minimum budget to work with VRYKS?', a: "We don't publish pricing because every engagement is scoped to the specific outcome. VRYKS is not the cheapest option — and that is the point. We compete on outcome, not price." }
            ]}
          ].map(group => (
            <div key={group.category} style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>{group.category}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {group.qas.map(qa => (
                  <div key={qa.q}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>{qa.q}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{qa.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: '1rem' }}>Still have a question?</span>
            <a href="mailto:contact@vryks.com" style={{ color: '#eaff00', textDecoration: 'none' }}>Ask Us Directly →</a>
          </div>
        </div>
      </section>

      {/* 15 · Global Footer */}
      <footer style={{ padding: '6rem 2rem 2rem 2rem', background: '#020202' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            <div>
              <h2 style={{ fontFamily: 'Gazpacho, sans-serif', fontSize: '2rem', marginBottom: '0.5rem' }}>VRYKS</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', maxWidth: '200px' }}>A Creative & Media Studio<br/>Est. India. Operating Globally.</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '14px' }}>Services</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 2 }}>
                <li>Design</li><li>Technology</li><li>Marketing</li><li>Production</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '14px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 2 }}>
                <li>About</li><li>Work With Us</li><li>Our Works</li><li>Join the Team</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '14px' }}>Contact</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 2 }}>
                <li>contact@vryks.com</li><li>vryks.com</li><li>India — Global</li>
              </ul>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
            <div>© VRYKS {new Date().getFullYear()}. All rights reserved.</div>
            <div style={{ fontFamily: 'Scholar, serif', fontStyle: 'italic', fontSize: '1.2rem', color: '#fff' }}>"Where ambition comes to life."</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span>Instagram</span>
              <span>LinkedIn</span>
              <span>X</span>
              <span>YouTube</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
