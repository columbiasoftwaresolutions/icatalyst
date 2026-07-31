/* ============================================================================
   iCatalyst — shared content data (source of truth from the content brief).
   All page components read from window.IC.*
   ============================================================================ */

const IC = {};

IC.company = {
  name: 'iCatalyst, Inc.',
  tagline: 'Accelerating your Success',
  principles: ['Innovation', 'Intelligence', 'Integrity'],
  copyright: '© 2025 iCatalyst, Inc. All Rights Reserved',
};

IC.links = {
  linkedin: 'https://www.linkedin.com/company/icatalyst-inc-/',
  employeeLogin: 'https://icatalystinc.sharepoint.com/SitePages/Home.aspx',
  brochure: 'iCatalyst Capability Brochure 2026 (PDF)',
};

/* Primary nav. "Who We Are" anchors to the homepage section. */
IC.nav = [
  { label: 'Who We Are', href: 'index.html#who', key: 'who' },
  { label: 'Solutions', href: 'solutions.html', key: 'solutions' },
  { label: 'Products', href: 'products.html', key: 'products' },
  { label: 'Contracts', href: 'contracts.html', key: 'contracts' },
  { label: 'Careers', href: 'careers.html', key: 'careers' },
];

IC.valueStatements = [
  'Innovative services powered by proven processes to accelerate your success.',
  'Intelligent solutions to help you run your organization more effectively.',
  'Winning your trust with our integrity, dedication and commitment to service.',
];

IC.homeHeadline = 'Automation and AI-Driven Solutions';

IC.whoWeAre = [
  'iCatalyst, Inc. is a next-generation technology company specializing in Artificial Intelligence (AI), Natural Language Processing (NLP), Machine Learning (ML), and Robotic Process Automation (RPA). Since 2007, we’ve partnered with federal and commercial clients to deliver innovative products and services that drive mission success, operational efficiency, and digital transformation.',
  'Our solutions are built on a foundation of agility, security, and scalability, guided by our CMMI ML 3 DEV framework and backed by globally recognized certifications in ISO 9001:2015 (Quality Management) and ISO/IEC 27001:2022 (Information Security).',
  'As a trusted partner on GSA MAS, GSA 8(a) STARS III, OASIS+ and FAA eFAST, iCatalyst provides streamlined access to cutting-edge technologies and tailored solutions. We partner with industry leaders such as Appian, Pega Systems, Salesforce, UiPath, Oracle, Adobe Sign, and Amazon Web Services (AWS) to deliver intelligent automation, low/no-code platforms, and advanced analytics at scale.',
  'With an over 90% employee retention rate over the past five years, our success is driven by a culture of innovation, continuous learning, and a deep commitment to client outcomes.',
];

/* top = category label (Indra-style, shown above the number); l = caption below. */
IC.metrics = [
  { top: 'Track record', pre: '', num: '19', suf: '+', l: 'Years delivering since 2007' },
  { top: 'Our people', pre: '', num: '90', suf: '%', l: 'Employee retention, past 5 years' },
  { top: 'Federal access', pre: '', num: '4', suf: '', l: 'Contract vehicles held' },
  { top: 'Portfolio', pre: '$', num: '80', suf: 'M+', l: 'Contracts under management' },
];

IC.philosophy = {
  intro: [
    'At iCatalyst, we don’t just deliver technology, we accelerate outcomes. Our mission is to simplify complexity and empower organizations to achieve their goals faster through intelligent, secure, and scalable solutions. Whether supporting federal agencies or commercial enterprises, we bring a product and services approach rooted in AI, NLP, ML, RPA, and advanced analytics to drive measurable impact.',
    'We believe in building solutions that are simple, intuitive, and easy to use. Our role is to be the catalyst that accelerates transformation, enabling our clients to focus on their mission while we streamline the process behind it.',
    'Guided by our core principles — Innovation, Intelligence, and Integrity — we deliver AI-powered products and services that enhance operational efficiency, improve decision-making, and create long-term value.',
  ],
  closing: 'We are proud to support those who serve the nation and equally committed to helping commercial clients thrive in a competitive, data-driven world. At iCatalyst, we don’t just deliver solutions — we accelerate success.',
  values: [
    { e: 'INNOVATION', b: 'We harness AI, ML, NLP, and RPA to solve today’s challenges and anticipate tomorrow’s with scalable solutions.' },
    { e: 'INTELLIGENCE', b: 'Context-aware, adaptive, mission-aligned solutions that enable faster, data-driven decisions.' },
    { e: 'INTEGRITY', b: 'Trust earned through transparency and accountability — backed by ISO 9001 and ISO 27001 certifications.' },
  ],
};

