import type { MissionTask } from './types';

interface MOSMapping {
  keywords: string[];
  insights: string[];
}

const mosDatabase: Record<string, MOSMapping> = {
  // Cyber / IT / Signal
  cyber: {
    keywords: ['25', '17c', '26', '35t', 'cyber', 'signal', 'it', 'comm', '06', '1n4', '3d0', '3d1'],
    insights: [
      'Enroll in free DoD SkillBridge IT pipelines: Amazon AWS Training, Microsoft MSSA, NPower, or Hiring Our Heroes Tech Programs',
      'Use your military experience to test out of CompTIA A+, Network+, Security+ through vouchers at your education center',
      'Request Joint Service Transcript (JST) to convert cyber leadership and certifications into college credits',
      'Look into federal GS-2210 IT Specialist roles — your clearance gives you priority hire on USAJobs.gov',
      'Apply to veteran apprenticeship programs: IBM SkillsBuild, Salesforce Military, Google IT Support Certificate',
      'Leverage clearance for defense contractor roles: Booz Allen, Leidos, CACI, Northrop Grumman veteran hiring programs',
    ],
  },
  
  // Infantry / Combat Arms
  infantry: {
    keywords: ['11', '03', '0311', '31', '18', 'infantry', 'ranger', 'airborne', 'combat'],
    insights: [
      'Strong pipeline into law enforcement: local police academies, state trooper programs, federal agencies (FBI, DEA, ATF)',
      'Use the GI Bill for accredited Criminal Justice or Emergency Management programs at schools with veteran support',
      'Convert infantry squad leader/platoon sergeant experience into civilian leadership roles: operations supervisor, security manager, emergency response coordinator',
      'Check Department of Homeland Security (DHS) and CBP veteran preference hiring programs for border patrol and federal protective service',
      'Apply leadership skills to corporate security roles at Fortune 500 companies with veteran initiatives',
      'Consider executive protection, private security contracting, or physical security specialist positions leveraging tactical experience',
    ],
  },
  
  // Medical / Healthcare
  medical: {
    keywords: ['68', '8404', 'medic', 'corpsman', '4n0', 'medical', 'healthcare'],
    insights: [
      'Use Army/Navy medic experience to fast-track EMT-Basic, EMT-Paramedic, or healthcare technician certification through state equivalency programs',
      'Your trauma medical experience from deployment aligns perfectly with ER tech, critical care tech, and fire/EMS hiring pipelines',
      'Use GI Bill for accelerated nursing (ADN/BSN) or Physician Assistant programs — many offer military credit for clinical hours',
      'Apply to VA healthcare facilities through their veteran preference hiring program for immediate placement',
      'Explore surgical tech, radiology tech, or respiratory therapy programs that accept military medical training',
      'Consider pharmaceutical companies and medical device manufacturers with veteran medical affairs programs',
    ],
  },
  
  // Logistics / Supply
  logistics: {
    keywords: ['88', '92', '3051', '2t', 'supply', 'logistics', 'warehouse', 'transportation'],
    insights: [
      'Direct path to supply chain management, warehouse operations, or logistics coordinator roles at Amazon, UPS, FedEx veteran hiring programs',
      'Your military logistics experience translates to civilian certifications: APICS CSCP, Six Sigma Green Belt (often free through TAP)',
      'Use JST to convert military logistics training into Supply Chain Management college credits',
      'Federal government hiring preference for GS-2001 Supply Management Specialist positions',
      'Manufacturing and distribution companies actively recruit veterans for operations management: Walmart, Target, Home Depot',
      'Consider freight brokerage, commercial driving (CDL), or transportation management positions',
    ],
  },
  
  // Intelligence / Analysis
  intel: {
    keywords: ['35', '02', '1n', 'intel', 'intelligence', 'analyst', 'geospatial'],
    insights: [
      'Your clearance is gold: defense contractors (Booz Allen, SAIC, BAE Systems) actively recruit cleared intel veterans',
      'Federal three-letter agencies (CIA, DIA, NSA, FBI) have veteran hiring programs with expedited security clearance transfer',
      'Convert HUMINT, SIGINT, GEOINT experience into civilian analyst roles at fusion centers and private intelligence firms',
      'Use GI Bill for Masters in Intelligence Studies, Cybersecurity, or Data Analytics to level up credentials',
      'Apply intelligence analysis skills to corporate threat intelligence, fraud analysis, or risk management positions',
      'Consider contracting back to DoD/IC as a civilian analyst through cleared job boards like ClearanceJobs.com',
    ],
  },
  
  // Aviation / Mechanical
  aviation: {
    keywords: ['15', '60', '61', '62', '2a', '2w', 'aviation', 'aircraft', 'mechanic', 'helicopter'],
    insights: [
      'Use your A&P (Airframe and Powerplant) military experience to fast-track FAA certification through equivalency programs',
      'Commercial airlines (Delta, United, Southwest) have dedicated veteran hiring programs for aircraft mechanics and technicians',
      'Apply to defense contractors maintaining military aircraft: Lockheed Martin, Boeing, Northrop Grumman',
      'Consider aviation management programs using GI Bill to move into airline operations or airport management',
      'Federal Aviation Administration (FAA) offers veteran preference for inspector and safety positions',
      'Private aviation companies and helicopter operators actively recruit military-trained pilots and mechanics',
    ],
  },
  
  // Engineering / Construction
  engineering: {
    keywords: ['12', '13', '21', '1371', 'engineer', 'seabee', 'construction', 'combat engineer'],
    insights: [
      'Convert military construction experience into civilian trade certifications: electrician, plumber, HVAC, heavy equipment operator',
      'Use apprenticeship programs through unions (IBEW, Plumbers Union, Operating Engineers) with veteran fast-track placement',
      'Federal hiring preference for civil engineering technician and facilities management roles',
      'Commercial construction companies (Turner, Bechtel, Fluor) have veteran hiring initiatives for project management',
      'Use GI Bill for Civil Engineering, Construction Management, or Architecture programs with military credit',
      'Consider facilities management, property management, or construction inspection positions leveraging technical skills',
    ],
  },
};

