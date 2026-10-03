import type { Journey } from '../os/types.ts';

export type InterestKind = 'solutions' | 'education' | 'community';
export type InterestSource = 'home-contact' | 'education' | 'community' | 'platform';

export interface InterestInput {
  name: string;
  email: string;
  whatsapp: string;
  journey: Journey;
  interest: InterestKind;
  message: string;
  marketingConsent: boolean;
  noticeVersion: string;
  source: InterestSource;
  idempotencyKey: string;
  honeypot: string;
  captchaToken: string;
}

export type InterestRecord = Omit<InterestInput, 'honeypot' | 'captchaToken' | 'idempotencyKey'> & {
  id: string;
  createdAt: string;
};
