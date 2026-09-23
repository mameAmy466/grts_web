import type {
  Article,
  CategorySlug,
  Episode,
  ProgramSlot,
  ShortItem,
  VideoItem,
} from "@/lib/types";
import { slugify, unsplash } from "@/lib/utils";

export const SITE = {
  name: "GRTS",
  phone: "+220 422 0000",
  email: "info@grts.gm",
  tagline:
    "Informing. Educating. Entertaining. The national broadcaster of The Gambia, bringing global standards to local stories.",
};

export const categories: { slug: CategorySlug; label: string }[] = [
  { slug: "politics", label: "Politics" },
  { slug: "economy", label: "Economy" },
  { slug: "sports", label: "Sports" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "health", label: "Health" },
  { slug: "technology", label: "Technology" },
  { slug: "culture", label: "Culture" },
];

export const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com" },
  { name: "X", href: "https://x.com" },
  { name: "YouTube", href: "https://www.youtube.com" },
  { name: "Instagram", href: "https://www.instagram.com" },
] as const;

const article = (
  partial: Omit<Article, "href" | "slug"> & { href?: string; slug?: string },
): Article => {
  const slug = partial.slug ?? slugify(partial.title);
  return {
    ...partial,
    slug,
    href: partial.href ?? `/news/${partial.category}/${slug}`,
  };
};

export const breakingNews: Article[] = [
  article({
    id: "b1",
    title: "Port of Banjul expands digital clearance systems for cargo",
    excerpt: "",
    category: "economy",
    categoryLabel: "Economy",
    date: "August 1, 2026",
    image: unsplash("photo-1578575437130-527eed3abbec", 200),
  }),
  article({
    id: "b2",
    title: "Ministry of Education launches new nationwide literacy drive",
    excerpt: "",
    category: "politics",
    categoryLabel: "Government",
    date: "August 1, 2026",
    image: unsplash("photo-1503676260728-1c00da094a0b", 200),
  }),
  article({
    id: "b3",
    title: "GRA reports record tax collection in the first half of 2026",
    excerpt: "",
    category: "economy",
    categoryLabel: "Economy",
    date: "August 1, 2026",
    image: unsplash("photo-1454165804606-c3d57bc86b40", 200),
  }),
];

export const homeTopNews: Article[] = [
  article({
    id: "ht1",
    title: "Cabinet reviews coastal protection plan for the Kombo shoreline",
    excerpt: "",
    category: "politics",
    categoryLabel: "Politics",
    date: "July 31, 2026 14:00",
    image: unsplash("photo-1541872703-74c5e44368f9", 400),
  }),
  article({
    id: "ht2",
    title: "Gambia U-20 side prepares for WAFU tournament in Banjul",
    excerpt: "",
    category: "sports",
    categoryLabel: "Sports",
    date: "July 31, 2026 12:30",
    image: unsplash("photo-1574629810360-7efbbe195018", 400),
  }),
  article({
    id: "ht3",
    title: "Farmers in the North Bank report stronger groundnut yields",
    excerpt: "",
    category: "economy",
    categoryLabel: "Agriculture",
    date: "July 31, 2026 11:15",
    image: unsplash("photo-1625246333195-78d9c38ad449", 400),
  }),
  article({
    id: "ht4",
    title: "New community radio studio opens in Basse Santa Su",
    excerpt: "",
    category: "culture",
    categoryLabel: "Culture",
    date: "July 31, 2026 09:40",
    image: unsplash("photo-1478737270239-2f02b77fc618", 400),
  }),
];

export const homeHeadlines = {
  featured: article({
    id: "hf1",
    title: "National team call-up fuels hopes ahead of AFCON qualifiers",
    excerpt: "Players return to camp in Bakau as coaches finalise the squad.",
    category: "sports",
    categoryLabel: "POLITICS",
    date: "July 30, 2026 18:20",
    image: unsplash("photo-1522778119026-d647f0596c20", 1400),
  }),
  side: [
    article({
      id: "hs1",
      title: "State House briefs the press on the new public service reforms",
      excerpt: "",
      category: "politics",
      categoryLabel: "Government",
      date: "July 30, 2026 16:10",
      image: unsplash("photo-1540575467063-178a50c2df87", 400),
    }),
    article({
      id: "hs2",
      title: "Climate briefing warns of heavier rains across the West Coast",
      excerpt: "",
      category: "economy",
      categoryLabel: "Climate",
      date: "July 30, 2026 13:45",
      image: unsplash("photo-1469474968028-56623f02e425", 400),
    }),
    article({
      id: "hs3",
      title: "Central Bank outlines next steps for mobile money regulation",
      excerpt: "",
      category: "economy",
      categoryLabel: "Economy",
      date: "July 30, 2026 10:05",
      image: unsplash("photo-1551836022-d5d88e9218df", 400),
    }),
    article({
      id: "hs4",
      title: "Schools reopen with new digital attendance pilots in the Kanifing area",
      excerpt: "",
      category: "education",
      categoryLabel: "Education",
      date: "July 30, 2026 09:20",
      image: unsplash("photo-1503676260728-1c00da094a0b", 400),
    }),
  ],
};

