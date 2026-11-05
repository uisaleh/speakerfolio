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
  }
];
