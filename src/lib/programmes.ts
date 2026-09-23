import type { Program, ProgramFilter, ReplayEpisode } from "@/lib/types";
import { unsplash } from "@/lib/utils";

export const programFilters: { id: ProgramFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "politics", label: "Politics" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
  { id: "culture", label: "Culture" },
  { id: "education", label: "Education" },
  { id: "religion", label: "Religion" },
  { id: "talk-shows", label: "Talk Shows" },
];

export const programmes: Program[] = [
  {
    id: "p1",
    slug: "grts-news-hour",
    title: "GRTS News Hour",
    badge: "News",
    badgeColor: "#e31c23",
    filter: "politics",
    schedule: "Daily News — 8:00 PM",
    image: unsplash("photo-1588681664899-f78c6204014b", 900),
    description:
      "The flagship evening bulletin — politics, the economy, and the stories that shape The Gambia, from Banjul to the provinces.",
  },
  {
    id: "p2",
    slug: "good-morning-gambia",
    title: "Good Morning Gambia",
    badge: "Morning",
    badgeColor: "#16a34a",
    filter: "talk-shows",
    schedule: "Weekdays — 8:00 AM",
    image: unsplash("photo-1598550476439-6847785fcea7", 900),
    description:
      "A live start to the day: headlines, market prices, weather, and studio guests who set the national conversation.",
  },
  {
    id: "p3",
    slug: "kibaro-kundaa",
    title: "Kibaro Kundaa",
    badge: "News",
    badgeColor: "#e31c23",
    filter: "politics",
    schedule: "Daily — 7:00 PM",
    image: unsplash("photo-1495020689067-958852a7765e", 900),
    description:
      "Mandinka-language news for listeners and viewers across the country, with correspondents from every region.",
  },
  {
    id: "p4",
    slug: "xibaar-yi",
    title: "Xibaar Yi",
    badge: "News",
    badgeColor: "#e31c23",
    filter: "politics",
    schedule: "Daily — 7:30 PM",
    image: unsplash("photo-1504711434969-e33886168f5c", 900),
    description:
      "Wolof news that follows the day's events in the Greater Banjul Area and beyond — clear, local, and close to home.",
  },
  {
    id: "p5",
    slug: "kabaaru-leydi",
    title: "Kabaaru Leydi",
    badge: "News",
    badgeColor: "#e31c23",
    filter: "politics",
    schedule: "Daily — 6:30 PM",
    image: unsplash("photo-1529107386315-e1a2ed48a620", 900),
    description:
      "Fula-language reporting on national affairs, community life, and the stories that travel the river and the roads.",
  },
  {
    id: "p6",
    slug: "bantaba",
    title: "Bantaba",
    badge: "Talk",
    badgeColor: "#ea580c",
    filter: "talk-shows",
    schedule: "Wednesdays — 9:00 PM",
    image: unsplash("photo-1475721027785-f74eccf877e2", 900),
    description:
      "A village square on television: citizens, officials, and elders sit together to argue the week's most urgent questions.",
  },
  {
    id: "p7",
    slug: "national-assembly",
    title: "National Assembly",
    badge: "Politics",
    badgeColor: "#b91c1c",
    filter: "politics",
    schedule: "Sittings — Live",
    image: unsplash("photo-1540575467063-178a50c2df87", 900),
    description:
      "Live and recorded coverage of parliamentary sittings, committee work, and the debates that become law.",
  },
  {
    id: "p8",
    slug: "scorpions-live",
    title: "Scorpions Live",
    badge: "Sports",
    badgeColor: "#16a34a",
    filter: "sports",
    schedule: "Match days — Live",
    image: unsplash("photo-1522778119026-d647f0596c20", 900),
    description:
      "Match commentary, dressing-room access, and the road to qualification with the national football team.",
  },
  {
    id: "p9",
    slug: "sports-roundup",
    title: "Sports Roundup",
    badge: "Sports",
    badgeColor: "#16a34a",
    filter: "sports",
    schedule: "Sundays — 7:00 PM",
    image: unsplash("photo-1574629810360-7efbbe195018", 900),
    description:
      "A weekly sweep of football, wrestling, athletics, and the community pitches that keep the country moving.",
  },
  {
    id: "p10",
    slug: "scholars-forum",
    title: "Scholars' Forum",
    badge: "Education",
    badgeColor: "#2563eb",
    filter: "education",
    schedule: "Saturdays — 11:00 AM",
    image: unsplash("photo-1524178232363-1fb2b075b655", 900),
    description:
      "Teachers, researchers, and students examine the questions that sit behind the classroom and the exam hall.",
  },
  {
    id: "p11",
    slug: "gambian-heritage",
    title: "Gambian Heritage",
    badge: "Culture",
    badgeColor: "#a16207",
    filter: "culture",
    schedule: "Fridays — 8:30 PM",
    image: unsplash("photo-1547471080-7cc2caa01a7e", 900),
    description:
      "Sites, ceremonies, and the people who keep memory alive — from stone circles to the kora in a family compound.",
  },
  {
    id: "p12",
    slug: "afri-beats",
    title: "Afri Beats",
    badge: "Music",
    badgeColor: "#db2777",
    filter: "entertainment",
    schedule: "Saturdays — 9:00 PM",
    image: unsplash("photo-1514525253161-7a46d19cd819", 900),
    description:
      "Live sessions and studio interviews with the musicians shaping the sound of The Gambia and the region.",
  },
  {
    id: "p13",
    slug: "islamic-hour",
    title: "Islamic Hour",
    badge: "Religion",
    badgeColor: "#0d9488",
    filter: "religion",
    schedule: "Fridays — 1:30 PM",
    image: unsplash("photo-1564769625905-50e93615e769", 900),
    description:
      "Recitation, reflection, and conversation for Friday — a regular appointment for households across the country.",
  },
  {
    id: "p14",
    slug: "discover-gambia",
    title: "Discover Gambia",
    badge: "Documentary",
    badgeColor: "#0284c7",
    filter: "culture",
    schedule: "Sundays — 6:00 PM",
    image: unsplash("photo-1523805003891-64f0e2f629e6", 900),
    description:
      "A camera on the river, the coast, and the up-country roads — landscapes and livelihoods in long form.",
  },
  {
    id: "p15",
    slug: "health-matters",
    title: "Health Matters",
    badge: "Health",
    badgeColor: "#0891b2",
    filter: "education",
    schedule: "Tuesdays — 8:00 PM",
    image: unsplash("photo-1576091160399-112ba8d25d1d", 900),
    description:
      "Clinics, prevention, and practical advice for the rainy season and beyond, with doctors and community nurses.",
  },
  {
    id: "p16",
    slug: "eye-on-the-gambia",
    title: "Eye on The Gambia",
    badge: "Debate",
    badgeColor: "#c2410c",
    filter: "talk-shows",
    schedule: "Thursdays — 9:00 PM",
    image: unsplash("photo-1557804506-669a67965ba0", 900),
    poster: unsplash("photo-1475721027785-f74eccf877e2", 700),
    description:
      "A weekly briefing on the stories shaping the country — from the ECOWAS trade corridor to the newsrooms and markets that carry them home.",
  },
  {
    id: "p17",
    slug: "farm-and-field",
    title: "Farm & Field",
    badge: "Agriculture",
    badgeColor: "#65a30d",
    filter: "education",
    schedule: "Mondays — 7:30 PM",
    image: unsplash("photo-1625246333195-78d9c38ad449", 900),
    description:
      "Groundnuts, gardens, and the cooperatives that feed the markets — reporting from the North Bank to the URR.",
  },
  {
    id: "p18",
    slug: "gambian-stories",
    title: "Gambian Stories",
    badge: "Drama",
    badgeColor: "#7c3aed",
    filter: "entertainment",
    schedule: "Sundays — 8:30 PM",
    image: unsplash("photo-1485846234645-a62647f31c78", 900),
    description:
      "Original drama from Gambian writers and actors — family, city life, and the choices that follow people home.",
  },
  {
    id: "p19",
    slug: "kids-corner",
    title: "Kids Corner",
    badge: "Children",
    badgeColor: "#ca8a04",
    filter: "entertainment",
    schedule: "Saturdays — 10:00 AM",
    image: unsplash("photo-1503454537195-1dcabb73ffb9", 900),
    description:
      "Songs, stories, and classroom games for the youngest audience — made in The Gambia, for Saturday morning.",
  },
  {
    id: "p20",
    slug: "women-in-focus",
    title: "Women in Focus",
    badge: "Women",
    badgeColor: "#e11d48",
    filter: "talk-shows",
    schedule: "Wednesdays — 7:00 PM",
    image: unsplash("photo-1573497019940-1c28c88b4f3e", 900),
    description:
      "Profiles and studio conversations with the women running businesses, clinics, farms, and public life.",
  },
];

