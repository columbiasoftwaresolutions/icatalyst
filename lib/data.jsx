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

IC.metrics = [
  { n: '2007', l: 'FOUNDED · 19+ YEARS OF DELIVERY' },
  { n: '90%+', l: 'EMPLOYEE RETENTION · PAST 5 YEARS' },
  { n: '4', l: 'FEDERAL CONTRACT VEHICLES' },
  { n: '3', l: 'ISO & CMMI CERTIFICATIONS' },
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
    capabilities: ['AI/ML model development', 'Robotic Process Automation (RPA)', 'Intelligent document processing', 'Predictive analytics', 'Process automation'] },
  { id: 'cloud', no: '02', name: 'Cloud & Infrastructure Modernization',
    summary: 'Migrate and secure workloads across AWS, Azure, and GCP with multi-cloud best practices.',
    capabilities: ['Cloud migration', 'Multi-cloud architecture', 'Infrastructure-as-code', 'Security & compliance', 'Cost optimization'] },
  { id: 'data', no: '03', name: 'Data Engineering & Advanced Analytics',
    summary: 'Build data lakes/warehouses and deliver real-time, scalable, actionable insights.',
    capabilities: ['Data lakes & warehouses', 'ETL / ELT pipelines', 'Real-time analytics', 'BI dashboards', 'Data governance'] },
  { id: 'it', no: '04', name: 'Enterprise IT Modernization & Custom Development',
    summary: 'Transform legacy systems with agile delivery, DevSecOps, and low/no-code platforms.',
    capabilities: ['Legacy modernization', 'Custom software development', 'DevSecOps', 'Low/no-code (Appian, Pega)', 'Agile delivery'] },
  { id: 'program', no: '05', name: 'Mission-Focused Program & Change Management',
    summary: 'Deliver complex programs with PMBOK-aligned execution, financial control, and training.',
    capabilities: ['PMBOK-aligned program management', 'Financial control', 'Organizational change management', 'Training', 'Governance'] },
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
  { code: 'CMMI ML 3 DEV', name: 'Maturity Level 3' },
];

IC.contractVehicles = [
  { code: 'GSA MAS', name: 'Multiple Award Schedule' },
  { code: 'GSA 8(a) STARS III', name: 'Governmentwide Acquisition Contract' },
  { code: 'OASIS+', name: 'Professional Services' },
  { code: 'FAA eFAST', name: 'Electronic FAST' },
];

IC.partners = ['Appian', 'Pega Systems', 'Salesforce', 'UiPath', 'Oracle', 'Adobe Sign', 'Amazon Web Services (AWS)'];

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
  { id: 'aws', name: 'AWS', file: 'assets/partners/aws-logo.png', scale: 1.5 },
];

IC.offices = [
  { tag: 'MAIN OFFICE', city: 'McLean, VA', addr: '7925 Jones Branch Drive, Suite #3175, McLean, VA 22102' },
  { tag: 'NEW JERSEY', city: 'Pleasantville, NJ', addr: '1000 W. Washington Ave, Suite 203, Pleasantville, NJ 08232' },
  { tag: 'OKLAHOMA', city: 'Oklahoma City, OK', addr: '100 NE 5th St, 1st Floor, Oklahoma City, OK 73104' },
];

IC.inquiryTypes = ['General inquiry', 'Solutions & services', 'Products', 'Contracts & teaming', 'Careers', 'Partnership'];

/* Graphic motif per solution / product (see lib/motion.jsx Motif variants). */
IC.solutionMotif = { ai: 'nodes', cloud: 'arcs', data: 'bars', it: 'grid', program: 'flow' };
IC.productMotif = { geospatial: 'topo', semantic: 'nodes', assistant: 'flow' };

/* Canvas viz scene per solution / product (see lib/canvasviz.jsx). */
IC.solutionScene = { ai: 'network', cloud: 'accelerate', data: 'flow', it: 'network', program: 'accelerate' };
IC.productScene = { geospatial: 'flow', semantic: 'network', assistant: 'accelerate' };

window.IC = IC;
