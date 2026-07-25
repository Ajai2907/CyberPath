import type { TrackId } from './tracks';

export interface RoadmapResource {
  name: string;
  type: 'Course' | 'Platform' | 'Book' | 'Cert' | 'Project' | 'Reading';
  free: boolean;
  note?: string;
}

export interface RoadmapTopic {
  title: string;
  detail: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  goal: string;
  duration: string;
  topics: RoadmapTopic[];
  resources: RoadmapResource[];
}

export interface Roadmap {
  trackId: TrackId;
  phases: RoadmapPhase[];
}

export const ROADMAPS: Record<TrackId, Roadmap> = {
  soc: {
    trackId: 'soc',
    phases: [
      {
        phase: 1,
        title: 'Foundations',
        goal: 'Build a working mental model of networks, OS, and security fundamentals.',
        duration: '4–6 weeks',
        topics: [
          { title: 'Networking fundamentals', detail: 'TCP/IP, OSI model, common ports/protocols, DNS, DHCP, packet structure.' },
          { title: 'Linux & Windows basics', detail: 'File systems, permissions, process management, event logs.' },
          { title: 'Security principles', detail: 'CIA triad, least privilege, defense in depth, common attack categories.' },
        ],
        resources: [
          { name: 'TryHackMe — Pre-Security path', type: 'Platform', free: true, note: 'Guided networking + security basics' },
          { name: 'Professor Messer CompTIA Security+ videos', type: 'Course', free: true, note: 'Free video series on YouTube' },
          { name: 'Cybersecurity & Cyberwar by P.W. Singer', type: 'Book', free: false, note: 'Broad context' },
        ],
      },
      {
        phase: 2,
        title: 'Core SOC Skills',
        goal: 'Learn to read logs, alerts, and network traffic like an analyst.',
        duration: '6–8 weeks',
        topics: [
          { title: 'SIEM fundamentals', detail: 'Splunk or Elastic — ingesting logs, writing queries, building dashboards.' },
          { title: 'Log analysis', detail: 'Windows Event Logs, Syslog, auth logs, proxy/ firewall logs.' },
          { title: 'Network traffic analysis', detail: 'Wireshark, Zeek, identifying suspicious flows and beaconing.' },
          { title: 'MITRE ATT&CK', detail: 'Mapping adversary behavior to tactics & techniques.' },
        ],
        resources: [
          { name: 'LetsDefend SOC path', type: 'Platform', free: false, note: 'Simulated SOC environment' },
          { name: 'TryHackMe — SOC Level 1 path', type: 'Platform', free: true },
          { name: 'Splunk Free / Splunk Essentials', type: 'Course', free: true },
        ],
      },
      {
        phase: 3,
        title: 'Tools & Hands-On Practice',
        goal: 'Operate a detection pipeline end-to-end in a simulated environment.',
        duration: '6–8 weeks',
        topics: [
          { title: 'Detection engineering', detail: 'Writing Sigma rules, tuning alerts, reducing false positives.' },
          { title: 'Threat intelligence', detail: 'Consuming feeds, IOC enrichment, pivoting on VirusTotal/MISP.' },
          { title: 'Incident response process', detail: 'PICERL framework, triage, containment, evidence handling.' },
          { title: 'Endpoint detection', detail: 'EDR concepts, Sysmon, process lineage analysis.' },
        ],
        resources: [
          { name: 'CyberDefenders Blue Team Labs', type: 'Platform', free: false },
          { name: 'MITRE ATT&CK Navigator', type: 'Reading', free: true },
          { name: 'Active Directory Canary / Honeyaccounts lab', type: 'Project', free: true },
        ],
      },
      {
        phase: 4,
        title: 'Certifications to Target',
        goal: 'Validate your skills with industry-recognized credentials.',
        duration: '8–12 weeks',
        topics: [
          { title: 'CompTIA Security+', detail: 'Entry-level, broad security fundamentals — the standard starting cert.' },
          { title: 'CompTIA CySA+', detail: 'Analyst-focused, blue-team oriented.' },
          { title: 'BTL1 (Blue Team Level 1)', detail: 'Practical, hands-on blue team certification.' },
        ],
        resources: [
          { name: 'CompTIA Security+ (SY0-701)', type: 'Cert', free: false },
          { name: 'CompTIA CySA+', type: 'Cert', free: false },
          { name: 'Blue Team Level 1 (BTL1)', type: 'Cert', free: false, note: 'Practical exam' },
        ],
      },
      {
        phase: 5,
        title: 'Portfolio & Job-Readiness',
        goal: 'Demonstrate real detection work and land your first SOC role.',
        duration: 'Ongoing',
        topics: [
          { title: 'Detection portfolio', detail: 'Publish 3–5 Sigma rules or Splunk detections with writeups on GitHub.' },
          { title: 'Threat hunt writeups', detail: 'Document a hunt hypothesis, query, and findings.' },
          { title: 'Resume & interview prep', detail: 'Translate lab work into resume bullets; practice SOC interview questions.' },
        ],
        resources: [
          { name: 'Publish detections to a GitHub repo', type: 'Project', free: true },
          { name: 'Write a threat hunt on Medium/ Substack', type: 'Project', free: true },
          { name: 'SOC interview question bank (LetsDefend blog)', type: 'Reading', free: true },
        ],
      },
    ],
  },
  pentest: {
    trackId: 'pentest',
    phases: [
      {
        phase: 1,
        title: 'Foundations',
        goal: 'Get fluent with the attacker mindset and the underlying systems.',
        duration: '4–6 weeks',
        topics: [
          { title: 'Networking & Linux', detail: 'TCP/IP, common protocols, bash fluency, file permissions.' },
          { title: 'Web fundamentals', detail: 'HTTP, cookies, sessions, same-origin policy, REST.' },
          { title: 'Security basics', detail: 'OWASP Top 10, CIA triad, common vuln categories.' },
        ],
        resources: [
          { name: 'TryHackMe — Pre-Security + Beginner path', type: 'Platform', free: true },
          { name: 'OverTheWire Bandit', type: 'Platform', free: true, note: 'Linux CLI wargame' },
          { name: 'The Web Application Hacker\'s Handbook', type: 'Book', free: false },
        ],
      },
      {
        phase: 2,
        title: 'Core Hacking Skills',
        goal: 'Learn the standard attack methodology: enumerate, exploit, escalate.',
        duration: '8–10 weeks',
        topics: [
          { title: 'Recon & enumeration', detail: 'nmap, gobuster, subdomain discovery, service fingerprinting.' },
          { title: 'Web exploitation', detail: 'SQLi, XSS, SSRF, IDOR, auth flaws, file upload.' },
          { title: 'Privilege escalation', detail: 'Linux & Windows local privesc, misconfigurations, SUID.' },
          { title: 'Active Directory', detail: 'Kerberos, BloodHound, lateral movement, pass-the-hash.' },
        ],
        resources: [
          { name: 'TryHackMe — Junior Penetration Tester path', type: 'Platform', free: true },
          { name: 'PortSwigger Web Security Academy', type: 'Platform', free: true, note: 'Best free web hacking resource' },
          { name: 'HackTheBox Academy', type: 'Platform', free: false },
        ],
      },
      {
        phase: 3,
        title: 'Tools & Hands-On Practice',
        goal: 'Chain exploits on realistic, live targets.',
        duration: '8–12 weeks',
        topics: [
          { title: 'Burp Suite mastery', detail: 'Proxy, Repeater, Intruder, extensions.' },
          { title: 'Metasploit & payloads', detail: 'Exploitation, meterpreter, pivoting.' },
          { title: 'Buffer overflows', detail: 'Stack-based overflows, basic exploit dev.' },
          { title: 'Report writing', detail: 'Executive summary, findings, repro steps, remediation.' },
        ],
        resources: [
          { name: 'HackTheBox — active machines', type: 'Platform', free: false },
          { name: 'VulnHub / Proving Grounds Practice', type: 'Platform', free: true },
          { name: 'Build a home Active Directory lab', type: 'Project', free: true },
        ],
      },
      {
        phase: 4,
        title: 'Certifications to Target',
        goal: 'Prove you can do it under pressure.',
        duration: '10–16 weeks',
        topics: [
          { title: 'CompTIA Security+', detail: 'Foundational — required by many employers.' },
          { title: 'eJPT / PNPT', detail: 'Entry-level practical pentest certs.' },
          { title: 'OSCP', detail: 'The gold standard practical pentest certification — 24-hour exam.' },
        ],
        resources: [
          { name: 'CompTIA Security+', type: 'Cert', free: false },
          { name: 'INE eJPT', type: 'Cert', free: false },
          { name: 'OffSec OSCP (PEN-200)', type: 'Cert', free: false, note: 'Practical, proctored' },
        ],
      },
      {
        phase: 5,
        title: 'Portfolio & Job-Readiness',
        goal: 'Show, don\'t tell — build a body of work recruiters can verify.',
        duration: 'Ongoing',
        topics: [
          { title: 'HTB/TJM writeups', detail: 'Publish 5–10 machine writeups with methodology.' },
          { title: 'Bug bounty', detail: 'HackerOne / Bugcrowd — submit real reports.' },
          { title: 'Resume & interview prep', detail: 'Emphasize methodology + reporting, not just tools.' },
        ],
        resources: [
          { name: 'HackerOne / Bugcrowd', type: 'Platform', free: true },
          { name: 'CTFtime.org — join a CTF', type: 'Platform', free: true },
          { name: 'Writeups on GitHub / Medium', type: 'Project', free: true },
        ],
      },
    ],
  },
  grc: {
    trackId: 'grc',
    phases: [
      {
        phase: 1,
        title: 'Foundations',
        goal: 'Understand how security maps to business risk and law.',
        duration: '4–6 weeks',
        topics: [
          { title: 'Security fundamentals', detail: 'CIA triad, risk = threat × vuln × impact, control types.' },
          { title: 'Business & legal context', detail: 'How security enables the business; basic data protection law.' },
          { title: 'IT basics', detail: 'Enough networking, cloud, and identity to talk credibly with engineers.' },
        ],
        resources: [
          { name: 'Professor Messer Security+ videos', type: 'Course', free: true },
          { name: 'NIST Cybersecurity Framework (CSF) docs', type: 'Reading', free: true },
          { name: 'CISSP Sybex study guide', type: 'Book', free: false },
        ],
      },
      {
        phase: 2,
        title: 'Core GRC Skills',
        goal: 'Operate the frameworks, risk registers, and audit processes.',
        duration: '8–10 weeks',
        topics: [
          { title: 'Frameworks', detail: 'NIST CSF, ISO 27001, CIS Controls, SOC 2, PCI-DSS.' },
          { title: 'Risk assessments', detail: 'Identify, score, treat, and track risk.' },
          { title: 'Policy & control mapping', detail: 'Writing policy, mapping controls to frameworks.' },
          { title: 'Audit & evidence', detail: 'Walking through an audit, evidence collection.' },
        ],
        resources: [
          { name: 'ISACA CRISC / CISA review manuals', type: 'Book', free: false },
          { name: 'ISO 27001 free overview courses (ISO.org)', type: 'Course', free: true },
          { name: 'Secure Controls Framework (SCF) open docs', type: 'Reading', free: true },
        ],
      },
      {
        phase: 3,
        title: 'Tools & Hands-On Practice',
        goal: 'Run a real (simulated) GRC program end-to-end.',
        duration: '6–8 weeks',
        topics: [
          { title: 'GRC platforms', detail: 'ServiceNow GRC, OneTrust, or open-source like Riscurity.' },
          { title: 'Vendor risk', detail: 'Third-party risk assessments, questionnaires, remediation.' },
          { title: 'Cloud compliance', detail: 'Mapping AWS/Azure controls to SOC 2 / ISO 27001.' },
          { title: 'Security awareness', detail: 'Designing training and phishing simulations.' },
        ],
        resources: [
          { name: 'OneTrust / Drata free trials', type: 'Platform', free: false },
          { name: 'Build a mock SOC 2 control matrix', type: 'Project', free: true },
          { name: 'AWS Audit Manager guide', type: 'Reading', free: true },
        ],
      },
      {
        phase: 4,
        title: 'Certifications to Target',
        goal: 'Carry the credentials that open GRC doors.',
        duration: '10–14 weeks',
        topics: [
          { title: 'CompTIA Security+', detail: 'Foundational.' },
          { title: 'CISA', detail: 'Audit-focused, highly respected.' },
          { title: 'CRISC / CISM', detail: 'Risk and security management.' },
        ],
        resources: [
          { name: 'CompTIA Security+', type: 'Cert', free: false },
          { name: 'ISACA CISA', type: 'Cert', free: false },
          { name: 'ISACA CRISC', type: 'Cert', free: false },
        ],
      },
      {
        phase: 5,
        title: 'Portfolio & Job-Readiness',
        goal: 'Show you can translate security into business outcomes.',
        duration: 'Ongoing',
        topics: [
          { title: 'Policy portfolio', detail: 'Publish sample AUP, IR, and access-control policies.' },
          { title: 'Mock audit writeup', detail: 'Document a full simulated SOC 2 audit.' },
          { title: 'Resume & interview prep', detail: 'Emphasize frameworks, communication, and audit experience.' },
        ],
        resources: [
          { name: 'Publish a sample policy pack on GitHub', type: 'Project', free: true },
          { name: 'SANS GRC reading lists', type: 'Reading', free: true },
          { name: 'GRC interview question bank (LinkedIn)', type: 'Reading', free: true },
        ],
      },
    ],
  },
  cloud: {
    trackId: 'cloud',
    phases: [
      {
        phase: 1,
        title: 'Foundations',
        goal: 'Get fluent in cloud primitives and identity models.',
        duration: '4–6 weeks',
        topics: [
          { title: 'Networking & Linux', detail: 'VPCs, subnets, routing, IAM basics, bash.' },
          { title: 'Cloud fundamentals', detail: 'IaaS/PaaS/SaaS, shared responsibility model.' },
          { title: 'Security basics', detail: 'Identity, least privilege, encryption in transit/at rest.' },
        ],
        resources: [
          { name: 'AWS Cloud Practitioner free training', type: 'Course', free: true },
          { name: 'TryHackMe — Cloud Fundamentals', type: 'Platform', free: true },
          { name: 'Cloud Security Alliance guidance', type: 'Reading', free: true },
        ],
      },
      {
        phase: 2,
        title: 'Core Cloud Security Skills',
        goal: 'Secure identity, data, and network controls across a major cloud.',
        duration: '8–10 weeks',
        topics: [
          { title: 'IAM hardening', detail: 'Roles, policies, MFA, conditional access, service principals.' },
          { title: 'Network security', detail: 'Security groups, NACLs, private endpoints, WAF.' },
          { title: 'Data protection', detail: 'KMS/encryption, secrets management, bucket policies.' },
          { title: 'Logging & monitoring', detail: 'CloudTrail, GuardDuty, Azure Monitor, GCP Audit Logs.' },
        ],
        resources: [
          { name: 'AWS Security Learning Plan', type: 'Course', free: true },
          { name: 'Hacking The Cloud (hackingthe.cloud)', type: 'Platform', free: true },
          { name: 'CloudGoat (Rhino Security)', type: 'Platform', free: true, note: 'Vulnerable AWS labs' },
        ],
      },
      {
        phase: 3,
        title: 'Tools & Hands-On Practice',
        goal: 'Operate DevSecOps pipelines and IaC security at scale.',
        duration: '8–12 weeks',
        topics: [
          { title: 'Infrastructure as Code', detail: 'Terraform, CloudFormation, secure module design.' },
          { title: 'IaC scanning', detail: 'tfsec, Checkov, Terrascan.' },
          { title: 'CI/CD security', detail: 'Secret scanning, SAST in pipelines, image scanning.' },
          { title: 'Container & Kubernetes', detail: 'Docker hardening, K8s RBAC, network policies.' },
        ],
        resources: [
          { name: 'Kubernetes Goat', type: 'Platform', free: true },
          { name: 'Checkov / tfsec docs', type: 'Reading', free: true },
          { name: 'Build a secure Terraform module repo', type: 'Project', free: true },
        ],
      },
      {
        phase: 4,
        title: 'Certifications to Target',
        goal: 'Carry cloud + security credentials.',
        duration: '10–14 weeks',
        topics: [
          { title: 'AWS Solutions Architect Associate', detail: 'Cloud architecture baseline.' },
          { title: 'AWS Security Specialty', detail: 'Deep AWS security — the marquee cert.' },
          { title: 'CCSK or CCSP', detail: 'Vendor-neutral cloud security.' },
        ],
        resources: [
          { name: 'AWS SAA-C03', type: 'Cert', free: false },
          { name: 'AWS Security Specialty (SCS-C02)', type: 'Cert', free: false },
          { name: '(ISC)² CCSP', type: 'Cert', free: false },
        ],
      },
      {
        phase: 5,
        title: 'Portfolio & Job-Readiness',
        goal: 'Demonstrate secure-by-default cloud engineering.',
        duration: 'Ongoing',
        topics: [
          { title: 'Reference architecture', detail: 'Publish a secure landing zone in Terraform.' },
          { title: 'Open-source contributions', detail: 'PRs to Checkov, Prowler, or kube-bench.' },
          { title: 'Resume & interview prep', detail: 'Highlight multi-cloud, IaC, and automation.' },
        ],
        resources: [
          { name: 'Publish a secure AWS landing zone', type: 'Project', free: true },
          { name: 'Prowler / kube-bench contributions', type: 'Project', free: true },
          { name: 'CloudSecList newsletter', type: 'Reading', free: true },
        ],
      },
    ],
  },
  dfir: {
    trackId: 'dfir',
    phases: [
      {
        phase: 1,
        title: 'Foundations',
        goal: 'Build the OS and network fluency that forensics depends on.',
        duration: '4–6 weeks',
        topics: [
          { title: 'OS internals', detail: 'Windows registry, NTFS, Linux file systems, process trees.' },
          { title: 'Networking', detail: 'PCAP analysis, common protocols, traffic baselining.' },
          { title: 'Security fundamentals', detail: 'Incident lifecycle, evidence handling, chain of custody.' },
        ],
        resources: [
          { name: 'TryHackMe — Pre-Security path', type: 'Platform', free: true },
          { name: 'SANS Digital Forensics blog', type: 'Reading', free: true },
          { name: 'Windows Internals (Russinovich)', type: 'Book', free: false },
        ],
      },
      {
        phase: 2,
        title: 'Core DFIR Skills',
        goal: 'Acquire, preserve, and analyze digital evidence.',
        duration: '8–10 weeks',
        topics: [
          { title: 'Disk forensics', detail: 'Imaging, Autopsy, FTK Imager, file system timelines.' },
          { title: 'Memory forensics', detail: 'Volatility — process, network, and malware artifacts in RAM.' },
          { title: 'Network forensics', detail: 'Zeek, Wireshark, reconstructing sessions from PCAP.' },
          { title: 'Windows artifacts', detail: 'Event logs, prefetch, Shimcache, Amcache, MFT.' },
        ],
        resources: [
          { name: 'TryHackMe — Cyber Forensics path', type: 'Platform', free: true },
          { name: '13Cubed DFIR videos (YouTube)', type: 'Course', free: true },
          { name: 'Volatility 3 documentation', type: 'Reading', free: true },
        ],
      },
      {
        phase: 3,
        title: 'Tools & Hands-On Practice',
        goal: 'Investigate realistic incidents from detection to root cause.',
        duration: '8–12 weeks',
        topics: [
          { title: 'EDR & live response', detail: 'Velociraptor, KAPE, collecting triage artifacts.' },
          { title: 'Malware analysis basics', detail: 'Static analysis, strings, hashing, sandboxing.' },
          { title: 'Threat hunting', detail: 'Hypothesis-driven hunts across endpoint + network data.' },
          { title: 'Incident reporting', detail: 'Timeline construction, executive summary, lessons learned.' },
        ],
        resources: [
          { name: 'CyberDefenders DFIR labs', type: 'Platform', free: false },
          { name: 'Eric Zimmerman\'s tools (KAPE, EZViewer)', type: 'Platform', free: true },
          { name: 'Build a Velociraptor homelab', type: 'Project', free: true },
        ],
      },
      {
        phase: 4,
        title: 'Certifications to Target',
        goal: 'Carry practical DFIR credentials.',
        duration: '10–14 weeks',
        topics: [
          { title: 'CompTIA Security+', detail: 'Foundational.' },
          { title: 'GCFA', detail: 'SANS forensic analyst — highly respected.' },
          { title: 'GCFR / BTL2', detail: 'Cloud forensics or advanced blue team.' },
        ],
        resources: [
          { name: 'CompTIA Security+', type: 'Cert', free: false },
          { name: 'GIAC GCFA', type: 'Cert', free: false },
          { name: 'Blue Team Level 2 (BTL2)', type: 'Cert', free: false },
        ],
      },
      {
        phase: 5,
        title: 'Portfolio & Job-Readiness',
        goal: 'Show you can run an investigation end-to-end.',
        duration: 'Ongoing',
        topics: [
          { title: 'Case writeups', detail: 'Publish 3–5 DFIR case studies with timelines.' },
          { title: 'Tooling', detail: 'Release a Volatility plugin or KAPE module.' },
          { title: 'Resume & interview prep', detail: 'Emphasize methodology, evidence handling, and reporting.' },
        ],
        resources: [
          { name: 'Publish DFIR writeups on GitHub', type: 'Project', free: true },
          { name: 'Contribute to Volatility plugins', type: 'Project', free: true },
          { name: 'DFIR Madness challenge set', type: 'Platform', free: true },
        ],
      },
    ],
  },
  appsec: {
    trackId: 'appsec',
    phases: [
      {
        phase: 1,
        title: 'Foundations',
        goal: 'Be a developer who understands security primitives.',
        duration: '4–6 weeks',
        topics: [
          { title: 'Web fundamentals', detail: 'HTTP, sessions, cookies, same-origin policy, REST APIs.' },
          { title: 'Programming', detail: 'Comfort in at least one web stack (Node, Python, Java, Go).' },
          { title: 'Security basics', detail: 'OWASP Top 10, input validation, authN/authZ.' },
        ],
        resources: [
          { name: 'OWASP Top 10 documentation', type: 'Reading', free: true },
          { name: 'PortSwigger Web Security Academy', type: 'Platform', free: true },
          { name: 'The Web Application Hacker\'s Handbook', type: 'Book', free: false },
        ],
      },
      {
        phase: 2,
        title: 'Core AppSec Skills',
        goal: 'Find and fix the classes of bugs that matter most.',
        duration: '8–10 weeks',
        topics: [
          { title: 'Injection & auth flaws', detail: 'SQLi, command injection, IDOR, broken access control.' },
          { title: 'XSS & CSRF', detail: 'Reflected/stored/DOM XSS, CSRF tokens, SameSite cookies.' },
          { title: 'Secure design', detail: 'Threat modeling, STRIDE, secure session handling.' },
          { title: 'Secrets & deps', detail: 'Hardcoded secrets, vulnerable dependencies, SBOMs.' },
        ],
        resources: [
          { name: 'OWASP Juice Shop', type: 'Platform', free: true },
          { name: 'OWASP Cornucopia / Threat Modeling Canvas', type: 'Reading', free: true },
          { name: 'DVWA (Damn Vulnerable Web App)', type: 'Platform', free: true },
        ],
      },
      {
        phase: 3,
        title: 'Tools & Hands-On Practice',
        goal: 'Wire security into a real SDLC.',
        duration: '8–12 weeks',
        topics: [
          { title: 'SAST/DAST', detail: 'Semgrep, CodeQL, ZAP, Burp Enterprise — tuning and triage.' },
          { title: 'SCA & secrets', detail: 'Dependabot, Snyk, Trivy, gitleaks in CI.' },
          { title: 'Secure code review', detail: 'Reviewing PRs for vulns, not just style.' },
          { title: 'Container & API security', detail: 'Image scanning, OpenAPI schema validation, API fuzzing.' },
        ],
        resources: [
          { name: 'Semgrep + CodeQL tutorials', type: 'Course', free: true },
          { name: 'OWASP ZAP', type: 'Platform', free: true },
          { name: 'Build a CI pipeline with SAST + SCA', type: 'Project', free: true },
        ],
      },
      {
        phase: 4,
        title: 'Certifications to Target',
        goal: 'Carry credentials that prove code-level security depth.',
        duration: '10–14 weeks',
        topics: [
          { title: 'CompTIA Security+', detail: 'Foundational.' },
          { title: 'OSCP or eWPTX', detail: 'Practical web exploitation.' },
          { title: 'CASE (Certified Application Security Engineer)', detail: 'AppSec-focused.' },
        ],
        resources: [
          { name: 'CompTIA Security+', type: 'Cert', free: false },
          { name: 'INE eWPTX', type: 'Cert', free: false },
          { name: 'EC-Council CASE Java', type: 'Cert', free: false },
        ],
      },
      {
        phase: 5,
        title: 'Portfolio & Job-Readiness',
        goal: 'Demonstrate you can ship secure software at velocity.',
        duration: 'Ongoing',
        topics: [
          { title: 'Vuln disclosures', detail: 'Responsibly disclose bugs or contribute to bug bounties.' },
          { title: 'Secure-by-default template', detail: 'Publish a hardened starter app + CI pipeline.' },
          { title: 'Resume & interview prep', detail: 'Emphasize dev background + security mindset.' },
        ],
        resources: [
          { name: 'Publish a secure app starter repo', type: 'Project', free: true },
          { name: 'HackerOne / Bugcrowd web targets', type: 'Platform', free: true },
          { name: 'AppSec interview guides (OWASP)', type: 'Reading', free: true },
        ],
      },
    ],
  },
};