export function getProgramme(slug: string) {
  return programmes.find((item) => item.slug === slug);
}

export function relatedProgrammes(slug: string, count = 5) {
  const current = getProgramme(slug);
  const pool = programmes.filter((item) => item.slug !== slug);
  const same = pool.filter((item) => item.filter === current?.filter);
  return [...same, ...pool.filter((item) => !same.includes(item))].slice(0, count);
}

const featuredReplay: ReplayEpisode = {
  id: "replay-thies",
  programSlug: "eye-on-the-gambia",
  title: "Gambia Launches Renewable Energy Hub in Thiès",
  category: "Energy & Infrastructure",
  published: "Published on July 28, 2026",
  posted: "1 week ago",
  views: "14,230 views",
  duration: "02:34",
  durationSeconds: 154,
  image: unsplash("photo-1509391366360-2e959784a276", 1600),
  about:
    "GRTS follows the opening of a new renewable energy hub and the partners behind the first phase of solar storage for communities along the corridor. Officials say the site will train technicians and supply power to clinics and cold-storage for farmers. This replay includes the ribbon-cutting, the studio briefing, and reactions from traders in the nearby market.",
};

function episodeFromProgram(program: Program, index: number): ReplayEpisode {
  const posted = ["5 hours ago", "1 day ago", "2 days ago", "3 days ago", "1 week ago"][index % 5];
  return {
    id: `replay-${program.slug}`,
    programSlug: program.slug,
    title: program.title === "Eye on The Gambia" ? featuredReplay.title : `${program.title}: this week's edition`,
    category: program.badge,
    published: "Published on July 28, 2026",
    posted,
    views: ["8,410 views", "11,002 views", "6,774 views", "14,230 views"][index % 4],
    duration: ["12:40", "32:10", "18:22", "02:34", "29:15"][index % 5],
    durationSeconds: [760, 1930, 1102, 154, 1755][index % 5],
    image: program.image,
    about: program.description,
  };
}

export const replayEpisodes: ReplayEpisode[] = programmes.map((program, index) =>
  program.slug === featuredReplay.programSlug ? featuredReplay : episodeFromProgram(program, index),
);

export function getReplay(slug: string) {
  return replayEpisodes.find((item) => item.programSlug === slug);
}

export function upNextEpisodes(slug: string, count = 7) {
  return replayEpisodes.filter((item) => item.programSlug !== slug).slice(0, count);
}

export function relatedReplays(slug: string, count = 8) {
  return replayEpisodes.filter((item) => item.programSlug !== slug).slice(0, count);
}
