/* Eduvia — content data. Edit this file to change categories / courses.
   `video` points at the demo clip; replace with each lesson's real video. */
window.Eduvia = window.Eduvia || {};

Eduvia.DEMO_VIDEO = "assets/video/intro.mp4";

Eduvia.CATEGORIES = [
  { slug: "maths",     name: "Mathematics", icon: "i-maths",     c1: "#3b1f7a", c2: "#6d3fc4",
    tagline: "Numbers that finally make sense",
    blurb: "From algebra to calculus — short visual lessons that turn formulas into stories." },
  { slug: "science",   name: "Science",     icon: "i-science",   c1: "#0f4c5c", c2: "#1f9aa8",
    tagline: "Peek inside how the world works",
    blurb: "Atoms, cells, forces and reactions explained with animations and simple experiments." },
  { slug: "coding",    name: "Coding",      icon: "i-coding",    c1: "#2b1650", c2: "#7c3aed",
    tagline: "Write your first spell in code",
    blurb: "Learn to build real things — websites, programs and problem-solving skills step by step." },
  { slug: "languages", name: "Languages",   icon: "i-languages", c1: "#7a2e1f", c2: "#e0763f",
    tagline: "Speak it. Read it. Write it.",
    blurb: "Build confidence in speaking, reading and writing with everyday conversations." },
  { slug: "arts",      name: "Arts & Design", icon: "i-arts",    c1: "#7a1f5a", c2: "#e0577f",
    tagline: "Where imagination meets the page",
    blurb: "Sketching, colour and digital illustration — start creating from your very first lesson." },
  { slug: "exams",     name: "Exam Prep",   icon: "i-exams",     c1: "#3a2a10", c2: "#c9a24b",
    tagline: "Study smarter, not harder",
    blurb: "Memory tricks, aptitude practice and test strategies to help you walk in prepared." }
];