IC.solutions = [
  { id: 'ai', no: '01', name: 'AI-Driven Digital Transformation',
    summary: 'Accelerate mission outcomes with AI/ML, RPA, and intelligent automation.',
    capabilities: ['AI/ML/NLP', 'RPA (UiPath, Appian, Pega)', 'Predictive analytics', 'Decision engines', 'Intelligent automation'],
    overview: 'Federal agencies are prioritizing automation, intelligent decision-making, and mission acceleration. AI, machine learning, RPA, and advanced analytics let agencies modernize legacy processes, reduce burden, improve accuracy, and deliver services at scale.',
    valueProp: 'Deliver faster, smarter, and more secure services by integrating AI, automation, cloud, and advanced analytics across your mission workflows.',
    expertise: [
      { t: 'End-to-End RPA Implementation', b: 'Assessment, design, development, testing, deployment, and ongoing optimization.' },
      { t: 'AI-Integrated Automation', b: 'Solutions that combine RPA with machine learning and NLP for intelligent decisioning.' },
      { t: 'Cloud-Native RPA', b: 'Scalable automation using modern, secure platforms and cloud-native architectures.' },
      { t: 'Security-First Automation', b: 'Compliance, zero-trust principles, and federal-grade security embedded end-to-end.' },
      { t: 'Rapid Delivery', b: 'Agile execution with measurable outcomes delivered in weeks, not months.' },
    ],
    advantage: [
      { t: 'Proven Track Record', b: 'Successful AI + automation delivery across federal programs.' },
      { t: 'Certified RPA Experts', b: 'UiPath, Appian, and Pega certified practitioners.' },
      { t: 'Ease of Use & Maintenance', b: 'Low-code workflows, transparent documentation, and scalable architectures.' },
      { t: 'Cloud & Hybrid Flexibility', b: 'Deployments tailored to AWS GovCloud, Azure Gov, hybrid, and on-prem environments.' },
      { t: 'Secure & Compliant', b: 'Built to meet FISMA, NIST SP 800-53, FedRAMP, RMF, and Zero Trust directives.' },
    ] },
  { id: 'cloud', no: '02', name: 'Cloud & Infrastructure Modernization',
    summary: 'Migrate and secure workloads across AWS, Azure, and GCP with multi-cloud best practices.',
    capabilities: ['Cloud migration', 'Multi-cloud architecture', 'Cloud-native apps', 'FedRAMP / NIST', 'Cost optimization'],
    overview: 'Agencies are under mandates to migrate to secure, scalable, and cost-effective cloud environments. iCatalyst delivers secure, intelligent, and seamless cloud transformation using leading platforms like AWS, Microsoft Azure, and Google Cloud Platform (GCP).',
    valueProp: 'Achieve enhanced performance, scalability, cost-efficiency, and operational agility while reducing infrastructure expense and ensuring federal compliance.',
    expertise: [
      { t: 'Cloud Readiness & Migration', b: 'Readiness assessments, migration-candidate identification, and end-to-end migration with minimal disruption.' },
      { t: 'Cost & ROI Modeling', b: 'Total cost of ownership and ROI modeling, with deployment strategy across IaaS, PaaS, and SaaS.' },
      { t: 'Cloud-Native Architecture', b: 'Microservices, containers, and serverless architecture for modern, scalable workloads.' },
      { t: 'Security & Compliance', b: 'Zero-trust, IAM, encryption, and continuous compliance (FedRAMP, NIST).' },
      { t: 'Certified Engineers', b: 'Certified cloud engineers across AWS, Azure, and GCP, with AI/ML-accelerated assessment and planning.' },
    ],
    advantage: [
      { t: 'Certified Cloud Experts', b: 'AWS, Azure, and GCP engineers with secure, scalable deployments.' },
      { t: 'AI-Driven Cloud Strategy', b: 'AI/ML to accelerate assessments and migration paths.' },
      { t: 'Legacy Modernization', b: 'Transform outdated systems into resilient cloud platforms.' },
      { t: 'Cost Optimization', b: 'Reduce waste, improve utilization, maximize ROI.' },
    ] },
  { id: 'data', no: '03', name: 'Data Engineering & Advanced Analytics',
    summary: 'Build data lakes/warehouses and deliver real-time, scalable, actionable insights.',
    capabilities: ['Data warehouses', 'Data lakes & streaming', 'Predictive modeling', 'Dashboards (Tableau, Power BI)', 'Data quality'],
    overview: 'Agencies are managing massive data volumes and need real-time, actionable insights. iCatalyst turns billions of records into mission-critical intelligence with scalable, secure analytics platforms.',
    valueProp: 'Turn billions of records into mission-critical intelligence with scalable, secure analytics platforms.',
    expertise: [
      { t: 'Data Warehousing', b: 'Large-scale warehouse solutions (PostgreSQL, Oracle, PostGIS), data lakes, and streaming analytics.' },
      { t: 'Data Integration', b: 'Assess, extract, transform, and standardize disparate data sets from multiple source systems.' },
      { t: 'Data Virtualization', b: 'Platforms like Denodo for governed self-service BI on integrated data.' },
      { t: 'Data Quality', b: 'Apply rules of precedence and data-quality indices across sources.' },
      { t: 'Visualization & Dashboards', b: 'Intuitive, interactive dashboards (Tableau, Power BI, Kibana) that support exploratory analysis.' },
    ],
    advantage: [
      { t: 'Skilled Workforce', b: 'Experts across data types, pipelines, and analytics stacks.' },
      { t: 'Intelligent Solutions', b: 'Tailored builds using COTS platforms or proprietary cloud solutions.' },
      { t: 'Effectiveness', b: 'Exploratory analysis to expose patterns, trends, and correlations.' },
      { t: 'Reduced Cost', b: 'Optimal balance of capability and price with open-source tools where appropriate.' },
    ] },
  { id: 'it', no: '04', name: 'Enterprise IT Modernization & Custom Development',
    summary: 'Transform legacy systems with agile delivery, DevSecOps, and low/no-code platforms.',
    capabilities: ['Legacy modernization', 'Agile dev (Java, Python, React)', 'DevSecOps & CI/CD', 'Low/no-code (Appian, Salesforce)', 'Geospatial'],
    overview: 'Business agility is critical for federal and commercial organizations to stay competitive. iCatalyst develops AI-powered, secure, and scalable applications that automate complex workflows, enhance decision-making, and adapt rapidly to evolving demands.',
    valueProp: 'AI-powered, secure, and scalable applications that automate complex workflows and adapt rapidly to evolving mission and market demands.',
    expertise: [
      { t: 'Client-Centric Development', b: 'User stories (Jira / Confluence) with iterative stakeholder engagement.' },
      { t: 'Modular & Scalable Architecture', b: 'Microservices, containers (Docker, Kubernetes), and cloud-native patterns (AWS, Azure, GCP).' },
      { t: 'DevOps & Agile Delivery', b: 'CI/CD, automated testing, and IaC (Terraform, Ansible) for faster releases.' },
      { t: 'AI-Driven Automation', b: 'Embed AI/ML, NLP, RPA, and predictive analytics for intelligent, adaptive solutions.' },
      { t: 'Geospatial Intelligence', b: 'Esri ArcGIS, QGIS, and Mapbox integrations for spatial visualization and analysis.' },
      { t: 'Resilient & Secure Systems', b: 'Built-in fault isolation and strong security controls.' },
    ],
    advantage: [
      { t: 'Skilled & Certified Teams', b: 'Proficient in Python, Java, JavaScript/TypeScript, React, Angular, Node.js, Spring Boot; expert in Agile, DevOps, and cloud-native delivery.' },
      { t: 'Intelligent, Transparent Solutions', b: 'Design with clear traceability to mission goals and continuous stakeholder feedback.' },
      { t: 'Operational Efficiency', b: 'Break down Dev–Ops silos, enabling shared accountability and high-performing, maintainable applications.' },
      { t: 'Cost-Effective Modernization', b: 'Reduce technical debt and long-term maintenance through cloud-native, AI-enabled architectures.' },
    ] },
  { id: 'program', no: '05', name: 'Mission-Focused Program & Change Management',
    summary: 'Deliver complex programs with PMBOK-aligned execution, financial control, and training.',
    capabilities: ['PMBOK-aligned PM', 'Acquisition (CPIC, OMB MIBC)', 'Financial & quality mgmt', 'BPR & training', 'Performance management'],
    overview: 'Large-scale programs demand disciplined execution, financial control, and stakeholder alignment. iCatalyst manages high-impact technology programs across AI/ML, IT modernization, cloud, and enterprise data — having saved clients over $10 million in operational and capital costs.',
    valueProp: 'Disciplined, metrics-driven program delivery — saving clients multi-million-dollar operational and capital costs.',
    expertise: [
      { t: 'Acquisition & Investment Management', b: 'Full acquisition lifecycle using federal frameworks (CPIC, OMB MIBC) for funding and compliance.' },
      { t: 'Program Artifact Development', b: 'Technical documentation including requirements and implementation roadmaps.' },
      { t: 'Enterprise Data Management', b: 'Managing large-scale data warehouses (1B+ records) and high-throughput applications.' },
      { t: 'Financial Management & Cost Control', b: 'EVM, forecasting, and cost-benefit analysis.' },
      { t: 'Quality Management', b: 'ISO 9001:2015 practices and metrics-driven, performance-based management.' },
      { t: 'Business Process Reengineering', b: 'Optimizing operations aligned with mission outcomes — training 600+ users in two weeks.' },
    ],
    advantage: [
      { t: 'Skilled & Certified Teams', b: 'PMBOK, Agile, and SAFe-trained program managers with federal and commercial portfolio experience.' },
      { t: 'Integrated Program Dashboards', b: 'Real-time tracking of status, risks, dependencies, and milestones.' },
      { t: 'Modern Collaboration Tools', b: 'Jira, Confluence, MS Project, and cloud PM platforms.' },
      { t: 'Cost Optimization & Risk Control', b: 'Proactive management to reduce rework and drive savings.' },
    ] },
];

