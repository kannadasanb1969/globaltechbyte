import React from 'react'
import {
  ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardList, Code2,
  GitBranch, Github, GraduationCap, Mail, MapPin, Menu, Phone, Rocket,
  ShieldCheck, Users, X, Gauge, ServerCog, Database, Workflow
} from 'lucide-react'

const techs = [
  ['React', <Code2 size={34}/>],
  ['.NET', <ServerCog size={34}/>],
  ['C#', <Code2 size={34}/>],
  ['SQL Server', <Database size={34}/>],
  ['Git', <GitBranch size={34}/>],
  ['GitHub', <Github size={34}/>],
  ['Jira', <ClipboardList size={34}/>],
  ['Agile / Scrum', <Workflow size={34}/>],
]

const process = [
  ['Apply Online', 'Fill the internship application form', <ClipboardList/>],
  ['Join Internship', 'Start your free internship program', <GraduationCap/>],
  ['Work on Projects', 'Build real projects using React & .NET', <Code2/>],
  ['Performance Review', 'Your work and contribution are evaluated', <Gauge/>],
  ['Interview', 'Shortlisted candidates attend an interview', <Users/>],
  ['Career Opportunity', 'Selected candidates may join our team', <ShieldCheck/>],
]

function Logo() {
  return (
    <a href="#home" className="brand" aria-label="Global Tech Byte home">
      <span className="brand-mark">GTB</span>
      <span className="brand-text"><strong>GLOBAL</strong><em>TECH BYTE</em></span>
    </a>
  )
}

