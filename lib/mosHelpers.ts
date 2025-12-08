import type { MissionTask } from './types';

interface MOSMapping {
  keywords: string[];
  insights: string[];
}

type MOSCategory = keyof typeof mosDatabase;

// Central MOS → category database.
// We expanded categories a bit and made some keywords more precise.
const mosDatabase: Record<string, MOSMapping> = {
  // Cyber / IT / Signal
  cyber: {
    keywords: [
      '17c', '17e', // Army cyber
      '25', '25b', '25n', '25s', // Army signal/IT
      '26', // legacy signal
      '35t', // MI systems maintainer
      'it', 'cyber', 'signal', 'comm',
      '06', // USMC comms
      '1n4', // USAF network intel
      '3d0', '3d1', // USAF cyber/comm
    ],
    insights: [
      'Map your MOS to civilian titles like IT Support Specialist, Network Administrator, or Cybersecurity Analyst',
      'Enroll in DoD SkillBridge tech pipelines: Amazon AWS, Microsoft MSSA, NPower, or Hiring Our Heroes tech cohorts',
      'Use your military experience to test out of CompTIA A+, Network+, Security+ using vouchers from your education center',
      'Request your Joint Service Transcript (JST) to convert cyber training and leadership into college credits',
      'Target GS-2210 IT Specialist roles on USAJobs — your clearance and DoD background are major advantages',
      'Look at veteran tech apprenticeships: IBM SkillsBuild, Salesforce Military, Google IT Support / Cyber certificates',
      'Leverage your clearance for defense contractor roles: Booz Allen, Leidos, CACI, Northrop Grumman, SAIC',
    ],
  },

  // Infantry / Combat Arms
  infantry: {
    keywords: [
      '11', '11b', '11c', // Army infantry
      '03', '0311', '0313', // USMC infantry
      '18', // Special Forces
      'infantry', 'ranger', 'airborne', 'combat arms',
    ],
    insights: [
      'Translate infantry experience into civilian titles: Operations Supervisor, Field Operations Lead, Security Manager',
      'Strong pipeline into law enforcement: local police academies, state troopers, and federal agencies (FBI, DEA, ATF)',
      'Use the GI Bill for Criminal Justice or Emergency Management programs at schools with strong veteran support',
      'Check DHS and CBP veteran hiring for border patrol, federal protective service, and emergency response roles',
      'Corporate security and physical risk management roles value your small-unit leadership and crisis decision-making',
      'Executive protection, event security, and private security contracting are natural extensions of your experience',
    ],
  },

  // Military Police / Law Enforcement
  lawEnforcement: {
    keywords: [
      '31', '31b', '31e', // Army MP / corrections
      '5811', '5813', // USMC MP
      'mp', 'military police',
    ],
    insights: [
      'Translate MP duties into civilian job titles: Police Officer, Public Safety Officer, Security Supervisor',
      'Many departments waive or shorten academies for prior military police — ask about lateral/accelerated tracks',
      'Your report writing and case documentation experience are valuable for detective and investigations roles',
      'Look at federal paths: TSA, Federal Protective Service, US Marshals, and DHS agencies with veteran preference',
      'Corporate security departments (banks, hospitals, campuses) value MP experience in access control and incident response',
      'Consider crime prevention, loss prevention, or risk analysis roles that use your investigative skills without patrol work',
    ],
  },

  // Medical / Healthcare
  medical: {
    keywords: [
      '68', '68w', '68c', // Army medics / behavioral
      '8404', 'corpsman',
      '4n0', // USAF medical
      'medic', 'corpsman', 'medical', 'healthcare',
    ],
    insights: [
      'Use medic/corpsman experience to fast-track EMT-B/Paramedic through state equivalency or bridge programs',
      'Your trauma and emergency care experience aligns with ER tech, ICU tech, and fire/EMS hiring pipelines',
      'Use the GI Bill for accelerated nursing (ADN/BSN) or Physician Assistant programs that accept military clinical hours',
      'Apply to VA hospitals and community clinics through veteran preference hiring for healthcare tech roles',
      'Explore surgical tech, radiology tech, respiratory therapy, and dialysis tech programs that value your background',
      'Medical device and pharma companies recruit medics for clinical specialist and field educator roles',
    ],
  },

  // Logistics / Supply
  logistics: {
    keywords: [
      '88', '88m', '88n', // transportation
      '92', '92y', '92a', '92s', // supply
      '3051', // USMC supply
      '2t', // USAF transportation
      'supply', 'logistics', 'warehouse', 'transportation',
    ],
    insights: [
      'Translate logistics MOS into titles like Supply Chain Coordinator, Warehouse Lead, or Logistics Analyst',
      'Direct path into Amazon, UPS, FedEx, and other major distribution centers with veteran hiring pipelines',
      'Leverage logistics training toward APICS / CSCP and Six Sigma certifications (often discounted or free)',
      'Use JST to convert logistics and maintenance courses into Supply Chain Management college credits',
      'Federal GS-2001 Supply Management and GS-0346 Logistics Management roles align well with your experience',
      'Manufacturing and e-commerce firms actively recruit veterans into operations and fulfillment leadership roles',
    ],
  },

  // Intelligence / Analysis
  intel: {
    keywords: [
      '35', '35f', '35g', '35m', // Army intel
      '02', // USMC intel
      '1n', '1n0', // USAF intel
      'intel', 'intelligence', 'analyst', 'geospatial', 'geoint', 'humint', 'sigint',
    ],
    insights: [
      'Your clearance + intel background = prime candidate for defense contractor analyst roles',
      'Target agencies like CIA, DIA, NSA, FBI that have dedicated veteran hiring paths and clearance transfer',
      'Convert HUMINT, SIGINT, GEOINT skills into roles at fusion centers, threat intel shops, or risk firms',
      'Use the GI Bill for graduate programs in Intelligence Studies, Security Studies, Cyber, or Data Analytics',
      'Apply your analytical skills to corporate threat intel, fraud detection, and risk management roles',
      'Search cleared job boards (e.g., ClearanceJobs-type sites) to contract back as a civilian analyst',
    ],
  },

  // Aviation / Mechanical
  aviation: {
    keywords: [
      '15', // Army aviation
      '60', '61', '62', // rotary/wings
      '2a', '2w', // USAF maintenance
      'aviation', 'aircraft', 'mechanic', 'helicopter',
    ],
    insights: [
      'Leverage your aircraft maintenance hours toward FAA A&P certification via equivalency pathways',
      'Airlines and MRO shops actively recruit veterans for aircraft mechanic and avionics roles',
      'Defense contractors (Lockheed, Boeing, Northrop, etc.) hire maintainers for military platforms worldwide',
      'Use the GI Bill for Aviation Management or Aeronautical Engineering if you want to move into leadership roles',
      'Explore FAA inspector and safety roles where your aircraft experience is a key differentiator',
      'Private aviation and helicopter operators value military-standard maintenance culture and reliability',
    ],
  },

  // Engineering / Construction
  engineering: {
    keywords: [
      '12', // Army engineers
      '13', // some artillery engineers / decon
      '21', // legacy engineer
      '1371', // USMC combat engineer
      'engineer', 'seabee', 'construction', 'combat engineer',
    ],
    insights: [
      'Convert construction and heavy equipment time into civilian licenses (CDL, equipment operator cards)',
      'Union apprenticeships (IBEW, plumbers, operating engineers) often have veteran fast-tracks',
      'Facilities management and public works departments value your mix of technical and leadership experience',
      'Use the GI Bill for Civil Engineering, Construction Management, or Architecture',
      'Large construction firms recruit vets into project engineer and assistant project manager roles',
      'Inspection and code-enforcement jobs leverage your safety, QA/QC, and field experience',
    ],
  },

  // Admin / HR / Personnel
  admin: {
    keywords: [
      '42', '42a', // Army HR
      's1', 'personnel', 'adjutant',
      'yn', // Navy yeoman
      'ps', // USAF personnel
      'human resources', 'admin',
    ],
    insights: [
      'Translate admin/HR MOS into titles like HR Specialist, People Operations Coordinator, or Office Manager',
      'Your experience with awards, evals, and records fits HR assistant and HR generalist roles very well',
      'Federal HR Assistant (GS-0203) and HR Specialist (GS-0201) roles are a strong match',
      'Use the GI Bill for Business Administration, HR Management, or Organizational Leadership programs',
      'Smaller companies value “do-it-all” admins who can manage schedules, budgets, and people ops',
      'Payroll, benefits administration, and recruiting coordinator roles are natural next steps from S1 work',
    ],
  },

  // Food Service / Culinary
  foodService: {
    keywords: [
      '92g', 'cook', 'culinary', 'food service', '3302',
    ],
    insights: [
      'Translate cook/culinary MOS into roles like Line Cook, Kitchen Manager, or Food Service Supervisor',
      'Your experience feeding large units maps well to banquet kitchens, hotels, and institutional dining',
      'Use the GI Bill for culinary school or hospitality management if you want to move into higher-end venues',
      'Hospitals, universities, and school districts love veteran reliability in food service leadership roles',
      'Consider food truck, catering, or meal prep entrepreneurship using your large-scale cooking background',
      'Add ServSafe and local food safety certifications to stand out in civilian culinary hiring',
    ],
  },
};