IC.products = [
  {
    id: 'geospatial', no: '01', name: 'iCatalyst Geospatial Engine',
    tagline: 'A powerful cloud-based geospatial analytics platform delivering advanced data integration, visualization, and compliance insights across complex environments.',
    challenge: 'Organizations across various sectors face the complex challenge of integrating and analyzing large volumes of data from diverse sources to ensure operational efficiency and compliance with safety standards. Whether it’s managing urban development, environmental conservation, or aviation traffic, the necessity for robust tools that can contextualize data within geographic frameworks to reveal hidden patterns, interdependencies, and potential opportunities remains obscured by conventional analytical approaches. Traditional methods often lack the capability to dynamically integrate and visualize data, leading to inefficiencies in operational oversight.',
    solution: ['iCatalyst introduces an innovative, custom, secure, and cutting-edge cloud-based geospatial data analysis platform tailored for diverse industry applications. Our solution integrates advanced spatial mapping technologies that allow businesses and institutions unprecedented visibility into intricate spatial relationships across multiple data sets — from urban development and environmental conservation to transportation and critical infrastructure.'],
    features: [
      { t: 'Automated Data Integration', b: 'Using custom machine learning algorithms, the platform automates the integration of data from numerous databases, providing a single repository for a wide selection of data crucial for performing advanced data analytics.' },
      { t: 'Advanced Geospatial Analysis', b: 'Allows users to perform complex custom analyses based on user-defined geospatial components, critical for identifying patterns and trends that require further investigation or immediate action.' },
      { t: 'Custom Visualization Tools', b: 'Manages measures and reports effectively, supporting the generation of 2D, 3D, and 4D simulations of completed analyses, enhancing the interpretability of complex data sets.' },
      { t: 'Enhanced Compliance Monitoring', b: 'Pinpoints non-compliance with safety standards through advanced geospatial analysis, crucial for maintaining adherence to regulatory requirements.' },
      { t: 'Extensibility', b: 'Users can enhance their analysis by adding external sources, such as voice data, for additional layers of context and precision.' },
    ],
    benefits: [
      { t: 'Enhanced Data Integration', b: 'Seamless integration and manipulation of data using machine learning algorithms from multiple sources.' },
      { t: 'Advanced Analytical Tools', b: 'Sophisticated tools for detailed geospatial and temporal analysis, critical for effective decision-making.' },
      { t: 'Proven User Base', b: 'Actively used by aviation analysts to analyze air traffic in 3D and 4D (including Time) for aircraft proximity, especially in dynamic, high-air-traffic environments.' },
      { t: 'Customizable Visualizations', b: 'Detailed visualizations that make complex data sets accessible and understandable.' },
      { t: 'Operational Efficiency', b: 'Streamlines processes, reduces time to insight, and handles large-scale data environments.' },
      { t: 'Scalability and Flexibility', b: 'Scales from local agencies to global enterprises.' },
      { t: 'Security and Compliance', b: 'Ensures rigorous standards are met across sectors.' },
    ],
  },
  {
    id: 'semantic', no: '02', name: 'iCatalyst Semantic Intelligence Platform',
    tagline: 'An innovative, custom, secure, and cloud-based AI solution for organizations buried with unstructured data.',
    challenge: 'Modern-day organizations are drowning in documents and finding it impossible to access relevant, accurate, and complete information in a timely manner from a vast expanse of unstructured data.',
    solution: ['iCatalyst has an innovative, custom, secure, and cloud-based solution built on the iCatalyst Semantic Intelligence Platform. Our solution extracts relevant user-defined information from PDF documents using semantic technologies and enables users to interact with information in a way that is accurate, intuitive, and reflects human concepts of language.'],
    coreTech: [
      { t: 'Natural Language Processing (NLP)', b: 'A subfield of AI that helps computers understand, interpret, and manipulate human language.' },
      { t: 'Machine Learning (ML)', b: 'Algorithms that recognize and learn patterns from text automatically and iteratively, continuously improving on relevant results.' },
      { t: 'Domain-specific Ontology', b: 'A set of concepts and categories in a subject area, and the relationships between them, built using the document library.' },
      { t: 'Graph Database', b: 'A database optimized for storage, access, retrieval, and intuitive visualization of heavily interrelated, unstructured (textual) data.' },
    ],
    howItWorks: [
      'Documents are deconstructed in preparation for NLP and ML.',
      'NLP breaks down the document for the machine to interpret, combined with a customer domain-specific ontology that adds contextual meaning to the text.',
      'Transformed content is captured in a graph database; users build downloadable collections of passages across multiple documents, retrieve, and visualize information on a customizable interface.',
      'ML algorithms present increasingly complex related results based on user search, helping users find and discover related information not previously considered.',
    ],
    benefitsList: [
      'Quickly find content of interest and discover relevant information across a 1,000+ collection of documents.',
      'Rapidly acquire accurate, relevant, and complete results within minutes.',
      'Save days or weeks of sifting through dozens of documents.',
      'Foster collaboration by sharing document collections with team members.',
      'Save analysis and output from organizational champions to train the future workforce.',
      'Identify similar passages across documents for: determining compliance with policy / directives / standards; ensuring consistency and quality of user guides, SOPs, and work instructions.',
      'Built-in training guides for ease of use.',
      'Applies to professions such as inspectors, medical examiners, executives, contractors, lawyers, and auditors.',
    ],
  },
  {
    id: 'assistant', no: '03', name: 'iCatalyst Vendor-Agnostic AI Assistant',
    tagline: 'A domain-specific, multi-model AI assistant that delivers precise, contextual responses grounded in user-provided documents and conversations.',
    challenge: 'As enterprises increasingly turn to AI for support, standard chatbot solutions often fall short. These systems typically rely on a single Large Language Model (LLM), limiting breadth and adaptability; generalize answers without tailoring to a company’s specific industry or data; and lack integration with internal knowledge bases and contextual understanding of ongoing conversations. These limitations are particularly problematic for government, finance, healthcare, and other regulated or high-stakes domains where precision, transparency, and contextual accuracy are essential.',
    solution: [
      'Our custom solution bridges the gap between general-purpose AI tools and the needs of domain-specific, context-sensitive users. Built on a modular Retrieval-Augmented Generation (RAG) architecture, it delivers precise, citation-backed responses grounded in user-provided documents and prior conversations.',
      'Users interact through a custom chat interface. As messages are exchanged, they are stored in a relational database and semantically indexed using PGVector, allowing the assistant to remember and reason across previous interactions and retrieved information.',
      'A project-based interface lets users organize domain-specific knowledge and task-oriented conversations. Projects group related conversations and documents, each with a dedicated dashboard (accessible via the sidebar) displaying associated documents and conversations. Users can upload or delete documents and create, rename, or remove conversations.',
      'Behind the scenes, the system enriches each user message with supporting material — recent messages for coherence, semantically related past exchanges, and excerpts from uploaded documents. Documents in .pdf, .txt, and .docx formats are parsed, chunked, and embedded as vector representations, stored with metadata, and indexed in a vector database for efficient semantic retrieval. The enriched prompt is sent to the selected language model, with LangChain managing prompt construction, memory integration, and model interaction for a vendor-agnostic deployment strategy.',
    ],
    benefits: [
      { t: 'Tailored, Non-Generic Answers', b: 'Specific to domain and based on user documents and past interactions.' },
      { t: 'Multi-Model Flexibility', b: 'Choose between LLM providers for performance and cost optimization.' },
      { t: 'Enterprise-Ready Contextual Intelligence', b: 'Maintains coherent conversation within projects relevant to the subject.' },
      { t: 'Trust and Transparency', b: 'Source citations included for confident decision-making.' },
      { t: 'Scalable for Diverse Use Cases', b: 'Supports legal, compliance, research, and other knowledge-driven workflows.' },
    ],
  },
];

