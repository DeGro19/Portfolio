// Everything lifted from the CV, kept as structured data so the page stays
// presentational. Update here when the CV changes.

export const about = {
  paragraphs: [
    "I'm a cybersecurity graduate from Keele University, where I finished in July 2025 with a BSc Honours Degree in Computer Science, Cyber Security, graded 1st Class. My work sits where offensive security meets tooling. I find how web applications fail, then build something that catches it the next time.",
    "I spent my summer breaks working through IBM's cybersecurity track rather than waiting until after the degree: seven certifications covering threat intelligence, penetration testing, incident response and forensics, network security and database vulnerabilities, and breach response case studies.",
    "That same instinct drove my dissertation. Default OWASP ZAP scans handle textbook SQL injection well and struggle against encoded, time-based and nested payloads, so I built a context-aware payload library to close the gap: Boolean logic, time delays, nested queries and obfuscation via Base64, Unicode and hexadecimal. Validated against WebGoat, it found 9% more injection vulnerabilities than the default configuration. It won Best Poster at Keele Town Hall, was nominated for Student of the Year 2025, and is being co-published with Dr. Amro Al-Said Ahmad.",
    "Since graduating I have kept building. I completed online courses in cloud computing and AI, and earned Microsoft's AZ-204 (Azure Developer Associate) through hands-on work across identity and access management, secrets handling in Key Vault, event-driven architecture and application monitoring. Application-layer security does not count for much if the cloud underneath it is misconfigured. I also took part in Microsoft's two-day Agentic AI Hackathon in June 2026, building multi-agent applications on Microsoft Foundry with Azure OpenAI and the Microsoft Agent Framework, and came away with the AI Agent Master badge.",
    "I'm looking for a Junior Security Analyst role where research-led, cloud-aware methodology is actually useful, somewhere that cares why a detection failed, not just that it did.",
  ],
  highlights: [
    {
      value: "1st",
      label: "Class Honours",
      detail: "BSc Computer Science (Cyber Security)",
    },
    {
      value: "+9%",
      label: "SQLi detection",
      detail: "over default OWASP ZAP scans",
    },
    { value: "8+", label: "Certifications", detail: "Microsoft and IBM" },
    {
      value: "AZ-204",
      label: "Azure Developer",
      detail: "Microsoft Certified Associate",
    },
  ],
} as const;

export const education = {
  institution: "Keele University",
  degree: "BSc Computer Science (Cyber Security)",
  grade: "1st Class Honours",
  period: "Sept 2022 - July 2025",
  points: [
    "Dissertation: “Enhancing SQL Injection Detection in OWASP ZAP using Custom Payload Fuzzing”",
    "Engineered a custom SQLi detection pipeline in OWASP ZAP using custom payload fuzzing",
    "Conducted structured vulnerability assessments using WebGoat environments",
    "Awarded Best Poster at Keele Town Hall; nominated Student of the Year 2025",
    "Dissertation co-publishing with Dr. Amro Al-Said Ahmad",
  ],
} as const;

export const certifications = [
  {
    issuer: "Microsoft",
    items: [
      {
        name: "AZ-204: Azure Developer Associate",
        detail:
          "App Service, Azure Functions, Key Vault, Azure AD, Service Bus, Event Hub, Event Grid, Cosmos DB, Blob Storage, Container Registry, APIM, Application Insights, Azure Monitor",
      },
      {
        name: "Agentic AI Hackathon: AI Agent Master (Jun 2026)",
        detail:
          "Two-day hands-on build using Microsoft Foundry, Azure OpenAI and the Microsoft Agent Framework, including multi-agent workflow orchestration with Foundry IQ",
      },
    ],
  },
  {
    issuer: "IBM",
    items: [
      { name: "Cyber Threat Intelligence" },
      { name: "Cybersecurity Analyst Assessment" },
      { name: "Cybersecurity Capstone: Breach Response Case Studies" },
      { name: "Penetration Testing, Incident Response and Forensics" },
      { name: "Network Security & Database Vulnerabilities" },
      { name: "Introduction to Cybersecurity Tools & Cyberattacks" },
      { name: "Operating Systems: Overview, Administration and Security" },
    ],
  },
] as const;