// Utility: remove duplicates while preserving order
function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

// Normalize and map MOS string to one of our internal categories
function classifyMOS(mos: string): MOSCategory | null {
  const mosLower = mos.toLowerCase().trim();
  if (!mosLower) return null;

  for (const [category, data] of Object.entries(mosDatabase) as [MOSCategory, MOSMapping][]) {
    if (data.keywords.some(keyword => mosLower.includes(keyword.toLowerCase()))) {
      return category;
    }
  }

  return null;
}

export function getMOSInsights(mos: string, task: MissionTask): string[] {
  const allInsights: string[] = [];
  const mosCategory = classifyMOS(mos);

  // 1) Base MOS-specific insights
  if (mosCategory) {
    allInsights.push(...mosDatabase[mosCategory].insights);
  }

  // 2) Task-specific insights that also consider MOS
  const taskSpecificInsights = getTaskSpecificInsights(task, mos, mosCategory);
  allInsights.push(...taskSpecificInsights);

  // 3) If still nothing, fall back to general transition insights
  if (allInsights.length === 0) {
    allInsights.push(...getGeneralInsights(mosCategory));
  }

  return unique(allInsights);
}

function getTaskSpecificInsights(
  task: MissionTask,
  mos: string,
  mosCategory: MOSCategory | null
): string[] {
  const insights: string[] = [];
  const taskTitle = task.title.toLowerCase();
  const taskCategory = task.category;

  const mosLabel = mos.toUpperCase();

  // Helper: add a MOS-flavored sentence depending on category
  const addMOSCareerFlavor = () => {
    switch (mosCategory) {
      case 'cyber':
        insights.push(
          `Translate ${mosLabel} into civilian roles like IT Support, Network Engineer, or SOC Analyst and highlight any cleared work.`
        );
        break;
      case 'infantry':
      case 'lawEnforcement':
        insights.push(
          `Translate ${mosLabel} into law enforcement, public safety, and physical security roles — your use-of-force and report writing experience is valuable.`
        );
        break;
      case 'medical':
        insights.push(
          `Translate ${mosLabel} into EMS, hospital tech, and clinic roles; emphasize triage, trauma care, and patient monitoring.`
        );
        break;
      case 'logistics':
        insights.push(
          `Translate ${mosLabel} into supply chain, warehouse, and transportation roles with metrics (lines stocked, routes managed, dollar value of inventory).`
        );
        break;
      case 'intel':
        insights.push(
          `Translate ${mosLabel} into analyst roles (intel, fraud, cyber, risk) that use your pattern recognition and briefing skills.`
        );
        break;
      case 'engineering':
        insights.push(
          `Translate ${mosLabel} into construction, utilities, facilities, or infrastructure roles that use your field engineering background.`
        );
        break;
      case 'admin':
        insights.push(
          `Translate ${mosLabel} into HR, recruiting, office management, and people-ops roles using your personnel and records experience.`
        );
        break;
      case 'foodService':
        insights.push(
          `Translate ${mosLabel} into kitchen lead, catering, or high-volume food service roles; emphasize large-headcount operations.`
        );
        break;
      case 'aviation':
        insights.push(
          `Translate ${mosLabel} into aircraft maintenance, flight-line, or aviation operations roles; highlight specific platforms you worked on.`
        );
        break;
    }
  };

  // Career-related task insights
  if (taskCategory === 'career' || taskTitle.includes('resume') || taskTitle.includes('job')) {
    addMOSCareerFlavor();

    insights.push(
      'Request your Joint Service Transcript (JST) so you can translate schools and courses directly into civilian credits on your resume.',
      'Use Military OneSource Career Coaching (free) to review your resume and run mock interviews with a civilian coach.',
      'Prioritize roles that explicitly mention “veteran-friendly” or have a dedicated military hiring program.'
    );

    if (mosCategory === 'cyber') {
      insights.push(
        'Stack civilian certs on top of your MOS: Security+, CEH, or CISSP (long-term) can unlock higher-paying cyber roles.',
        'Search for “cleared SOC analyst” or “junior cyber” roles within commuting distance of your target city.'
      );
    }

    if (mosCategory === 'infantry' || mosCategory === 'lawEnforcement') {
      insights.push(
        'Look at police cadet and lateral-entry programs that give credit for prior military police or combat arms service.',
        'Consider security operations centers (GSOC) and corporate security teams if you want structured shifts without patrol work.'
      );
    }

    if (mosCategory === 'medical') {
      insights.push(
        'Ask hospitals about medic-to-EMT/Paramedic bridge options that honor your existing clinical hours.',
        'Highlight mass-casualty drills, field care, and independent decision-making on your resume.'
      );
    }
  }

  // Education-related task insights
  if (taskCategory === 'education' || taskTitle.includes('gi bill') || taskTitle.includes('school')) {
    insights.push(
      'Check if your target school has a dedicated veterans center and student veterans organization — that support matters more than rank on a list.',
      'Use the GI Bill Comparison Tool to spot schools with good graduation and earnings outcomes for veterans.',
      'Look into SkillBridge programs (last 180 days of service) that line up directly with the degree or cert you want next.'
    );

    if (mosCategory === 'cyber' || mosCategory === 'intel') {
      insights.push(
        'Consider degrees in Cybersecurity, Computer Science, or Data Analytics that build directly on your MOS skills.',
        'Look for programs that accept industry certs (like CompTIA or Cisco) for prior learning credit.'
      );
    }

    if (mosCategory === 'infantry' || mosCategory === 'lawEnforcement') {
      insights.push(
        'Criminal Justice, Emergency Management, and Homeland Security degrees align well with your operational background.',
        'If you want to pivot hard away from tactics, consider Business, Operations Management, or Teaching as fresh starts.'
      );
    }

    if (mosCategory === 'medical') {
      insights.push(
        'Accelerated nursing or PA programs often love medics/corpsmen — your clinical hours are a huge advantage.',
        'If you want shorter school, look at rad tech, respiratory therapy, or surgical tech programs with strong job placement rates.'
      );
    }
  }

  // Healthcare/disability-related insights
  if (taskCategory === 'healthcare' || taskTitle.includes('disability') || taskTitle.includes('va')) {
    insights.push(
      'Work with an accredited Veterans Service Officer (VSO) — American Legion, VFW, DAV — for completely free claim help.',
      'Document everything: get buddy statements, collect medical records, and write detailed personal impact statements.',
      'File an Intent to File (ITF) on VA.gov as soon as possible to lock in your effective date while you gather evidence.'
    );

    if (mosCategory === 'infantry' || mosCategory === 'lawEnforcement' || mosCategory === 'engineering') {
      insights.push(
        'If you carried heavy loads, jumped, or worked around blasts, make sure back, knee, and hearing issues are all documented.',
        'Don’t ignore “small” injuries — chronic pain and limited range of motion add up over time and should be evaluated.'
      );
    }

    if (mosCategory === 'cyber' || mosCategory === 'intel') {
      insights.push(
        'If you worked long hours on screens or in secure facilities, document headaches, sleep issues, and anxiety if they affect your life now.',
        'Mental health claims are valid — counseling records and ongoing treatment are part of the evidence, not a weakness.'
      );
    }
  }

  // Housing-related insights
  if (taskCategory === 'housing' || taskTitle.includes('housing') || taskTitle.includes('home')) {
    insights.push(
      'VA Home Loans require no down payment and no PMI — huge advantage over conventional mortgages.',
      'Get pre-qualified with a veteran-focused lender before house hunting so you know your realistic price range.',
      'Check your state’s veteran benefits page for property tax exemptions and closing cost assistance.'
    );
  }

  // Finance-related insights
  if (taskCategory === 'finance' || taskTitle.includes('budget') || taskTitle.includes('financial')) {
    insights.push(
      'Use Military OneSource financial counseling to build a transition budget that covers at least 3–6 months of expenses.',
      'Apply for unemployment compensation after ETS if you’re job hunting — most separating service members qualify.',
      'Avoid cashing out TSP if possible; rolling to an IRA or new employer plan keeps the tax advantages intact.'
    );

    if (mosCategory === 'cyber' || mosCategory === 'intel') {
      insights.push(
        'Tech and cleared roles can have signing bonuses — factor that into your short-term savings plan, not your base budget.',
      );
    }

    if (mosCategory === 'infantry' || mosCategory === 'lawEnforcement') {
      insights.push(
        'Law enforcement and security roles often include pension tracks — compare long-term retirement benefits, not just salary.',
      );
    }
  }

  return unique(insights);
}