export const homeNewsGrid: Article[] = [
  article({
    id: "hg1",
    title: "Parliament debates the 2026 supplementary budget",
    excerpt: "",
    category: "politics",
    categoryLabel: "POLITICS",
    date: "July 20, 2026",
    image: unsplash("photo-1529107386315-e1a2ed48a620", 800),
  }),
  article({
    id: "hg2",
    title: "Street festivals return to Banjul with a record weekend crowd",
    excerpt: "",
    category: "culture",
    categoryLabel: "CULTURE",
    date: "July 20, 2026",
    image: unsplash("photo-1514525253161-7a46d19cd819", 800),
  }),
  article({
    id: "hg3",
    title: "Clinics in rural Gambia expand maternal health outreach",
    excerpt: "",
    category: "health",
    categoryLabel: "HEALTH",
    date: "July 19, 2026",
    image: unsplash("photo-1576091160399-112ba8d25d1d", 800),
  }),
  article({
    id: "hg4",
    title: "Startups in Kanifing pitch digital tools for local traders",
    excerpt: "",
    category: "technology",
    categoryLabel: "TECH",
    date: "July 18, 2026",
    image: unsplash("photo-1518770660439-4636190af475", 800),
  }),
];

export const latestVideos: VideoItem[] = [
  {
    id: "v1",
    title: "Good Morning Gambia: market prices and the week ahead",
    image: unsplash("photo-1598550476439-6847785fcea7", 800),
    posted: "5 hours ago",
    views: "12.4K views",
    duration: "1:12:40",
    href: "/programmes/good-morning-gambia/watch",
  },
  {
    id: "v2",
    title: "The Frontline: ECOWAS trade corridor special",
    image: unsplash("photo-1540575467063-178a50c2df87", 800),
    posted: "1 day ago",
    views: "8.4K views",
    duration: "34:22",
    href: "/programmes/eye-on-the-gambia/watch",
  },
  {
    id: "v3",
    title: "Civic Hour: The Citizen's Mandate",
    image: unsplash("photo-1475721027785-f74eccf877e2", 800),
    posted: "2 days ago",
    views: "11K views",
    duration: "29:15",
    href: "/programmes/bantaba/watch",
  },
  {
    id: "v4",
    title: "Sports Desk: Scorpions training camp report",
    image: unsplash("photo-1574629810360-7efbbe195018", 800),
    posted: "2 days ago",
    views: "6.8K views",
    duration: "18:40",
    href: "/programmes/scorpions-live/watch",
  },
  {
    id: "v5",
    title: "Culture Night: kora masters in Brikama",
    image: unsplash("photo-1511671782779-c97d3d27a1d4", 800),
    posted: "3 days ago",
    views: "14.2K views",
    duration: "42:08",
    href: "/programmes/afri-beats/watch",
  },
  {
    id: "v6",
    title: "Farm to Market: groundnut harvest across the North Bank",
    image: unsplash("photo-1625246333195-78d9c38ad449", 800),
    posted: "3 days ago",
    views: "9.1K views",
    duration: "22:11",
    href: "/programmes/farm-and-field/watch",
  },
  {
    id: "v7",
    title: "Health Matters: malaria prevention this rainy season",
    image: unsplash("photo-1576091160399-112ba8d25d1d", 800),
    posted: "4 days ago",
    views: "7.3K views",
    duration: "16:55",
    href: "/programmes/health-matters/watch",
  },
  {
    id: "v8",
    title: "Tech Today: digital clearance at the Port of Banjul",
    image: unsplash("photo-1516321318423-f06f85e504f3", 800),
    posted: "5 days ago",
    views: "5.6K views",
    duration: "27:03",
    href: "/programmes/eye-on-the-gambia/watch",
  },
];

export const watchAgainFeatured: VideoItem = {
  id: "wa0",
  title: "National briefing: infrastructure and the rainy season",
  image: unsplash("photo-1588681664899-f78c6204014b", 1400),
  posted: "5 hours ago",
  views: "18.6K views",
  duration: "1:12:40",
  href: "/programmes/grts-news-hour/watch",
};

export const watchAgainSide: VideoItem[] = latestVideos.slice(1, 4);

export const popularVideos: VideoItem[] = [
  latestVideos[4],
  latestVideos[2],
  latestVideos[5],
  latestVideos[7],
];