export function getMOSInsights(mos: string, task: MissionTask): string[] {
  const insights: string[] = [];
  const mosLower = mos.toLowerCase();
  
  // Match MOS to category
  for (const [category, data] of Object.entries(mosDatabase)) {
    if (data.keywords.some(keyword => mosLower.includes(keyword))) {
      insights.push(...data.insights);
      break;
    }
  }
  
  // Add task-specific insights
  const taskSpecificInsights = getTaskSpecificInsights(task, mos);
  if (taskSpecificInsights.length > 0) {
    insights.push(...taskSpecificInsights);
  }
  
  // Add general insights if no specific match
  if (insights.length === 0) {
    insights.push(...getGeneralInsights());
  }
  
  return insights;
}

function getTaskSpecificInsights(task: MissionTask, mos: string): string[] {
  const insights: string[] = [];
  const taskTitle = task.title.toLowerCase();
  const taskCategory = task.category;
  
  // Career-related task insights
  if (taskCategory === 'career' || taskTitle.includes('resume') || taskTitle.includes('job')) {
    insights.push(
      'Request your Joint Service Transcript (JST) through your branch portal — it translates military training into civilian college credits',
      'Use Military OneSource Career Coaching (free) to review your resume and practice interviews with civilian hiring managers',
      'Attend Hiring Our Heroes career fairs — they connect veterans directly with hiring managers, not recruiters'
    );
  }
  
  // Education-related task insights
  if (taskCategory === 'education' || taskTitle.includes('gi bill') || taskTitle.includes('school')) {
    insights.push(
      'Check if your target school is a Yellow Ribbon Program participant for additional tuition coverage beyond GI Bill',
      'Apply for Pell Grants and FAFSA even with GI Bill — you can stack benefits to cover books, housing, and expenses',
      'Look into SkillBridge programs (last 180 days of service) to train with civilian employers while still receiving military pay'
    );
  }
  
  // Healthcare/disability-related insights
  if (taskCategory === 'healthcare' || taskTitle.includes('disability') || taskTitle.includes('va')) {
    insights.push(
      'Work with an accredited Veterans Service Officer (VSO) for FREE disability claim assistance — American Legion, VFW, DAV all provide this',
      'Document everything: get buddy statements from fellow service members who witnessed your injuries or conditions',
      'File your Intent to File (ITF) ASAP on VA.gov — this locks in your effective date even while gathering documentation'
    );
  }
  
  // Housing-related insights
  if (taskCategory === 'housing' || taskTitle.includes('housing') || taskTitle.includes('home')) {
    insights.push(
      'VA Home Loans require NO down payment and NO PMI — this saves tens of thousands compared to conventional mortgages',
      'Get pre-qualified with veteran-friendly lenders: Veterans United, USAA, Navy Federal before house hunting',
      'Some states offer additional veteran property tax exemptions — check your target state\'s veteran benefits'
    );
  }
  
  // Finance-related insights
  if (taskCategory === 'finance' || taskTitle.includes('budget') || taskTitle.includes('financial')) {
    insights.push(
      'Roll your TSP (Thrift Savings Plan) into a Roth IRA to avoid early withdrawal penalties and maintain tax-advantaged growth',
      'Use Military OneSource financial counseling (free, confidential) to create a transition budget and review your benefits',
      'Apply for unemployment compensation immediately after ETS in your target state — most veterans qualify'
    );
  }
  
  return insights;
}