IC.certifications = [
  { code: 'ISO 9001:2015', name: 'Quality Management' },
  { code: 'ISO/IEC 27001:2022', name: 'Information Security' },
  { code: 'CMMI DEV/SVC ML3', name: 'Maturity Level 3' },
];

IC.contractVehicles = [
  { code: 'GSA MAS', name: 'Multiple Award Schedule',
    number: '47QTCA21D00AE', meta: 'SIN 541515 · IT Professional Services',
    desc: 'IT professional services and labor categories for database planning and design; systems analysis, integration, and design; and programming, conversion, and implementation support.' },
  { code: 'GSA 8(a) STARS III', name: 'Governmentwide Acquisition Contract',
    number: '47QTCB21D0157',
    desc: 'Emerging technology-focused IT services, ancillary support, and ancillary telecommunications / wireless.' },
  { code: 'OASIS+', name: 'Professional Services (SB & 8(a))',
    number: '47QRCA25DSC05 · 47QRCA25DA117',
    desc: 'Management & Advisory Services and Technical & Engineering Services, under both the Small Business and 8(a) pools.' },
  { code: 'FAA eFAST', name: 'Electronic FAST',
    number: 'MOA# DTFAWA11A-00217',
    desc: 'Air transportation services, business administration & management, and computer / information systems development functional areas.' },
];