function App() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="site">
      <header className="topbar">
        <Logo />
        <button className="menuBtn" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          {open ? <X/> : <Menu/>}
        </button>
        <nav className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)}>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#internship">Internship</a>
          <a href="#process">Our Process</a>
          <a href="#technologies">Technologies</a>
          <a href="#services">Projects</a>
          <a href="#careers">Careers</a>
          <a href="#contact">Contact Us</a>
        </nav>
        <a className="btn headerCta" href="mailto:hr@globaltechbyte.com?subject=Internship Application - Global Tech Byte">
          Apply for Internship
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="heroGlow glowA"></div><div className="heroGlow glowB"></div>
          <div className="heroCopy">
            <p className="eyebrow">FREE INTERNSHIP • REAL PROJECTS • REAL EXPERIENCE</p>
            <h1>Learn. Build. Grow.<br/>Build Your Future With <span>Global Tech Byte</span></h1>
            <p className="heroText">
              We offer <b>FREE internships</b> for students in React & .NET.
              Work on real-time projects, learn professional Agile practices and build valuable industry experience.
            </p>
            <div className="heroActions">
              <a className="btn" href="mailto:hr@globaltechbyte.com?subject=Free Internship Application">
                Apply for Free Internship <ArrowRight size={18}/>
              </a>
              <a className="btn btnGhost" href="#about">Explore More <ArrowRight size={18}/></a>
            </div>
            <div className="heroStats">
              <div><GraduationCap/><span><b>100% Free</b>Internship</span></div>
              <div><BriefcaseBusiness/><span><b>Real-Time</b>Projects</span></div>
              <div><Workflow/><span><b>Agile</b>Work Environment</span></div>
              <div><Rocket/><span><b>Performance</b>Based Hiring</span></div>
            </div>
          </div>

          <div className="heroVisual" aria-label="Technology development illustration">
            <div className="gridGlow"></div>
            <div className="orb orbOne">REACT</div>
            <div className="orb orbTwo">.NET</div>
            <div className="codePanel">
              <div className="codeTop"><i></i><i></i><i></i></div>
              <pre>{`const future = {
  skills: ["React", ".NET"],
  workflow: "Agile",
  tools: ["Git", "Jira"],
  growth: "Performance Based"
}`}</pre>
            </div>
            <div className="peopleCard">
              <Users size={55}/>
              <strong>Learn with a real team</strong>
              <span>Build • Review • Improve • Deliver</span>
            </div>
          </div>
        </section>

        <section className="splitSection" id="about">
          <div>
            <p className="eyebrow">OUR MISSION</p>
            <h2>Empowering Students.<br/>Building Careers. Creating Impact.</h2>
            <p>
              Global Tech Byte helps students gain practical software development experience through free internships,
              guided real-time projects, modern tools and an industry-style development process.
            </p>
            <div className="miniFeatures">
              <div><GraduationCap/><span><b>Free Internship</b>For Students</span></div>
              <div><Users/><span><b>Performance Based</b>Career Opportunity</span></div>
            </div>
          </div>

          <div className="offerWrap" id="services">
            <h3>What We Offer</h3>
            <div className="offerGrid">
              <article className="card">
                <GraduationCap className="cardIcon"/>
                <h4>For Students</h4>
                <ul>
                  <li>Free Internship Program</li><li>React & .NET Development</li>
                  <li>Real-Time Project Experience</li><li>Agile Team Environment</li>
                  <li>Performance-Based Hiring Opportunity</li>
                </ul>
                <a href="mailto:hr@globaltechbyte.com?subject=Join Internship" className="btn small">Join Internship</a>
              </article>
              <article className="card">
                <BriefcaseBusiness className="cardIcon"/>
                <h4>For Businesses</h4>
                <ul>
                  <li>Custom Software Development</li><li>React Web Applications</li>
                  <li>.NET API & Backend Development</li><li>Online / Offline Project Support</li>
                  <li>Maintenance & Enhancement</li>
                </ul>
                <a href="mailto:hr@globaltechbyte.com?subject=Software Project Enquiry" className="btn small">Discuss a Project</a>
              </article>
            </div>
          </div>
        </section>

        <section className="internshipSection" id="internship">
          <h2>Why Internship with <span>Global Tech Byte?</span></h2>
          <div className="benefits">
            <div><ShieldCheck/><h4>Free & Accessible</h4><p>100% free internship for passionate students.</p></div>
            <div><Code2/><h4>Real Projects</h4><p>Work on practical React and .NET applications.</p></div>
            <div><Users/><h4>Team Experience</h4><p>Collaborate, review code and improve continuously.</p></div>
            <div><Workflow/><h4>Agile Environment</h4><p>Use Git, GitHub, Jira, sprints and Scrum practices.</p></div>
            <div><Rocket/><h4>Career Growth</h4><p>Strong performers can be considered for employment.</p></div>
          </div>
        </section>

        <section className="processSection" id="process">
          <h2>How It Works?</h2>
          <p className="sectionIntro">Our simple internship and hiring process</p>
          <div className="process">
            {process.map(([title, text, icon], index) => (
              <React.Fragment key={title}>
                <div className="step">
                  <div className="stepIcon">{React.cloneElement(icon, {size: 28})}</div>
                  <span className="stepNo">{index + 1}</span>
                  <h4>{title}</h4><p>{text}</p>
                </div>
                {index < process.length - 1 && <ArrowRight className="connector"/>}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="techSection" id="technologies">
          <h2>Technologies & Tools We Use</h2>
          <div className="techGrid">
            {techs.map(([name, icon]) => <div className="techCard" key={name}>{icon}<b>{name}</b></div>)}
          </div>
        </section>

        <section className="careerBanner" id="careers">
          <div>
            <p className="eyebrow">START YOUR CAREER</p>
            <h2>Ready to Build Real Software?</h2>
            <p>Join our free internship program and experience a professional software development workflow.</p>
          </div>
          <a className="btn" href="mailto:hr@globaltechbyte.com?subject=Internship Application - Global Tech Byte">
            Apply Now <ArrowRight size={18}/>
          </a>
        </section>
      </main>

      <footer id="contact">
        <div className="footerGrid">
          <div><Logo/><p>Empowering the next generation of developers through free internships, real-world projects and career opportunities.</p></div>
          <div><h4>Quick Links</h4><a href="#home">Home</a><a href="#about">About Us</a><a href="#internship">Internship</a><a href="#process">Our Process</a></div>
          <div><h4>Technologies</h4><a href="#technologies">React</a><a href="#technologies">.NET / C#</a><a href="#technologies">Git & GitHub</a><a href="#technologies">Jira / Agile</a></div>
          <div>
            <h4>Contact Us</h4>
            <a href="tel:+919566235342"><Phone size={16}/> +91 95662 35342</a>
            <a href="mailto:hr@globaltechbyte.com"><Mail size={16}/> hr@globaltechbyte.com</a>
            <span><MapPin size={16}/> India</span>
          </div>
        </div>
        <div className="copyright">
          <span>© {new Date().getFullYear()} Global Tech Byte. All Rights Reserved.</span>
          <span>Built for learning, projects and growth.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
