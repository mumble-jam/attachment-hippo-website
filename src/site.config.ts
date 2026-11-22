/**
 * Single source of truth for links, contact details and third-party IDs.
 * Change things here, not inside the pages.
 */
export const site = {
  name: 'Attachment Hippo',
  url: 'https://attachmenthippo.com',
  email: 'attachmenthippo@gmail.com',
  startYear: 2025,

  /** Google Workspace Marketplace listing — every "Add to Gmail" button points here. */
  installUrl:
    'https://workspace.google.com/marketplace/app/attachment_hippo/720296425994?flow_type=2',
  installLabel: 'Add to Gmail™ — it’s free',

  nav: [
    { label: 'Pricing', href: '/pricing.html' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Use cases', href: '/#use-cases' },
    { label: 'Contact us', href: '/#contact' },
  ],

  legal: [
    { label: 'Terms of Service', href: '/legal/terms_of_service.html' },
    { label: 'Privacy Policy', href: '/legal/privacy_policy.html' },
    { label: 'Refund Policy', href: '/legal/refund_policy.html' },
  ],

  /** Analytics only load in production builds (`npm run build`). */
  analytics: {
    umamiWebsiteId: 'df4047a3-f37e-4276-bb1a-492403d7e5a2',
    gaMeasurementId: 'G-PLT7L30ZGC',
  },
} as const;