export const shorts: ShortItem[] = [
  {
    id: "s1",
    title: "How a Banjul workshop is printing solar parts",
    category: "Innovation",
    image: unsplash("photo-1518770660439-4636190af475", 600),
    duration: "0:34",
    href: "/programmes",
  },
  {
    id: "s2",
    title: "Inside the Albert Market before sunrise",
    category: "Business",
    image: unsplash("photo-1556742049-0cfed4f6a45d", 600),
    duration: "0:48",
    href: "/programmes",
  },
  {
    id: "s3",
    title: "Kora lesson on the streets of Brikama",
    category: "Culture",
    image: unsplash("photo-1516280440614-37939bbacd81", 600),
    duration: "0:41",
    href: "/programmes",
  },
  {
    id: "s4",
    title: "Scorpions warm-up, 30 seconds",
    category: "Sports",
    image: unsplash("photo-1461896836934-ffe607ba6851", 600),
    duration: "0:29",
    href: "/programmes",
  },
  {
    id: "s5",
    title: "Mangrove planting along the Tanbi wetlands",
    category: "Environment",
    image: unsplash("photo-1547471080-7cc2caa01a7e", 600),
    duration: "0:52",
    href: "/programmes",
  },
];

export const newsHero = {
  featured: article({
    id: "nf1",
    title: "The Best Street Food Restaurants in Banjul and Its Suburbs",
    excerpt: "GRTS Special: Food & Dining",
    category: "culture",
    categoryLabel: "GRTS Special: Food & Dining",
    date: "August 1, 2026",
    image: unsplash("photo-1555939594-58d7cb561ad1", 1600),
  }),
  grid: [
    article({
      id: "ng1",
      title: "Coalition talks resume as parties weigh electoral reforms",
      excerpt: "",
      category: "politics",
      categoryLabel: "POLITICS",
      date: "August 1, 2026",
      image: unsplash("photo-1541872703-74c5e44368f9", 700),
    }),
    article({
      id: "ng2",
      title: "Root Festival announces an expanded programme in Basse",
      excerpt: "",
      category: "culture",
      categoryLabel: "CULTURE",
      date: "August 1, 2026",
      image: unsplash("photo-1514525253161-7a46d19cd819", 700),
    }),
    article({
      id: "ng3",
      title: "Mobile money rules aim to protect everyday consumers",
      excerpt: "",
      category: "economy",
      categoryLabel: "ECONOMY",
      date: "July 31, 2026",
      image: unsplash("photo-1556742049-0cfed4f6a45d", 700),
    }),
    article({
      id: "ng4",
      title: "Gambian researchers trial a low-cost water sensor",
      excerpt: "",
      category: "technology",
      categoryLabel: "SCIENCE",
      date: "July 31, 2026",
      image: unsplash("photo-1518770660439-4636190af475", 700),
    }),
  ],
  compact: [
    article({
      id: "nc1",
      title: "Teachers welcome the new literacy materials for Grade 1",
      excerpt: "",
      category: "politics",
      categoryLabel: "Education",
      date: "2 hours ago",
      image: unsplash("photo-1524178232363-1fb2b075b655", 240),
    }),
    article({
      id: "nc2",
      title: "Ferry services resume a fuller timetable at Banjul",
      excerpt: "",
      category: "economy",
      categoryLabel: "Transport",
      date: "3 hours ago",
      image: unsplash("photo-1578575437130-527eed3abbec", 240),
    }),
    article({
      id: "nc3",
      title: "Women's league kicks off with a sold-out opener",
      excerpt: "",
      category: "sports",
      categoryLabel: "Sports",
      date: "4 hours ago",
      image: unsplash("photo-1566576912321-d58ddd7a6088", 240),
    }),
  ],
};

export const latestNewsFeatured = article({
  id: "lnf",
  title: "Trailblazers of Sport: Gambian Athletes Paving the Way for Future Generations",
  excerpt:
    "From Bakau to the world stage, a new generation of athletes is rewriting what is possible — and pulling community programmes with them.",
  category: "sports",
  categoryLabel: "SPORTS",
  date: "August 1, 2026",
  image: unsplash("photo-1461896836934-ffe607ba6851", 900),
});

export const latestNewsList: Article[] = [
  article({
    id: "ln1",
    title: "Health ministry deploys extra teams before peak malaria season",
    excerpt:
      "Community clinics will extend hours and restock rapid tests across the West Coast and North Bank.",
    category: "health",
    categoryLabel: "HEALTH",
    date: "August 1, 2026",
    image: unsplash("photo-1576091160399-112ba8d25d1d", 300),
  }),
  article({
    id: "ln2",
    title: "A new cultural archive will digitise kora recordings",
    excerpt:
      "The project partners with Radio Gambia to restore tapes from the 1970s and 80s.",
    category: "culture",
    categoryLabel: "CULTURE",
    date: "July 31, 2026",
    image: unsplash("photo-1511671782779-c97d3d27a1d4", 300),
  }),
  article({
    id: "ln3",
    title: "Tech hubs in Kanifing open applications for a youth fellowship",
    excerpt:
      "Twenty places will support founders building tools for agriculture, payments, and media.",
    category: "technology",
    categoryLabel: "TECH",
    date: "July 31, 2026",
    image: unsplash("photo-1516321318423-f06f85e504f3", 300),
  }),
  article({
    id: "ln4",
    title: "Banjul port night shift expands to cut cargo waiting times",
    excerpt:
      "Operators say extra hours will ease congestion for perishable goods heading inland.",
    category: "economy",
    categoryLabel: "ECONOMY",
    date: "July 30, 2026",
    image: unsplash("photo-1578575437130-527eed3abbec", 300),
  }),
];