function getGeneralInsights(): string[] {
  return [
    'Request your Joint Service Transcript (JST) through your service branch to convert military training into civilian college credits',
    'Look for DoD SkillBridge programs (last 180 days of service) that provide civilian job training while still receiving military pay',
    'Use VA Veteran Readiness and Employment (VR&E / Chapter 31) if you\'re unsure of your direction — free career counseling and training',
    'Attend Transition Assistance Program (TAP) workshops at least 90 days before ETS — mandatory but invaluable for benefits overview',
    'Connect with veteran service organizations (American Legion, VFW, DAV) for free claims assistance and community support',
    'Leverage your security clearance if applicable — cleared positions pay 10-20% more and are in high demand',
  ];
}

export function getResourcesForTask(task: MissionTask): Array<{ name: string; url: string; description: string }> {
  const resources: Array<{ name: string; url: string; description: string }> = [];
  
  // Common resources
  resources.push({
    name: 'VA.gov',
    url: 'https://www.va.gov',
    description: 'Official VA website for healthcare, disability claims, and benefits',
  });
  
  // Task-specific resources
  if (task.category === 'career' || task.title.toLowerCase().includes('job') || task.title.toLowerCase().includes('resume')) {
    resources.push(
      {
        name: 'Hiring Our Heroes',
        url: 'https://www.hiringourheroes.org',
        description: 'Career fairs and networking events connecting veterans with employers',
      },
      {
        name: 'LinkedIn for Veterans',
        url: 'https://www.linkedin.com/veterans',
        description: 'Free LinkedIn Premium for veterans and military job search tools',
      },
      {
        name: 'USAJobs.gov',
        url: 'https://www.usajobs.gov/help/working-in-government/unique-hiring-paths/veterans',
        description: 'Federal job board with veteran hiring preference',
      },
      {
        name: 'Military OneSource',
        url: 'https://www.militaryonesource.mil',
        description: 'Free career coaching, resume reviews, and transition assistance',
      }
    );
  }
  
  if (task.category === 'education' || task.title.toLowerCase().includes('gi bill')) {
    resources.push(
      {
        name: 'GI Bill Comparison Tool',
        url: 'https://www.va.gov/education/gi-bill-comparison-tool',
        description: 'Compare GI Bill benefits across schools and programs',
      },
      {
        name: 'Joint Service Transcript',
        url: 'https://jst.dod.mil',
        description: 'Request official transcript of military training for college credit',
      },
      {
        name: 'SkillBridge',
        url: 'https://skillbridge.osd.mil',
        description: 'DoD program for civilian job training during last 180 days of service',
      }
    );
  }
  
  if (task.category === 'healthcare' || task.title.toLowerCase().includes('disability') || task.title.toLowerCase().includes('claim')) {
    resources.push(
      {
        name: 'eBenefits',
        url: 'https://www.ebenefits.va.gov',
        description: 'File disability claims and check claim status online',
      },
      {
        name: 'VA Disability Calculator',
        url: 'https://www.va.gov/disability/compensation-rates/veteran-rates',
        description: 'View current disability compensation rates',
      },
      {
        name: 'Veterans Service Organizations',
        url: 'https://www.va.gov/vso',
        description: 'Find accredited VSOs for free disability claim assistance',
      }
    );
  }
  
  if (task.category === 'housing') {
    resources.push(
      {
        name: 'VA Home Loans',
        url: 'https://www.va.gov/housing-assistance/home-loans',
        description: 'Information on VA-backed home loans with no down payment',
      },
      {
        name: 'Veterans United',
        url: 'https://www.veteransunited.com',
        description: 'Nation\'s largest VA home loan lender',
      }
    );
  }
  
  if (task.category === 'finance') {
    resources.push(
      {
        name: 'TSP (Thrift Savings Plan)',
        url: 'https://www.tsp.gov',
        description: 'Manage your military retirement savings account',
      },
      {
        name: 'Military OneSource Financial Counseling',
        url: 'https://www.militaryonesource.mil/financial-legal',
        description: 'Free confidential financial counseling for service members',
      }
    );
  }
  
  return resources;
}