/* level: Beginner | Intermediate | Advanced */
Eduvia.COURSES = [
  // --- Mathematics
  { id: "m1", cat: "maths", title: "Algebra Unlocked", level: "Beginner", minutes: 42, lessons: 12, mentor: "Meera Iyer", thumb: 1,
    desc: "Variables, equations and the 'aha' moments that make algebra click.",
    learn: ["Solve linear equations", "Understand variables", "Factor expressions", "Graph simple functions"] },
  { id: "m2", cat: "maths", title: "Geometry in Motion", level: "Beginner", minutes: 38, lessons: 10, mentor: "Arjun Rao", thumb: 2,
    desc: "Angles, triangles and circles brought to life with animated proofs.",
    learn: ["Angle rules", "Area & perimeter", "Triangle theorems", "Circle basics"] },
  { id: "m3", cat: "maths", title: "Calculus Without Fear", level: "Intermediate", minutes: 64, lessons: 16, mentor: "Dr. Kavya Nair", thumb: 3,
    desc: "Limits, derivatives and integrals explained through everyday motion.",
    learn: ["Limits intuition", "Derivative rules", "Area under curves", "Real-world problems"] },
  { id: "m4", cat: "maths", title: "Probability & Everyday Luck", level: "Intermediate", minutes: 35, lessons: 9, mentor: "Sanjay Kumar", thumb: 4,
    desc: "Dice, cards and weather forecasts — think in chances, not guesses.",
    learn: ["Basic probability", "Combinations", "Conditional chance", "Spotting bad odds"] },

  // --- Science
  { id: "s1", cat: "science", title: "Inside the Atom", level: "Beginner", minutes: 36, lessons: 9, mentor: "Dr. Anitha Raman", thumb: 1,
    desc: "Protons, neutrons, electrons — a guided tour of the tiniest building blocks.",
    learn: ["Atomic structure", "Periodic table logic", "Isotopes", "How bonds form"] },
  { id: "s2", cat: "science", title: "The Living Cell", level: "Beginner", minutes: 40, lessons: 11, mentor: "Priya Menon", thumb: 2,
    desc: "Explore the organelles that keep every living thing running.",
    learn: ["Cell parts & jobs", "Plant vs animal cells", "Cell division", "Energy in cells"] },
  { id: "s3", cat: "science", title: "Forces, Motion & Energy", level: "Intermediate", minutes: 58, lessons: 14, mentor: "Rahul Verma", thumb: 3,
    desc: "Newton's laws with ramps, rockets and roller coasters.",
    learn: ["Newton's three laws", "Work & power", "Energy conservation", "Projectile motion"] },
  { id: "s4", cat: "science", title: "Chemistry of Everyday Life", level: "Intermediate", minutes: 46, lessons: 12, mentor: "Dr. Latha Subramanian", thumb: 4,
    desc: "Why bread rises, iron rusts and soap cleans — chemistry all around you.",
    learn: ["Reactions & equations", "Acids and bases", "Mixtures", "Kitchen experiments"] },

  // --- Coding
  { id: "c1", cat: "coding", title: "Python from Zero", level: "Beginner", minutes: 72, lessons: 18, mentor: "Vikram Shah", thumb: 1,
    desc: "Your very first programs — variables, loops and functions, no experience needed.",
    learn: ["Write & run code", "Loops and conditions", "Functions", "Mini projects"] },
  { id: "c2", cat: "coding", title: "Web Magic: HTML & CSS", level: "Beginner", minutes: 55, lessons: 14, mentor: "Nisha Patel", thumb: 2,
    desc: "Build and style a beautiful web page from a blank file.",
    learn: ["Page structure", "Colours & fonts", "Flexbox & grid", "Responsive design"] },
  { id: "c3", cat: "coding", title: "JavaScript Spells", level: "Intermediate", minutes: 80, lessons: 20, mentor: "Dev Anand", thumb: 3,
    desc: "Make pages come alive with interactions, animations and logic.",
    learn: ["DOM basics", "Events", "Functions & arrays", "Build a small app"] },
  { id: "c4", cat: "coding", title: "Think Like a Programmer", level: "Advanced", minutes: 68, lessons: 15, mentor: "Ishita Rao", thumb: 4,
    desc: "Break big problems down — algorithms, patterns and clean thinking.",
    learn: ["Problem decomposition", "Sorting & searching", "Big-O basics", "Debugging habits"] },

  // --- Languages
  { id: "l1", cat: "languages", title: "English Speaking Starter", level: "Beginner", minutes: 45, lessons: 12, mentor: "Grace Thomas", thumb: 1,
    desc: "Everyday phrases and confident pronunciation for real conversations.",
    learn: ["Daily conversations", "Pronunciation", "Common phrases", "Listening practice"] },
  { id: "l2", cat: "languages", title: "Tamil Reading Roots", level: "Beginner", minutes: 33, lessons: 10, mentor: "Selvi Murugan", thumb: 2,
    desc: "Learn the Tamil script step by step with letters, sounds and simple words.",
    learn: ["Vowels & consonants", "Reading words", "Simple sentences", "Writing practice"] },
  { id: "l3", cat: "languages", title: "Write Like a Storyteller", level: "Intermediate", minutes: 50, lessons: 13, mentor: "Rhea Dsouza", thumb: 3,
    desc: "Hooks, characters and flow — craft writing people want to finish.",
    learn: ["Strong openings", "Show, don't tell", "Dialogue", "Editing"] },
  { id: "l4", cat: "languages", title: "Grammar in Minutes", level: "Beginner", minutes: 28, lessons: 8, mentor: "Mohan Das", thumb: 4,
    desc: "Tenses, articles and punctuation — the rules that matter, fast.",
    learn: ["Tenses", "Articles", "Punctuation", "Common mistakes"] },

  // --- Arts & Design
  { id: "a1", cat: "arts", title: "Sketching Basics", level: "Beginner", minutes: 48, lessons: 12, mentor: "Anika Sen", thumb: 1,
    desc: "Lines, shapes and shading — draw what you see with confidence.",
    learn: ["Line control", "Basic shapes", "Shading", "Perspective intro"] },
  { id: "a2", cat: "arts", title: "Colour Theory Made Simple", level: "Beginner", minutes: 30, lessons: 8, mentor: "Tara Joseph", thumb: 2,
    desc: "Harmony, contrast and mood — pick palettes that always work.",
    learn: ["Colour wheel", "Harmonies", "Mood & meaning", "Palette building"] },
  { id: "a3", cat: "arts", title: "Digital Illustration 101", level: "Intermediate", minutes: 62, lessons: 15, mentor: "Kabir Mehta", thumb: 3,
    desc: "Tablet, layers and brushes — create your first polished illustration.",
    learn: ["Brush & layer setup", "Line art", "Colouring", "Light & shadow"] },
  { id: "a4", cat: "arts", title: "Calligraphy & Lettering", level: "Beginner", minutes: 34, lessons: 9, mentor: "Leela Krishnan", thumb: 4,
    desc: "Graceful strokes and hand-lettering with just a pen and patience.",
    learn: ["Pen holding", "Basic strokes", "Alphabets", "Layout ideas"] },

  // --- Exam Prep
  { id: "e1", cat: "exams", title: "Smart Study Habits", level: "Beginner", minutes: 26, lessons: 7, mentor: "Coach Ramesh", thumb: 1,
    desc: "Planning, focus and revision systems that really stick.",
    learn: ["Study planning", "Active recall", "Spaced revision", "Beating distraction"] },
  { id: "e2", cat: "exams", title: "Aptitude Fast Track", level: "Intermediate", minutes: 54, lessons: 14, mentor: "Neha Kapoor", thumb: 2,
    desc: "Shortcuts for percentages, ratios and puzzles under time pressure.",
    learn: ["Percentages", "Ratio & proportion", "Logical puzzles", "Speed tricks"] },
  { id: "e3", cat: "exams", title: "Memory Palace Techniques", level: "Intermediate", minutes: 32, lessons: 8, mentor: "Dr. Suresh Babu", thumb: 3,
    desc: "Remember lists, dates and formulas using ancient memory methods.",
    learn: ["Visual memory", "Loci method", "Mnemonics", "Daily practice"] },
  { id: "e4", cat: "exams", title: "Mock Test Strategy", level: "Advanced", minutes: 44, lessons: 10, mentor: "Coach Ramesh", thumb: 4,
    desc: "Time management and analysis so every mock test makes you better.",
    learn: ["Time splitting", "Question selection", "Error analysis", "Exam-day routine"] }
];

Eduvia.LEVELS = ["Beginner", "Intermediate", "Advanced"];

Eduvia.cat = function (slug) { return Eduvia.CATEGORIES.find(function (c) { return c.slug === slug; }); };
Eduvia.course = function (id) { return Eduvia.COURSES.find(function (c) { return c.id === id; }); };
Eduvia.coursesIn = function (slug) { return Eduvia.COURSES.filter(function (c) { return c.cat === slug; }); };
Eduvia.thumbOf = function (c) { return "assets/img/thumbs/" + c.cat + "-" + c.thumb + ".svg"; };