export const mostViewed: Article[] = [
  article({
    id: "mv1",
    title: "What the ECOWAS trade corridor means for Gambian exporters",
    excerpt: "",
    category: "economy",
    categoryLabel: "ECONOMY",
    date: "July 30, 2026",
    image: unsplash("photo-1578575437130-527eed3abbec", 200),
  }),
  article({
    id: "mv2",
    title: "Inside the squad: how the Scorpions are preparing",
    excerpt: "",
    category: "sports",
    categoryLabel: "SPORTS",
    date: "July 29, 2026",
    image: unsplash("photo-1574629810360-7efbbe195018", 200),
  }),
  article({
    id: "mv3",
    title: "A practical guide to the new mobile money rules",
    excerpt: "",
    category: "economy",
    categoryLabel: "FINANCE",
    date: "July 28, 2026",
    image: unsplash("photo-1454165804606-c3d57bc86b40", 200),
  }),
  article({
    id: "mv4",
    title: "Why coastal towns are planting mangroves this month",
    excerpt: "",
    category: "health",
    categoryLabel: "CLIMATE",
    date: "July 27, 2026",
    image: unsplash("photo-1547471080-7cc2caa01a7e", 200),
  }),
];

export const editorsChoice: Article[] = [
  article({
    id: "ec1",
    title: "The satellite dish that brought a village back into the picture",
    excerpt:
      "A community in the Upper River Region restored its GRTS signal — and Friday night football — with a shared dish and a lot of patience.",
    category: "technology",
    categoryLabel: "SCIENCE & TECH",
    date: "July 26, 2026",
    image: unsplash("photo-1446776811953-b23d57bd21aa", 900),
  }),
  article({
    id: "ec2",
    title: "Night markets, live bands, and the return of Banjul after dark",
    excerpt:
      "Promoters say audiences are back. We spent a weekend following the musicians who never really left.",
    category: "entertainment",
    categoryLabel: "ENTERTAINMENT & CULTURE",
    date: "July 25, 2026",
    image: unsplash("photo-1485846234645-a62647f31c78", 900),
  }),
  article({
    id: "ec3",
    title: "How GRTS is upgrading the national broadcast chain",
    excerpt:
      "From studio cameras in Kanifing to transmitters up-country, a look at the work happening behind the red light.",
    category: "technology",
    categoryLabel: "SATELLITE & BROADCAST",
    date: "July 24, 2026",
    image: unsplash("photo-1598488035139-bdbb2231ce04", 900),
  }),
];

