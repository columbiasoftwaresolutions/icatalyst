/* Contact — validating form (client-side) + offices + contact info. */

const FIELD = {
  width: '100%', boxSizing: 'border-box', background: 'var(--canvas)', color: 'var(--ink)',
  border: '1px solid var(--hairline-translucent)', borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-md) var(--space-lg)', fontFamily: 'var(--font-display)',
  fontSize: 'var(--body-md-size)', letterSpacing: 'var(--body-md-ls)', outline: 'none',
};

function Field({ label, children, error }) {
  return (
    <label style={{ display: 'block' }}>
      <span className="t-mono-eyebrow" style={{ color: 'var(--ink)', marginBottom: 7, display: 'block' }}>{label}</span>
      {children}
      {error && <span className="t-caption" style={{ color: 'var(--accent-orange)', marginTop: 6, display: 'block' }}>{error}</span>}
    </label>
  );
}

function ContactForm() {
  const [form, setForm] = React.useState({ name: '', email: '', org: '', type: IC.inquiryTypes[0], message: '' });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const fieldStyle = (k) => ({ ...FIELD, borderColor: errors[k] ? 'var(--accent-orange)' : 'var(--hairline-translucent)' });

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Please enter your full name.';
    if (!form.email.trim()) er.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Please enter a valid email address.';
    if (!form.message.trim()) er.message = 'Please tell us how we can help.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) setSent(true);
  };

  React.useEffect(() => { refreshIcons(); });

  if (sent) {
    return (
      <Card style={{ display: 'grid', gap: 'var(--space-lg)', placeItems: 'start', padding: 'var(--space-4xl) var(--space-3xl)' }}>
        <span style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--accent-mint)', display: 'grid', placeItems: 'center' }}>
          <i data-lucide="check" style={{ width: 24, height: 24, color: 'var(--ink)' }}></i>
        </span>
        <h3 className="t-display-md" style={{ color: 'var(--ink)' }}>Thank you, {form.name.split(' ')[0] || 'there'}.</h3>
        <p className="t-body-md" style={{ color: 'var(--body)' }}>Your message has been received. A member of the iCatalyst team will be in touch shortly. You can also reach us directly at {IC.contact.email} or {IC.contact.phone}.</p>
        <Pill variant="outline" onClick={() => { setSent(false); setForm({ name: '', email: '', org: '', type: IC.inquiryTypes[0], message: '' }); }}>Send another</Pill>
      </Card>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 'var(--space-lg)' }}>
      <div className="two-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        <Field label="FULL NAME" error={errors.name}>
          <input style={fieldStyle('name')} value={form.name} onChange={set('name')} placeholder="Jane Doe" />
        </Field>
        <Field label="EMAIL" error={errors.email}>
          <input style={fieldStyle('email')} value={form.email} onChange={set('email')} placeholder="you@organization.gov" />
        </Field>
      </div>
      <div className="two-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        <Field label="ORGANIZATION">
          <input style={fieldStyle('org')} value={form.org} onChange={set('org')} placeholder="Agency or company" />
        </Field>
        <Field label="INQUIRY TYPE">
          <select style={{ ...fieldStyle('type'), appearance: 'none', cursor: 'pointer' }} value={form.type} onChange={set('type')}>
            {IC.inquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <Field label="MESSAGE" error={errors.message}>
        <textarea style={{ ...fieldStyle('message'), minHeight: 140, resize: 'vertical', lineHeight: 1.5 }} value={form.message} onChange={set('message')} placeholder="How can we help?" />
      </Field>
      <div>
        <Pill type="submit" variant="primary">Send message</Pill>
      </div>
    </form>
  );
}

function ContactInfo() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3xl)', alignContent: 'start' }}>
      <div>
        <Eyebrow>GENERAL CONTACT</Eyebrow>
        <div style={{ display: 'grid', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
          <a href={`tel:${IC.contact.phone.replace(/[^\d+]/g, '')}`} className="t-body-md" style={{ color: 'var(--ink)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <i data-lucide="phone" style={{ width: 16, height: 16, color: 'var(--body)' }}></i>{IC.contact.phone}
          </a>
          <div className="t-body-md" style={{ color: 'var(--body)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <i data-lucide="printer" style={{ width: 16, height: 16, color: 'var(--body)' }}></i>Fax {IC.contact.fax}
          </div>
          <a href={`mailto:${IC.contact.email}`} className="t-body-md" style={{ color: 'var(--ink)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <i data-lucide="mail" style={{ width: 16, height: 16, color: 'var(--body)' }}></i>{IC.contact.email}
          </a>
          <div className="t-body-md" style={{ color: 'var(--body)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <i data-lucide="clock" style={{ width: 16, height: 16, color: 'var(--body)' }}></i>{IC.contact.hours}
          </div>
          <a href={IC.links.linkedin} target="_blank" rel="noopener" className="t-body-md" style={{ color: 'var(--ink)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <i data-lucide="arrow-up-right" style={{ width: 16, height: 16, color: 'var(--body)' }}></i>LinkedIn
          </a>
          <a href={IC.links.employeeLogin} target="_blank" rel="noopener" className="t-body-md" style={{ color: 'var(--ink)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <i data-lucide="lock" style={{ width: 16, height: 16, color: 'var(--body)' }}></i>Employee Login
          </a>
        </div>
      </div>
      <div>
        <Eyebrow>OFFICES</Eyebrow>
        <div style={{ display: 'grid', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
          {IC.offices.map(o => (
            <div key={o.city}>
              <span className="t-mono-label" style={{ color: 'var(--body)' }}>{o.tag}</span>
              <p className="t-body-md" style={{ color: 'var(--ink)', marginTop: 4 }}>{o.addr}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  React.useEffect(() => { refreshIcons(); });
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <NavBar current="contact" />
      <PageHeader
        eyebrow="CONTACT US"
        title="Let’s talk about your mission"
        lead="Whether you’re a federal agency or a commercial enterprise, tell us what you’re working on and we’ll connect you with the right team."
        breadcrumb={[{ label: 'Home', href: 'index.html' }, { label: 'Contact' }]}
      />
      <Band>
        <div className="split-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 'var(--space-5xl)', alignItems: 'start' }}>
          <ContactForm />
          <ContactInfo />
        </div>
      </Band>
      <Footer />
      <ContactOrb />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