export const skills = [
  {
    category: "Security Tools",
    items: ["OWASP ZAP", "Burp Suite", "Wireshark"],
  },
  {
    category: "Offensive Security",
    items: [
      "SQLi Testing",
      "Manual Payload Fuzzing",
      "DAST",
      "Web Application Pentesting",
    ],
  },
  {
    category: "Defensive & Analysis",
    items: [
      "Cyber Threat Intelligence",
      "Incident Response",
      "Vulnerability Scanning",
      "Log Analysis",
      "Secrets Management",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    items: [
      "Azure App Service",
      "Azure Functions",
      "Key Vault",
      "Azure AD / Microsoft Identity Platform",
      "Service Bus",
      "Event Hub",
      "Event Grid",
      "Cosmos DB",
      "Blob Storage",
      "Container Registry",
      "Container Instances",
      "APIM",
      "Redis Cache",
      "Application Insights",
      "Azure Monitor",
      "ARM Templates",
    ],
  },
  {
    category: "Languages",
    items: ["Python", "SQL", "Java", "C++", "HTML"],
  },
  {
    category: "Systems & Environments",
    items: ["Windows", "XAMPP", "WebGoat", "Azure Portal"],
  },
] as const;

export const extracurricular = [
  {
    name: "CyberFirst Advanced Programme",
    period: "2019",
    description:
      "Government-backed summer school covering penetration testing, encryption and threat detection.",
  },
  {
    name: "TryHackMe",
    period: "2024 - 2025",
    description:
      "Labs simulating SQLi, XSS, privilege escalation and network-based attacks.",
  },
  {
    name: "Hack Keele Society",
    period: "2022 - 2025",
    description: "Ethical hacking meetups and Capture The Flag (CTF) events.",
  },
] as const;

export const projects = [
  {
    title: "SQLi Detection Enhancement in OWASP ZAP",
    subtitle: "Dissertation",
    summary:
      "A custom payload fuzzing library extending OWASP ZAP's SQL injection detection, validated against WebGoat.",
    points: [
      "Developed a custom payload fuzzing library to extend SQLi detection capabilities in OWASP ZAP",
      "Leveraged Python automation to outperform default scan configurations, delivering a +9% improvement in detection rate validated against the WebGoat environment",
      "Conducted comparative analysis exposing structural flaws in default OWASP ZAP payloads versus custom payloads",
      "Awarded Best Poster at Keele Town Hall; nominated Student of the Year 2025",
    ],
    tech: ["Python", "OWASP ZAP", "WebGoat", "Docker", "SQL", "DAST"],
    caseStudy: "/projects/sqli-detection",
    repo: "https://github.com/DeGro19/Enhancing-SQL-Injection-Vulnerability-Detection-in-Open-Source-Scanners-using-Payload-Fuzzing",
  },
  {
    title: "Microsoft Azure Cloud Application",
    subtitle: "AZ-204 Developer Associate",
    summary:
      "A production-grade Azure web application covering identity, secrets, event-driven messaging and observability.",
    points: [
      "Deployed and managed a scalable web application on Azure App Service, configuring SSL, API settings, diagnostics logging and autoscaling rules",
      "Implemented identity and access controls using the Microsoft Identity Platform and Azure Active Directory, including OAuth 2.0 flows, shared access signatures and role-based access control",
      "Secured application secrets using Azure Key Vault with key rotation and certificate handling",
      "Designed event-driven messaging pipelines using Service Bus, Event Hub and Event Grid for asynchronous workflows and decoupled microservice communication",
      "Configured observability and alerting via Application Insights and Azure Monitor to support proactive incident response",
      "Managed Cosmos DB (partitioning schemes and consistency levels), Blob Storage (archiving and retention) and Queue Storage",
      "Deployed containerised workloads via Container Registry and Container Instances; provisioned infrastructure with ARM templates",
      "Implemented API Management with authentication policies and rate limiting to enforce defence in depth",
    ],
    tech: [
      "Azure",
      "OAuth 2.0",
      "Key Vault",
      "Cosmos DB",
      "ARM Templates",
      "APIM",
    ],
  },
  {
    title: "Agentic AI Hackathon",
    subtitle: "Microsoft Foundry, June 2026",
    summary:
      "Two days building multi-agent AI applications on Microsoft Foundry, part of Microsoft's Cloud & AI Frontier Week.",
    points: [
      "Built multi-agent AI applications using Microsoft Foundry, Azure OpenAI and the Microsoft Agent Framework",
      "Orchestrated multi-agent workflows with Foundry IQ for multi-step business automation",
      "Attended the live sessions across both days and completed the required projects to earn the AI Agent Master badge",
    ],
    tech: [
      "Microsoft Foundry",
      "Azure OpenAI",
      "Microsoft Agent Framework",
      "Foundry IQ",
    ],
    certificate: "/agentic-ai-hackathon-certificate.pdf",
    image: {
      src: "/agentic-ai-hackathon-badge.png",
      width: 1254,
      height: 1254,
      alt: "Microsoft Agentic AI Hackathon, AI Agent Master badge, June 2026",
    },
  },
] as const;