export const categoryArticles: Record<CategorySlug, Article[]> = {
  economy: [
    article({
      id: "e0",
      title:
        "Gambia Revenue Authority Reports Record Tax Collection in First Half of 2026",
      excerpt:
        "Officials say digital filing and tighter customs checks lifted receipts, with more of the gains earmarked for roads and clinics.",
      category: "economy",
      categoryLabel: "ECONOMY",
      date: "August 1, 2026",
      readTime: "10 min read",
      image: unsplash("photo-1486406146926-c627a92ad1ab", 1600),
      author: "Fatou Jallow",
      authorImage: unsplash("photo-1573496359142-b8d87734a5a2", 200),
      caption:
        "GRA headquarters in Banjul during the annual revenue review conference. Photo: GRTS News.",
      lead:
        "The Gambia Revenue Authority has recorded its strongest first-half collection on record, with officials crediting digital filing, tighter customs checks, and a broader tax base for the jump in receipts.",
      sections: [
        {
          heading: "Digital Transformation Driving Growth",
          paragraphs: [
            "GRA Commissioner General Yankuba Darboe told a briefing in Banjul that more than half of corporate filings now arrive through the online portal, cutting processing times and reducing the room for informal arrangements at the counter.",
            "Customs officers at the Port of Banjul and the airport have been issued handheld scanners linked to the same system, allowing declarations to be checked against invoices before goods leave the yard.",
            "The authority says the next phase will bring self-employed traders and market associations onto a simplified mobile form, with support desks already opening in Serrekunda and Brikama.",
          ],
        },
        {
          heading: "Sector-by-Sector Breakdown",
          paragraphs: [
            "Import duties and VAT on consumer goods accounted for the largest share of the increase, followed by corporate income tax from banks, telecoms, and fuel distributors.",
            "Tourism-related levies also rose after a stronger winter season on the coast, while collections from small businesses grew more slowly — a gap the authority says the mobile form is meant to close.",
            "Ministers say a portion of the surplus will be ring-fenced for road repairs and clinic supplies in the North Bank and Upper River regions, subject to the supplementary budget now before the National Assembly.",
          ],
        },
      ],
      tags: ["Economy", "GRA", "Tax Revenue", "Digital Filing", "Government"],
    }),
    article({
      id: "e1",
      title: "Central Bank Introduces Mobile Money Regulations to Protect Consumers",
      excerpt: "",
      category: "economy",
      categoryLabel: "FINANCE",
      date: "July 30, 2026",
      readTime: "6 min read",
      image: unsplash("photo-1556742049-0cfed4f6a45d", 800),
    }),
    article({
      id: "e2",
      title: "Banjul port upgrade aims to cut cargo waiting times in half",
      excerpt: "",
      category: "economy",
      categoryLabel: "TRADE",
      date: "July 29, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1578575437130-527eed3abbec", 800),
    }),
    article({
      id: "e3",
      title: "Groundnut cooperatives secure better prices for the new season",
      excerpt: "",
      category: "economy",
      categoryLabel: "AGRICULTURE",
      date: "July 28, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1625246333195-78d9c38ad449", 800),
    }),
    article({
      id: "e4",
      title: "Tourism board projects a stronger winter season for the coast",
      excerpt: "",
      category: "economy",
      categoryLabel: "TOURISM",
      date: "July 27, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1547471080-7cc2caa01a7e", 800),
    }),
    article({
      id: "e5",
      title: "Small traders say digital payments are finally reaching the markets",
      excerpt: "",
      category: "economy",
      categoryLabel: "FINANCE",
      date: "July 26, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1454165804606-c3d57bc86b40", 800),
    }),
    article({
      id: "e6",
      title: "Fuel prices ease slightly as regional supply steadies",
      excerpt: "",
      category: "economy",
      categoryLabel: "ENERGY",
      date: "July 25, 2026",
      readTime: "3 min read",
      image: unsplash("photo-1611273426858-450d8e3c9fce", 800),
    }),
  ],
  politics: [
    article({
      id: "p0",
      title: "Cabinet sets a timetable for the public service reform bill",
      excerpt:
        "Ministers say the package will modernise hiring, pay, and digital records across government agencies.",
      category: "politics",
      categoryLabel: "POLITICS",
      date: "August 1, 2026",
      readTime: "8 min read",
      image: unsplash("photo-1541872703-74c5e44368f9", 1400),
    }),
    article({
      id: "p1",
      title: "National Assembly returns for a sitting on electoral amendments",
      excerpt: "",
      category: "politics",
      categoryLabel: "PARLIAMENT",
      date: "July 30, 2026",
      readTime: "6 min read",
      image: unsplash("photo-1529107386315-e1a2ed48a620", 800),
    }),
    article({
      id: "p2",
      title: "Local councils ask for a clearer share of tourism levies",
      excerpt: "",
      category: "politics",
      categoryLabel: "LOCAL",
      date: "July 28, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1540575467063-178a50c2df87", 800),
    }),
    article({
      id: "p3",
      title: "Youth groups present a civic education plan to the IEC",
      excerpt: "",
      category: "politics",
      categoryLabel: "CIVIC",
      date: "July 26, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1524178232363-1fb2b075b655", 800),
    }),
    article({
      id: "p4",
      title: "Diplomatic briefing: Gambia's role in the ECOWAS corridor talks",
      excerpt: "",
      category: "politics",
      categoryLabel: "DIPLOMACY",
      date: "July 24, 2026",
      readTime: "7 min read",
      image: unsplash("photo-1557804506-669a67965ba0", 800),
    }),
    article({
      id: "p5",
      title: "A new open-data portal will publish government contracts",
      excerpt: "",
      category: "politics",
      categoryLabel: "GOVERNMENT",
      date: "July 22, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1454165804606-c3d57bc86b40", 800),
    }),
    article({
      id: "p6",
      title: "Opposition parties outline their positions on media law",
      excerpt: "",
      category: "politics",
      categoryLabel: "MEDIA",
      date: "July 20, 2026",
      readTime: "6 min read",
      image: unsplash("photo-1495020689067-958852a7765e", 800),
    }),
  ],
  sports: [
    article({
      id: "sp0",
      title: "Scorpions name a provisional squad for the AFCON qualifier",
      excerpt:
        "Camp opens in Bakau this week, with several Europe-based players expected to join over the weekend.",
      category: "sports",
      categoryLabel: "FOOTBALL",
      date: "August 1, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1522778119026-d647f0596c20", 1400),
    }),
    article({
      id: "sp1",
      title: "Women's league opener fills the stands in Serrekunda",
      excerpt: "",
      category: "sports",
      categoryLabel: "FOOTBALL",
      date: "July 30, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1566576912321-d58ddd7a6088", 800),
    }),
    article({
      id: "sp2",
      title: "Athletics: Gambian sprinters book tickets to the regional meet",
      excerpt: "",
      category: "sports",
      categoryLabel: "ATHLETICS",
      date: "July 28, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1461896836934-ffe607ba6851", 800),
    }),
    article({
      id: "sp3",
      title: "Wrestling night in Serekunda draws a national TV audience",
      excerpt: "",
      category: "sports",
      categoryLabel: "WRESTLING",
      date: "July 26, 2026",
      readTime: "3 min read",
      image: unsplash("photo-1547471080-7cc2caa01a7e", 800),
    }),
    article({
      id: "sp4",
      title: "Beach football returns to the Cape Point sand this Saturday",
      excerpt: "",
      category: "sports",
      categoryLabel: "FOOTBALL",
      date: "July 24, 2026",
      readTime: "3 min read",
      image: unsplash("photo-1574629810360-7efbbe195018", 800),
    }),
    article({
      id: "sp5",
      title: "A new community pitch opens for youth sides in Brikama",
      excerpt: "",
      category: "sports",
      categoryLabel: "YOUTH",
      date: "July 22, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1489944440615-453fc2b6a9a9", 800),
    }),
    article({
      id: "sp6",
      title: "Cycling clubs map a safer route along the Bertil Harding Highway",
      excerpt: "",
      category: "sports",
      categoryLabel: "CYCLING",
      date: "July 20, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1541625602330-2277a4c46182", 800),
    }),
  ],
  entertainment: [
    article({
      id: "en0",
      title: "Root Festival expands with new stages in Basse and Banjul",
      excerpt:
        "Organisers promise a wider mix of kora, afrobeats, and film, with several nights carried live on GRTS.",
      category: "entertainment",
      categoryLabel: "CULTURE",
      date: "August 1, 2026",
      readTime: "6 min read",
      image: unsplash("photo-1514525253161-7a46d19cd819", 1400),
    }),
    article({
      id: "en1",
      title: "A new Gambian drama series starts tonight on GRTS 1",
      excerpt: "",
      category: "entertainment",
      categoryLabel: "TV",
      date: "July 30, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1485846234645-a62647f31c78", 800),
    }),
    article({
      id: "en2",
      title: "Kora masters record a live session at the Radio Gambia studio",
      excerpt: "",
      category: "entertainment",
      categoryLabel: "MUSIC",
      date: "July 28, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1511671782779-c97d3d27a1d4", 800),
    }),
    article({
      id: "en3",
      title: "Film nights return to the Alliance space with local shorts",
      excerpt: "",
      category: "entertainment",
      categoryLabel: "FILM",
      date: "July 26, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1489599849927-2ee91cede3ba", 800),
    }),
    article({
      id: "en4",
      title: "Street carnival weekend: what to see from July 31",
      excerpt: "",
      category: "entertainment",
      categoryLabel: "EVENTS",
      date: "July 24, 2026",
      readTime: "3 min read",
      image: unsplash("photo-1533174072545-7a4b6ad7a6c3", 800),
    }),
    article({
      id: "en5",
      title: "Young poets take the Civic Hour open-mic slot",
      excerpt: "",
      category: "entertainment",
      categoryLabel: "ARTS",
      date: "July 22, 2026",
      readTime: "3 min read",
      image: unsplash("photo-1475721027785-f74eccf877e2", 800),
    }),
    article({
      id: "en6",
      title: "A restored archive reel shows Banjul in the early colour years",
      excerpt: "",
      category: "entertainment",
      categoryLabel: "ARCHIVE",
      date: "July 20, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1440404653325-ab127d49abc1", 800),
    }),
  ],
  health: [
    article({
      id: "h0",
      title: "Health teams fan out before the peak of the malaria season",
      excerpt:
        "Extra testing kits and evening clinic hours are being rolled out in the West Coast and North Bank regions.",
      category: "health",
      categoryLabel: "HEALTH",
      date: "August 1, 2026",
      readTime: "7 min read",
      image: unsplash("photo-1576091160399-112ba8d25d1d", 1400),
    }),
    article({
      id: "h1",
      title: "Maternal outreach clinics add weekend hours in rural wards",
      excerpt: "",
      category: "health",
      categoryLabel: "MATERNAL",
      date: "July 30, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1579684385127-1e27a4c4626e", 800),
    }),
    article({
      id: "h2",
      title: "Nutrition drive targets school meals in the Upper River Region",
      excerpt: "",
      category: "health",
      categoryLabel: "NUTRITION",
      date: "July 28, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1498837167922-ddd27525d352", 800),
    }),
    article({
      id: "h3",
      title: "Mental health helpline reports a rise in youth callers",
      excerpt: "",
      category: "health",
      categoryLabel: "WELLBEING",
      date: "July 26, 2026",
      readTime: "6 min read",
      image: unsplash("photo-1573497019940-1c28c88b4f3e", 800),
    }),
    article({
      id: "h4",
      title: "Clean water points reduce clinic visits in two river communities",
      excerpt: "",
      category: "health",
      categoryLabel: "WATER",
      date: "July 24, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1547471080-7cc2caa01a7e", 800),
    }),
    article({
      id: "h5",
      title: "Vaccination week: what parents need to know this month",
      excerpt: "",
      category: "health",
      categoryLabel: "IMMUNISATION",
      date: "July 22, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1579684453423-f84349ef60b0", 800),
    }),
    article({
      id: "h6",
      title: "Hospitals trial a shared digital records system in Kanifing",
      excerpt: "",
      category: "health",
      categoryLabel: "SYSTEMS",
      date: "July 20, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1516549655169-df83a0774514", 800),
    }),
  ],
  technology: [
    article({
      id: "t0",
      title: "Port of Banjul rolls out digital clearance for cargo agents",
      excerpt:
        "The first phase lets agents file documents online and track inspections, with a public briefing due next week.",
      category: "technology",
      categoryLabel: "INFRASTRUCTURE",
      date: "August 1, 2026",
      readTime: "6 min read",
      image: unsplash("photo-1518770660439-4636190af475", 1400),
    }),
    article({
      id: "t1",
      title: "A low-cost sensor is helping farmers watch soil moisture",
      excerpt: "",
      category: "technology",
      categoryLabel: "AGRI-TECH",
      date: "July 30, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1581091226825-a6a2a5aee158", 800),
    }),
    article({
      id: "t2",
      title: "Kanifing tech hubs open a twenty-place youth fellowship",
      excerpt: "",
      category: "technology",
      categoryLabel: "STARTUPS",
      date: "July 28, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1516321318423-f06f85e504f3", 800),
    }),
    article({
      id: "t3",
      title: "GRTS upgrades the national transmission chain",
      excerpt: "",
      category: "technology",
      categoryLabel: "BROADCAST",
      date: "July 26, 2026",
      readTime: "6 min read",
      image: unsplash("photo-1598488035139-bdbb2231ce04", 800),
    }),
    article({
      id: "t4",
      title: "Schools receive tablets for the new literacy programme",
      excerpt: "",
      category: "technology",
      categoryLabel: "EDTECH",
      date: "July 24, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1503676260728-1c00da094a0b", 800),
    }),
    article({
      id: "t5",
      title: "A community dish restores television to an upriver village",
      excerpt: "",
      category: "technology",
      categoryLabel: "ACCESS",
      date: "July 22, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1446776811953-b23d57bd21aa", 800),
    }),
    article({
      id: "t6",
      title: "Cyber hygiene tips as more traders move payments online",
      excerpt: "",
      category: "technology",
      categoryLabel: "SECURITY",
      date: "July 20, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1555949963-aa79dcee981c", 800),
    }),
  ],
  culture: [
    article({
      id: "c0",
      title: "A new archive will digitise decades of Radio Gambia tapes",
      excerpt:
        "Engineers are transferring kora sessions and news bulletins from the 1970s before the oxide gives out.",
      category: "culture",
      categoryLabel: "ARCHIVE",
      date: "August 1, 2026",
      readTime: "7 min read",
      image: unsplash("photo-1478737270239-2f02b77fc618", 1400),
    }),
    article({
      id: "c1",
      title: "Street food guide: where Banjul still cooks after midnight",
      excerpt: "",
      category: "culture",
      categoryLabel: "FOOD",
      date: "July 30, 2026",
      readTime: "6 min read",
      image: unsplash("photo-1555939594-58d7cb561ad1", 800),
    }),
    article({
      id: "c2",
      title: "Weavers in Brikama prepare cloth for the independence parade",
      excerpt: "",
      category: "culture",
      categoryLabel: "CRAFT",
      date: "July 28, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1488521787991-ed7bbaae773c", 800),
    }),
    article({
      id: "c3",
      title: "Night markets return with live bands along the Albert Market",
      excerpt: "",
      category: "culture",
      categoryLabel: "NIGHTLIFE",
      date: "July 26, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1514525253161-7a46d19cd819", 800),
    }),
    article({
      id: "c4",
      title: "A photography walk documents everyday life in Basse",
      excerpt: "",
      category: "culture",
      categoryLabel: "PHOTO",
      date: "July 24, 2026",
      readTime: "4 min read",
      image: unsplash("photo-1523805003891-64f0e2f629e6", 800),
    }),
    article({
      id: "c5",
      title: "Language hour: teaching Wolof and Mandinka on Saturday radio",
      excerpt: "",
      category: "culture",
      categoryLabel: "LANGUAGE",
      date: "July 22, 2026",
      readTime: "3 min read",
      image: unsplash("photo-1503676260728-1c00da094a0b", 800),
    }),
    article({
      id: "c6",
      title: "The restored colour reels that show Banjul in the 1970s",
      excerpt: "",
      category: "culture",
      categoryLabel: "ARCHIVE",
      date: "July 20, 2026",
      readTime: "5 min read",
      image: unsplash("photo-1440404653325-ab127d49abc1", 800),
    }),
  ],
};

