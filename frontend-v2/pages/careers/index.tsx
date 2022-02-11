import Link from 'next/link'
import Layout from '@/components/Layout'

export const jobs = [
  // Job 1
  {
    id: 'smart-contract-developer',
    title: '📌 Smart Contract Developer',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior, Junior',
    descriptions: [
      'Develop, improve and maintain Smart Contracts, apply to use-cases such as NFT minting, Marketplace Operation, On-chain => Offchain integration (using Wallet and NFT as logging keys)',
      'Work with product teams to write smart contracts according to the needs of each product team',
      'Research, explore, discuss, debate, come up with development ideas in a general direction and work with the team on those ideas',
      'Read/Understand technical papers/documents to come up with a solution as well as install that solution in the code base',
      'Research and learn about models of other protocols on crypto space',
      'Write tests and deployment scripts',
      'Work, report and be trained by Blockchain Tech Lead'
    ],
    advantages: [
      'Priority is given to candidates who have knowledge of code bases, models of protocols',
      'Priority is given to candidates who actively research and optimize the system and give ideas to develop the system'
    ],
    requirements: [
      '6 months+ experience in coding smart contracts using Solidity',
      'Experience working with Web3 js, Node js, Vue js, React js',
      'Have good logical thinking, good knowledge of algorithms and algorithms (priority is given to those who have participated in national, regional or international competitive programming at high school or university)',
      'Can read and understand technical papers/documents at the method/algorithm level',
      'Possessing the working spirit of a startup: proactive, self-responsible at work, willing to try new things, learn new things, have a problem-solver mindset',
      'Able to communicate in English at work at a good level or higher, especially reading and writing skills at a level that can meet the requirements of intensive document research',
      'Have a sense of writing clean, meticulous and detailed code',
      'Have good teamwork skills, support colleagues with/different teams'
    ],
    benefits: [
      'Competitive salary (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts'
    ]
  },

  // Job 2
  {
    id: 'fullstack-engineer',
    title: '🎯 Fullstack Engineer',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior, Junior',
    descriptions: [
      'Building the initial marketplace and APIs with our Blockchain Tech Lead',
      'Overseeing the engineering organization on a day – to – day basis as the organization grows',
      'Evaluate and confirm product design and changes',
      'Recruit, assign, direct and evaluate technical employees',
      'Manage the installation, testing, operation and maintenance of the product, making sure they are executed by the personnel responsible as the organization grows',
      'Organize and manage technical projects, making detailed plans and timelines that work towards the fulfillment of set product objectives',
      'Collaborate with other leaders to ensure successful development, release and launch of a world – class product'
    ],
    requirements: [
      'Prior leadership experience of an engineering organization',
      'Solid knowledge of best practices in engineering and architecture',
      'Front-end development skills (React/Vue)',
      'Back-end development skills (Node.js/MySQL)',
      'AWS DevOps skill',
      'Product management skills',
      'Rapid prototyping experience',
      'Capability to work on tight deadlines',
      'Excellent communication, written and verbal',
      'Excellent problem – finding and solution – finding skills',
      'Prior experience as VP (or higher) of engineering',
      'Experience in multiple major product releases',
      'Blockchain experience',
      'Marketplace platform experience'
    ],
    benefits: [
      'Competitive salary range (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 3
  {
    id: 'tester',
    title: '⛳ Tester (Lead)',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior',
    descriptions: [
      'Review client requirement and provides feedback',
      'Responsible for creating test plans and strategy',
      'Reviews and re-evaluates the test strategy to adjust for new information, changing risks, shifting priorities and schedules',
      'Oversees testing of software features',
      'Oversees quality review of various applications',
      'Oversees project to make sure work is scheduled based on priorities, risks and team strengths and assignment of resources across projects',
      'Oversees implementation and execution of functional, regression and acceptance tests',
      'Assists in test environment setup/teardown, test automation and exploratory testing',
      'Oversees the creation and maintenance of test data and test documentation',
      'Provides suitable solutions for issues/errors based on the understanding of the system and client business processes',
      'Leads/mentors Test Engineers and shares knowledge to make sure QA staff meets technical qualifications required for their positions',
      'Assists in coaching junior staff by helping them to make decisions, solve problems, manage meetings and set goals, provides feedback on testing-related tasks, delegates and assigns testing responsibilities',
      'Works with clients in evaluating and implementing new technologies and offer strategies for new opportunities',
      'Assists in formulating QA standards and best practices, organizational policies and processes and strategic plans',
      'Assists management in setting the direction for quality assurance within the organization',
      'Assists in recruiting new staff, conducting interviews and evaluate potential candidates'
    ],
    requirements: [
      '6+ years of working experience or equivalent combination of education and experience. Background in CS, IT or related scientific discipline',
      'Experience in testing various Game, Web applications, Services',
      'Experience managing a team of QA Engineers',
      'Experience in communicating with clients',
      'Understanding of test-driven development',
      'Understanding of software development lifecycle and best practices',
      'Understanding of Agile and Waterfall processes',
      'Understanding of user interface design',
      'Strong knowledge of software quality assurance best practices & methodologies',
      'Familiarity with various defect management systems',
      'Ability to communicate in English verbally and in writing',
      'Ability to communicate technical aspects to people with non-IT background',
      'Ability to ensure that solutions developed by technical teams fit the business needs',
      'Ability to offer alternative approaches to achieve the client goals',
      'Ability to analyses complex situations and manage all variables to achieve optimal solutions',
      'Ability to act on the information provided or get information needed so that decisions for project implementations can be made quickly and effectively',
      'Ability to define and prioritize short-term and long-term objectives for the teams and make necessary corrections under changing circumstances'
    ],
    benefits: [
      'Competitive salary range (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 4
  {
    id: 'business-analyst',
    title: '🔍 Business Analyst (Lead)',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior',
    descriptions: [
      'Meet with decision makers, system owners and end users to define business, financial and operations requirements and systems goals, and identify and resolve system issues',
      'Lead design sessions in prototyping new systems for the purpose of enhancing business processes, operations and information process flow',
      'Review and analyze the effectiveness and efficiency of existing systems and develop strategies for improving or further leveraging these systems',
      'Identify and establish scope and parameters of systems analysis in order to define outcome criteria and measure-taking actions',
      'Collaborate in the planning, design, development and deployment of new applications, and enhancement to existing applications',
      'Conduct research on software and hardware products to justify recommendations and to support purchasing efforts',
      'Prepare and deliver reports, recommendations or alternatives that address existing and potential trouble areas in operating systems across the organization',
      'Create system design proposals',
      'Perform cost-benefit and return on investment analyses for proposed systems to aid management in making implementation decisions',
      'Ensure compatibility and interoperability of in-house computing systems',
      'Create systems models, specifications, diagrams and charts to provide direction to system programmers',
      'Coordinate and perform in-depth tests, including end-user reviews for modified and new systems, and another post-implementation support',
      'Provide orientation and training to end users for all modified and new systems',
      'Provide guidance and/or instruction to junior staff members'
    ],
    requirements: [
      'The Lead Business Analyst will have a bachelor’s degree and 5 years of Business Analyst experience (county government preferred)',
      'Proven experience in overseeing the design, development and implementation of Game products, Web app',
      'Extensive practical knowledge in importing data for use in report software, spreadsheets, graphs and flow charts',
      'Proven experience in the operation and analysis of database hardware, software and standards, as well as data retrieval methodologies',
      'Demonstrated project management skills',
      'Excellent understanding of the organization’s goals and objectives',
      'Excellent analytical, mathematical and creative problem-solving skills',
      'Excellent written and oral communication skills',
      'Excellent listening and interpersonal skills',
      'Logical and efficient',
      'Keen attention to detail',
      'Ability to conduct research into systems issues and products as required',
      'Ability to communicate ideas in both technical and user-friendly language',
      'Highly self-motivated and directed',
      'Ability to effectively prioritize and execute task in a high-pressure environment',
      'Strong customer service orientation',
      'Experience working in a team-oriented, collaborative environment'
    ],
    benefits: [
      'Competitive salary range (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 5
  {
    id: 'marketing-excutive',
    title: '🎈 Marketing Excutive',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior, Junior',
    descriptions: [
      'Write posts, news on social networks, press release as well as creative copy',
      'Run social media channels (e.g.: Twitter, Telegram, Facebook and LinkedIn) to enhance audience engagement',
      'Help with marketing plans, advertising, direct marketing and campaign',
      'Build & manage vibrant community on social media channels',
      "Manage and take care marketing partners' activities",
      'Other tasks assigned by leaders'
    ],
    requirements: [
      'Proven experience in marketing, especially in content marketing',
      'Ability to work independently and collaboratively as a team member',
      'An effective communicator with good English written and spoken skills',
      'Proven ability to quickly learn and understand complex topics',
      'Interest in Blockchain is a plus',
      'Experience in design and video editing are also plus points'
    ],
    benefits: [
      'Competitive salary range (negotiable based on capacity) up to $1000',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 6
  {
    id: 'graphic-designer',
    title: '🚀Graphic Designer',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior, Junior, Remote',
    descriptions: [
      'Design the marketing materials for marketing activities (catalog, brochure, poster, etc.)',
      'Design work related to products (mattress, packing and other bedding products)',
      'Coordinating the content department to create ideas, develop a scripted deployment plan, shoot short videos for brands according to the media team’s content plan',
      'Editing in-house video clips to serve PR campaigns, marketing, training activities and internal communication, etc.',
      'Collect and research new trends and ideas to increase the attractiveness of videos',
      'Setting up for product’s inhouse photoshoot',
      'Other tasks as assigned'
    ],
    requirements: [
      'Proficient with Graphic software e.g. Adobe Photoshop, Premiere Pro and Illustrator',
      'Ability to meet tight deadlines and handle multiple projects simultaneously',
      'Exceptional creativity and innovation',
      'Experienced in designing game related content is a plus',
      'Portfolio presentation for interview',
      'Able to give and receive constructive criticism',
      'Understand marketing, production, website design, corporate identity, product packaging, advertisements and multimedia design',
      'Experience with computer-aided design'
    ],
    benefits: [
      'Competitive salary (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 7
  {
    id: 'game-ui-ux-designer',
    title: '🕹️Game UI/UX Designer',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior, Junior, Remote',
    descriptions: [
      'Translate concepts into user flow, wireframes, mockups and prototypes that lead to intuitive user experience',
      'Understand our users (create personas through user research and data...)',
      'Understand our Ecosystem, our NFT game, our NFTs and the metaverse',
      'Design (define the right interaction model, find creative solutions to solve UX problems...)',
      'Work closely with the Product Development team to design and deliver breakthrough digital experiences for both OC and Mobile games',
      'You have strong knowledge of the digital space and can show our teams the right design direction',
      'Create mood boards, Sketches, wireframes and user flows prior to designing using key data and analytics',
      'Design communication materials for our brand, from brief through to execution and contribute to elevating the product development team and creative output',
      'You contribute all sorts of design and production support to the team. Focusing on innovation and quality',
      'Inspire and collaborate with your co-workers to produce inventive, thoughtful, relevant work for the team. Experiment with new tools and techniques to improve your work',
      'Cultivate and understanding of industry trends and share your insights with the team',
      'Participates and facilitates brainstorming sessions'
    ],
    requirements: [
      'English and Vietnamese speaking and writing skills',
      'Prior experience working as UX Designer',
      'A great sense of product design and a deep UX understanding',
      'Experience creating prototypes using wireframe tools (Figma...)',
      'Solid experience that is demonstrated via your portfolio',
      'Have at least 2-3 years of experience',
      'Can demonstrate the range in both concept and final design solutions',
      'Have extremely high regard for details',
      'Are able to manage multiple tasks and deadlines without losing your way',
      'Can not only develop your own concepts/designs but are also able to collaborate with the team to enhance every project and are not above any task',
      'Passionate about what you do, not just chasing a paycheck',
      'Have a strong positive attitude. So strong that it is contagious'
    ],
    benefits: [
      'Competitive salary (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 8
  {
    id: 'game-executive-producer',
    title: '🎨Game Executive Producer',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior, Junior, Remote',
    descriptions: [
      'Ensure our team is up to speed with the Gaming landscape, markets, competition and user requirements in depth',
      'Deeply understand the overall game vision, product strategy, customer base and business goals',
      'Deliver on our first game. Then create new and exciting games within the GameFi Eco System',
      'Have autonomy and accountability over the strategic direction, execution and budge of our games',
      'Source, select and manage internal and external development partners who will execute our vision',
      'Create a framework for game production. Manage the milestones, timelines, and KPIs of the game, making sure they are executed by the personnel responsible as the organization grows',
      'Build a highly functioning team to execute the strategic vision, finding the right balance of outsourced partners and internal hires as appropriate',
      'Manage the development and operational processes within your division',
      'Effectively priorities product and team decisions across all levels and make strategic pivots based on data and new information'
    ],
    requirements: [
      '5+ years of Game Producer experience in making Web Game (like games in facebook, zalo), Multiplayer Game preferred (PC, iOS and Android), including game at similar scale and levels',
      'Willingness to relocate to Hanoi, Vietnam to bond with the team',
      'Prior leadership experience working with cross-functional teams',
      'Rapid prototyping experience. User research and feedback implementation experience',
      'Strong sense of organization coordination and communication',
      'Capability to work on tight deadlines',
      'Excellent problem-finding and solution-fiding skills',
      'Blockchain basic knowledge',
      'Monetization experience',
      'Technical background or Design background'
    ],
    benefits: [
      'Competitive salary (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 9
  {
    id: 'game-designer-economy',
    title: '🔮 Game Designer (Economy)',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior, Junior, Remote',
    descriptions: [
      'Solve never before solved game design challenges as we work together to create a truly groundbreaking gaming experience',
      'Take a pre-existing high-level game economy design and improve it with monetization strategies and details to pre-existing features',
      'Collaborate with the design team and developers to successfully implement and tune economic and monetization content into the product',
      'Manage the economy and pricing of all content within the game with in-depth macroeconomic models',
      'Manage the balance between player-generated vs developer-generated content while keeping positive progression and play-and-earn philosophy at the core of your design'
    ],
    requirements: [
      '2+ years of experience with economy design or mobile game monetization',
      'Proficient in analytical thinking and problem solving',
      'Strong quantitative skills (e.g. the skill set to translate the design into numbers)',
      'Expertise in Excel or Sheets',
      'Familiarity analyzing and interpreting player data',
      'An entry-level understanding of the blockchain',
      'An interest in Play-to-Earn game design',
      'Strong understanding of the Web mini game, Game casual',
      'Blockchain basic knowledge',
      'Marketplace platform experience',
      'Mathematical or Analytical background'
    ],
    benefits: [
      'Competitive salary range (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 10
  {
    id: 'game-2d-3d-artist',
    title: '🎮 Game 2D/3D Artist (All level)',
    location: 'Ha Noi, HCM, Remote',
    type: 'Full time',
    level: 'Senior, Junior, Remote',
    descriptions: [
      'Work on the illustration or concept art design for our game, working closely with the product team and engineers to produce initial sketches of concepts to high quality game marketing ready illustrations',
      'Collaborate with other team members to ensure successful development, release and launch of a successful game',
      'Conduct user research to inform, iterate and validate the product, characters, environment, asset design'
    ],
    requirements: [
      '1 – 5 years prior experience in illustration & design',
      'Solid knowledge of Zbrush/Blender, Mixamo or other similar applications',
      'Solid knowledge of best practices in design',
      'Rapid prototyping experience',
      'Capability to work on tight deadlines',
      'Have a sizable portfolio of creative work related to concept art and character designs',
      'Experience in multiple major art & game product releases'
    ],
    benefits: [
      'Competitive salary range (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 11
  {
    id: 'art-director',
    title: '🎨 Art Director',
    location: 'Ha Noi, HCM',
    type: 'Full time',
    level: 'Senior',
    descriptions: [
      'Work with the entire creative team to establish a unified brand understanding and voice for the company, helming a creative audit to elevate our innovation',
      'Conceptualize campaign vision, harnessing original graphics 2D – 3D content, copy, content website, social media and other marketing materials',
      'Develop creative briefs based on ideas established in brainstorming sessions with director, schedules and expected deliverables for the creative team',
      'Delegate projects to in – house designers and oversee storyboards',
      'Obtain team approval by presenting final layouts, storyboards and illustration, encouraging members to provide feedback and responding to internal commentary and request',
      'Present or oversee presentation of final concepts and coordinate production and dissemination for cross – organizational use'
    ],
    requirements: [
      'Bachelor’s degree in fine art, graphic design or similar discipline',
      '8+ years as a professional graphic designer with 4+ years of experience in management role',
      'Proficiency with design software, such as Adobe Creative Suite',
      'Exceptional capability with typography, layout and prototyping',
      'Highly skilled with leading a team of creative talent',
      'Strong creative vision with an understanding of business objectives',
      'Master’s degree',
      'Prior experience as an art director',
      'Web development experience',
      'Have a solid knowledge of photography and video production'
    ],
    benefits: [
      'Competitive salary range (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  },

  // Job 12
  {
    id: 'chief-marketing-officer',
    title: '💥 Chief Marketing Officer',
    location: 'Ha Noi, HCM',
    type: 'Full time',
    level: 'Senior',
    descriptions: [
      'Manage Marketing, Community and product-related programs from inception through completion while leveraging your excellent stakeholder management and program management skills',
      'Collaborate with a diverse cross-functional team (Marketing, Communication, Product, Design, Research, Data, Legal, etc.)',
      'Establish roadmaps and milestones, anticipate and manage risks, resolve roadblocks and operational challenges',
      'Establish and manage required processes, communication forums, artifacts, reporting formats and tools to upscale high-quality marketing operations',
      'Run stand ups, workgroup meetings, identifying action items and addressing blockers to keep programs and projects on track',
      'Improve process inputs, streamline workflows and project management tools',
      'Become a trustful and reliable partner to multidisciplinary stakeholders',
      'Communicate status and manage stakeholder expectations and report to Direct Manager'
    ],
    requirements: [
      'Bachelor’s degree in Marketing, Business, Data Analytics, Engineering, Computer Science or other similar fields or equivalent practical experience',
      'Experience working as a program manager, operations manager or similar cross-functional role in a technology company',
      'Experience working with and coordinating operations and programs of interdisciplinary working groups',
      'Experience building productivity and automation tools',
      'Tenacious, self-starter who thrives in understanding the details of complex, cross-functional projects and can effectively distill into actionable project plans',
      'Super organization skills and an analytical view on maximizing productivity, with a focus on value and not getting caught up on process',
      'Great communication and stakeholder management skills, both written and verbal',
      'Have the energy and patience to work in a dynamic team and rapidly growing industry, while applying a methodical and analytical mindset',
      'Comfortable working with a lot of data in technical environment, requiring high attention to detail',
      'Ability to simplify operational and informational complexity, delivering the right message to each stakeholder'
    ],
    benefits: [
      'Competitive salary range (negotiable based on capacity)',
      'Sign Labor contract, pay Insurance, have 12 annual leaves and other holidays as regulated by the State',
      'Review bonus and increase salary annually, have December bonus (13th month salary)',
      'Equipment and devices equipped and periodic health check for all employees',
      'Support career development, have chance to participate in Icetea Labs’ training courses to improve professional skills',
      'Tea and coffee break with snack, team building, sports, esports, unlimited parties as regulated by the Company',
      'A buzzing space full of globally influential technical founders and business establishing experts',
      "Other employee benefits offered by the company's leadership",
      'Working time: Monday to Friday (9:00 AM – 6:00 PM); Lunch time: 12:00 AM – 1:30 PM'
    ]
  }]

const Careers = () => (
  <Layout title="Careers">
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block pb-16">
      <div className="uppercase font-bold text-4xl mb-6">Current Openings</div>

      <div className="flex w-full px-4 mb-2">
        <div className="text-xs text-gamefiDark-50 uppercase flex-1">Title</div>
        <div className="hidden md:inline-block text-xs text-gamefiDark-50 uppercase w-48 text-left">Location</div>
        <div className="hidden md:inline-block text-xs text-gamefiDark-50 uppercase w-48 text-left">Job Type</div>
        <div className="inline-flex justify-start text-xs text-gamefiDark-50 uppercase w-48">Level</div>
      </div>

      { jobs.map((job) => <Link href={`/careers/${job.id}`} key={job.id} passHref={true}>
        <div className="flex w-full text-sm font-casual hover:bg-gamefiDark-700 cursor-pointer p-4 mb-2">
          <div className="flex-1 text-base">{job.title}<p className="md:hidden text-xs">{job.location}</p><p className="md:hidden text-xs">{job.type}</p></div>
          <div className="hidden md:inline-block w-48 text-left opacity-75">{job.location}</div>
          <div className="hidden md:inline-block w-48 text-left opacity-75">{job.type}</div>
          <div className="md:w-48 items-center justify-start inline-flex gap-x-2">{job.level.split(',').map(l => {
            l = l.trim()
            let color = 'text-white'
            if (l === 'Senior') {
              color = 'text-yellow-500'
            }

            if (l === 'Junior') {
              color = 'text-indigo-400'
            }

            return <span key={l} className={color}>{l}</span>
          })}</div>
        </div>
      </Link>) }
    </div>
  </Layout>
)

export default Careers
