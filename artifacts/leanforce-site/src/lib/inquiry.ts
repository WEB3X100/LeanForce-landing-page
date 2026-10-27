export type InquiryInput = {
  name?: string;
  company?: string;
  role?: string;
  industry?: string;
  workflow?: string;
  tools?: string;
  contactMethod?: string;
  contactDetail?: string;
  consent?: boolean | string;
};

export type InquiryValue = {
  name: string;
  company: string;
  role: string;
  industry: string;
  workflow: string;
  tools: string;
  contactMethod: string;
  contactDetail: string;
  consent: true;
};

const limits = {
  name: 120,
  company: 160,
  role: 120,
  industry: 80,
  workflow: 2000,
  tools: 300,
  contactDetail: 160,
};

function clean(value: unknown, max: number) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
}

export function validateInquiry(input: InquiryInput) {
  const errors: Record<string, string> = {};
  const name = clean(input.name, limits.name);
  const company = clean(input.company, limits.company);
  const role = clean(input.role, limits.role);
  const industry = clean(input.industry, limits.industry);
  const workflow = clean(input.workflow, limits.workflow);
  const tools = clean(input.tools, limits.tools);
  const contactMethod = clean(input.contactMethod, 20) || 'Email';
  const contactDetail = clean(input.contactDetail, limits.contactDetail);
  const consent = input.consent === true || input.consent === 'on' || input.consent === 'true';

  if (!name) errors.name = 'Add your name.';
  if (!company) errors.company = 'Add the company name.';
  if (!industry) errors.industry = 'Choose an industry.';
  if (workflow.length < 12) errors.workflow = 'Describe the workflow in a sentence or two.';
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetail);
  const phoneOk = contactDetail.replace(/\D/g, '').length >= 7;
  if (!contactDetail) errors.contactDetail = 'Add an email or phone number.';
  else if (contactMethod === 'Email' && !emailOk) {
    errors.contactDetail = 'Enter an email address like name@company.com.';
  } else if (contactMethod === 'Phone' && !phoneOk) {
    errors.contactDetail = 'Enter a phone number we can call.';
  } else if (contactMethod !== 'Email' && contactMethod !== 'Phone' && !emailOk && !phoneOk) {
    errors.contactDetail = 'Enter an email address or a phone number we can use.';
  }
  if (!consent) errors.consent = 'Confirm LeanForce may use these details to reply.';

  const value: InquiryValue | null = Object.keys(errors).length
    ? null
    : { name, company, role, industry, workflow, tools, contactMethod, contactDetail, consent: true };

  return { errors, value };
}