export const editorsChoiceSidebar: Article[] = [
  mostViewed[0],
  editorsChoice[1],
  latestNewsList[1],
  homeNewsGrid[2],
  editorsChoice[0],
];

export const todayGuide: ProgramSlot[] = [
  { time: "06:00", title: "Quran Recitation", category: "Faith" },
  { time: "06:30", title: "Morning Headlines", category: "News" },
  { time: "08:00", title: "Good Morning Gambia", category: "Current affairs" },
  { time: "10:00", title: "Gambian News", category: "News", live: true },
  { time: "13:00", title: "The Frontline", category: "Current affairs" },
  { time: "15:00", title: "Civic Hour", category: "Talk" },
  { time: "18:00", title: "Evening News", category: "News" },
  { time: "20:00", title: "Sports Desk", category: "Sports" },
  { time: "21:30", title: "Drama Night", category: "Entertainment" },
];

export const yesterdayGuide: ProgramSlot[] = [
  { time: "06:00", title: "Quran Recitation", category: "Faith" },
  { time: "08:00", title: "Good Morning Gambia", category: "Current affairs" },
  { time: "10:00", title: "Gambian News", category: "News" },
  { time: "14:00", title: "Farm to Market", category: "Documentary" },
  { time: "18:00", title: "Evening News", category: "News" },
  { time: "20:30", title: "Culture Night", category: "Entertainment" },
];

