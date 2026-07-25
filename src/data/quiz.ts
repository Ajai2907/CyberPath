import type { TrackId } from './tracks';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  /** Weight contributed to each track when this option is selected. */
  weights: Partial<Record<TrackId, number>>;
}

export interface QuizQuestion {
  id: string;
  category: 'Background' | 'Interest' | 'WorkStyle' | 'Experience';
  prompt: string;
  helper?: string;
  options: QuizOption[];
}

/**
 * Weighted quiz. Each option contributes points to one or more tracks.
 * Scores are normalized to 0–100% in the scoring engine.
 */
export const QUIZ: QuizQuestion[] = [
  {
    id: 'q1_networking',
    category: 'Background',
    prompt: 'How comfortable are you with networking concepts (TCP/IP, DNS, routing)?',
    helper: 'Think about whether you could explain what happens when you type a URL.',
    options: [
      { id: 'none', label: 'Never really touched it', weights: { grc: 2 } },
      { id: 'basic', label: 'I know the basics', weights: { soc: 3, grc: 2, appsec: 1 } },
      { id: 'solid', label: 'Solid — I can troubleshoot', weights: { soc: 5, pentest: 4, dfir: 4, cloud: 4 } },
      { id: 'expert', label: 'Expert — subnets, packets, the works', weights: { pentest: 5, soc: 5, dfir: 5, cloud: 5 } },
    ],
  },
  {
    id: 'q2_programming',
    category: 'Background',
    prompt: 'What is your programming experience?',
    options: [
      { id: 'none', label: 'None yet', weights: { grc: 3, soc: 2 } },
      { id: 'script', label: 'A little scripting (Bash, Python)', weights: { soc: 4, dfir: 3, pentest: 3, cloud: 3 } },
      { id: 'intermediate', label: 'Comfortable building small apps', weights: { pentest: 4, appsec: 5, cloud: 5 } },
      { id: 'advanced', label: 'Advanced — multiple languages, frameworks', weights: { appsec: 5, pentest: 5, cloud: 5 } },
    ],
  },
  {
    id: 'q3_os',
    category: 'Background',
    prompt: 'How well do you know Linux?',
    options: [
      { id: 'none', label: "I've barely used it", weights: { grc: 2 } },
      { id: 'basic', label: 'Basic commands and file system', weights: { soc: 3, grc: 2, appsec: 2 } },
      { id: 'comfortable', label: 'Comfortable — I use it daily', weights: { soc: 5, pentest: 4, dfir: 5, cloud: 4 } },
      { id: 'deep', label: 'Deep — kernel, services, hardening', weights: { pentest: 5, dfir: 5, cloud: 5, soc: 5 } },
    ],
  },
  {
    id: 'q4_offense',
    category: 'Interest',
    prompt: 'Offense or defense — which excites you more?',
    options: [
      { id: 'offense', label: 'Breaking in (offense)', weights: { pentest: 5, appsec: 3 } },
      { id: 'defense', label: 'Defending (defense)', weights: { soc: 5, dfir: 3 } },
      { id: 'both', label: 'Both equally', weights: { pentest: 3, soc: 3, dfir: 3, appsec: 3 } },
      { id: 'neither', label: 'Neither — I prefer strategy/policy', weights: { grc: 5 } },
    ],
  },
  {
    id: 'q5_focus',
    category: 'Interest',
    prompt: 'Which of these sounds most interesting to dig into?',
    options: [
      { id: 'siem', label: 'Log analysis & threat hunting in SIEMs', weights: { soc: 5, dfir: 3 } },
      { id: 'exploits', label: 'Finding and exploiting vulnerabilities', weights: { pentest: 5, appsec: 4 } },
      { id: 'policy', label: 'Writing policy, risk assessments, audits', weights: { grc: 5 } },
      { id: 'cloud', label: 'Securing cloud infrastructure', weights: { cloud: 5 } },
      { id: 'forensics', label: 'Memory/disk forensics after an incident', weights: { dfir: 5 } },
      { id: 'securecode', label: 'Reviewing code for security flaws', weights: { appsec: 5 } },
    ],
  },
  {
    id: 'q6_workstyle',
    category: 'WorkStyle',
    prompt: 'What work style fits you best?',
    options: [
      { id: 'hands-on', label: 'Hands-on, tactical, in the tools', weights: { soc: 4, pentest: 4, dfir: 4 } },
      { id: 'analytical', label: 'Analytical, research, documentation', weights: { grc: 4, dfir: 3, appsec: 3 } },
      { id: 'people', label: 'People-facing, advisory, communication', weights: { grc: 5, soc: 2 } },
      { id: 'builder', label: 'Building and automating systems', weights: { cloud: 5, appsec: 4 } },
    ],
  },
  {
    id: 'q7_pressure',
    category: 'WorkStyle',
    prompt: 'How do you handle high-pressure, time-critical situations?',
    options: [
      { id: 'thrive', label: 'I thrive — I want to be in the war room', weights: { soc: 5, dfir: 5, pentest: 3 } },
      { id: 'ok', label: "I'm fine with occasional urgency", weights: { pentest: 3, cloud: 3, appsec: 3 } },
      { id: 'steady', label: 'I prefer steady, planned work', weights: { grc: 5, appsec: 3, cloud: 3 } },
    ],
  },
  {
    id: 'q8_motivation',
    category: 'Interest',
    prompt: 'What would make you feel most fulfilled in a security role?',
    options: [
      { id: 'catch', label: 'Catching an attacker in the act', weights: { soc: 5, dfir: 4 } },
      { id: 'break', label: 'Breaking something nobody else could', weights: { pentest: 5, appsec: 3 } },
      { id: 'comply', label: 'Helping an org pass a critical audit', weights: { grc: 5 } },
      { id: 'scale', label: 'Securing systems at massive scale', weights: { cloud: 5 } },
      { id: 'solve', label: 'Solving a digital crime puzzle', weights: { dfir: 5 } },
      { id: 'ship', label: 'Shipping secure software fast', weights: { appsec: 5 } },
    ],
  },
  {
    id: 'q9_experience',
    category: 'Experience',
    prompt: 'How much hands-on security experience do you already have?',
    options: [
      { id: 'new', label: 'Brand new — just starting out', weights: { soc: 2, grc: 2 } },
      { id: 'dabbled', label: "I've dabbled (CTFs, homelabs, courses)", weights: { pentest: 3, soc: 3, dfir: 2, appsec: 2 } },
      { id: 'working', label: '1–3 years in IT/security-adjacent work', weights: { soc: 4, cloud: 4, grc: 4 } },
      { id: 'senior', label: '3+ years, ready to specialize', weights: { pentest: 4, cloud: 4, appsec: 4, dfir: 4 } },
    ],
  },
  {
    id: 'q10_learning',
    category: 'WorkStyle',
    prompt: 'How do you learn best?',
    options: [
      { id: 'platforms', label: 'Interactive platforms (TryHackMe, HackTheBox)', weights: { pentest: 5, soc: 4, dfir: 3 } },
      { id: 'build', label: 'Building real projects', weights: { cloud: 5, appsec: 5 } },
      { id: 'read', label: 'Reading frameworks & documentation', weights: { grc: 5 } },
      { id: 'cases', label: 'Case studies & real incident reports', weights: { dfir: 5, soc: 3 } },
    ],
  },
];