/* Customers iCatalyst serves (from the live site). */
IC.customers = [
  'U.S. Department of Transportation (DOT)',
  'Federal Aviation Administration (FAA)',
  'National Transportation Safety Board (NTSB)',
  'U.S. Air Force',
  'U.S. Department of Education',
  'Volpe — USDOT Volpe Center',
  'Engility',
];

IC.partners = ['Appian', 'Pega Systems', 'Salesforce', 'UiPath', 'Oracle', 'Adobe Sign', 'Microsoft', 'Amazon Web Services (AWS)'];

/* Technology partner logos. Drop real files into assets/partners/<file>,
   then set IC.partnersHaveLogos = true below to switch from wordmarks to images. */
IC.partnersHaveLogos = true;
IC.partnerLogos = [
  { id: 'appian', name: 'Appian', file: 'assets/partners/appian-logo.png' },
  { id: 'pega', name: 'Pega', file: 'assets/partners/pega-logo.png' },
  { id: 'salesforce', name: 'Salesforce', file: 'assets/partners/salesforce-logo.png', scale: 1.7 },
  { id: 'uipath', name: 'UiPath', file: 'assets/partners/uipath-logo.png' },
  { id: 'oracle', name: 'Oracle', file: 'assets/partners/oracle-logo.png' },
  { id: 'adobe', name: 'Adobe', file: 'assets/partners/adobe-logo.png' },
  { id: 'microsoft', name: 'Microsoft', file: 'assets/partners/microsoft-logo.png' },
  { id: 'aws', name: 'AWS', file: 'assets/partners/aws-logo.png', scale: 1.5 },
];

