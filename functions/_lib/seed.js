// Speakers prepared for you as drafts. Each one is added to the admin list once
// (the first time the admin panel loads after a deploy). Deleting it later does not bring it back.
export const SEEDS = [
  {
    name: 'Stanley Agwu',
    slug: 'stanley-agwu',
    headline: 'Motivational keynote speaker, author and speech coach',
    speakerType: 'Motivational keynote speaker',
    topics: ['Motivation', 'Entrepreneurship'],
    formats: ['Keynote'],
    location: 'Hamilton, Ontario, Canada',
    shortBio: 'Stanley Agwu is a motivational keynote speaker, author and speech coach based in Hamilton, Ontario. He empowers people to tap into their greatness and turn their goals into a clear plan of action. Stanley is the CEO of Wealth Communications Inc., which he has led since 2011, and the author of Motivation From Within.',
    bio: 'Stanley Agwu is a speaker, author and speech coach who helps individuals tap into their greatness. As a motivational speaker and business coach, he focuses on mindset, wealth building and the steps people need to reach their dreams.\nAlongside speaking, Stanley offers one-on-one coaching. Together with each client he builds a master action plan that sets out their goals and the steps to get there, using his own strategies for overcoming the obstacles in the way.\nStanley has been CEO of Wealth Communications Inc. since 2011, where he works on wealth-building opportunities. He is the author of Motivation From Within and studied at Abia State University.',
    video: 'https://www.youtube.com/watch?v=swxYXyxQolg',
    links: { website: 'https://www.stanleyagwu.com', linkedin: 'https://www.linkedin.com/in/stanley-agwu-65890888/' },
    talks: [], events: [], quotes: [],
    published: false, featured: false, consent: false, consentNote: ''
  },
  {
    name: 'Sunny Isuekebhor',
    slug: 'sunny-isuekebhor',
    headline: 'Leadership coach and keynote speaker on adaptive leadership and leading through change',
    speakerType: 'International keynote speaker',
    topics: ['Leadership', 'Communication', 'Motivation'],
    formats: ['Keynote', 'Workshop', 'Training', 'Virtual'],
    location: 'Lagos, Nigeria',
    languages: 'English',
    travel: 'In person and virtual',
    shortBio: 'Apostle Sunny Isuekebhor is a leadership expert, executive coach and international keynote speaker based in Lagos, Nigeria. With over 15 years of experience working with C-suite leaders and high-growth teams, he helps organizations transform their leadership culture, deliver complex strategic projects and build resilient, high-performing teams. He is the author of Turning Every Leader Into a Star, an Amazon #1 New Release.',
    bio: 'Sunny Isuekebhor has spoken at industry conferences and corporate events on adaptive leadership, high-impact project leadership, executive presence and leading through change. He delivers keynotes in person and virtually, and his sessions are known for being insightful, energizing and immediately applicable.\nSince 2015 he has advised executives, teams, companies and governments on leadership and project success, on Zoom and onsite. He also coaches senior executives one-on-one and runs leadership development programs, including the 12-module Sunny Leadership course.\nBefore leadership work, Sunny spent more than a decade in engineering and project management, including construction and power plant projects for Shell Petroleum Development Company and Lafarge Nigeria. He holds an MSc in Project Management from the University of Liverpool and a B.Eng in Mechanical Engineering from the University of Benin.\nHe teaches on Udemy, with courses including The 12 Things Every Public Speaker Must Know and Understand, and Follower Leadership Is the World\'s New Solution.',
    talks: [
      { title: 'Adaptive Leadership' },
      { title: 'High-Impact Project Leadership' },
      { title: 'Executive Presence' },
      { title: 'Leading Through Change' }
    ],
    events: [], quotes: [],
    links: { linkedin: 'https://www.linkedin.com/in/apostle-sunny-isuekebhor/' },
    bookingEmail: 'booksunny10@gmail.com',
    published: false, featured: false, consent: false, consentNote: ''
  },
  {
    name: 'Scott Stockdale',
    slug: 'scott-stockdale',
    headline: 'SEO trainer and instructor helping businesses show up on Google and AI search',
    speakerType: 'SEO trainer',
    topics: ['Technology', 'Entrepreneurship'],
    formats: ['Training', 'Workshop', 'Virtual'],
    location: 'Harrogate, England, United Kingdom',
    languages: 'English',
    shortBio: 'Scott Stockdale is an SEO manager, instructor and the founder of Stockdale Media, based in Harrogate, UK. For more than seven years he has run SEO campaigns for brands including 118 118 Money, Myprotein and Watches of Switzerland, in-house and at agencies. As lead SEO instructor at Zero To Mastery, he has taught thousands of students through his 11-hour SEO bootcamp, courses and workshops.',
    bio: 'Scott Stockdale helps businesses show up on Google, ChatGPT and other AI search tools. He is an SEO Manager at Avium, where he helps keynote speakers get more bookings, and through Stockdale Media he works with founder-led businesses on SEO.\nHe has worked at THG, Journey Further and WMG Agency, covering technical SEO, content and digital PR across sites in the UK, Germany, Italy, Spain and the US.\nAs lead SEO instructor at Zero To Mastery, a global academy with over a million students, Scott teaches through courses and workshops and answers students\' questions every week. His articles on marketing and SEO on Medium have been read over two million times.\nOutside SEO, he is the matchday commentator for Harrogate Railway Athletic F.C. and a media assistant at Harrogate Town AFC.',
    talks: [], events: [],
    quotes: [
      { quote: 'Within just a few weeks, we were ranking #1 on a key search term we\'ve been trying to rank on for years and saw a 23% increase in our organic traffic. This guy knows his stuff.', name: 'Faith Benson', role: 'Former VP of Marketing, Gun.io' }
    ],
    links: { website: 'https://scottstockdale.co.uk', linkedin: 'https://www.linkedin.com/in/scott-stockdale/' },
    bookingEmail: 'scott_stockdale@live.co.uk',
    published: false, featured: false, consent: false, consentNote: ''
  },
  {
    name: 'Tina Varughese',
    slug: 'tina-varughese',
    photo: '/assets/seed/tina-varughese.webp',
    headline: 'Human connection keynote speaker and author on inclusive workplaces where everyone belongs',
    speakerType: 'Keynote speaker and trainer',
    topics: ['HR and culture', 'Leadership', 'Communication', 'Motivation'],
    formats: ['Keynote', 'Workshop', 'Training', 'Virtual'],
    location: 'Calgary, Alberta, Canada',
    languages: 'English',
    travel: 'Canada and the USA · In person and virtual',
    shortBio: 'Tina Varughese is a human connection expert, keynote speaker and author of 50 Shades of Beige: Building Bridges While Breaking Bias. Named one of Canada\'s Top 10 Notable Speakers by Ignite Magazine, she helps organizations build psychologically safe workplaces where difficult conversations become possible and everyone feels seen, heard and acknowledged. She has spoken for Pfizer, Hockey Canada, Hyundai, Telus, Travelers Insurance and the Department of Justice Canada. Humor is her secret sauce.',
    bio: 'Tina Varughese helps organizations increase positivity, profits and purpose by creating workplaces where people feel they belong. Her keynotes and training sessions build a psychologically safe environment where employees can share ideas, ask questions and communicate openly, and help people move from jaded judgment to curious compassion.\nAs an Indo-Canadian daughter with a professional background in immigration, she brings a perspective that spans both worlds. Before founding T Works Inc in 2007, she spent eight years in business development at Alberta Economic Development, specializing in economic immigration, and she has also run her own relocation company.\nShe speaks on cross-cultural communication, inclusion, unconscious bias, resilience and work-life balance, in person and virtually across Canada and the USA. Her clients include BMO, TD, Telus, Pfizer, Hockey Canada, Loblaw, Kraft Heinz, Alberta Health Services and AICPA & CIMA. Media coverage includes the Toronto Star, CBC Radio One, TSN and Ignite Magazine.\nTina holds a Bachelor of Commerce in Marketing from the University of Saskatchewan.',
    talks: [
      { title: 'Just Be(longing): Authenticity, Belonging and Connection at Work', format: 'Keynote' },
      { title: '50 Shades of Beige: Communicate with the Cross-Cultural Advantage', format: 'Keynote' },
      { title: 'The Human Side of Unconscious Bias', format: 'Keynote' },
      { title: 'Inclusive Leadership: From Silos to Safety', format: 'Keynote' }
    ],
    video: 'https://youtu.be/uQT4jzZ6FEE',
    events: [
      { event: 'HR and Leadership Conference', organizer: 'CPHR Manitoba', format: 'Keynote' },
      { event: 'Anti-racism training for 400 players and staff', organizer: 'Hockey Canada', format: 'Training', year: '2020' },
      { event: 'Senior management session', organizer: 'Competition Bureau, Government of Canada' },
      { event: 'Member event keynote', organizer: 'Certified Professional Accountants of Saskatchewan', format: 'Keynote' }
    ],
    quotes: [
      { quote: 'Tina was the highest rated at this year\'s HR and Leadership Conference.', name: 'Ron Gauthier', role: 'CEO, CPHR Manitoba' },
      { quote: 'Tina\'s keynote presentation was motivating, thought-provoking, funny and from the heart.', name: 'Myrna Buttner Stahl', role: 'Director of Member Events and Communications, CPA Saskatchewan' },
      { quote: 'Tina\'s energy, humour and knowledge continue to resonate with us.', name: 'Dave Richardson', role: 'Senior VP, Telus' },
      { quote: 'Tina is an electrifying speaker. Her passion is infectious and highly relevant.', name: 'Warren Wood', role: 'Portfolio Manager, BMO Nesbitt Burns' }
    ],
    links: {
      website: 'https://tworksforyou.ca/', linkedin: 'https://www.linkedin.com/in/tinavarughese/',
      youtube: 'https://www.youtube.com/channel/UCe46rIVuIo9dUH6IkbV9t0w', instagram: 'https://www.instagram.com/tina_varughese/',
      x: 'https://twitter.com/TinaVarughese', facebook: 'https://www.facebook.com/TWorks-441054042582920/'
    },
    bookingEmail: 'tina@tworksforyou.ca',
    bookingLink: 'https://tworksforyou.ca/contact/',
    published: false, featured: false, consent: false, consentNote: ''
  },
  {
    name: 'Anton Rybakov',
    slug: 'anton-rybakov',
    photo: '/assets/seed/anton-rybakov.webp',
    headline: 'Motivational and mental health speaker on resilience and overcoming adversity',
    speakerType: 'Motivational keynote speaker',
    topics: ['Motivation', 'Health and wellbeing', 'Entrepreneurship'],
    formats: ['Keynote'],
    location: 'Houston, Texas, United States',
    shortBio: 'Anton Rybakov is a motivational and mental health speaker, entrepreneur and host of The F\'d Up Mind Podcast, based in Houston, Texas. After losing loved ones and rebuilding his life from scratch, he speaks about mental resilience, discipline and turning pain into purpose. He is the founder of Fun Characters, a multi-city entertainment company bringing positivity to people of all ages.',
    bio: 'Anton Rybakov inspires people to rise, take control of their lives and build something meaningful. His keynotes focus on resilience, overcoming adversity and the mindset it takes to keep going after setbacks.\nOn The F\'d Up Mind Podcast, he has real conversations about mental resilience, discipline, overcoming adversity and turning pain into purpose.\nSince 2022 he has run Fun Characters, an entertainment company operating in Houston and Miami that creates memorable experiences for people of all ages.',
    talks: [], events: [], quotes: [],
    links: { linkedin: 'https://www.linkedin.com/in/anton-rybakov-35bb48191/' },
    published: false, featured: false, consent: false, consentNote: ''
  },
  {
    name: 'Suja Unnikrishnan',
    slug: 'suja-unnikrishnan',
    photo: '/assets/seed/suja-unnikrishnan.webp',
    headline: 'Communication and voice trainer and media coach helping students and businesses perform with confidence',
    speakerType: 'Communication trainer',
    topics: ['Communication', 'Entrepreneurship'],
    formats: ['Training', 'Workshop'],
    location: 'Kozhikode, Kerala, India',
    shortBio: 'Suja Unnikrishnan is a communication and voice trainer, media coach and co-founder of Purple Tree Creatives, based in Kozhikode, Kerala. A radio announcer with All India Radio since 2019, she hosted the live chat show Real FM Show for four years. She has trained more than 100 students and works with schools, colleges and entrepreneurs to help them communicate with clarity, confidence and impact.',
    bio: 'Suja Unnikrishnan helps students, professionals and organizations communicate with clarity, confidence and impact, and perform well in front of the media. She has collaborated with schools, colleges and coaching centres, and supports entrepreneurs in building their communication presence offline and online.\nAs CEO and co-founder of Purple Tree Creatives, she helps brands, institutions and entrepreneurs with strategic communication, social media strategy, video production and media training.\nShe has worked as an announcer at All India Radio, Kozhikode, since 2019. She was also part of the founding team of Radio CU, the campus radio of the University of Calicut, where she designed programmes and organised events as Program Executive.\nSuja holds a master\'s degree in communication and journalism from the University of Calicut and a BA in English Language and Literature.',
    talks: [], events: [], quotes: [],
    links: { linkedin: 'https://www.linkedin.com/in/suja-unnikrishnan-597b76377/', instagram: 'https://www.instagram.com/sujaaspeaks/' },
    published: false, featured: false, consent: true, consentNote: 'Told Saleh she wants to be listed, 5 Nov 2026'
  },
  {
    name: 'Felicia M. L. Davis',
    slug: 'felicia-ml-davis',
    photo: '/assets/seed/felicia-ml-davis.webp',
    headline: 'Keynote speaker on leadership and neurodiversity at work',
    speakerType: 'Keynote speaker',
    topics: ['Leadership', 'HR and culture', 'Communication'],
    formats: ['Keynote'],
    location: 'Dallas/Fort Worth, Texas, United States',
    shortBio: 'Felicia M. L. Davis is a keynote speaker, business leader and co-author of Autism, Not Attitude, based in Dallas/Fort Worth, Texas. With more than 15 years of experience in leadership and organizational transformation, she helps organizations unlock the competitive advantage of neurodiverse employees. Her keynotes combine business expertise with lived experience, using humor, storytelling and memorable analogies.',
    bio: 'Every organization has untapped brilliance, and sometimes it simply thinks differently. Felicia M. L. Davis helps leaders find it, with keynotes on communication, leadership and workplace culture for executive audiences, HR and talent teams, people leaders and employee resource groups.\nShe brings more than 15 years of leadership and organizational transformation experience to the stage, and a late diagnosis of autism and ADHD shaped how she approaches leadership.\nFelicia is the co-author, with Nancy Wainscott, of Autism, Not Attitude: Embracing Neurodivergence at Work and in Relationships. Through Eunoia Thinking she also offers executive coaching and consulting.',
    talks: [
      { title: 'Different Minds, Extraordinary Results: The Competitive Advantage Hiding in Plain Sight', format: 'Keynote',
        summary: 'For executives, leadership conferences and HR teams: the hidden barriers that keep talented people from doing their best work, and how cognitive diversity strengthens innovation, decisions, retention and performance.',
        takeaways: ['A business case for neurodiversity leadership can act on', 'A framework for turning cognitive difference into innovation'] },
      { title: 'Autism, Not Attitude: Decoding the Communication Gap That\'s Costing Your Organization', format: 'Keynote',
        summary: 'For people leaders and manager development: what happens when different communication styles collide, and how to turn misunderstanding into clarity.',
        takeaways: ['Stronger conflict-resolution skills across communication styles', 'A working vocabulary for neurodivergent communication styles'] },
      { title: 'Built to Thrive: Responsibility, Resilience, and the Future of Neuroinclusivity', format: 'Keynote',
        summary: 'For leadership teams, HR, ERGs and culture events: moving beyond accommodation to shared responsibility, with sustainable performance and no lowered expectations.',
        takeaways: ['Tools to reduce miscommunication and burnout on mixed teams', 'Accommodation strategies that cost little or nothing'] }
    ],
    events: [
      { event: 'Neurodiversity and Conflict Resolution', organizer: 'Edward Jones', format: 'Keynote' },
      { event: 'Autism, Not Attitude', organizer: 'Mensa', format: 'Talk' },
      { event: 'Speaker Series', organizer: 'Mensa Foundation', format: 'Talk' }
    ],
    quotes: [
      { quote: 'Felicia was an engaging speaker, sharing her passion about neurodiversity while inviting audience members to participate.', name: 'Attendee', role: 'Neurodiversity and Conflict Resolution, Edward Jones' },
      { quote: 'This session was great to help think about how others are thinking and reacting to many different things.', name: 'AJ Mazuca', role: 'Attendee, Autism, Not Attitude, Mensa' }
    ],
    links: { website: 'https://feliciamldavis.com/', linkedin: 'https://www.linkedin.com/in/feliciamldavis/', youtube: 'https://www.youtube.com/@FeliciaMLDavis', facebook: 'https://www.facebook.com/FeliciaMLDavis' },
    bookingEmail: 'Felicia@feliciamldavis.com',
    bookingLink: 'https://feliciamldavis.com/#Contact',
    published: false, featured: false, consent: true, consentNote: 'Told Saleh she wants to be listed, 5 Nov 2026'
  },
  {
    name: 'Zakiyyah Hill',
    slug: 'zakiyyah-hill',
    photo: '/assets/seed/zakiyyah-hill.webp',
    headline: 'Keynote speaker and transformation coach on identity, leadership and resilience',
    speakerType: 'Keynote speaker and transformation coach',
    topics: ['Leadership', 'Motivation'],
    formats: ['Keynote', 'Workshop', 'Training'],
    location: 'Sacramento, California, United States',
    shortBio: 'Zakiyyah Hill is an author, keynote speaker, transformation coach and John Maxwell Certified Leader with more than 20 years of leadership and management experience across corporate, nonprofit, public sector and faith environments. She created The Uncovering, a seven-stage framework for leaders who have lost themselves in the process of surviving their organizations, and wrote Descendants of Tamar and Stop Throwing Yourself Away.',
    bio: 'Many leaders are not struggling because they lack skill, ambition or commitment. Zakiyyah Hill calls the real problem displacement: losing the connection between who they are and how they lead, under the pressure to perform and the weight of everything they have survived.\nShe speaks to corporations, nonprofits, government organizations, faith communities and women\'s leadership platforms, and gives leaders a concrete path back to purpose-driven leadership.\nAs founder and lead transformation coach of EdifyAlwayz since 2020, she delivers coaching, training and leadership development programs built on The Uncovering framework. She is also a pastor, and her message moves between the pulpit, the boardroom and the counseling office.\nHer books are Descendants of Tamar and Stop Throwing Yourself Away: Reclaiming Your Identity Before Life Taught You to Disappear, published in 2026.',
    talks: [
      { title: 'The Leader Who Disappeared', format: 'Keynote',
        summary: 'Delivered to faith communities, women\'s conferences and leadership summits, it names the hidden leadership crisis of displacement and gives leaders a path back to purpose-driven leadership.' }
    ],
    events: [], quotes: [],
    links: { website: 'https://zakiyyahhill.com/', linkedin: 'https://www.linkedin.com/in/zakiyyah-hill/' },
    bookingEmail: 'booking@zakiyyahhill.com',
    published: false, featured: false, consent: true, consentNote: 'Told Saleh she wants to be listed, 5 Nov 2026'
  },
  {
    name: 'Ayman Nassar',
    slug: 'ayman-nassar',
    photo: '/assets/seed/ayman-nassar.webp',
    headline: 'Keynote speaker and Marathon des Sables finisher with leadership lessons from the Sahara',
    speakerType: 'Keynote speaker',
    topics: ['Leadership', 'Motivation', 'Health and wellbeing'],
    formats: ['Keynote', 'Virtual'],
    location: 'Hamilton, Ontario, Canada',
    shortBio: 'Ayman Nassar is a keynote speaker, Certified Management Accountant (CMA) and Senior Internal Auditor at ArcelorMittal Dofasco in Hamilton, Ontario. A finisher of the Marathon des Sables, the multi-day ultramarathon across the Sahara, he shares the leadership lessons he learned in the desert, drawing on more than 15 years in internal audit, accounting and quality assurance.',
    bio: 'Did you hear the one about the internal auditor who ran across the Sahara? Ayman Nassar finished the Marathon des Sables, one of the toughest footraces on earth, run over six days through the desert, and turned the experience into leadership lessons for teams and professionals.\nHe sharpens his public speaking on the stand-up comedy stage, so his talks mix real stories with humour. His message is that a person is the balance between their personal and professional lives, and that making time for big personal goals makes people better at their work.\nAyman is a Certified Management Accountant and a Senior Internal Auditor at ArcelorMittal Dofasco, a role he has held since 2023. Before moving to Canada he spent more than a decade in Kuwait in audit and quality roles with the Al Babtain Group, Forward Sports Event Management, United Real Estate Company, Alghanim Industries, United Arab Shipping Company and RSM Albazie.\nHe also speaks about personal investing, including a session for the Centre For Talking Arts on how to make money in the Egyptian stock market.',
    video: 'https://www.youtube.com/watch?v=zqgNuwevZhs',
    videoTitle: 'How to Make Money in the Egyptian Stock Market, Centre For Talking Arts',
    talks: [
      { title: 'Leadership Lessons from the Sahara', format: 'Keynote',
        summary: 'What finishing the Marathon des Sables taught him about preparation, resilience and leading under pressure, told with the humour of a stand-up comic.' },
      { title: 'How to Make Money in the Egyptian Stock Market', format: 'Virtual',
        summary: 'A practical session on building wealth through investing in the Egyptian stock market, first given for the Centre For Talking Arts in April 2025.' }
    ],
    events: [{ event: 'How to Make Money in the Egyptian Stock Market', organizer: 'Centre For Talking Arts', format: 'Virtual', year: '2025' }], quotes: [],
    links: { website: 'https://aymannassar.speakerfolio.com/', linkedin: 'https://www.linkedin.com/in/aymannassarcma/' },
    published: true, featured: false, consent: true, consentNote: 'Told Saleh he wants to be listed, 10 Nov 2026'
  },
  {
    name: 'Roberta Bogany',
    slug: 'roberta-bogany',
    photo: '/assets/seed/roberta-bogany.webp',
    headline: 'Speaker, author and workshop facilitator helping people navigate change and life transitions',
    speakerType: 'Speaker and workshop facilitator',
    topics: ['Motivation', 'Health and wellbeing', 'HR and culture'],
    formats: ['Keynote', 'Workshop', 'Training'],
    location: 'Houston, Texas, United States',
    shortBio: 'Roberta Bogany, M.Ed, is a speaker, author, certified life coach and workshop facilitator in Houston, Texas, with more than 25 years in learning and development. She helps people grow through life\'s transitions, from an empty nest or career shift to a personal setback, and is the author of Relining the Empty Nest and Life Happens: 10 Steps to Navigating Change and Transition.',
    bio: 'For more than 25 years, Roberta Bogany has helped people navigate change. Her career began in learning and development, where she designed programs, facilitated workshops, coached learners and led large-scale organizational training. Along the way she found that her greatest passion is helping people grow through life\'s transitions.\nWhether someone is facing an empty nest, a career shift, a personal setback or the uncertainty of a new season of life, Roberta believes every transition holds an opportunity for growth. Through speaking, facilitation and reflective learning experiences, she helps people recognize the season they are in, navigate change with confidence, build resilience and rediscover purpose.\nHer mission is to help people embrace where they are today while preparing for who they are becoming tomorrow.\nRoberta spent more than 14 years at Houston Methodist, most recently as Senior Training Specialist, after learning roles with the City of Houston, Calpine Corporation, Gulf Coast Regional Blood Center and Shell Oil Products. She holds a Master of Education, a graduate certificate in communication and media studies from Walden University, and is a certified life coach. She speaks to organizations, community groups and faith communities.',
    talks: [
      { title: 'Standing in Your Season', format: 'Workshop', length: '',
        summary: 'A reflective workshop that helps people recognize the season of life they are in, make peace with where they are and take intentional steps toward what comes next.',
        takeaways: ['Recognize the season you are in', 'Navigate change with confidence', 'Take intentional next steps'] },
      { title: 'The Me Yet to Be: The Experience', format: 'Workshop', length: '',
        summary: 'A guided experience in self-discovery that helps people rediscover purpose and possibility, and move intentionally toward who they are becoming.',
        takeaways: ['Personal growth and self-discovery', 'Rediscover purpose and possibility', 'Move toward who you are becoming'] },
      { title: 'Courage in Everyday Clothes', format: 'Keynote', length: '',
        summary: 'On the everyday courage it takes to keep growing: resilience through challenges, confidence through reinvention and a habit of lifelong learning.',
        takeaways: ['Resilience through challenges', 'Confidence and reinvention', 'Lifelong learning'] },
      { title: 'Life Happens: 10 Steps to Navigating Change', format: 'Keynote', length: '',
        summary: 'Based on her book Life Happens, ten practical steps for finding your footing when life shifts, from an empty nest or a career change to a personal setback.',
        takeaways: ['Ten practical steps through change', 'Build resilience in a new season', 'Rediscover purpose and possibility'] }
    ],
    events: [], quotes: [],
    links: { website: 'https://robertabogany.speakerfolio.com/', linkedin: 'https://www.linkedin.com/in/robertabogany/', instagram: 'https://www.instagram.com/justroberta6295/', facebook: 'https://www.facebook.com/robertaboganyauthor/' },
    bookingEmail: 'imrobertabogany@gmail.com', languages: 'English',
    published: true, featured: false, consent: true, consentNote: 'Told Saleh she wants to be listed, 10 Nov 2026'
  }
];