export function getStepsForTask(task: MissionTask, mos: string): string[] {
  const steps: string[] = [];
  const taskTitle = task.title.toLowerCase();
  
  // TAP / Transition counseling steps
  if (taskTitle.includes('tap') || taskTitle.includes('transition assistance')) {
    return [
      'Contact your installation\'s Transition Assistance Office (TAO) or ACAP center',
      'Schedule your initial counseling appointment at least 90 days before ETS',
      'Attend the mandatory 5-day TAP workshop covering employment, education, and benefits',
      'Complete the Individual Transition Plan (ITP) with your counselor',
      'Attend optional workshops: resume writing, interview skills, entrepreneurship',
      'Bring your spouse if married — they can attend most sessions',
      'Keep your TAP completion certificate for verification',
    ];
  }
  
  // DD-214 request steps
  if (taskTitle.includes('dd-214') || taskTitle.includes('dd214')) {
    return [
      'Request Member 4 copy (long form) — this is the version needed for benefits',
      'Verify all information is correct before signing: dates, character of service, RE code',
      'Request at least 5-10 certified copies at separation',
      'Scan and save digital copies in multiple secure locations (cloud, encrypted drive)',
      'Mail one copy to your county/state veteran affairs office for official record',
      'Keep originals in fireproof safe or safety deposit box',
      'If you need copies later, request through eVetRecs or National Archives',
    ];
  }
  
  // VA healthcare enrollment steps
  if (taskTitle.includes('enroll') && taskTitle.includes('healthcare')) {
    return [
      'Gather required documents: DD-214, Social Security card, insurance info (if any)',
      'Apply online at VA.gov/health-care/apply or call 1-877-222-VETS',
      'Complete VA Form 10-10EZ (Application for Health Benefits)',
      'Provide financial information to determine priority group (affects copays)',
      'Wait for enrollment decision letter (usually 1-2 weeks)',
      'Once enrolled, schedule your initial appointment at nearest VA facility',
      'Enroll within 5 years of discharge for no-cost care; after 5 years, enrollment is still possible but may have copays',
    ];
  }
  
  // Disability claim steps
  if (taskTitle.includes('disability') && (taskTitle.includes('claim') || taskTitle.includes('documentation') || taskTitle.includes('file'))) {
    return [
      'File Intent to File (ITF) on VA.gov immediately to lock in your effective date',
      'Gather service medical records through milConnect, TRICARE, or your unit',
      'Request copies of all deployment medical documentation and sick call records',
      'Write detailed personal statements describing each condition and how it affects daily life',
      'Get buddy statements from fellow service members who witnessed your injuries/conditions',
      'Document current symptoms with photos, journals, or civilian medical records',
      'Schedule your separation physical and discuss all conditions with provider',
      'Work with an accredited VSO (Veterans Service Officer) for free claim assistance',
      'Submit claim within 1 year of separation for faster processing',
      'Track claim status on VA.gov or eBenefits portal',
    ];
  }
  
  // Resume creation steps
  if (taskTitle.includes('resume') || taskTitle.includes('cv')) {
    return [
      `Identify civilian job titles that match your ${mos} skills using O*NET Online`,
      'Use reverse chronological format: contact info, summary, experience, education, skills',
      'Translate military jargon: "squad leader" → "team supervisor", "platoon sergeant" → "operations manager"',
      'Quantify achievements: number of personnel led, budgets managed, operations completed',
      'Highlight security clearance (if active) at top of resume',
      'List relevant certifications, technical skills, and training',
      'Use Military OneSource or TAP for free professional resume review',
      'Tailor resume to each job posting — use keywords from job description',
      'Keep to 1-2 pages maximum',
      'Save as PDF with clear filename: FirstName_LastName_Resume.pdf',
    ];
  }
  
  // LinkedIn optimization steps
  if (taskTitle.includes('linkedin')) {
    return [
      'Use professional photo: solid background, military uniform or business attire',
      'Write compelling headline: "[Your Role] transitioning to [Target Industry] | [Key Skills] | Security Clearance"',
      'Craft strong summary: who you are, what you bring, what you\'re seeking',
      'Add all military positions with civilian-friendly descriptions',
      'Request recommendations from supervisors, peers, and direct reports',
      'Add skills and get endorsed: leadership, project management, etc.',
      'Join veteran groups and industry-specific groups in your target field',
      'Turn on "Open to Work" and select "All LinkedIn Members" for recruiter visibility',
      'Connect with 50-100 professionals in your target industry',
      'Post updates about your transition and career goals',
      'Engage with others\' content: like, comment, share relevant posts',
    ];
  }
  
  // Job application steps
  if (taskTitle.includes('apply') && (taskTitle.includes('job') || taskTitle.includes('position') || taskTitle.includes('hiring'))) {
    return [
      'Create target list of 20-30 companies with veteran hiring programs',
      'Research each company\'s veteran initiatives and culture',
      'Tailor resume and cover letter to each position',
      'Use veteran job boards: Hiring Our Heroes, RecruitMilitary, LinkedIn Veterans',
      'Apply to federal positions on USAJobs.gov using veteran preference',
      'Network with company veterans through LinkedIn before applying',
      'Follow up 7-10 days after application with polite inquiry email',
      'Track applications in spreadsheet: company, position, date applied, status',
      'Prepare for interviews: research company, practice STAR method answers',
      'Send thank-you email within 24 hours of interview',
    ];
  }
  
  // GI Bill application steps
  if (taskTitle.includes('gi bill') || taskTitle.includes('education benefits')) {
    return [
      'Verify your GI Bill eligibility and entitlement months on VA.gov',
      'Research schools using GI Bill Comparison Tool for graduation rates and outcomes',
      'Request official military transcripts (JST) to get credit for military training',
      'Apply for admission to your target school',
      'Once accepted, submit VA Form 22-1990 (Application for Education Benefits)',
      'School certifying official will verify your enrollment with VA',
      'Wait for Certificate of Eligibility (COE) from VA (2-4 weeks)',
      'Provide COE to school\'s financial aid office',
      'Monthly housing allowance (MHA) will be direct deposited',
      'VA pays tuition directly to school at start of each term',
      'Use remaining time wisely — benefits cover 36 months of full-time study',
    ];
  }
  
  // Budget creation steps
  if (taskTitle.includes('budget') || taskTitle.includes('financial planning')) {
    return [
      'List all current military income: base pay, BAH, BAS, special pays',
      'Calculate estimated civilian income based on job research',
      'List fixed expenses: rent/mortgage, car payment, insurance, phone',
      'List variable expenses: food, gas, utilities, entertainment',
      'Account for loss of military benefits: healthcare, commissary, exchange',
      'Add civilian healthcare costs (if not VA-enrolled)',
      'Factor in potential employment gap: plan for 3-6 months without income',
      'Identify areas to cut spending during transition',
      'Set up emergency fund with 3-6 months expenses',
      'Review budget with Military OneSource financial counselor (free)',
      'Use budgeting app: YNAB, Mint, or EveryDollar',
      'Update budget monthly as circumstances change',
    ];
  }
  
  // Generic steps if no match
  if (steps.length === 0) {
    return [
      'Review task requirements and deadline carefully',
      'Gather all necessary documentation and information',
      'Break large tasks into smaller, manageable steps',
      'Schedule time on your calendar to work on this task',
      'Use free resources: TAP, Military OneSource, VSOs',
      'Ask for help from fellow veterans who have completed transition',
      'Track progress and update completion status',
      'Follow up as needed to ensure task is fully complete',
    ];
  }
  
  return steps;
}