function getGeneralInsights(mosCategory: MOSCategory | null): string[] {
  const general: string[] = [
    'Request your Joint Service Transcript (JST) through your service branch to convert military training into civilian college credits.',
    'Look for DoD SkillBridge programs in your last 180 days to train with civilian employers while still drawing military pay.',
    'Use VA Veteran Readiness and Employment (VR&E, Chapter 31) if you need help picking a career path or retraining.',
    'Complete the Transition Assistance Program (TAP) workshops and actually use the resume, interview, and LinkedIn support they offer.',
    'Connect with veteran service organizations (American Legion, VFW, DAV) for claims help and networking.',
    'Leverage your security clearance if you have one — cleared roles typically pay more and are in high demand.',
  ];

  if (mosCategory === 'cyber' || mosCategory === 'intel') {
    general.push('You are already in a high-demand field — combine your MOS skills with 1–2 civilian certs and you will stand out fast.');
  }

  if (mosCategory === 'infantry' || mosCategory === 'lawEnforcement') {
    general.push('Your leadership under stress is a differentiator — emphasize that in applications, not just “did what I was told.”');
  }

  return unique(general);
}

export function getResourcesForTask(
  task: MissionTask
): Array<{ name: string; url: string; description: string }> {
  const resources: Array<{ name: string; url: string; description: string }> = [];

  const title = task.title.toLowerCase();
  const category = task.category;

  // Common baseline resource
  resources.push({
    name: 'VA.gov',
    url: 'https://www.va.gov',
    description: 'Official VA website for healthcare, disability claims, education, and benefits.',
  });

  if (category === 'career' || title.includes('job') || title.includes('resume')) {
    resources.push(
      {
        name: 'Hiring Our Heroes',
        url: 'https://www.hiringourheroes.org',
        description: 'Career fairs, fellowships, and employer connections for transitioning service members.',
      },
      {
        name: 'LinkedIn for Veterans',
        url: 'https://www.linkedin.com/veterans',
        description: 'Free LinkedIn Premium and military-focused job search tools.',
      },
      {
        name: 'USAJobs – Veterans',
        url: 'https://www.usajobs.gov/help/working-in-government/unique-hiring-paths/veterans',
        description: 'Federal jobs portal with veteran hiring authorities and preference explained.',
      },
      {
        name: 'Military OneSource',
        url: 'https://www.militaryonesource.mil',
        description: 'Free career coaching, resume reviews, and transition support.',
      }
    );
  }

  if (category === 'education' || title.includes('gi bill')) {
    resources.push(
      {
        name: 'GI Bill Comparison Tool',
        url: 'https://www.va.gov/education/gi-bill-comparison-tool',
        description: 'Compare schools, outcomes, and costs using your GI Bill benefits.',
      },
      {
        name: 'Joint Service Transcript',
        url: 'https://jst.dod.mil',
        description: 'Request official transcript of your military training for college credit.',
      },
      {
        name: 'SkillBridge',
        url: 'https://skillbridge.osd.mil',
        description: 'Find approved civilian training opportunities during your last 180 days.',
      }
    );
  }

  if (category === 'healthcare' || title.includes('disability') || title.includes('claim')) {
    resources.push(
      {
        name: 'eBenefits / VA Disability',
        url: 'https://www.ebenefits.va.gov',
        description: 'Start disability claims, upload documents, and check claim status.',
      },
      {
        name: 'VA Disability Compensation Rates',
        url: 'https://www.va.gov/disability/compensation-rates/veteran-rates',
        description: 'See current monthly payment tables for each rating.',
      },
      {
        name: 'VA – Accredited VSOs',
        url: 'https://www.va.gov/vso',
        description: 'Find accredited VSOs for free representation and claims assistance.',
      }
    );
  }

  if (category === 'housing') {
    resources.push(
      {
        name: 'VA Home Loans',
        url: 'https://www.va.gov/housing-assistance/home-loans',
        description: 'Official info on VA-backed home loans with no down payment and no PMI.',
      },
      {
        name: 'Veterans United',
        url: 'https://www.veteransunited.com',
        description: 'Large VA-focused mortgage lender with education and pre-approval tools.',
      }
    );
  }

  if (category === 'finance') {
    resources.push(
      {
        name: 'TSP (Thrift Savings Plan)',
        url: 'https://www.tsp.gov',
        description: 'Manage your military retirement savings and rollover options.',
      },
      {
        name: 'Military OneSource – Financial Counseling',
        url: 'https://www.militaryonesource.mil/financial-legal',
        description: 'Free, confidential financial counseling for service members and families.',
      }
    );
  }

  return resources;
}