/* Contact details (from the live site). */
IC.contact = {
  phone: '(703) 942-5888',
  fax: '(703) 348-3172',
  email: 'info@icatalystinc.com',
  hours: 'Monday–Friday · 8:00 AM – 5:00 PM ET',
};

/* Careers benefits (from the live site). Rendered as +/- accordions. */
IC.benefits = [
  { label: 'HEALTH & WELLNESS', body: 'Comprehensive health, vision, and dental insurance for eligible employees, plus an annual wellness reimbursement and paid time off.' },
  { label: 'COMPENSATION', body: 'Competitive salaries, performance bonuses, and service awards recognizing exceptional work.' },
  { label: 'CAREER DEVELOPMENT', body: 'Education assistance for job-related courses or certifications that are mutually beneficial, plus tuition reimbursement.' },
  { label: 'WORK FLEXIBILITY', body: 'Flexible schedules and remote-work options; eligible employees are reimbursed for phone and internet used for company work.' },
  { label: 'SOCIAL & COMMUNITY', body: 'Referral bonuses when friends and family join the team, social events that promote our culture, and sponsored community events — including Community Service Leave.' },
  { label: 'PLANS & PROTECTION', body: '401(k), short-term disability, and life insurance round out the package.' },
];

IC.offices = [
  { tag: 'MAIN OFFICE', city: 'McLean, VA', addr: '7925 Jones Branch Drive, Suite #3175, McLean, VA 22102' },
  { tag: 'NEW JERSEY', city: 'Pleasantville, NJ', addr: '1000 W. Washington Ave, Suite 203, Pleasantville, NJ 08232' },
  { tag: 'OKLAHOMA', city: 'Oklahoma City, OK', addr: '100 NE 5th St, 1st Floor, Oklahoma City, OK 73104' },
];