// One-time changes to speakers already in storage (applied once, then remembered).
export const PATCHES = [
  { id: 'ayman-website-2026-11-11', slug: 'ayman-nassar', links: { website: 'https://aymannassar.speakerfolio.com/' } },
  { id: 'roberta-details-2026-11-12', slug: 'roberta-bogany', links: { website: 'https://robertabogany.speakerfolio.com/', linkedin: 'https://www.linkedin.com/in/robertabogany/', instagram: 'https://www.instagram.com/justroberta6295/', facebook: 'https://www.facebook.com/robertaboganyauthor/' },
    set: { bookingEmail: 'imrobertabogany@gmail.com', languages: 'English', talks: [
      { title: 'Standing in Your Season', format: 'Workshop', length: '',
        summary: 'A reflective workshop that helps people recognize the season of life they are in, make peace with where they are and take intentional steps toward what comes next.',
        takeaways: ['Recognize the season you are in', 'Navigate change with confidence', 'Take intentional next steps'] },
      { title: 'The Me Yet to Be: The Experience', format: 'Workshop', length: '',
        summary: 'A guided experience in self-discovery that helps people rediscover purpose and possibility, and move intentionally toward who they are becoming.',
        takeaways: ['Personal growth and self-discovery', 'Rediscover purpose and possibility', 'Move toward who you are becoming'] },
      { title: 'Courage in Everyday Clothes', format: 'Keynote', length: '',
        summary: 'On the everyday courage it takes to keep growing: resilience through challenges, confidence through reinvention and a habit of lifelong learning.',
        takeaways: ['Resilience through challenges', 'Confidence and reinvention', 'Lifelong learning'] },
      { title: 'Life Happens: 10 Steps to Navigating Change', format: 'Keynote', length: '',
        summary: 'Based on her book Life Happens, ten practical steps for finding your footing when life shifts, from an empty nest or a career change to a personal setback.',
        takeaways: ['Ten practical steps through change', 'Build resilience in a new season', 'Rediscover purpose and possibility'] }
    ] } }
];