export const tomorrowGuide: ProgramSlot[] = [
  { time: "06:00", title: "Quran Recitation", category: "Faith" },
  { time: "08:00", title: "Good Morning Gambia", category: "Current affairs" },
  { time: "10:00", title: "Gambian News", category: "News" },
  { time: "12:00", title: "Health Matters", category: "Lifestyle" },
  { time: "16:00", title: "Kids Hour", category: "Children" },
  { time: "18:00", title: "Evening News", category: "News" },
  { time: "21:00", title: "The Frontline", category: "Current affairs" },
];

export const episodes: Episode[] = [
  {
    id: "ep1",
    title: "Ep. 12: How Silence Shapes Creativity",
    category: "Deep Focus",
    duration: "38 min",
    href: "/radio",
  },
  {
    id: "ep2",
    title: "Ep. 11: Markets Before Sunrise",
    category: "The Green Hour",
    duration: "42 min",
    href: "/radio",
  },
  {
    id: "ep3",
    title: "Ep. 10: The Kora in a Small Room",
    category: "Live Session",
    duration: "51 min",
    href: "/radio",
  },
  {
    id: "ep4",
    title: "Ep. 09: What Farmers Hear in the Rain",
    category: "The Green Hour",
    duration: "36 min",
    href: "/radio",
  },
  {
    id: "ep5",
    title: "Ep. 08: Night Desk at Radio Gambia",
    category: "Behind the Mic",
    duration: "29 min",
    href: "/radio",
  },
  {
    id: "ep6",
    title: "Ep. 07: A Brief History of the Shipping Forecast",
    category: "Archive",
    duration: "44 min",
    href: "/radio",
  },
  {
    id: "ep7",
    title: "Ep. 06: Youth Voices from Basse",
    category: "Community",
    duration: "33 min",
    href: "/radio",
  },
  {
    id: "ep8",
    title: "Ep. 05: Football on the Radio",
    category: "Sports",
    duration: "47 min",
    href: "/radio",
  },
];