export function getStepsForTask(task: MissionTask, mos: string): string[] {
  const steps: string[] = [];
  const taskTitle = task.title.toLowerCase();
  const mosCategory = classifyMOS(mos);
  const mosLabel = mos.toUpperCase();

  // TAP / Transition counseling steps
  if (taskTitle.includes('tap') || taskTitle.includes('transition assistance')) {
    steps.push(
      'Contact your installation’s Transition Assistance or ACAP office to schedule your initial counseling.',
      'Book your TAP class at least 90 days before ETS; earlier is better if you can swing it.',
      'Attend the full TAP workshop week and actually engage with the resume, LinkedIn, and networking pieces.',
      'Complete your Individual Transition Plan (ITP) with measurable goals for career, education, and finances.',
      'Add optional tracks (entrepreneurship, higher ed, technical careers) that fit where you want to land next.',
      'If you have a spouse, invite them — they can attend most TAP sessions and it helps planning together.'
    );
  }

  // DD-214 request / handling steps
  if (taskTitle.includes('dd-214') || taskTitle.includes('dd214')) {
    steps.push(
      'Verify that your DD-214 shows the correct dates, character of service, awards, and MOS before you sign anything.',
      'Request the Member-4 (long form) copy — that’s the one used for benefits and job verification.',
      'Get multiple certified copies at separation and store them in a fireproof safe or safety deposit box.',
      'Scan a digital copy and back it up in at least two secure locations (encrypted drive + secure cloud).',
      'Provide a copy to your county or state veterans office if they offer additional benefits.',
      'If you ever lose it, request copies through the National Archives (eVetRecs) online.'
    );
  }

  // VA healthcare enrollment
  if (taskTitle.includes('enroll') && taskTitle.includes('healthcare')) {
    steps.push(
      'Gather your DD-214, Social Security number, and any private insurance information.',
      'Apply for VA healthcare online at VA.gov/health-care/apply or by calling 1-877-222-VETS.',
      'Complete VA Form 10-10EZ (Application for Health Benefits) honestly, including income info.',
      'Wait for your enrollment decision and assigned priority group.',
      'Once enrolled, call your local VA facility to book your first primary care appointment.',
      'Enroll within 5 years of discharge if possible; that window gives you enhanced eligibility, especially if you deployed.',
    );
  }

  // Disability claim / documentation
  if (
    taskTitle.includes('disability') &&
    (taskTitle.includes('claim') || taskTitle.includes('documentation') || taskTitle.includes('file'))
  ) {
    steps.push(
      'File an Intent to File (ITF) on VA.gov to lock in your start date before you gather all the evidence.',
      'Request your service treatment records through milConnect/TRICARE and any civilian records tied to your service.',
      'Write a personal statement for each claimed condition explaining when it started and how it affects daily life.',
      'Ask battle buddies or supervisors for buddy statements that back up injuries or events they witnessed.',
      'Schedule a separation physical and make sure every issue you plan to claim is discussed and documented.',
      'Work with an accredited VSO to actually file the claim and upload all supporting documentation.',
      'Track the status through VA.gov or eBenefits and respond quickly to any VA requests for more information.'
    );
  }

  // Resume creation
  if (taskTitle.includes('resume') || taskTitle.includes('cv')) {
    steps.push(
      `Use tools like O*NET or MOS translators to find 2–3 civilian job titles that align with your MOS (${mosLabel}).`,
      'Choose a clean, reverse-chronological resume format (most recent roles first).',
      'Translate military terms into civilian language: “platoon sergeant” → “operations manager”, “squad leader” → “team lead”.',
      'Quantify impact: number of people led, equipment value, missions completed, error rates reduced.',
      'Highlight security clearance (if you have one) at the top under your summary.',
      'Add a skills section that lists tools, platforms, and certifications in plain language.',
      'Tailor your resume keywording for each job posting so it passes automated screening systems.',
      'Save as a PDF named clearly (e.g., First_Last_Resume.pdf) before you upload or email.'
    );

    if (mosCategory === 'cyber') {
      steps.push(
        'Create a section for “Technical Skills” where you list networks, operating systems, and tools you’ve actually touched.',
      );
    }

    if (mosCategory === 'infantry' || mosCategory === 'lawEnforcement') {
      steps.push(
        'Add bullets that show leadership under stress: high-stakes decisions, de-escalation, and safety responsibility.'
      );
    }

    if (mosCategory === 'medical') {
      steps.push(
        'Call out patient volume, triage experience, and specific procedures you performed or assisted with.'
      );
    }

    if (mosCategory === 'logistics') {
      steps.push(
        'Include metrics around inventory accuracy, on-time delivery, and readiness rates that you improved or maintained.'
      );
    }
  }

  // LinkedIn optimization
  if (taskTitle.includes('linkedin')) {
    steps.push(
      'Upload a clear, professional headshot with good lighting and a neutral background.',
      'Write a headline that mentions you are transitioning and names your target roles and key skills.',
      'Craft a summary that tells your story in 4–6 short paragraphs instead of just copying your NCOER.',
      'Add each duty position with civilian-friendly language and quantifiable results.',
      'Request recommendations from supervisors, peers, and direct reports who can speak to your work.',
      'Turn on “Open to Work” with your target locations and roles.',
      'Join veteran groups and industry-specific groups to expand your network.',
      'Engage weekly: comment on posts, share relevant articles, and celebrate other veterans’ wins.'
    );
  }

  // Job application steps
  if (taskTitle.includes('apply') && (taskTitle.includes('job') || taskTitle.includes('position') || taskTitle.includes('hiring'))) {
    steps.push(
      'Build a target list of 20–30 companies that either excite you or have strong veteran programs.',
      'Set up job alerts on 2–3 platforms (LinkedIn, USAJobs, company careers pages) using your target titles.',
      'Tailor your resume and a short, focused cover letter to each posting.',
      'Network into roles by finding employees (especially veterans) at the company and asking smart questions.',
      'Track applications in a simple spreadsheet with company, role, date, and status.',
      'Follow up politely 7–10 days after applying if you haven’t heard anything.',
      'Prepare for interviews using the STAR method and stories from your service that show leadership and problem-solving.',
      'Send a brief thank-you email within 24 hours of any interview.'
    );
  }

  // GI Bill / education benefits
  if (taskTitle.includes('gi bill') || taskTitle.includes('education benefits')) {
    steps.push(
      'Confirm your GI Bill eligibility and remaining months of entitlement on VA.gov.',
      'Use the GI Bill Comparison Tool to shortlist schools with good veteran outcomes and strong support offices.',
      'Request your JST so the school can evaluate transfer credits for your MOS schools and courses.',
      'Apply to your chosen schools and keep track of admissions, financial aid, and program start dates.',
      'Submit VA Form 22-1990 (or 22-1995 if changing schools) to start your education benefits.',
      'Provide your Certificate of Eligibility (COE) to the school’s certifying official.',
      'Confirm how and when tuition will be paid, and when your monthly housing allowance will start.',
      'Check if the school participates in Yellow Ribbon if tuition exceeds standard GI Bill caps.'
    );
  }

  // Budget / financial planning
  if (taskTitle.includes('budget') || taskTitle.includes('financial planning')) {
    steps.push(
      'List your current military income (base pay, BAH, BAS, special pays) and what will end at ETS.',
      'Estimate civilian income scenarios based on your target roles and locations.',
      'List all fixed monthly expenses and identify any new ones (civilian health insurance, higher rent, etc.).',
      'Plan for at least 3–6 months of living expenses in an emergency fund if possible.',
      'Factor in job search time — very few people walk straight from ETS into a dream job the next week.',
      'Book a session with Military OneSource or a local financial counselor to review your plan.',
      'Pick a budgeting app or spreadsheet you will actually use monthly.',
    );
  }

  // If nothing matched at all, give generic “good practice” steps
  if (steps.length === 0) {
    steps.push(
      'Clarify what “done” looks like for this task (success criteria, deadline, and documents needed).',
      'Break the task into 3–7 smaller actions you can actually accomplish.',
      'Block focused time on your calendar for each action instead of “I’ll get to it later.”',
      'Leverage free resources: TAP, Military OneSource, VSOs, and veteran peers who’ve already done this.',
      'Track your progress and adjust if new information or obstacles pop up.'
    );
  }

  return unique(steps);
}
