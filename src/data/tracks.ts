import type { LucideIcon } from 'lucide-react';
import {
  Shield,
  Sword,
  Scale,
  Cloud,
  Fingerprint,
  Bug,
} from 'lucide-react';

export type TrackId =
  | 'soc'
  | 'pentest'
  | 'grc'
  | 'cloud'
  | 'dfir'
  | 'appsec';

export interface CareerTrack {
  id: TrackId;
  name: string;
  tagline: string;
  icon: LucideIcon;
  accent: string; // tailwind color class root, e.g. 'cyber'
  blurb: string;
  roles: string[];
  avgSalary: string;
  demand: 'High' | 'Very High' | 'Exploding';
}

export const TRACKS: CareerTrack[] = [
  {
    id: 'soc',
    name: 'SOC Analyst / Blue Team',
    tagline: 'Defend the perimeter, hunt threats, respond fast.',
    icon: Shield,
    accent: 'cyber',
    blurb:
      'Monitor environments, detect intrusions, and lead incident response. The front line of defense — perfect for people who love pattern recognition and staying calm under pressure.',
    roles: ['SOC Analyst L1/L2', 'Threat Hunter', 'Detection Engineer', 'IR Coordinator'],
    avgSalary: '$75k–$120k',
    demand: 'Very High',
  },
  {
    id: 'pentest',
    name: 'Penetration Tester / Red Team',
    tagline: 'Think like an attacker, break before they do.',
    icon: Sword,
    accent: 'signal',
    blurb:
      'Authorized hacking — find weaknesses in systems, apps, and people before adversaries do. Hands-on, creative, and deeply technical.',
    roles: ['Penetration Tester', 'Red Team Operator', 'Exploitation Specialist'],
    avgSalary: '$95k–$150k',
    demand: 'Very High',
  },
  {
    id: 'grc',
    name: 'GRC & Security Compliance',
    tagline: 'Where security meets strategy and law.',
    icon: Scale,
    accent: 'warn',
    blurb:
      'Governance, risk, and compliance — translate security into business language. Ideal for analytical communicators who like policy, frameworks, and audit.',
    roles: ['GRC Analyst', 'Compliance Officer', 'Risk Manager', 'Security Auditor'],
    avgSalary: '$85k–$135k',
    demand: 'High',
  },
  {
    id: 'cloud',
    name: 'Cloud Security Engineer',
    tagline: 'Secure the infrastructure the world runs on.',
    icon: Cloud,
    accent: 'cyber',
    blurb:
      'Design and enforce security across AWS, Azure, and GCP. DevSecOps, identity, and infrastructure-as-code — a fast-growing hybrid of cloud ops and security.',
    roles: ['Cloud Security Engineer', 'DevSecOps Engineer', 'Cloud Architect'],
    avgSalary: '$120k–$180k',
    demand: 'Exploding',
  },
  {
    id: 'dfir',
    name: 'Digital Forensics & Incident Response',
    tagline: 'After the breach: investigate, recover, attribute.',
    icon: Fingerprint,
    accent: 'signal',
    blurb:
      'Combine investigative forensics with live incident response. For methodical minds who want to piece together what happened and stop it from happening again.',
    roles: ['DFIR Specialist', 'Forensic Analyst', 'Incident Responder'],
    avgSalary: '$100k–$160k',
    demand: 'Very High',
  },
  {
    id: 'appsec',
    name: 'Application Security (AppSec)',
    tagline: 'Bake security into the code itself.',
    icon: Bug,
    accent: 'danger',
    blurb:
      'Secure the software development lifecycle — threat modeling, SAST/DAST, secure code review. A coder-friendly path that bridges dev and security.',
    roles: ['AppSec Engineer', 'Secure Code Reviewer', 'DevSecOps Engineer'],
    avgSalary: '$110k–$170k',
    demand: 'Very High',
  },
];

export const TRACK_MAP: Record<TrackId, CareerTrack> = TRACKS.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {} as Record<TrackId, CareerTrack>,
);