export const followerStats = [
  { name: "Facebook", count: "125K", label: "Fans", color: "#1877F2" },
  { name: "X", count: "89K", label: "Followers", color: "#1D9BF0" },
  { name: "YouTube", count: "54K", label: "Subscribers", color: "#FF0000" },
  { name: "Instagram", count: "45K", label: "Followers", color: "#E1306C" },
] as const;

export function getCategory(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function articlesFor(slug: CategorySlug) {
  return categoryArticles[slug] ?? [];
}

export function allArticles() {
  const extras = [
    ...breakingNews,
    ...homeTopNews,
    homeHeadlines.featured,
    ...homeHeadlines.side,
    ...homeNewsGrid,
    newsHero.featured,
    ...newsHero.grid,
    ...newsHero.compact,
    latestNewsFeatured,
    ...latestNewsList,
    ...mostViewed,
    ...editorsChoice,
  ];
  const map = new Map<string, Article>();
  for (const item of [...Object.values(categoryArticles).flat(), ...extras]) {
    map.set(`${item.category}/${item.slug}`, item);
  }
  return [...map.values()];
}

export function getArticle(category: string, slug: string) {
  return allArticles().find(
    (item) => item.category === category && item.slug === slug,
  );
}

export function relatedArticles(article: Article, count = 3) {
  const sameCategory = articlesFor(article.category).filter(
    (item) => item.id !== article.id,
  );
  if (sameCategory.length >= count) return sameCategory.slice(0, count);

  const extras = allArticles().filter(
    (item) => item.id !== article.id && !sameCategory.some((entry) => entry.id === item.id),
  );
  return [...sameCategory, ...extras].slice(0, count);
}