IC.inquiryTypes = ['General inquiry', 'Solutions & services', 'Products', 'Contracts & teaming', 'Careers', 'Partnership'];

/* Card background images (Indra-style image cards). Drop real photos at these
   paths; until then each card falls back to its animated canvas scene.
   Recommended ~1200×900 JPG, cool/technical, subject in the upper half. */
IC.cardImages = {
  // Solutions
  ai: 'assets/cards/ai.jpg',
  cloud: 'assets/cards/cloud.jpg',
  data: 'assets/cards/data.jpg',
  it: 'assets/cards/it.jpg',
  program: 'assets/cards/program.jpg',
  // Products
  geospatial: 'assets/cards/geospatial.jpg',
  semantic: 'assets/cards/semantic.jpg',
  assistant: 'assets/cards/assistant.jpg',
};

/* Graphic motif per solution / product (see lib/motion.jsx Motif variants). */
IC.solutionMotif = { ai: 'nodes', cloud: 'arcs', data: 'bars', it: 'grid', program: 'flow' };
IC.productMotif = { geospatial: 'topo', semantic: 'nodes', assistant: 'flow' };

/* Canvas viz scene per solution / product (see lib/canvasviz.jsx). */
IC.solutionScene = { ai: 'ai-net', cloud: 'cloud-tiers', data: 'data-grid', it: 'it-modules', program: 'program-timeline' };
IC.productScene = { geospatial: 'geo-morph', semantic: 'semantic-morph', assistant: 'assistant-morph' };

window.IC = IC;
