// ── Types ────────────────────────────────────────────────────────────────────

export interface Property {
  id: number
  city: string
  area: string
  estate: string
  type: string
  tier: "budget" | "middle" | "premium"
  listingType: "rent" | "sale" | "both"
  beds: number
  baths: number
  sqft: number
  rentKES: number
  rentUSD: number
  salePriceKES?: number
  salePriceUSD?: number
  verified: boolean
  replyTime: string
  img: string
  images?: string[]
  amenities: string[]
  lat: number
  lon: number
  distanceToCBD: number
  nearbySchools: Array<{ name: string; distance: string; type: string }>
  nearbyHospitals: Array<{ name: string; distance: string }>
  nearbyMalls: Array<{ name: string; distance: string }>
  nearbyTransport: string[]
  description: string
  landlordName: string
  availableFrom: string
  petFriendly: boolean
  furnished: boolean
  parkingSpots: number
  tags: string[]
}

// ── Image library ─────────────────────────────────────────────────────────────

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=520&fit=crop&auto=format`

// Hero/exterior images per tier — large pools so every property gets a distinct shot
const EXT: Record<"budget" | "middle" | "premium", string[]> = {
  premium: [
    U("photo-1613977257365-aaae5a9817ff"),
    U("photo-1416331108676-a22ccb276e35"),
    U("photo-1509600110300-21b9d5fedeb7"),
    U("photo-1635108201418-0996823f4cc3"),
    U("photo-1635111300299-e6e677daf7b7"),
    U("photo-1752836720470-5647462f707b"),
    U("photo-1758117638928-c03fcca424c7"),
    U("photo-1598710951575-8f7d0346c24e"),
    U("photo-1669255034440-7d293acdd207"),
    U("photo-1576336463225-18df4bee0e38"),
    U("photo-1621437102383-99e5cf9859c7"),
    U("photo-1587047643567-24a019cdcb70"),
    U("photo-1780287857653-124e013bdd7c"),
    U("photo-1771192442016-d4c78d5729eb"),
    U("photo-1783125127059-514d7a90ab99"),
    U("photo-1763479142280-675629f6db27"),
    U("photo-1782939355736-fc6ed5c24b88"),
    U("photo-1652878856832-887df545cb0c"),
    U("photo-1529290130-4ca3753253ae"),
    U("photo-1613490493576-7fde63acd811"),
  ],
  middle: [
    U("photo-1674758978719-6121d8fbefb4"),
    U("photo-1786609836782-fafdcd51d8d8"),
    U("photo-1778871104310-01eb18aac023"),
    U("photo-1775303137786-1abd83d40e0d"),
    U("photo-1557736921-21fa9fdb3cfe"),
    U("photo-1771457362598-eb92f9f4bf42"),
    U("photo-1706755347826-29868be54b37"),
    U("photo-1685432941657-ea47a685c4d6"),
    U("photo-1600079748111-2e3468c8a2a8"),
    U("photo-1649148389482-d0d8bb761041"),
    U("photo-1693079632935-894021d301ca"),
    U("photo-1780919073827-ed086bf9b371"),
    U("photo-1774031137615-23d5bed07a68"),
    U("photo-1758796629979-c967b99dec5e"),
    U("photo-1709715739517-555cc6fe9391"),
    U("photo-1649769425782-8cdb757da2b4"),
    U("photo-1568605114967-8130f3a36994"),
    U("photo-1580587771525-78b9dba3b914"),
    U("photo-1502005229762-cf1b2da7c5d6"),
    U("photo-1694465990855-e78110c345af"),
  ],
  budget: [
    U("photo-1783444917333-dc2db9a7ae5e"),
    U("photo-1771096835033-0f428a5fc583"),
    U("photo-1778668633541-906ac1332021"),
    U("photo-1783521512349-ad0033d06a7c"),
    U("photo-1771479755111-efb9187564f2"),
    U("photo-1766229492178-c67c3b68be64"),
    U("photo-1758430611955-72bb61658df8"),
    U("photo-1759338584492-45647a320916"),
    U("photo-1771350957359-9788d786e80e"),
    U("photo-1779614710032-0c048fb9b2f0"),
    U("photo-1777105986341-9677da85607e"),
    U("photo-1572561580854-9569358ad8e3"),
    U("photo-1643534875576-690d96755b22"),
    U("photo-1557736921-21fa9fdb3cfe"),
    U("photo-1630241466166-22e43156d8c0"),
    U("photo-1758796629979-c967b99dec5e"),
    U("photo-1771096835033-0f428a5fc583"),
    U("photo-1771350957359-9788d786e80e"),
  ],
}

// Interior gallery images — used for all gallery slots across all tiers
const INT: string[] = [
  U("photo-1564078516393-cf04bd966897"),
  U("photo-1724582586529-62622e50c0b3"),
  U("photo-1724582586458-a51791349977"),
  U("photo-1724582586495-d050726cf354"),
  U("photo-1673563932832-a0c9e0ed26f8"),
  U("photo-1720247520862-7e4b14176fa8"),
  U("photo-1704040686413-2c607dbd2f06"),
  U("photo-1642976975710-1d8890dbf5ab"),
  U("photo-1663811397219-c572550dffc5"),
  U("photo-1628744876525-f2678d8af47f"),
  U("photo-1647082550285-119acfd169f2"),
  U("photo-1758957701419-2c6e266f7988"),
  U("photo-1667584523543-d1d9cc828a15"),
  U("photo-1745429523617-0d837856ca35"),
  U("photo-1668911493514-2aeed8439227"),
  U("photo-1774716925801-cad665240e12"),
  U("photo-1658218635253-64728f6234be"),
  U("photo-1665986127754-25c3100880be"),
  U("photo-1776348065117-02285a905b0b"),
  U("photo-1774716926071-fc03e73d0806"),
  U("photo-1663756915302-78b3bc4be8f1"),
  U("photo-1738748444659-f8975b12ce57"),
  U("photo-1662454419622-a41092ecd245"),
  U("photo-1780287857653-124e013bdd7c"),
  U("photo-1613553507747-5f8d62ad5904"),
]

// ── Deterministic pseudo-random ──────────────────────────────────────────────
function pr(seed: number, max: number): number {
  return Math.abs(((seed * 1103515245 + 12345) ^ (seed >> 3)) % max)
}

// ── Static pools ──────────────────────────────────────────────────────────────

const SUFFIXES = [
  "Court", "Gardens", "Heights", "Residences", "Estate", "Place",
  "Park", "Towers", "Ridge", "Grove", "Manor", "Crescent",
  "Close", "View", "Terrace", "Lane", "Annex", "Homes",
]

const LANDLORDS = [
  "James Kamau", "Grace Njoroge", "Peter Mwangi", "Alice Odhiambo",
  "Samuel Kioko", "David Ngugi", "Caroline Otieno", "John Muriithi",
  "Mary Wanjiku", "Eric Waweru", "Faith Mutua", "Paul Ndirangu",
  "Thomas Oloo", "Susan Njambi", "Ann Muthoni", "Hassan Omar",
  "Fatuma Ali", "Mohammed Shariff", "Francis Chege", "Jane Wachira",
  "George Kiprono", "Otieno Onyango", "Akinyi Achieng", "Dr. Kiptoo Ruto",
  "Agnes Chebii", "Nderitu Kamau", "Mary Wambua", "Patrick Gichohi",
  "Priya Mehta", "Charles Ndegwa", "David Kimani", "Sarah Muthoni",
  "Gideon Waweru", "Joseph Kariuki", "Lucy Wambura", "Kevin Odhiambo",
  "Beatrice Mwende", "Stephen Githinji", "Ruth Chebet", "Daniel Omondi",
]

const DATES = [
  "Immediate", "Immediate", "Immediate",
  "01 Sep 2026", "15 Sep 2026", "01 Oct 2026",
  "15 Oct 2026", "01 Nov 2026", "15 Nov 2026",
]

const AMENITY_POOLS = {
  budget: [
    "Water Supply", "Security Guard", "Parking", "CCTV",
    "Borehole", "Water Tank", "Gate", "Backup Power",
  ],
  middle: [
    "Parking", "24hr Security", "Backup Generator", "Water 24/7",
    "CCTV", "Fibre Internet", "Intercom", "Gym", "Borehole",
    "Kids Play Area", "Rooftop Access", "Elevator", "Swimming Pool",
    "Solar Water Heater",
  ],
  premium: [
    "Swimming Pool", "Gymnasium", "24hr Armed Security",
    "Backup Generator", "Solar Power", "Fibre 100Mbps",
    "Concierge Service", "CCTV", "Smart Home", "Private Garden",
    "DSQ", "Staff Quarters", "Tennis Court", "Home Theatre",
    "Wine Cellar", "Heated Pool", "Private Lift", "AC Throughout",
  ],
}

function pickAmenities(tier: "budget" | "middle" | "premium", seed: number): string[] {
  const pool = AMENITY_POOLS[tier]
  const count = tier === "budget" ? 3 : tier === "middle" ? 5 : 7
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const idx = pr(seed + i * 7, pool.length)
    if (!result.includes(pool[idx])) result.push(pool[idx])
  }
  return result
}

// ── Area + listing definitions ────────────────────────────────────────────────

interface Sch { n: string; d: string; t: string }
interface Hosp { n: string; d: string }
interface Mall { n: string; d: string }

interface AreaSpec {
  city: string
  area: string
  tier: "budget" | "middle" | "premium"
  lat: number
  lon: number
  cbd: number
  sch: Sch[]
  hosp: Hosp[]
  mall: Mall[]
  trans: string[]
  ls: ListingSpec[]
}

interface ListingSpec {
  beds: number
  baths: number
  sqft: number
  type: string
  rent: number
  sale: number          // 0 = rent-only
  lt: "rent" | "sale" | "both"
  fur?: true
  pet?: true
}

const AREAS: AreaSpec[] = [
  // ════════════════════════════════════════
  //  NAIROBI — PREMIUM
  // ════════════════════════════════════════
  {
    city: "Nairobi", area: "Gigiri", tier: "premium",
    lat: -1.2268, lon: 36.7856, cbd: 12,
    sch: [{ n: "UNIS Nairobi", d: "0.8 km", t: "International" }, { n: "Rosslyn Academy", d: "1.5 km", t: "International" }],
    hosp: [{ n: "AAR Health Gigiri", d: "0.5 km" }, { n: "Aga Khan Hospital", d: "4.5 km" }],
    mall: [{ n: "Village Market", d: "0.6 km" }, { n: "Rosslyn Riviera", d: "1.2 km" }],
    trans: ["UN Complex (0.4 km)", "Taxi/Chauffeur zone", "Matatu to Westlands (0.5 km)"],
    ls: [
      { beds: 5, baths: 5, sqft: 4500, type: "5BR Villa",        rent: 780000, sale: 260000000, lt: "both", fur: true },
      { beds: 4, baths: 4, sqft: 3200, type: "4BR Villa",        rent: 520000, sale: 185000000, lt: "both" },
      { beds: 3, baths: 3, sqft: 2000, type: "3BR Apartment",    rent: 320000, sale: 110000000, lt: "both", fur: true },
      { beds: 2, baths: 2, sqft: 1400, type: "2BR Penthouse",    rent: 200000, sale: 75000000,  lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Muthaiga", tier: "premium",
    lat: -1.2571, lon: 36.82, cbd: 8,
    sch: [{ n: "Muthaiga Primary", d: "0.7 km", t: "Primary" }, { n: "Aga Khan Academy", d: "2.5 km", t: "International" }],
    hosp: [{ n: "Aga Khan Hospital", d: "2.2 km" }, { n: "Nairobi Hospital", d: "4 km" }],
    mall: [{ n: "Westgate Mall", d: "3.5 km" }, { n: "Sarit Centre", d: "4 km" }],
    trans: ["Muthaiga Club (0.3 km)", "Taxi (0.1 km)", "Matatu to CBD (0.7 km)"],
    ls: [
      { beds: 5, baths: 5, sqft: 4200, type: "5BR Colonial Villa",  rent: 680000, sale: 230000000, lt: "both" },
      { beds: 4, baths: 4, sqft: 3500, type: "4BR Villa",           rent: 560000, sale: 195000000, lt: "both" },
      { beds: 3, baths: 3, sqft: 2200, type: "3BR Maisonette",      rent: 300000, sale: 100000000, lt: "both" },
      { beds: 2, baths: 2, sqft: 1500, type: "2BR Apartment",       rent: 165000, sale: 58000000,  lt: "both", fur: true },
    ],
  },
  {
    city: "Nairobi", area: "Runda", tier: "premium",
    lat: -1.21, lon: 36.77, cbd: 16,
    sch: [{ n: "Runda Preparatory", d: "0.5 km", t: "Primary" }, { n: "ISK", d: "2 km", t: "International" }],
    hosp: [{ n: "Kiambu Level 5", d: "4 km" }, { n: "Aga Khan", d: "7 km" }],
    mall: [{ n: "Two Rivers Mall", d: "4 km" }, { n: "Village Market", d: "5 km" }],
    trans: ["Private driver advised", "Matatu 106 (0.8 km)", "Two Rivers Bus (2 km)"],
    ls: [
      { beds: 6, baths: 6, sqft: 5500, type: "6BR Villa",         rent: 900000, sale: 320000000, lt: "both" },
      { beds: 5, baths: 5, sqft: 4000, type: "5BR Villa",         rent: 680000, sale: 240000000, lt: "both" },
      { beds: 4, baths: 4, sqft: 2800, type: "4BR Townhouse",     rent: 420000, sale: 145000000, lt: "both" },
      { beds: 3, baths: 3, sqft: 1900, type: "3BR Apartment",     rent: 250000, sale: 85000000,  lt: "both", fur: true },
    ],
  },
  {
    city: "Nairobi", area: "Karen", tier: "premium",
    lat: -1.3171, lon: 36.7072, cbd: 18,
    sch: [{ n: "Karen C Primary", d: "0.8 km", t: "Primary" }, { n: "Hillcrest International", d: "2 km", t: "International" }],
    hosp: [{ n: "Karen Hospital", d: "1.4 km" }, { n: "Nairobi South", d: "5 km" }],
    mall: [{ n: "Karen Shopping Centre", d: "1 km" }, { n: "Waterfront Karen", d: "2.5 km" }],
    trans: ["Matatu 111 (0.6 km)", "Bolt/Uber pickup", "Karen bus stop (0.6 km)"],
    ls: [
      { beds: 5, baths: 5, sqft: 3800, type: "5BR Maisonette",  rent: 620000, sale: 220000000, lt: "both" },
      { beds: 4, baths: 4, sqft: 2800, type: "4BR Bungalow",    rent: 380000, sale: 155000000, lt: "both", pet: true },
      { beds: 3, baths: 3, sqft: 1900, type: "3BR Townhouse",   rent: 210000, sale: 85000000,  lt: "both", pet: true },
      { beds: 2, baths: 2, sqft: 1200, type: "2BR Apartment",   rent: 130000, sale: 48000000,  lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Lavington", tier: "premium",
    lat: -1.2836, lon: 36.7771, cbd: 9,
    sch: [{ n: "Lavington Primary", d: "0.5 km", t: "Primary" }, { n: "Nairobi Academy", d: "1.2 km", t: "Mixed" }],
    hosp: [{ n: "Nairobi West Hospital", d: "2.3 km" }, { n: "Nairobi Hospital", d: "3.8 km" }],
    mall: [{ n: "Junction Mall", d: "0.7 km" }, { n: "Valley Arcade", d: "1 km" }],
    trans: ["Matatu stage (0.2 km)", "Junction Mall shuttle", "Taxi zone (0.1 km)"],
    ls: [
      { beds: 4, baths: 4, sqft: 3000, type: "4BR Villa",        rent: 420000, sale: 160000000, lt: "both" },
      { beds: 3, baths: 3, sqft: 1800, type: "3BR Apartment",    rent: 185000, sale: 72000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 1200, type: "2BR Apartment",    rent: 120000, sale: 46000000,  lt: "both", fur: true },
      { beds: 1, baths: 1, sqft: 650,  type: "1BR Apartment",    rent: 75000,  sale: 28000000,  lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Spring Valley", tier: "premium",
    lat: -1.275, lon: 36.79, cbd: 10,
    sch: [{ n: "Braeburn Lavington", d: "2.5 km", t: "International" }, { n: "St Andrew's Prep", d: "3 km", t: "International Prep" }],
    hosp: [{ n: "Nairobi Hospital", d: "3.5 km" }, { n: "MP Shah", d: "3 km" }],
    mall: [{ n: "Junction Mall", d: "2 km" }, { n: "Valley Arcade", d: "2.5 km" }],
    trans: ["Taxi hub (0.2 km)", "Westlands (5 km)", "CBD (10 km)"],
    ls: [
      { beds: 4, baths: 4, sqft: 2800, type: "4BR Townhouse",   rent: 390000, sale: 140000000, lt: "both" },
      { beds: 3, baths: 3, sqft: 2000, type: "3BR Townhouse",   rent: 260000, sale: 95000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 1300, type: "2BR Apartment",   rent: 160000, sale: 58000000,  lt: "both", fur: true },
    ],
  },
  {
    city: "Nairobi", area: "Loresho", tier: "premium",
    lat: -1.27, lon: 36.76, cbd: 11,
    sch: [{ n: "Loresho Primary", d: "0.6 km", t: "Primary" }, { n: "Braeburn Gitanga", d: "2 km", t: "International" }],
    hosp: [{ n: "Kikuyu Mission Hospital", d: "4 km" }, { n: "Nairobi Hospital", d: "6 km" }],
    mall: [{ n: "Westgate Mall", d: "4 km" }, { n: "Sarit Centre", d: "5 km" }],
    trans: ["Matatu to Westlands (0.5 km)", "Private driver area", "Taxi pickup (0.1 km)"],
    ls: [
      { beds: 5, baths: 5, sqft: 4000, type: "5BR Villa",       rent: 580000, sale: 200000000, lt: "both" },
      { beds: 4, baths: 4, sqft: 3000, type: "4BR Villa",       rent: 400000, sale: 150000000, lt: "both", pet: true },
      { beds: 3, baths: 3, sqft: 2000, type: "3BR Bungalow",    rent: 240000, sale: 90000000,  lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Kyuna", tier: "premium",
    lat: -1.265, lon: 36.75, cbd: 12,
    sch: [{ n: "Aga Khan Primary Westlands", d: "2 km", t: "International" }, { n: "KIGA School", d: "1 km", t: "Primary" }],
    hosp: [{ n: "MP Shah Hospital", d: "3.5 km" }, { n: "AAR Health", d: "2 km" }],
    mall: [{ n: "Sarit Centre", d: "3.5 km" }, { n: "Westgate", d: "4 km" }],
    trans: ["Private driver advised", "Matatu to Westlands (0.8 km)"],
    ls: [
      { beds: 5, baths: 5, sqft: 4500, type: "5BR Villa",       rent: 700000, sale: 245000000, lt: "both" },
      { beds: 4, baths: 4, sqft: 3200, type: "4BR Villa",       rent: 490000, sale: 175000000, lt: "both" },
      { beds: 3, baths: 3, sqft: 2100, type: "3BR Townhouse",   rent: 280000, sale: 100000000, lt: "both", fur: true },
    ],
  },

  // ════════════════════════════════════════
  //  NAIROBI — UPPER-MIDDLE
  // ════════════════════════════════════════
  {
    city: "Nairobi", area: "Westlands", tier: "middle",
    lat: -1.2676, lon: 36.8116, cbd: 5,
    sch: [{ n: "Westlands Primary", d: "0.4 km", t: "Primary" }, { n: "Braeburn School", d: "1.8 km", t: "International" }],
    hosp: [{ n: "Aga Khan Hospital", d: "1.2 km" }, { n: "MP Shah", d: "2 km" }],
    mall: [{ n: "Sarit Centre", d: "0.3 km" }, { n: "Westgate Mall", d: "0.8 km" }],
    trans: ["Westlands Bus Terminal (0.3 km)", "Matatu stage (0.1 km)", "Uber zone"],
    ls: [
      { beds: 3, baths: 3, sqft: 1400, type: "3BR Apartment",   rent: 160000, sale: 62000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 1000, type: "2BR Apartment",   rent: 95000,  sale: 38000000,  lt: "both", fur: true },
      { beds: 1, baths: 1, sqft: 600,  type: "1BR Apartment",   rent: 60000,  sale: 22000000,  lt: "both" },
      { beds: 0, baths: 1, sqft: 400,  type: "Studio",          rent: 38000,  sale: 0,          lt: "rent", fur: true },
    ],
  },
  {
    city: "Nairobi", area: "Kilimani", tier: "middle",
    lat: -1.2989, lon: 36.7928, cbd: 6,
    sch: [{ n: "Kilimani Primary", d: "0.6 km", t: "Primary" }, { n: "Nairobi School", d: "2 km", t: "Secondary" }],
    hosp: [{ n: "Nairobi Hospital", d: "1.8 km" }, { n: "MP Shah", d: "3 km" }],
    mall: [{ n: "Yaya Centre", d: "0.9 km" }, { n: "Prestige Plaza", d: "1.5 km" }],
    trans: ["Matatu 46 (0.2 km)", "Uber hub (0.1 km)", "Kilimani stage (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Apartment",   rent: 130000, sale: 52000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 900,  type: "2BR Apartment",   rent: 85000,  sale: 35000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 500,  type: "1BR Apartment",   rent: 50000,  sale: 19000000,  lt: "both" },
      { beds: 0, baths: 1, sqft: 380,  type: "Studio",          rent: 32000,  sale: 0,          lt: "rent", fur: true },
    ],
  },
  {
    city: "Nairobi", area: "Kileleshwa", tier: "middle",
    lat: -1.29, lon: 36.79, cbd: 7,
    sch: [{ n: "Kileleshwa Primary", d: "0.5 km", t: "Primary" }, { n: "St Mary's School", d: "1.5 km", t: "Boys National" }],
    hosp: [{ n: "Nairobi Hospital", d: "2.5 km" }, { n: "MP Shah", d: "2.8 km" }],
    mall: [{ n: "Yaya Centre", d: "1.5 km" }, { n: "Junction", d: "2 km" }],
    trans: ["Matatu to CBD (0.3 km)", "Taxi hub (0.2 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Apartment",   rent: 140000, sale: 56000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 950,  type: "2BR Apartment",   rent: 90000,  sale: 38000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 550,  type: "1BR Apartment",   rent: 55000,  sale: 20000000,  lt: "both" },
      { beds: 0, baths: 1, sqft: 350,  type: "Studio",          rent: 35000,  sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Parklands", tier: "middle",
    lat: -1.26, lon: 36.82, cbd: 5,
    sch: [{ n: "Aga Khan Primary Parklands", d: "0.4 km", t: "International" }, { n: "Westlands Primary", d: "1.5 km", t: "Primary" }],
    hosp: [{ n: "Aga Khan Hospital", d: "1.5 km" }, { n: "Nairobi West", d: "6 km" }],
    mall: [{ n: "Sarit Centre", d: "1 km" }, { n: "ABC Place", d: "0.7 km" }],
    trans: ["Matatu to CBD (0.2 km)", "Westlands Bus (0.4 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1250, type: "3BR Apartment",   rent: 125000, sale: 50000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 850,  type: "2BR Apartment",   rent: 80000,  sale: 33000000,  lt: "both", fur: true },
      { beds: 1, baths: 1, sqft: 500,  type: "1BR Apartment",   rent: 48000,  sale: 18000000,  lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Riverside", tier: "middle",
    lat: -1.28, lon: 36.81, cbd: 7,
    sch: [{ n: "Riverside Primary", d: "0.5 km", t: "Primary" }, { n: "Braeburn Gitanga", d: "2 km", t: "International" }],
    hosp: [{ n: "MP Shah", d: "2 km" }, { n: "Aga Khan", d: "2.5 km" }],
    mall: [{ n: "Sarit Centre", d: "2 km" }, { n: "Westgate", d: "2.5 km" }],
    trans: ["Matatu (0.3 km)", "Riverside Drive taxi (0.1 km)"],
    ls: [
      { beds: 3, baths: 3, sqft: 1500, type: "3BR Apartment",   rent: 150000, sale: 58000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 1000, type: "2BR Apartment",   rent: 95000,  sale: 37000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 580,  type: "1BR Apartment",   rent: 58000,  sale: 22000000,  lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Hurlingham", tier: "middle",
    lat: -1.30, lon: 36.80, cbd: 6,
    sch: [{ n: "Hurlingham Primary", d: "0.5 km", t: "Primary" }, { n: "Nairobi School", d: "2 km", t: "Boys National" }],
    hosp: [{ n: "Nairobi Hospital", d: "1.5 km" }, { n: "Karen Hospital", d: "8 km" }],
    mall: [{ n: "Prestige Plaza", d: "0.8 km" }, { n: "Yaya Centre", d: "1.2 km" }],
    trans: ["Matatu 46 (0.2 km)", "Argwings Kodhek stage (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Apartment",   rent: 120000, sale: 47000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 850,  type: "2BR Apartment",   rent: 78000,  sale: 31000000,  lt: "both", fur: true },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 45000,  sale: 17000000,  lt: "both" },
    ],
  },

  // ════════════════════════════════════════
  //  NAIROBI — MIDDLE CLASS
  // ════════════════════════════════════════
  {
    city: "Nairobi", area: "South C", tier: "middle",
    lat: -1.307, lon: 36.8236, cbd: 7.8,
    sch: [{ n: "South C Primary", d: "0.3 km", t: "Primary" }, { n: "Lang'ata Barracks", d: "0.8 km", t: "Primary" }],
    hosp: [{ n: "Lang'ata Hospital", d: "1.5 km" }, { n: "Nairobi South", d: "3.2 km" }],
    mall: [{ n: "Galleria Mall", d: "2 km" }, { n: "Junction Mall", d: "3.5 km" }],
    trans: ["Matatu 126 (0.1 km)", "South C Bus Stop (0.2 km)", "SGR Syokimau (8 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR House",       rent: 65000,  sale: 24000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 800,  type: "2BR Apartment",   rent: 38000,  sale: 14000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 24000,  sale: 9000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 300,  type: "Studio",          rent: 16000,  sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "South B", tier: "middle",
    lat: -1.30, lon: 36.83, cbd: 7,
    sch: [{ n: "South B Primary", d: "0.4 km", t: "Primary" }, { n: "Jamhuri High", d: "1 km", t: "Secondary" }],
    hosp: [{ n: "Nairobi South Hospital", d: "2 km" }, { n: "Mater Hospital", d: "3 km" }],
    mall: [{ n: "Haile Selassie Mall", d: "1.5 km" }, { n: "Nextgen Mall", d: "2 km" }],
    trans: ["Matatu 34 (0.1 km)", "South B stage (0.2 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1100, type: "3BR Apartment",   rent: 55000,  sale: 20000000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 750,  type: "2BR Apartment",   rent: 35000,  sale: 13000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 450,  type: "1BR Apartment",   rent: 22000,  sale: 8500000,   lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Donholm", tier: "middle",
    lat: -1.2992, lon: 36.8784, cbd: 12,
    sch: [{ n: "Donholm Primary", d: "0.4 km", t: "Primary" }, { n: "St Catherine's Girls", d: "1 km", t: "Girls Secondary" }],
    hosp: [{ n: "Mama Lucy Hospital", d: "2.8 km" }, { n: "Athi River Hospital", d: "12 km" }],
    mall: [{ n: "Savannah Mall", d: "1.2 km" }, { n: "Buruburu Centre", d: "2.4 km" }],
    trans: ["Matatu 38 (0.2 km)", "Donholm stage (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Maisonette",  rent: 55000,  sale: 20000000,  lt: "both", pet: true },
      { beds: 3, baths: 2, sqft: 1100, type: "3BR Apartment",   rent: 42000,  sale: 16000000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 780,  type: "2BR Apartment",   rent: 28000,  sale: 10500000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 450,  type: "1BR Apartment",   rent: 18000,  sale: 7000000,   lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Buruburu", tier: "middle",
    lat: -1.2959, lon: 36.8651, cbd: 11,
    sch: [{ n: "Buruburu Girls High", d: "0.6 km", t: "Girls National" }, { n: "Buruburu Primary", d: "0.4 km", t: "Primary" }],
    hosp: [{ n: "Mama Lucy Kibaki Hospital", d: "1.9 km" }, { n: "Aga Khan", d: "12 km" }],
    mall: [{ n: "Buruburu Centre", d: "0.5 km" }, { n: "Savannah Mall", d: "2 km" }],
    trans: ["Matatu 9 (0.1 km)", "Matatu 38 (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR House",       rent: 50000,  sale: 18000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 800,  type: "2BR Apartment",   rent: 30000,  sale: 11500000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 19000,  sale: 7500000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 280,  type: "Bedsitter",       rent: 10000,  sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Umoja", tier: "middle",
    lat: -1.2988, lon: 36.885, cbd: 12,
    sch: [{ n: "Umoja 1 Primary", d: "0.3 km", t: "Primary" }, { n: "Embakasi Girls", d: "1.5 km", t: "Girls Secondary" }],
    hosp: [{ n: "Mama Lucy Hospital", d: "4 km" }, { n: "AAR Embakasi", d: "3 km" }],
    mall: [{ n: "Savannah Mall", d: "1.5 km" }, { n: "Nextgen Mall", d: "3 km" }],
    trans: ["Matatu 9 (0.1 km)", "Umoja Stage (0.1 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1100, type: "3BR House",       rent: 35000,  sale: 13500000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 720,  type: "2BR Apartment",   rent: 24000,  sale: 9000000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 440,  type: "1BR Apartment",   rent: 15000,  sale: 6000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 280,  type: "Bedsitter",       rent: 8500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Kasarani", tier: "middle",
    lat: -1.2252, lon: 36.8993, cbd: 15,
    sch: [{ n: "Kasarani Primary", d: "0.5 km", t: "Primary" }, { n: "Mwiki Secondary", d: "1 km", t: "Secondary" }],
    hosp: [{ n: "Kasarani Sub-District Hospital", d: "1.8 km" }, { n: "Mathare North Health", d: "2.5 km" }],
    mall: [{ n: "Thika Road Mall (TRM)", d: "3 km" }, { n: "Garden City", d: "4.5 km" }],
    trans: ["Matatu 45 (0.1 km)", "Kasarani Stage (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1100, type: "3BR Apartment",   rent: 42000,  sale: 16000000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 780,  type: "2BR Apartment",   rent: 28000,  sale: 11000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 460,  type: "1BR Apartment",   rent: 18000,  sale: 7000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 280,  type: "Bedsitter",       rent: 9000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Roysambu", tier: "middle",
    lat: -1.22, lon: 36.87, cbd: 12,
    sch: [{ n: "Roysambu Primary", d: "0.3 km", t: "Primary" }, { n: "Githurai Girls", d: "2 km", t: "Girls Secondary" }],
    hosp: [{ n: "Roysambu Health Centre", d: "0.7 km" }, { n: "Thika Road Clinic", d: "1.5 km" }],
    mall: [{ n: "TRM", d: "2.5 km" }, { n: "Garden City", d: "3 km" }],
    trans: ["Matatu 106 (0.1 km)", "Roysambu stage (0.2 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 760,  type: "2BR Apartment",   rent: 26000,  sale: 10000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 450,  type: "1BR Apartment",   rent: 17000,  sale: 6500000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 280,  type: "Bedsitter",       rent: 9500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Ruaka", tier: "middle",
    lat: -1.2001, lon: 36.771, cbd: 17,
    sch: [{ n: "Ruaka Primary", d: "0.7 km", t: "Primary" }, { n: "Kiambu High", d: "3 km", t: "Secondary" }],
    hosp: [{ n: "Kiambu Level 5", d: "3 km" }, { n: "AAR Ruaka", d: "1 km" }],
    mall: [{ n: "Two Rivers Mall", d: "2.5 km" }, { n: "Rosslyn Riviera", d: "3 km" }],
    trans: ["Matatu 106 (0.2 km)", "Ruaka stage (0.3 km)", "Two Rivers shuttle"],
    ls: [
      { beds: 2, baths: 1, sqft: 720,  type: "2BR Apartment",   rent: 28000,  sale: 11000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 440,  type: "1BR Apartment",   rent: 18000,  sale: 7000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 280,  type: "Bedsitter",       rent: 10000,  sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Langata", tier: "middle",
    lat: -1.33, lon: 36.79, cbd: 12,
    sch: [{ n: "Nairobi West Primary", d: "0.5 km", t: "Primary" }, { n: "Langata Secondary", d: "1 km", t: "Secondary" }],
    hosp: [{ n: "Lang'ata Hospital", d: "1 km" }, { n: "Nairobi West", d: "2 km" }],
    mall: [{ n: "Galleria Mall", d: "1.5 km" }, { n: "Junction", d: "4 km" }],
    trans: ["Matatu 111 (0.2 km)", "Langata Rd Bus (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Maisonette",  rent: 55000,  sale: 20000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 820,  type: "2BR Apartment",   rent: 32000,  sale: 12000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 20000,  sale: 7800000,   lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Rongai", tier: "middle",
    lat: -1.3975, lon: 36.7539, cbd: 22,
    sch: [{ n: "Rongai Primary", d: "0.4 km", t: "Primary" }, { n: "Nazarene Secondary", d: "1.2 km", t: "Secondary" }],
    hosp: [{ n: "Rongai Sub-County Hospital", d: "1 km" }, { n: "Kajiado Hospital", d: "12 km" }],
    mall: [{ n: "Rongai Mall", d: "0.8 km" }, { n: "Galleria", d: "8 km" }],
    trans: ["Matatu 111 (0.1 km)", "Rongai stage (0.1 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Apartment",   rent: 42000,  sale: 16000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 750,  type: "2BR Apartment",   rent: 22000,  sale: 8500000,   lt: "both", pet: true },
      { beds: 1, baths: 1, sqft: 450,  type: "1BR Apartment",   rent: 14000,  sale: 5500000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 280,  type: "Bedsitter",       rent: 8000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Syokimau", tier: "middle",
    lat: -1.357, lon: 37.0006, cbd: 20,
    sch: [{ n: "Syokimau Primary", d: "0.6 km", t: "Primary" }, { n: "Kaloleni Secondary", d: "1.5 km", t: "Secondary" }],
    hosp: [{ n: "Nairobi South Hospital", d: "4 km" }, { n: "AAR Embakasi", d: "5 km" }],
    mall: [{ n: "Mlolongo Mall", d: "2 km" }, { n: "Nextgen", d: "5.5 km" }],
    trans: ["SGR Syokimau Station (0.5 km)", "Matatu stage (0.3 km)", "Airport (8 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1100, type: "3BR Apartment",   rent: 48000,  sale: 18500000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 850,  type: "2BR Apartment",   rent: 35000,  sale: 14000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 500,  type: "1BR Apartment",   rent: 22000,  sale: 8500000,   lt: "both" },
    ],
  },
  {
    city: "Nairobi", area: "Ngong", tier: "middle",
    lat: -1.3581, lon: 36.6579, cbd: 26,
    sch: [{ n: "Ngong Township Primary", d: "0.9 km", t: "Primary" }, { n: "Ngong Hills Secondary", d: "1.5 km", t: "Secondary" }],
    hosp: [{ n: "Ngong Sub-County Hospital", d: "1.2 km" }, { n: "AAR Ngong", d: "0.8 km" }],
    mall: [{ n: "Ngong Hills Mall", d: "1 km" }, { n: "Karen Shopping Centre", d: "8 km" }],
    trans: ["Matatu 111 (0.4 km)", "Ngong Stage (0.6 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1400, type: "3BR Townhouse",   rent: 48000,  sale: 18000000,  lt: "both", pet: true },
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Bungalow",    rent: 42000,  sale: 16000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 800,  type: "2BR Apartment",   rent: 26000,  sale: 10000000,  lt: "both" },
    ],
  },

  // ════════════════════════════════════════
  //  NAIROBI — BUDGET
  // ════════════════════════════════════════
  {
    city: "Nairobi", area: "Githurai", tier: "budget",
    lat: -1.1816, lon: 36.9145, cbd: 18,
    sch: [{ n: "Githurai Primary", d: "0.3 km", t: "Primary" }, { n: "Githurai Secondary", d: "0.8 km", t: "Secondary" }],
    hosp: [{ n: "Githurai Health Centre", d: "0.8 km" }, { n: "Thika Road Clinic", d: "2 km" }],
    mall: [{ n: "TRM", d: "4.5 km" }, { n: "Garden City", d: "5 km" }],
    trans: ["Matatu 45 (0.05 km)", "Githurai Stage (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 600,  type: "2BR Apartment",   rent: 14000,  sale: 5500000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 380,  type: "1BR Apartment",   rent: 10000,  sale: 4000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 240,  type: "Bedsitter",       rent: 6500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Ruiru", tier: "budget",
    lat: -1.1459, lon: 36.9608, cbd: 22,
    sch: [{ n: "Ruiru Primary", d: "0.5 km", t: "Primary" }, { n: "Ruiru Secondary", d: "1.2 km", t: "Secondary" }],
    hosp: [{ n: "Ruiru Sub-County Hospital", d: "1.2 km" }, { n: "AAR Ruiru", d: "0.8 km" }],
    mall: [{ n: "Ruiru Mall", d: "0.3 km" }, { n: "TRM", d: "10 km" }],
    trans: ["Matatu to Nairobi (0.2 km)", "Ruiru stage (0.2 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 620,  type: "2BR Apartment",   rent: 15000,  sale: 5800000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 400,  type: "1BR Apartment",   rent: 11000,  sale: 4200000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 240,  type: "Bedsitter",       rent: 7000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Imara Daima", tier: "budget",
    lat: -1.3238, lon: 36.8934, cbd: 13,
    sch: [{ n: "Imara Daima Primary", d: "0.4 km", t: "Primary" }, { n: "Our Lady of Mercy", d: "1 km", t: "Mixed" }],
    hosp: [{ n: "Mater Hospital", d: "3 km" }, { n: "AAR Embakasi", d: "2.5 km" }],
    mall: [{ n: "Nextgen Mall", d: "1.5 km" }, { n: "Haile Selassie Mall", d: "2 km" }],
    trans: ["Matatu 34 (0.1 km)", "Imara Daima Stage (0.2 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 700,  type: "2BR Apartment",   rent: 24000,  sale: 9200000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 430,  type: "1BR Apartment",   rent: 15000,  sale: 5800000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 260,  type: "Bedsitter",       rent: 9000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Kahawa West", tier: "budget",
    lat: -1.19, lon: 36.91, cbd: 17,
    sch: [{ n: "Kahawa West Primary", d: "0.4 km", t: "Primary" }, { n: "Kahawa Secondary", d: "0.9 km", t: "Secondary" }],
    hosp: [{ n: "Mathare North Health Centre", d: "2 km" }, { n: "Roysambu Clinic", d: "1.5 km" }],
    mall: [{ n: "TRM", d: "4 km" }, { n: "Garden City", d: "5 km" }],
    trans: ["Matatu 45 (0.1 km)", "Kahawa West Stage (0.2 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 640,  type: "2BR Apartment",   rent: 16000,  sale: 6200000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 400,  type: "1BR Apartment",   rent: 11000,  sale: 4300000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 250,  type: "Bedsitter",       rent: 7000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Kayole", tier: "budget",
    lat: -1.28, lon: 36.91, cbd: 13,
    sch: [{ n: "Kayole Primary", d: "0.3 km", t: "Primary" }, { n: "Kayole Secondary", d: "0.8 km", t: "Secondary" }],
    hosp: [{ n: "Kayole Health Centre", d: "0.5 km" }, { n: "Mama Lucy", d: "4 km" }],
    mall: [{ n: "Savannah Mall", d: "2 km" }, { n: "Nextgen", d: "3 km" }],
    trans: ["Matatu 9 (0.1 km)", "Kayole Stage (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 580,  type: "2BR Apartment",   rent: 13000,  sale: 5000000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 360,  type: "1BR Apartment",   rent: 9000,   sale: 3500000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 240,  type: "Bedsitter",       rent: 6000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Kitengela", tier: "budget",
    lat: -1.4757, lon: 36.9611, cbd: 30,
    sch: [{ n: "Kitengela Primary", d: "0.5 km", t: "Primary" }, { n: "Kitengela International", d: "1.8 km", t: "International" }],
    hosp: [{ n: "Kitengela Health Centre", d: "0.9 km" }, { n: "Athi River Hospital", d: "7 km" }],
    mall: [{ n: "Kitengela Mall", d: "0.7 km" }, { n: "Mlolongo Mall", d: "12 km" }],
    trans: ["SGR Athi River (5 km)", "Matatu to Nairobi (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Bungalow",    rent: 30000,  sale: 11500000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 720,  type: "2BR Apartment",   rent: 18000,  sale: 7000000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 430,  type: "1BR Apartment",   rent: 11000,  sale: 4300000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 260,  type: "Bedsitter",       rent: 7500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Juja", tier: "budget",
    lat: -1.105, lon: 37.015, cbd: 30,
    sch: [{ n: "Juja Primary", d: "0.5 km", t: "Primary" }, { n: "JKUAT (University)", d: "1 km", t: "University" }],
    hosp: [{ n: "Juja Farm Hospital", d: "1.5 km" }, { n: "Thika District", d: "8 km" }],
    mall: [{ n: "Juja City Mall", d: "1 km" }, { n: "Thika Greens", d: "10 km" }],
    trans: ["Matatu to Thika (0.2 km)", "Matatu to Nairobi (0.2 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 650,  type: "2BR Apartment",   rent: 16000,  sale: 6000000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 400,  type: "1BR Apartment",   rent: 11000,  sale: 4200000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 260,  type: "Bedsitter",       rent: 7000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Dandora", tier: "budget",
    lat: -1.25, lon: 36.91, cbd: 11,
    sch: [{ n: "Dandora Primary", d: "0.3 km", t: "Primary" }, { n: "Dandora Secondary", d: "0.7 km", t: "Secondary" }],
    hosp: [{ n: "Dandora Health Centre", d: "0.4 km" }, { n: "Mama Lucy", d: "5 km" }],
    mall: [{ n: "Savannah Mall", d: "2.5 km" }, { n: "TRM", d: "6 km" }],
    trans: ["Matatu 9 (0.1 km)", "Matatu 10 (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 560,  type: "2BR Apartment",   rent: 12000,  sale: 4800000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 350,  type: "1BR Apartment",   rent: 8500,   sale: 3400000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 230,  type: "Bedsitter",       rent: 5500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Mlolongo", tier: "budget",
    lat: -1.355, lon: 36.97, cbd: 18,
    sch: [{ n: "Mlolongo Primary", d: "0.4 km", t: "Primary" }, { n: "Syokimau Secondary", d: "2 km", t: "Secondary" }],
    hosp: [{ n: "Mlolongo Clinic", d: "0.5 km" }, { n: "Athi River Hospital", d: "6 km" }],
    mall: [{ n: "Mlolongo Mall", d: "0.5 km" }, { n: "Nextgen", d: "4 km" }],
    trans: ["SGR Syokimau (2 km)", "Matatu (0.2 km)", "Airport (10 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 620,  type: "2BR Apartment",   rent: 15000,  sale: 5800000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 400,  type: "1BR Apartment",   rent: 10000,  sale: 4000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 250,  type: "Bedsitter",       rent: 6500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nairobi", area: "Komarock", tier: "budget",
    lat: -1.285, lon: 36.895, cbd: 13,
    sch: [{ n: "Komarock Primary", d: "0.4 km", t: "Primary" }, { n: "Komarock High", d: "1 km", t: "Secondary" }],
    hosp: [{ n: "Komarock Health Centre", d: "0.6 km" }, { n: "Mama Lucy", d: "4 km" }],
    mall: [{ n: "Savannah Mall", d: "2 km" }, { n: "Buruburu Centre", d: "3 km" }],
    trans: ["Matatu 38 (0.1 km)", "Komarock Stage (0.2 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 600,  type: "2BR Apartment",   rent: 14000,  sale: 5500000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 380,  type: "1BR Apartment",   rent: 10000,  sale: 4000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 250,  type: "Bedsitter",       rent: 6500,   sale: 0,          lt: "rent" },
    ],
  },

  // ════════════════════════════════════════
  //  MOMBASA
  // ════════════════════════════════════════
  {
    city: "Mombasa", area: "Nyali", tier: "premium",
    lat: -4.0221, lon: 39.7162, cbd: 8,
    sch: [{ n: "Nyali International School", d: "1.5 km", t: "International" }, { n: "Mombasa Academy", d: "2 km", t: "International" }],
    hosp: [{ n: "Aga Khan Hospital Mombasa", d: "2.8 km" }, { n: "Pandya Hospital", d: "3.5 km" }],
    mall: [{ n: "City Mall Nyali", d: "0.6 km" }, { n: "Nyali Centre", d: "1 km" }],
    trans: ["Matatu to CBD (0.3 km)", "Tuktuk zone (0.1 km)", "Uber pickup"],
    ls: [
      { beds: 4, baths: 4, sqft: 2800, type: "4BR Beach Villa",  rent: 350000, sale: 130000000, lt: "both", fur: true },
      { beds: 3, baths: 3, sqft: 1800, type: "3BR Apartment",    rent: 180000, sale: 68000000,  lt: "both", fur: true },
      { beds: 2, baths: 2, sqft: 1100, type: "2BR Apartment",    rent: 100000, sale: 40000000,  lt: "both", fur: true },
      { beds: 1, baths: 1, sqft: 600,  type: "1BR Studio",       rent: 55000,  sale: 0,          lt: "rent", fur: true },
    ],
  },
  {
    city: "Mombasa", area: "Shanzu", tier: "premium",
    lat: -3.9699, lon: 39.7105, cbd: 15,
    sch: [{ n: "Shanzu Teachers College", d: "0.5 km", t: "College" }, { n: "Light Academy Mombasa", d: "3 km", t: "International" }],
    hosp: [{ n: "Shanzu Community Clinic", d: "1 km" }, { n: "Aga Khan Mombasa", d: "8 km" }],
    mall: [{ n: "City Mall Nyali", d: "5 km" }, { n: "Voyager area shops", d: "0.4 km" }],
    trans: ["Matatu (0.5 km)", "Shanzu stage (0.6 km)", "Uber pickup"],
    ls: [
      { beds: 4, baths: 4, sqft: 2500, type: "4BR Ocean Villa",  rent: 320000, sale: 120000000, lt: "both", fur: true, pet: true },
      { beds: 3, baths: 3, sqft: 1700, type: "3BR Villa",        rent: 180000, sale: 70000000,  lt: "both", fur: true },
      { beds: 2, baths: 2, sqft: 950,  type: "2BR Apartment",    rent: 90000,  sale: 35000000,  lt: "both" },
    ],
  },
  {
    city: "Mombasa", area: "Bamburi", tier: "middle",
    lat: -3.9958, lon: 39.7199, cbd: 12,
    sch: [{ n: "Bahari Beach Primary", d: "0.8 km", t: "Primary" }, { n: "Light Academy", d: "1.5 km", t: "International" }],
    hosp: [{ n: "Coast General Hospital", d: "6 km" }, { n: "Bamburi Dispensary", d: "0.8 km" }],
    mall: [{ n: "City Mall Nyali", d: "3 km" }, { n: "Bamburi Beach area", d: "0.3 km" }],
    trans: ["Matatu (0.2 km)", "Bamburi stage (0.4 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Apartment",   rent: 65000,  sale: 25000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 900,  type: "2BR Apartment",   rent: 45000,  sale: 17500000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 520,  type: "1BR Apartment",   rent: 28000,  sale: 11000000,  lt: "both" },
      { beds: 0, baths: 1, sqft: 320,  type: "Studio",          rent: 18000,  sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Mombasa", area: "Tudor", tier: "middle",
    lat: -4.04, lon: 39.69, cbd: 4,
    sch: [{ n: "Tudor Primary", d: "0.4 km", t: "Primary" }, { n: "Mombasa Boys High", d: "1.5 km", t: "Boys Secondary" }],
    hosp: [{ n: "Coast General", d: "2 km" }, { n: "Aga Khan Mombasa", d: "3 km" }],
    mall: [{ n: "Mtwapa Mall", d: "8 km" }, { n: "City Mall", d: "6 km" }],
    trans: ["Matatu (0.2 km)", "Tudor Ferry (1 km)", "Tuk-tuk zone"],
    ls: [
      { beds: 3, baths: 2, sqft: 1100, type: "3BR Apartment",   rent: 52000,  sale: 20000000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 800,  type: "2BR Apartment",   rent: 35000,  sale: 14000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 22000,  sale: 8500000,   lt: "both" },
    ],
  },
  {
    city: "Mombasa", area: "Kizingo", tier: "premium",
    lat: -4.05, lon: 39.67, cbd: 2,
    sch: [{ n: "Aga Khan Academy Mombasa", d: "0.8 km", t: "International" }, { n: "Serani Primary", d: "0.5 km", t: "Primary" }],
    hosp: [{ n: "Aga Khan Hospital", d: "1 km" }, { n: "Coast General", d: "1.5 km" }],
    mall: [{ n: "Nakumatt Mombasa", d: "1 km" }, { n: "City Centre shops", d: "0.5 km" }],
    trans: ["Ferry terminal (0.5 km)", "Matatu (0.2 km)", "Uber zone"],
    ls: [
      { beds: 4, baths: 4, sqft: 2800, type: "4BR Villa",       rent: 280000, sale: 105000000, lt: "both", fur: true },
      { beds: 3, baths: 3, sqft: 1900, type: "3BR Apartment",   rent: 160000, sale: 62000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 1200, type: "2BR Apartment",   rent: 95000,  sale: 38000000,  lt: "both", fur: true },
    ],
  },
  {
    city: "Mombasa", area: "Mtwapa", tier: "budget",
    lat: -3.9354, lon: 39.7396, cbd: 18,
    sch: [{ n: "Mtwapa Primary", d: "0.4 km", t: "Primary" }, { n: "Mtwapa Secondary", d: "1 km", t: "Secondary" }],
    hosp: [{ n: "Mtwapa Health Centre", d: "0.7 km" }, { n: "Bahari Hospital", d: "2 km" }],
    mall: [{ n: "Mtwapa Market", d: "0.3 km" }, { n: "City Mall Nyali", d: "10 km" }],
    trans: ["Matatu to Mombasa (0.2 km)", "Mtwapa stage (0.2 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 700,  type: "2BR Apartment",   rent: 20000,  sale: 8000000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 430,  type: "1BR Apartment",   rent: 13000,  sale: 5200000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 270,  type: "Bedsitter",       rent: 8000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Mombasa", area: "Kongowea", tier: "budget",
    lat: -4.01, lon: 39.71, cbd: 6,
    sch: [{ n: "Kongowea Primary", d: "0.3 km", t: "Primary" }, { n: "Coast Academy", d: "1.5 km", t: "Secondary" }],
    hosp: [{ n: "Kongowea Dispensary", d: "0.4 km" }, { n: "Aga Khan Mombasa", d: "5 km" }],
    mall: [{ n: "Nyali Centre", d: "2 km" }, { n: "City Mall", d: "3 km" }],
    trans: ["Matatu (0.1 km)", "Stage (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 600,  type: "2BR Apartment",   rent: 16000,  sale: 6200000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 380,  type: "1BR Apartment",   rent: 10500,  sale: 4000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 240,  type: "Bedsitter",       rent: 6500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Mombasa", area: "Diani", tier: "premium",
    lat: -4.31, lon: 39.57, cbd: 35,
    sch: [{ n: "Diani Beach School", d: "1 km", t: "International" }, { n: "Ukunda Primary", d: "2 km", t: "Primary" }],
    hosp: [{ n: "Diani Beach Hospital", d: "1.5 km" }, { n: "South Coast Hospital", d: "3 km" }],
    mall: [{ n: "Diani Beach Shopping Centre", d: "0.5 km" }, { n: "Four Nineteen Mall", d: "2 km" }],
    trans: ["Airport transfers", "Matatu Ukunda (1.5 km)", "Taxi zone"],
    ls: [
      { beds: 4, baths: 4, sqft: 3200, type: "4BR Beach Villa",  rent: 450000, sale: 165000000, lt: "both", fur: true, pet: true },
      { beds: 3, baths: 3, sqft: 2000, type: "3BR Cottage",      rent: 220000, sale: 85000000,  lt: "both", fur: true },
      { beds: 2, baths: 2, sqft: 1200, type: "2BR Apartment",    rent: 120000, sale: 46000000,  lt: "both", fur: true },
    ],
  },

  // ════════════════════════════════════════
  //  NAKURU
  // ════════════════════════════════════════
  {
    city: "Nakuru", area: "Milimani", tier: "middle",
    lat: -0.3031, lon: 36.08, cbd: 4,
    sch: [{ n: "Nakuru High School", d: "0.8 km", t: "National" }, { n: "Moi Girls Nakuru", d: "1.5 km", t: "Girls National" }],
    hosp: [{ n: "Nakuru Level 5 Hospital", d: "2 km" }, { n: "War Memorial Hospital", d: "3 km" }],
    mall: [{ n: "Westside Mall", d: "3 km" }, { n: "Nakuru Mall", d: "4 km" }],
    trans: ["Matatu to town (0.5 km)", "SGR Nakuru (6 km)"],
    ls: [
      { beds: 4, baths: 3, sqft: 2200, type: "4BR Bungalow",    rent: 85000,  sale: 32000000,  lt: "both", pet: true },
      { beds: 3, baths: 2, sqft: 1500, type: "3BR Bungalow",    rent: 58000,  sale: 22000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 900,  type: "2BR Apartment",   rent: 35000,  sale: 13500000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 540,  type: "1BR Apartment",   rent: 22000,  sale: 8500000,   lt: "both" },
    ],
  },
  {
    city: "Nakuru", area: "Section 58", tier: "budget",
    lat: -0.294, lon: 36.075, cbd: 6,
    sch: [{ n: "Section 58 Primary", d: "0.3 km", t: "Primary" }, { n: "Menengai Secondary", d: "1.5 km", t: "Secondary" }],
    hosp: [{ n: "Nakuru Town Clinic", d: "2 km" }, { n: "War Memorial", d: "3 km" }],
    mall: [{ n: "Nakuru Mall", d: "2.5 km" }, { n: "Westside", d: "3 km" }],
    trans: ["Matatu (0.1 km)", "Section 58 Stage (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 680,  type: "2BR Apartment",   rent: 18000,  sale: 6800000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 420,  type: "1BR Apartment",   rent: 12000,  sale: 4600000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 270,  type: "Bedsitter",       rent: 7500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nakuru", area: "Lanet", tier: "middle",
    lat: -0.27, lon: 36.10, cbd: 8,
    sch: [{ n: "Lanet Primary", d: "0.5 km", t: "Primary" }, { n: "Lanet Uasin Gishu", d: "1 km", t: "Secondary" }],
    hosp: [{ n: "Rift Valley Hospital", d: "5 km" }, { n: "Lanet Clinic", d: "0.5 km" }],
    mall: [{ n: "Westside", d: "6 km" }, { n: "Lanet Shopping Centre", d: "0.3 km" }],
    trans: ["Matatu to Nakuru (0.3 km)", "Kenya Army barracks nearby"],
    ls: [
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Bungalow",    rent: 45000,  sale: 17000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 800,  type: "2BR Apartment",   rent: 28000,  sale: 11000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 18000,  sale: 7000000,   lt: "both" },
    ],
  },
  {
    city: "Nakuru", area: "Pipeline", tier: "budget",
    lat: -0.32, lon: 36.09, cbd: 5,
    sch: [{ n: "Pipeline Primary", d: "0.4 km", t: "Primary" }, { n: "Nakuru Day Secondary", d: "1.5 km", t: "Secondary" }],
    hosp: [{ n: "Nakuru Level 5", d: "3 km" }, { n: "Pipeline Clinic", d: "0.5 km" }],
    mall: [{ n: "Nakuru Mall", d: "3 km" }, { n: "City centre", d: "4 km" }],
    trans: ["Matatu (0.1 km)", "Pipeline Stage (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 640,  type: "2BR Apartment",   rent: 15000,  sale: 5800000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 400,  type: "1BR Apartment",   rent: 10000,  sale: 4000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 250,  type: "Bedsitter",       rent: 6000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Nakuru", area: "Kaptembwa", tier: "budget",
    lat: -0.34, lon: 36.05, cbd: 8,
    sch: [{ n: "Kaptembwa Primary", d: "0.3 km", t: "Primary" }, { n: "Kaptembwa Secondary", d: "0.9 km", t: "Secondary" }],
    hosp: [{ n: "Kaptembwa Health Centre", d: "0.5 km" }, { n: "Nakuru Level 5", d: "5 km" }],
    mall: [{ n: "Westside Mall", d: "5 km" }, { n: "Local market (0.3 km)", d: "0.3 km" }],
    trans: ["Matatu (0.1 km)", "Kaptembwa Stage (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 580,  type: "2BR Apartment",   rent: 12000,  sale: 4600000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 360,  type: "1BR Apartment",   rent: 8500,   sale: 3300000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 230,  type: "Bedsitter",       rent: 5500,   sale: 0,          lt: "rent" },
    ],
  },

  // ════════════════════════════════════════
  //  KISUMU
  // ════════════════════════════════════════
  {
    city: "Kisumu", area: "Milimani", tier: "middle",
    lat: -0.0917, lon: 34.768, cbd: 5,
    sch: [{ n: "Kisumu Boys High", d: "1 km", t: "Boys National" }, { n: "Aga Khan Primary Kisumu", d: "2 km", t: "International" }],
    hosp: [{ n: "Jaramogi Teaching Hospital", d: "2.5 km" }, { n: "Aga Khan Kisumu", d: "1.8 km" }],
    mall: [{ n: "Mega City Mall", d: "3 km" }, { n: "Rabuor Shopping", d: "1.5 km" }],
    trans: ["Matatu to CBD (0.3 km)", "Ferry terminal (4 km)"],
    ls: [
      { beds: 4, baths: 3, sqft: 2000, type: "4BR Bungalow",    rent: 75000,  sale: 28000000,  lt: "both", pet: true },
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Apartment",   rent: 48000,  sale: 18000000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 800,  type: "2BR Apartment",   rent: 30000,  sale: 11500000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 18000,  sale: 7000000,   lt: "both" },
    ],
  },
  {
    city: "Kisumu", area: "Tom Mboya", tier: "middle",
    lat: -0.10, lon: 34.77, cbd: 4,
    sch: [{ n: "Tom Mboya Primary", d: "0.4 km", t: "Primary" }, { n: "St Albert's College", d: "1 km", t: "Mixed" }],
    hosp: [{ n: "Kisumu County Hospital", d: "1.5 km" }, { n: "Aga Khan", d: "2 km" }],
    mall: [{ n: "Mega City", d: "2 km" }, { n: "Kisumu town market", d: "0.5 km" }],
    trans: ["Matatu (0.2 km)", "Kisumu stage (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1100, type: "3BR Apartment",   rent: 38000,  sale: 14500000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 720,  type: "2BR Apartment",   rent: 24000,  sale: 9500000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 440,  type: "1BR Apartment",   rent: 15000,  sale: 5800000,   lt: "both" },
    ],
  },
  {
    city: "Kisumu", area: "Mamboleo", tier: "budget",
    lat: -0.077, lon: 34.808, cbd: 9,
    sch: [{ n: "Mamboleo Primary", d: "0.5 km", t: "Primary" }, { n: "Mamboleo Secondary", d: "1 km", t: "Secondary" }],
    hosp: [{ n: "Mamboleo Dispensary", d: "0.3 km" }, { n: "Kisumu County", d: "7 km" }],
    mall: [{ n: "Nakumatt Mega", d: "5 km" }, { n: "Local market", d: "0.2 km" }],
    trans: ["Matatu (0.1 km)", "Mamboleo junction (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 620,  type: "2BR Apartment",   rent: 14000,  sale: 5500000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 390,  type: "1BR Apartment",   rent: 9500,   sale: 3700000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 250,  type: "Bedsitter",       rent: 6000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Kisumu", area: "Nyalenda", tier: "budget",
    lat: -0.11, lon: 34.78, cbd: 5,
    sch: [{ n: "Nyalenda Primary", d: "0.3 km", t: "Primary" }, { n: "Obunga Secondary", d: "1.2 km", t: "Secondary" }],
    hosp: [{ n: "Nyalenda Health Centre", d: "0.4 km" }, { n: "Kisumu County", d: "3 km" }],
    mall: [{ n: "Kisumu town", d: "3 km" }, { n: "Local market", d: "0.2 km" }],
    trans: ["Matatu (0.1 km)", "Stage (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 560,  type: "2BR Apartment",   rent: 11000,  sale: 4200000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 350,  type: "1BR Apartment",   rent: 7500,   sale: 2900000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 230,  type: "Bedsitter",       rent: 5000,   sale: 0,          lt: "rent" },
    ],
  },

  // ════════════════════════════════════════
  //  ELDORET
  // ════════════════════════════════════════
  {
    city: "Eldoret", area: "Elgon View", tier: "premium",
    lat: 0.5219, lon: 35.2753, cbd: 5,
    sch: [{ n: "Eldoret International School", d: "1.2 km", t: "International" }, { n: "Moi University", d: "3.5 km", t: "University" }],
    hosp: [{ n: "Moi Teaching & Referral Hospital", d: "4 km" }, { n: "Eldoret Hospital", d: "2.5 km" }],
    mall: [{ n: "Westside Mall Eldoret", d: "2 km" }, { n: "Zion Mall", d: "3 km" }],
    trans: ["Matatu (0.4 km)", "Eldoret Airport (8 km)"],
    ls: [
      { beds: 4, baths: 3, sqft: 2200, type: "4BR Townhouse",   rent: 95000,  sale: 36000000,  lt: "both" },
      { beds: 3, baths: 2, sqft: 1600, type: "3BR Bungalow",    rent: 65000,  sale: 25000000,  lt: "both" },
      { beds: 2, baths: 2, sqft: 1100, type: "2BR Apartment",   rent: 40000,  sale: 15500000,  lt: "both" },
    ],
  },
  {
    city: "Eldoret", area: "Pioneer", tier: "middle",
    lat: 0.529, lon: 35.264, cbd: 8,
    sch: [{ n: "Pioneer Primary", d: "0.5 km", t: "Primary" }, { n: "Eldoret Day Secondary", d: "1.5 km", t: "Secondary" }],
    hosp: [{ n: "Eldoret Hospital", d: "3 km" }, { n: "Pioneer Clinic", d: "0.3 km" }],
    mall: [{ n: "Plateau Mall", d: "4 km" }, { n: "Pioneer market", d: "0.3 km" }],
    trans: ["Matatu (0.2 km)", "Pioneer stage (0.3 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Bungalow",    rent: 45000,  sale: 17000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 800,  type: "2BR Apartment",   rent: 28000,  sale: 11000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 18000,  sale: 7000000,   lt: "both" },
    ],
  },
  {
    city: "Eldoret", area: "Huruma", tier: "budget",
    lat: 0.51, lon: 35.27, cbd: 6,
    sch: [{ n: "Huruma Primary", d: "0.3 km", t: "Primary" }, { n: "Huruma Secondary", d: "0.8 km", t: "Secondary" }],
    hosp: [{ n: "Huruma Dispensary", d: "0.4 km" }, { n: "Moi Teaching Hospital", d: "5 km" }],
    mall: [{ n: "Westside Mall", d: "3 km" }, { n: "Local market", d: "0.2 km" }],
    trans: ["Matatu (0.1 km)", "Huruma stage (0.2 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 620,  type: "2BR Apartment",   rent: 15000,  sale: 5800000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 390,  type: "1BR Apartment",   rent: 10000,  sale: 4000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 250,  type: "Bedsitter",       rent: 6500,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Eldoret", area: "Langas", tier: "budget",
    lat: 0.535, lon: 35.295, cbd: 10,
    sch: [{ n: "Langas Primary", d: "0.4 km", t: "Primary" }, { n: "Langas Secondary", d: "1 km", t: "Secondary" }],
    hosp: [{ n: "Langas Health Centre", d: "0.5 km" }, { n: "Moi Teaching Hospital", d: "8 km" }],
    mall: [{ n: "Langas Shopping Centre", d: "0.3 km" }, { n: "Westside Mall", d: "7 km" }],
    trans: ["Matatu (0.1 km)", "Langas stage (0.1 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 580,  type: "2BR Apartment",   rent: 12000,  sale: 4600000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 360,  type: "1BR Apartment",   rent: 8500,   sale: 3300000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 230,  type: "Bedsitter",       rent: 5500,   sale: 0,          lt: "rent" },
    ],
  },

  // ════════════════════════════════════════
  //  OTHER TOWNS
  // ════════════════════════════════════════
  {
    city: "Thika", area: "Thika CBD", tier: "middle",
    lat: -1.0332, lon: 37.0695, cbd: 0,
    sch: [{ n: "Thika High School", d: "1.5 km", t: "National" }, { n: "Gertrude's Children's Hospital", d: "1.5 km", t: "Hospital-School" }],
    hosp: [{ n: "Thika District Hospital", d: "2 km" }, { n: "Gertrude's Hospital", d: "1.5 km" }],
    mall: [{ n: "Thika Greens Mall", d: "1 km" }, { n: "Blue Post Hotel area", d: "2 km" }],
    trans: ["Thika stage (0.3 km)", "Matatu to Nairobi (0.3 km)", "SGR planned"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Apartment",   rent: 42000,  sale: 16000000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 750,  type: "2BR Apartment",   rent: 26000,  sale: 10000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 450,  type: "1BR Apartment",   rent: 17000,  sale: 6500000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 280,  type: "Bedsitter",       rent: 9000,   sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Kiambu", area: "Kiambu Town", tier: "middle",
    lat: -1.1718, lon: 36.8357, cbd: 0,
    sch: [{ n: "Kiambu High School", d: "0.8 km", t: "National" }, { n: "Good Shepherd Academy", d: "1.2 km", t: "Primary" }],
    hosp: [{ n: "Kiambu Level 5 Hospital", d: "1 km" }, { n: "AAR Kiambu", d: "0.5 km" }],
    mall: [{ n: "Kiambu Shopping Centre", d: "0.5 km" }, { n: "Two Rivers (15 km)", d: "15 km" }],
    trans: ["Matatu to Nairobi (0.2 km)", "Kiambu stage (0.2 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Bungalow",    rent: 45000,  sale: 17000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 800,  type: "2BR Apartment",   rent: 28000,  sale: 11000000,  lt: "both" },
      { beds: 1, baths: 1, sqft: 480,  type: "1BR Apartment",   rent: 18000,  sale: 7000000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 280,  type: "Bedsitter",       rent: 10000,  sale: 0,          lt: "rent" },
    ],
  },
  {
    city: "Machakos", area: "Machakos Town", tier: "middle",
    lat: -1.5177, lon: 37.2634, cbd: 0,
    sch: [{ n: "Machakos High School", d: "0.8 km", t: "National" }, { n: "Our Lady of Mercy", d: "1 km", t: "Girls Secondary" }],
    hosp: [{ n: "Machakos Level 5 Hospital", d: "1.5 km" }, { n: "Mutua Hospital", d: "1 km" }],
    mall: [{ n: "Machakos Town Centre", d: "0.5 km" }, { n: "People's Park area", d: "1 km" }],
    trans: ["Machakos Country Bus (0.5 km)", "Matatu to Nairobi (0.5 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Bungalow",    rent: 38000,  sale: 14500000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 750,  type: "2BR Apartment",   rent: 24000,  sale: 9000000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 450,  type: "1BR Apartment",   rent: 15000,  sale: 5800000,   lt: "both" },
    ],
  },
  {
    city: "Naivasha", area: "Naivasha Town", tier: "middle",
    lat: -0.717, lon: 36.4312, cbd: 0,
    sch: [{ n: "Naivasha Primary", d: "0.6 km", t: "Primary" }, { n: "Naivasha Secondary", d: "1.2 km", t: "Secondary" }],
    hosp: [{ n: "Naivasha Sub-County Hospital", d: "1.5 km" }, { n: "Kenyatta National Satellite", d: "4 km" }],
    mall: [{ n: "Naivasha Shopping Centre", d: "0.4 km" }, { n: "Lake Naivasha Resort area", d: "3 km" }],
    trans: ["SGR Naivasha (3 km)", "Matatu to Nairobi (0.5 km)", "Matatu to Nakuru (0.5 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1300, type: "3BR Bungalow",    rent: 40000,  sale: 15000000,  lt: "both", pet: true },
      { beds: 2, baths: 1, sqft: 780,  type: "2BR Apartment",   rent: 25000,  sale: 9500000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 460,  type: "1BR Apartment",   rent: 16000,  sale: 6200000,   lt: "both" },
    ],
  },
  {
    city: "Nyeri", area: "Nyeri Town", tier: "middle",
    lat: -0.4167, lon: 36.95, cbd: 0,
    sch: [{ n: "Nyeri High School", d: "1 km", t: "National" }, { n: "Dedan Kimathi University", d: "2 km", t: "University" }],
    hosp: [{ n: "Nyeri County Teaching Hospital", d: "1.5 km" }, { n: "Consolata Hospital", d: "1 km" }],
    mall: [{ n: "Nyeri Town Centre", d: "0.5 km" }, { n: "Dedan Kimathi Mall area", d: "2 km" }],
    trans: ["Matatu to Nairobi (0.5 km)", "Nyeri stage (0.5 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Bungalow",    rent: 38000,  sale: 14000000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 750,  type: "2BR Apartment",   rent: 24000,  sale: 9000000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 450,  type: "1BR Apartment",   rent: 15000,  sale: 5600000,   lt: "both" },
    ],
  },
  {
    city: "Meru", area: "Meru Town", tier: "middle",
    lat: 0.0471, lon: 37.649, cbd: 0,
    sch: [{ n: "Meru School", d: "1 km", t: "National" }, { n: "St Theresa's Girls Meru", d: "1.5 km", t: "Girls National" }],
    hosp: [{ n: "Meru Level 5 Hospital", d: "2 km" }, { n: "Consolata Hospital Meru", d: "1 km" }],
    mall: [{ n: "Meru Town Centre", d: "0.5 km" }, { n: "Milimani Mall", d: "1.5 km" }],
    trans: ["Matatu to Nairobi (0.5 km)", "Meru stage (0.5 km)"],
    ls: [
      { beds: 3, baths: 2, sqft: 1200, type: "3BR Bungalow",    rent: 35000,  sale: 13500000,  lt: "both" },
      { beds: 2, baths: 1, sqft: 720,  type: "2BR Apartment",   rent: 22000,  sale: 8500000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 440,  type: "1BR Apartment",   rent: 14000,  sale: 5500000,   lt: "both" },
    ],
  },
  {
    city: "Kisii", area: "Kisii Town", tier: "budget",
    lat: -0.6817, lon: 34.7667, cbd: 0,
    sch: [{ n: "Kisii School", d: "0.8 km", t: "National" }, { n: "Nyabururu Girls", d: "1 km", t: "Girls National" }],
    hosp: [{ n: "Kisii Teaching & Referral Hospital", d: "1.5 km" }, { n: "Nyanza Clinic", d: "0.5 km" }],
    mall: [{ n: "Kisii Market", d: "0.3 km" }, { n: "Kisii Shopping Centre", d: "0.5 km" }],
    trans: ["Matatu to Kisumu (0.4 km)", "Matatu to Nairobi (0.4 km)"],
    ls: [
      { beds: 2, baths: 1, sqft: 680,  type: "2BR Apartment",   rent: 15000,  sale: 5800000,   lt: "both" },
      { beds: 1, baths: 1, sqft: 420,  type: "1BR Apartment",   rent: 10000,  sale: 3800000,   lt: "both" },
      { beds: 0, baths: 1, sqft: 260,  type: "Bedsitter",       rent: 6000,   sale: 0,          lt: "rent" },
    ],
  },
]

// ── Generator ─────────────────────────────────────────────────────────────────

function buildDescription(area: AreaSpec, spec: ListingSpec, estate: string): string {
  const forSale = spec.lt === "sale"
  const prefix = forSale ? "For sale — " : ""
  const tierAdj = area.tier === "premium" ? "luxuriously finished" : area.tier === "middle" ? "well-maintained" : "clean and affordable"
  const sch = area.sch[0]
  return (
    `${prefix}${tierAdj} ${spec.beds === 0 ? spec.type.toLowerCase() : `${spec.beds}-bedroom ${spec.type.toLowerCase()}`} ` +
    `in ${area.area}, ${area.city}. ${sch.n} is ${sch.d} away. ` +
    `${area.cbd > 0 ? `${area.cbd} km from CBD. ` : ""}` +
    `${spec.fur ? "Fully furnished and move-in ready. " : ""}` +
    `${spec.pet ? "Pets welcome. " : ""}` +
    `Quick access to ${area.mall[0].n} (${area.mall[0].d}).`
  )
}

function buildTags(area: AreaSpec, spec: ListingSpec): string[] {
  const tags: string[] = []
  if (spec.lt !== "rent") tags.push("For Sale")
  if (spec.lt !== "sale") tags.push("For Rent")
  if (spec.fur) tags.push("Furnished")
  if (spec.pet) tags.push("Pet Friendly")
  if (area.tier === "premium") tags.push("Premium")
  if (area.cbd > 20) tags.push("Suburban")
  if (area.mall[0].d.startsWith("0.")) tags.push("Near Mall")
  return tags.slice(0, 3)
}

function generate(): Property[] {
  const result: Property[] = []
  let id = 1

  for (const area of AREAS) {
    let li = 0
    for (const spec of area.ls) {
      const seed = id * 31
      const suffix = SUFFIXES[pr(seed, SUFFIXES.length)]
      const estate = `${area.area} ${suffix}`

      // Hero: unique exterior per property using id as primary index
      const extPool = EXT[area.tier]
      const heroImg = extPool[(id - 1) % extPool.length]

      // Gallery: 4 unique interior shots, offset differently per property
      const galOffset = (id * 7) % INT.length
      const extras: string[] = []
      for (let g = 0; g < 5; g++) {
        const candidate = INT[(galOffset + g * 4) % INT.length]
        if (candidate !== heroImg && !extras.includes(candidate)) extras.push(candidate)
      }
      // Also add a second exterior (different from hero) for variety
      const secondExt = extPool[(id) % extPool.length]
      if (secondExt !== heroImg) extras.unshift(secondExt)

      const rentKES = spec.rent
      const rentUSD = Math.round(rentKES / 130 / 10) * 10
      const saleKES = spec.sale > 0 ? spec.sale : undefined
      const saleUSD = saleKES ? Math.round(saleKES / 130 / 100) * 100 : undefined

      const verifiedChance = area.tier === "premium" ? 0.8 : area.tier === "middle" ? 0.65 : 0.5
      const verified = pr(seed + 9, 100) < verifiedChance * 100

      const replyTimes = area.tier === "premium"
        ? ["< 1 hr", "< 1 hr", "< 2 hrs"]
        : area.tier === "middle"
          ? ["< 1 hr", "< 2 hrs", "< 3 hrs", "< 4 hrs"]
          : ["< 2 hrs", "< 4 hrs", "< 1 day", "< 1 day"]

      const parking = spec.beds === 0 ? 0 : spec.beds >= 4 ? 3 : spec.beds >= 3 ? 2 : 1

      const prop: Property = {
        id: id++,
        city: area.city,
        area: area.area,
        estate,
        type: spec.type,
        tier: area.tier,
        listingType: spec.lt,
        beds: spec.beds,
        baths: spec.baths,
        sqft: spec.sqft,
        rentKES,
        rentUSD,
        salePriceKES: saleKES,
        salePriceUSD: saleUSD,
        verified,
        replyTime: replyTimes[pr(seed + 10, replyTimes.length)],
        img: heroImg,
        images: [heroImg, ...extras.slice(0, 5)],
        amenities: pickAmenities(area.tier, seed + 11),
        lat: area.lat + (pr(seed + 20, 100) - 50) * 0.0001,
        lon: area.lon + (pr(seed + 21, 100) - 50) * 0.0001,
        distanceToCBD: area.cbd,
        nearbySchools: area.sch.map((s) => ({ name: s.n, distance: s.d, type: s.t })),
        nearbyHospitals: area.hosp.map((h) => ({ name: h.n, distance: h.d })),
        nearbyMalls: area.mall.map((m) => ({ name: m.n, distance: m.d })),
        nearbyTransport: area.trans,
        description: buildDescription(area, spec, estate),
        landlordName: LANDLORDS[(id + li) % LANDLORDS.length],
        availableFrom: DATES[pr(seed + 30, DATES.length)],
        petFriendly: spec.pet === true || pr(seed + 40, 100) < (area.tier === "premium" ? 55 : area.tier === "middle" ? 40 : 25),
        furnished: spec.fur === true || pr(seed + 41, 100) < (area.tier === "premium" ? 50 : area.tier === "middle" ? 20 : 8),
        parkingSpots: parking,
        tags: buildTags(area, spec),
      }

      result.push(prop)
      li++
    }
  }
  return result
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const PROPERTIES: Property[] = generate()

export const CITIES = [
  "All", "Nairobi", "Mombasa", "Nakuru", "Kisumu",
  "Eldoret", "Thika", "Kiambu", "Machakos", "Naivasha", "Nyeri", "Meru", "Kisii",
]

export const LISTING_TYPES = ["All", "For Rent", "For Sale"]
export const TIERS = ["All Tiers", "budget", "middle", "premium"]
export const PREMIUM_AREAS = ["Gigiri", "Muthaiga", "Runda", "Karen", "Lavington", "Spring Valley", "Loresho", "Kyuna"]
export const _VERSION = 2
