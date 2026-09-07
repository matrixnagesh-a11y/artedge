import {
  Entity,
  CompetitorComparison,
  MentionItem,
  MentionComment,
  IPScanNode,
  LeadItem,
  CrisisIncident,
  CampaignPlan,
  CompetitiveRecommendation,
  PlatformSource,
  SentimentClass,
  EmotionClass,
  SentimentTrafficLight,
} from "@/types";

export interface ReplenishParams {
  brandName: string;
  industry?: string;
  competitorNames?: string[];
  isSingleEntity?: boolean;
  prompt?: string;
  region?: string;
  location?: string;
  sourceChannels?: string[];
  customSourceUrls?: string[];
  entityType?: "company" | "individual";
  saveCurrentProject?: boolean;
}

// Preset industry templates for corporate company context
const INDUSTRY_PRESETS: { [key: string]: { keywords: string[]; aspects: string[]; commonCompetitors: string[] } } = {
  banking: {
    keywords: ["mobile app", "MAE", "downtime", "transaction fee", "customer service", "dividend", "SME loan", "credit card cashback", "scam alert", "fraud protection"],
    aspects: ["Digital Banking App", "Customer Support", "Fees & Interest Rates", "Security & Fraud Defense", "Branch Experience"],
    commonCompetitors: ["AmBank Group", "CIMB Regional", "Public Bank Bhd", "RHB Financial", "Hong Leong Bank"],
  },
  automotive: {
    keywords: ["EV charging", "battery range", "waiting list", "after-sales service", "spare parts", "test drive", "software update", "build quality", "pricing", "trade-in"],
    aspects: ["Battery Range & Performance", "After-Sales & Warranty", "Charging Infrastructure", "Cabin Build Quality", "Resale Value"],
    commonCompetitors: ["BYD Auto", "Proton e.MAS", "Smart Malaysia", "Hyundai Ioniq", "BMW iX"],
  },
  telecom: {
    keywords: ["5G coverage", "network drop", "unlimited data", "roaming speed", "fiber home internet", "billing dispute", "customer care line", "eSIM activation"],
    aspects: ["5G & 4G Coverage", "Network Latency", "Pricing & Roaming", "Customer Care Response", "Fiber Reliability"],
    commonCompetitors: ["Maxis Postpaid", "CelcomDigi Hub", "U Mobile 5G", "Unifi Mobile", "Yoodo"],
  },
  aviation: {
    keywords: ["flight delay", "refund process", "baggage handling", "seat comfort", "in-flight meal", "cabin crew hospitality", "airfare promo", "loyalty points"],
    aspects: ["On-Time Departure", "Ticket Pricing & Promos", "Customer Refund Portal", "Cabin Experience", "Baggage Service"],
    commonCompetitors: ["Malaysia Airlines", "Singapore Airlines", "Batik Air", "Scoot Aviation", "Cathay Pacific"],
  },
  ecommerce: {
    keywords: ["delivery delay", "seller rating", "voucher discount", "free shipping threshold", "return refund dispute", "live shopping", "fake product", "courier service"],
    aspects: ["Delivery Speed & Tracking", "Voucher & Discount Transparency", "Return/Refund Experience", "Counterfeit Protection", "Seller Support"],
    commonCompetitors: ["Lazada ASEAN", "TikTok Shop MY", "Zalora Fashion", "Shopee Regional", "PG Mall"],
  },
  tech: {
    keywords: ["API uptime", "cloud latency", "enterprise SLA", "security compliance", "user dashboard", "billing transparency", "AI accuracy", "developer documentation"],
    aspects: ["Platform Reliability & Uptime", "AI Model Accuracy", "Enterprise Security & PDPA", "Customer Success Team", "Developer Docs & APIs"],
    commonCompetitors: ["OmniPulse Cloud", "GlobalEdge AI", "Sovereign AI Labs", "InfraEdge Solutions", "DataCore Asia"],
  },
};

// Preset templates for individual / executive / public figure comparison
const INDIVIDUAL_PRESETS: { [key: string]: { keywords: string[]; aspects: string[]; commonCompetitors: { name: string; role: string; avatar: string }[] } } = {
  global_diplomacy: {
    keywords: [
      "multilateral diplomacy",
      "economic stability",
      "industrial modernization",
      "international summits",
      "trade policy",
      "geopolitical influence",
      "citizen welfare",
      "sustainable green development",
    ],
    aspects: [
      "Global Standing & Diplomatic Influence",
      "Domestic Development & Citizen Welfare",
      "International Mindshare & Share of Voice",
      "Statesmanship & Governance Credibility",
      "Strategic Vision & Modernization Delivery",
    ],
    commonCompetitors: [
      { name: "Joe Biden", role: "President, United States", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
      { name: "Narendra Modi", role: "Prime Minister, India", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
      { name: "Emmanuel Macron", role: "President, France", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
      { name: "Anwar Ibrahim", role: "Prime Minister, Malaysia", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" },
      { name: "Keir Starmer", role: "Prime Minister, United Kingdom", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
    ],
  },
  politics: {
    keywords: ["local standing", "public support", "popularity", "public status", "service to society", "constituency development", "silk weavers welfare", "irrigation projects"],
    aspects: [
      "Local Standing & Ground Influence",
      "Support to Public & Accessibility",
      "Popularity & Share of Voice",
      "Public Status & Leadership Credibility",
      "Service to Society & Constituency Work",
    ],
    commonCompetitors: [
      { name: "Nikhil Kumaraswamy", role: "JD(S) Youth Leader & Contestant", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
      { name: "C.P. Yogeshwara", role: "Senior Contestant & Former Minister", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
      { name: "D.K. Suresh", role: "Congress Leader & Former MP", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
      { name: "H.D. Kumaraswamy", role: "Union Minister & Former CM", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" },
      { name: "A. Manjunath", role: "Regional Political Figure", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
    ],
  },
  executive: {
    keywords: ["leadership credibility", "public standing", "popularity", "service to society", "strategic vision", "media admiration"],
    aspects: [
      "Local Standing & Industry Influence",
      "Support to Public & Citizen Accessibility",
      "Popularity & Media Share of Voice",
      "Public Status & Executive Reputation",
      "Service to Society & CSR Initiatives",
    ],
    commonCompetitors: [
      { name: "Satya Nadella", role: "CEO, Microsoft", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
      { name: "Sundar Pichai", role: "CEO, Alphabet & Google", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
      { name: "Tim Cook", role: "CEO, Apple", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
      { name: "Jensen Huang", role: "CEO, NVIDIA", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" },
      { name: "Sam Altman", role: "CEO, OpenAI", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
    ],
  },
  tech_leader: {
    keywords: ["developer popularity", "open source contribution", "industry stature", "public standing", "service to community", "AI ethics"],
    aspects: [
      "Local & Global Standing",
      "Developer Support & Accessibility",
      "Popularity & Public Mindshare",
      "Public Status & Tech Stature",
      "Service to Society & Open Innovation",
    ],
    commonCompetitors: [
      { name: "Elon Musk", role: "CEO, Tesla & xAI", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80" },
      { name: "Sundar Pichai", role: "CEO, Alphabet & Google", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
      { name: "Satya Nadella", role: "CEO, Microsoft", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
      { name: "Jensen Huang", role: "CEO, NVIDIA", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
      { name: "Sam Altman", role: "CEO, OpenAI", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" },
    ],
  },
};

export function generateReplenishedDataset(params: ReplenishParams) {
  const isIndividual = params.entityType === "individual";
  const brand = params.brandName.trim() || (isIndividual ? "Xi Jinping" : "Maybank");
  const prompt = params.prompt?.trim() || "";
  const region = params.region || (isIndividual ? "China / ASEAN" : "Malaysia");

  // Determine industry / role preset
  let detectedIndustry = params.industry?.toLowerCase() || (isIndividual ? "global_diplomacy" : "banking");
  const promptLower = `${params.industry || ""} ${prompt} ${brand} ${region}`.toLowerCase();

  if (isIndividual) {
    if (
      promptLower.includes("ramanagara") ||
      promptLower.includes("channapatna") ||
      promptLower.includes("nikhil") ||
      promptLower.includes("kumaraswamy") ||
      promptLower.includes("karnataka")
    ) {
      detectedIndustry = "politics";
    } else if (
      promptLower.includes("tech") ||
      promptLower.includes("ai") ||
      promptLower.includes("musk") ||
      promptLower.includes("software") ||
      promptLower.includes("satya") ||
      promptLower.includes("pichai") ||
      promptLower.includes("nadella") ||
      promptLower.includes("huang")
    ) {
      detectedIndustry = "tech_leader";
    } else {
      // Default for national/global figures, statesmen, heads of state (Xi Jinping, etc.)
      detectedIndustry = "global_diplomacy";
    }
  } else {
    if (promptLower.includes("bank") || promptLower.includes("fintech") || promptLower.includes("finance") || promptLower.includes("loan") || promptLower.includes("card")) {
      detectedIndustry = "banking";
    } else if (promptLower.includes("car") || promptLower.includes("ev") || promptLower.includes("auto") || promptLower.includes("motor") || promptLower.includes("vehicle") || promptLower.includes("tesla") || promptLower.includes("byd")) {
      detectedIndustry = "automotive";
    } else if (promptLower.includes("telco") || promptLower.includes("5g") || promptLower.includes("phone") || promptLower.includes("data") || promptLower.includes("network") || promptLower.includes("celcom") || promptLower.includes("maxis")) {
      detectedIndustry = "telecom";
    } else if (promptLower.includes("flight") || promptLower.includes("airline") || promptLower.includes("aviation") || promptLower.includes("airasia") || promptLower.includes("travel")) {
      detectedIndustry = "aviation";
    } else if (promptLower.includes("shop") || promptLower.includes("e-commerce") || promptLower.includes("ecommerce") || promptLower.includes("retail") || promptLower.includes("shopee") || promptLower.includes("lazada")) {
      detectedIndustry = "ecommerce";
    }
  }

  const preset = INDUSTRY_PRESETS[detectedIndustry] || INDUSTRY_PRESETS.banking;
  const individualPreset = INDIVIDUAL_PRESETS[detectedIndustry] || INDIVIDUAL_PRESETS.politics;

  const isSingle =
    params.isSingleEntity === true ||
    (params.competitorNames !== undefined && params.competitorNames.length === 0) ||
    (isIndividual && (!params.competitorNames || params.competitorNames.length === 0));

  let rawCompNames: string[] = [];
  if (!isSingle && params.competitorNames && params.competitorNames.length > 0) {
    rawCompNames = params.competitorNames
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.toLowerCase() !== brand.toLowerCase());
  }

  const finalCompNames: string[] = [];
  if (!isSingle && rawCompNames.length > 0) {
    for (const name of rawCompNames) {
      if (!finalCompNames.includes(name) && name.toLowerCase() !== brand.toLowerCase()) {
        finalCompNames.push(name);
      }
      if (finalCompNames.length >= 4) break;
    }
  } else if (!isSingle && params.competitorNames === undefined && !isIndividual) {
    // Only corporate company scans fall back to industry competitor presets when unspecified
    const fallbackList: string[] = preset.commonCompetitors;
    for (const fb of fallbackList) {
      if (finalCompNames.length >= 4) break;
      if (!finalCompNames.includes(fb) && fb.toLowerCase() !== brand.toLowerCase()) {
        finalCompNames.push(fb);
      }
    }
  }

  // Dynamic Share of Voice distribution
  let primarySov = 100.0;
  let peerSovs: number[] = [];

  if (finalCompNames.length === 1) {
    primarySov = 58.0;
    peerSovs = [42.0];
  } else if (finalCompNames.length === 2) {
    primarySov = 46.0;
    peerSovs = [32.0, 22.0];
  } else if (finalCompNames.length === 3) {
    primarySov = 40.0;
    peerSovs = [28.0, 20.0, 12.0];
  } else if (finalCompNames.length >= 4) {
    primarySov = 38.4;
    peerSovs = [26.2, 17.5, 11.4, 6.5];
  }

  let competitors: CompetitorComparison[] = [];

  if (isIndividual) {
    const individualPreset = INDIVIDUAL_PRESETS[detectedIndustry] || INDIVIDUAL_PRESETS.executive;
    competitors = [
      {
        id: "comp-primary",
        name: `${brand} (Primary)`,
        isPrimary: true,
        entityType: "individual",
        titleOrRole: "Primary Candidate & Monitored Leader",
        metrics: {
          mentionVolume: finalCompNames.length === 0 ? 21500 : 14820,
          shareOfVoicePercent: primarySov,
          reach: finalCompNames.length === 0 ? 3200000 : 2450000,
          engagementRate: 5.6,
          sentimentScore: 86.2,
          reputationRiskScore: 16.4,
          credibilityIndex: 95.8,
          leadIntentCount: 184,
          brandVisibilityIndex: 91.2,
          competitiveEdgeScore: 93.0,
        },
        individualPillars: {
          localStanding: 94,
          publicSupport: 91,
          popularity: 95,
          publicStatus: 92,
          serviceToSociety: 96,
          constituencyFocus:
            detectedIndustry === "global_diplomacy"
              ? "Bilateral diplomatic relations, multilateral economic corridors, domestic modernization, regional stability & industrial green transition"
              : detectedIndustry === "tech_leader"
              ? "Enterprise cloud infrastructure, sovereign AI development, developer platform openness & global cybersecurity governance"
              : promptLower.includes("ramanagara") || promptLower.includes("karnataka")
              ? "Ramanagara silk weaver subsidies, Kanakapura-Channapatna irrigation lift, road connectivity & youth employment centers"
              : "Strategic policy execution, community welfare advancement, institutional transparency & civic representation",
        },
        radarScores: {
          visibility: 94,
          engagement: 91,
          sentiment: 95,
          content: 92,
          reputation: 96,
          localStanding: 94,
          publicSupport: 91,
          popularity: 95,
          publicStatus: 92,
          serviceToSociety: 96,
        },
        postingFrequency: 18,
        topTopics: individualPreset.keywords.slice(0, 4),
      },
      ...finalCompNames.map((peerName, idx): CompetitorComparison => {
        const sov = peerSovs[idx] || 15.0;
        const sentList = [78.4, 82.0, 71.5, 68.0];
        const riskList = [24.0, 18.5, 36.0, 42.0];
        const localStandingList = [88, 85, 79, 74];
        const publicSupportList = [82, 86, 75, 71];
        const popularityList = [84, 80, 73, 69];
        const publicStatusList = [89, 87, 78, 72];
        const serviceToSocietyList = [85, 83, 76, 70];
        const focusList =
          detectedIndustry === "global_diplomacy"
            ? [
                "Bilateral trade treaties, diplomatic summit engagement & international economic partnerships",
                "National modernization initiatives, green industrial transition & digital economy governance",
                "Multilateral security dialogues, supply chain resilience & regional trade corridors",
                "Domestic public welfare programs, high-speed transit networks & provincial infrastructure",
              ]
            : detectedIndustry === "tech_leader"
            ? [
                "Enterprise AI governance, cloud ecosystem expansion & developer tooling",
                "Autonomous systems research, sovereign data protection & platform integrity",
                "Semiconductor hardware supply lines, edge computing rollout & venture incubation",
                "Open source standards advocacy, digital privacy compliance & tech ethics council",
              ]
            : promptLower.includes("ramanagara") || promptLower.includes("karnataka")
            ? [
                "Senior leadership experience, Channapatna tank filling scheme & party apparatus mobilization",
                "Bangalore Rural developmental projects, guarantee scheme advocacy & constituency camps",
                "Union Heavy Industries & Steel policymaking, regional agrarian backing & state leadership",
                "Local grassroots organization, municipal ward representation & community outreach",
              ]
            : [
                "Senior administrative experience, regional developmental advocacy & organizational mobilization",
                "Public infrastructure projects, citizen guarantee schemes & community townhalls",
                "National strategic committee representation, regional industrial backing & public leadership",
                "Civic grassroots organization, district representation & community engagement",
              ];

        return {
          id: `comp-ind-${idx + 1}`,
          name: peerName,
          isPrimary: false,
          entityType: "individual",
          titleOrRole: "Peer Leader & Candidate",
          metrics: {
            mentionVolume: Math.round(14820 * (sov / 38.4)),
            shareOfVoicePercent: sov,
            reach: Math.round(2450000 * (sov / 38.4)),
            engagementRate: Number((4.1 + idx * 0.3).toFixed(1)),
            sentimentScore: sentList[idx] || 72.0,
            reputationRiskScore: riskList[idx] || 25.0,
            credibilityIndex: Number((93.0 - idx * 3.0).toFixed(1)),
            leadIntentCount: Math.round(184 * (sov / 38.4)),
            brandVisibilityIndex: Number((82.0 - idx * 5.0).toFixed(1)),
            competitiveEdgeScore: Number((78.0 - idx * 4.5).toFixed(1)),
          },
          individualPillars: {
            localStanding: localStandingList[idx] || 75,
            publicSupport: publicSupportList[idx] || 75,
            popularity: popularityList[idx] || 75,
            publicStatus: publicStatusList[idx] || 75,
            serviceToSociety: serviceToSocietyList[idx] || 75,
            constituencyFocus: focusList[idx] || "Constituency welfare and public meetings",
          },
          radarScores: {
            visibility: localStandingList[idx] || 75,
            engagement: publicSupportList[idx] || 75,
            sentiment: popularityList[idx] || 75,
            content: publicStatusList[idx] || 75,
            reputation: serviceToSocietyList[idx] || 75,
            localStanding: localStandingList[idx] || 75,
            publicSupport: publicSupportList[idx] || 75,
            popularity: popularityList[idx] || 75,
            publicStatus: publicStatusList[idx] || 75,
            serviceToSociety: serviceToSocietyList[idx] || 75,
          },
          postingFrequency: Math.max(4, 15 - idx * 3),
          topTopics: individualPreset.keywords.slice(idx, idx + 3),
        };
      }),
    ];
  } else {
    competitors = [
      {
        id: "comp-primary",
        name: `${brand} (Primary)`,
        isPrimary: true,
        entityType: "company",
        titleOrRole: "Enterprise Brand",
        metrics: {
          mentionVolume: finalCompNames.length === 0 ? 24500 : 18450,
          shareOfVoicePercent: primarySov,
          reach: finalCompNames.length === 0 ? 2500000 : 1850000,
          engagementRate: 4.8,
          sentimentScore: 84.5,
          reputationRiskScore: 18.2,
          credibilityIndex: 94.6,
          leadIntentCount: 312,
          brandVisibilityIndex: 88.4,
          competitiveEdgeScore: 91.2,
        },
        radarScores: {
          visibility: 88,
          engagement: 84,
          sentiment: 85,
          content: 90,
          reputation: 92,
        },
        postingFrequency: 14,
        topTopics: preset.keywords.slice(0, 4),
      },
      ...finalCompNames.map((name, idx): CompetitorComparison => {
        const sov = peerSovs[idx] || 15.0;
        const sentList = [68.0, 74.2, 59.5, 62.0];
        const riskList = [34.0, 22.5, 48.0, 39.2];
        return {
          id: `comp-${idx + 1}`,
          name: name,
          isPrimary: false,
          entityType: "company",
          titleOrRole: "Direct Competitor",
          metrics: {
            mentionVolume: Math.round(18450 * (sov / 36.8)),
            shareOfVoicePercent: sov,
            reach: Math.round(1850000 * (sov / 36.8)),
            engagementRate: Number((3.2 + idx * 0.4).toFixed(1)),
            sentimentScore: sentList[idx] || 70.0,
            reputationRiskScore: riskList[idx] || 25.0,
            credibilityIndex: Number((91.0 - idx * 3.5).toFixed(1)),
            leadIntentCount: Math.round(312 * (sov / 36.8)),
            brandVisibilityIndex: Number((76.0 - idx * 6.0).toFixed(1)),
            competitiveEdgeScore: Number((72.0 - idx * 5.5).toFixed(1)),
          },
          radarScores: {
            visibility: Math.round(78 - idx * 7),
            engagement: Math.round(72 - idx * 5),
            sentiment: Math.round(sentList[idx] || 65),
            content: Math.round(74 - idx * 4),
            reputation: Math.round(80 - idx * 6),
          },
          postingFrequency: Math.max(3, 12 - idx * 2),
          topTopics: preset.keywords.slice(idx, idx + 3),
        };
      }),
    ];
  }

  const compNames = competitors.filter((c) => !c.isPrimary).map((c) => c.name);

  // Geographic pool tailored to context
  const isKarnatakaPolitics =
    (isIndividual && detectedIndustry === "politics") ||
    promptLower.includes("ramanagara") ||
    promptLower.includes("karnataka") ||
    promptLower.includes("channapatna");

  const geoPool = isKarnatakaPolitics
    ? [
        { ip: "49.207.180.22", city: "Ramanagara", region: "Karnataka", isp: "Airtel Broadband", lat: 12.7209, lng: 77.2799, country: "India", countryCode: "IN" },
        { ip: "106.51.72.10", city: "Channapatna", region: "Karnataka", isp: "Jio Fiber", lat: 12.6518, lng: 77.2064, country: "India", countryCode: "IN" },
        { ip: "117.216.40.85", city: "Magadi", region: "Karnataka", isp: "BSNL Broadband", lat: 12.9567, lng: 77.2281, country: "India", countryCode: "IN" },
        { ip: "157.48.90.14", city: "Kanakapura", region: "Karnataka", isp: "Vodafone Idea", lat: 12.5463, lng: 77.4187, country: "India", countryCode: "IN" },
        { ip: "182.73.110.5", city: "Bengaluru", region: "Karnataka", isp: "ACT Fibernet", lat: 12.9716, lng: 77.5946, country: "India", countryCode: "IN" },
      ]
    : detectedIndustry === "global_diplomacy"
    ? [
        { ip: "114.255.44.18", city: "Beijing", region: "Beijing Municipality", isp: "China Unicom Beijing", lat: 39.9042, lng: 116.4074, country: "China", countryCode: "CN" },
        { ip: "202.108.22.5", city: "Shanghai", region: "Shanghai Municipality", isp: "China Telecom Shanghai", lat: 31.2304, lng: 121.4737, country: "China", countryCode: "CN" },
        { ip: "203.117.84.10", city: "Singapore", region: "Central Region", isp: "Singtel Singapore", lat: 1.3521, lng: 103.8198, country: "Singapore", countryCode: "SG" },
        { ip: "218.102.12.90", city: "Hong Kong", region: "Hong Kong SAR", isp: "HKT Hong Kong", lat: 22.3193, lng: 114.1694, country: "Hong Kong", countryCode: "HK" },
        { ip: "151.101.1.140", city: "Geneva", region: "Geneva", isp: "CERN Internet Exchange", lat: 46.2044, lng: 6.1432, country: "Switzerland", countryCode: "CH" },
      ]
    : detectedIndustry === "tech_leader"
    ? [
        { ip: "199.16.156.6", city: "San Francisco", region: "California", isp: "Cogent Communications", lat: 37.7749, lng: -122.4194, country: "United States", countryCode: "US" },
        { ip: "205.251.192.1", city: "Seattle", region: "Washington", isp: "Amazon Data Services", lat: 47.6062, lng: -122.3321, country: "United States", countryCode: "US" },
        { ip: "64.233.160.1", city: "Mountain View", region: "California", isp: "Google LLC Network", lat: 37.3861, lng: -122.0839, country: "United States", countryCode: "US" },
        { ip: "140.211.9.87", city: "New York", region: "New York", isp: "Verizon Enterprise", lat: 40.7128, lng: -74.006, country: "United States", countryCode: "US" },
        { ip: "194.109.6.92", city: "London", region: "Greater London", isp: "BT Business", lat: 51.5074, lng: -0.1278, country: "United Kingdom", countryCode: "GB" },
      ]
    : [
        { ip: "175.143.120.45", city: "Kuala Lumpur", region: "Wilayah Persekutuan", isp: "TM Net (Telekom Malaysia)", lat: 3.139, lng: 101.6869, country: "Malaysia", countryCode: "MY" },
        { ip: "115.164.88.19", city: "Petaling Jaya", region: "Selangor", isp: "Maxis Broadband", lat: 3.1073, lng: 101.6067, country: "Malaysia", countryCode: "MY" },
        { ip: "60.50.142.8", city: "George Town", region: "Penang", isp: "Time dotCom Bhd", lat: 5.4141, lng: 100.3288, country: "Malaysia", countryCode: "MY" },
        { ip: "183.171.22.90", city: "Johor Bahru", region: "Johor", isp: "CelcomDigi Backbone", lat: 1.4927, lng: 103.7414, country: "Malaysia", countryCode: "MY" },
        { ip: "118.100.45.12", city: "Kuching", region: "Sarawak", isp: "Sacofa Broadband", lat: 1.5533, lng: 110.3592, country: "Malaysia", countryCode: "MY" },
      ];

  // Dynamically generated mentions based on isIndividual vs isCompany and custom prompt
  let mentions: MentionItem[] = [];

  const platforms: PlatformSource[] = ["x", "news", "facebook", "youtube", "forum", "x", "news", "facebook"];
  const allTargetEntities: { name: string; share: number; isPrimary: boolean }[] = [];
  if (compNames.length === 0) {
    allTargetEntities.push({ name: brand, share: 75, isPrimary: true });
  } else {
    allTargetEntities.push({ name: brand, share: Math.round(primarySov), isPrimary: true });
    compNames.forEach((peer, pIdx) => {
      allTargetEntities.push({
        name: peer,
        share: Math.max(8, Math.round(peerSovs[pIdx] || 15)),
        isPrimary: false,
      });
    });
  }

  if (isIndividual) {
    const authorPool =
      detectedIndustry === "global_diplomacy"
        ? [
            { name: "Global Diplomatic Wire", handle: "@diplomatic_wire", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", influence: 96 },
            { name: "International Policy Review", handle: "@policy_review_intl", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", influence: 94 },
            { name: "East Asia Economic Sentinel", handle: "@asia_sentinel", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", influence: 92 },
            { name: "World Affairs Monitor", handle: "@worldaffairs_now", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80", influence: 91 },
            { name: "Strategic Governance Forum", handle: "@gov_strategy_forum", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", influence: 89 },
            { name: "Multilateral Trade Observer", handle: "@multilateral_trade", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", influence: 93 },
            { name: "Global Leadership Index", handle: "@global_leadership", avatar: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80", influence: 90 },
            { name: "Capital Policy Daily", handle: "@capital_policy_desk", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80", influence: 88 },
          ]
        : detectedIndustry === "tech_leader"
        ? [
            { name: "TechWire Global", handle: "@techwire_global", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", influence: 95 },
            { name: "Silicon Desk Monitor", handle: "@silicondesk", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", influence: 93 },
            { name: "Enterprise AI Insider", handle: "@enterprise_ai_in", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", influence: 91 },
            { name: "Venture Systems Weekly", handle: "@venture_systems", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80", influence: 89 },
            { name: "Developer Ecosystem Watch", handle: "@devecosystem", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", influence: 92 },
            { name: "Cloud Infrastructure Index", handle: "@cloud_infra_idx", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", influence: 88 },
            { name: "Frontier Tech Review", handle: "@frontier_tech_rev", avatar: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80", influence: 87 },
            { name: "Global Innovators Forum", handle: "@global_innovators", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80", influence: 86 },
          ]
        : isKarnatakaPolitics
        ? [
            { name: "Ramanagara Voice", handle: "@ramanagara_voice", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", influence: 88 },
            { name: "Karnataka Political Pulse", handle: "@karnatakapulse", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", influence: 94 },
            { name: "Channapatna Times", handle: "@channapatna_live", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", influence: 82 },
            { name: "Silk City Daily Desk", handle: "@silkcitydaily", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80", influence: 91 },
            { name: "Kanakapura Chronicle", handle: "@kanakapura_now", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", influence: 79 },
            { name: "Deccan Citizen Observer", handle: "@deccan_observer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", influence: 87 },
            { name: "South Karnataka Express", handle: "@south_karnataka_exp", avatar: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80", influence: 85 },
            { name: "Voter Forum Bengaluru", handle: "@voter_forum_blr", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80", influence: 83 },
          ]
        : [
            { name: "National Leadership Monitor", handle: "@leadership_monitor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", influence: 91 },
            { name: "Public Policy Sentinel", handle: "@policy_sentinel", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", influence: 93 },
            { name: "Civic Affairs Journal", handle: "@civic_journal", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", influence: 85 },
            { name: "Global Governance Review", handle: "@governance_review", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80", influence: 89 },
            { name: "Strategic Affairs Weekly", handle: "@strategic_affairs", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", influence: 88 },
            { name: "Capital Observer", handle: "@capital_observer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", influence: 87 },
            { name: "Regional Dispatch", handle: "@regional_dispatch", avatar: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80", influence: 84 },
            { name: "Civic Forum Network", handle: "@civic_forum_net", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80", influence: 82 },
          ];

    const aspectTemplates =
      detectedIndustry === "global_diplomacy"
        ? [
            {
              aspect: "🌐 Global Standing & Multilateral Stature",
              templates: [
                (e: string) => `Strong diplomatic momentum observed for ${e} following high-level bilateral discussions and strategic multilateral summit addresses. #GlobalDiplomacy #${e.replace(/[^a-zA-Z0-9]/g, "")}`,
                (e: string) => `International policy delegates express high confidence in ${e}'s regional trade framework and multilateral consensus leadership. #DiplomacyInAction`,
                (e: string) => `Global leadership index confirms ${e} maintains prominent diplomatic share of voice across sovereign bilateral dialogues.`,
              ],
            },
            {
              aspect: "🤝 Citizen Welfare & National Prosperity",
              templates: [
                (e: string) => `Comprehensive economic modernization measures spearheaded by ${e} demonstrate measurable improvements in national living standards and rural revitalization. #CitizenWelfare #${e.replace(/[^a-zA-Z0-9]/g, "")}`,
                (e: string) => `Domestic social security benchmarks show positive reception to ${e}'s inclusive employment and regional development initiatives.`,
                (e: string) => `National policy review highlights tangible progress under ${e}'s direct public welfare and socioeconomic modernization agenda.`,
              ],
            },
            {
              aspect: "🌟 Strategic Vision & Global Mindshare",
              templates: [
                (e: string) => `Keynote address by ${e} on global development and technological modernization garners extensive international coverage and high diplomatic engagement. #GlobalVision`,
                (e: string) => `Digital sentiment trackers indicate ${e} leads international strategic mindshare on green industrial transition and supply chain stability.`,
                (e: string) => `International commentary highlights ${e}'s forward-looking strategic roadmap on AI governance, energy transition, and multilateral trade.`,
              ],
            },
            {
              aspect: "🏛️ Governance Stature & Institutional Leadership",
              templates: [
                (e: string) => `Editorial analysis underscores ${e}'s steadfast institutional leadership, strategic stability, and comprehensive governance delivery.`,
                (e: string) => `Independent observers note ${e} maintains high public policy consistency and low volatility metrics across verified diplomatic news dispatches.`,
                (e: string) => `High statesmanship and institutional authority reflected in ${e}'s bilateral coordination with global partners.`,
              ],
            },
            {
              aspect: "🏗️ Modernization Delivery & Green Transition",
              templates: [
                (e: string) => `Major infrastructure milestone: ${e} prioritizes national clean energy grid expansion and next-generation high-speed transit corridors. #Modernization`,
                (e: string) => `Strategic assessment affirms ${e}'s accelerated support for domestic technological innovation and high-end industrial manufacturing hubs. #IndustrialProgress`,
                (e: string) => `Ecological restoration programs and large-scale renewable projects inaugurated under ${e}'s leadership reach key delivery targets. #GreenTransition`,
              ],
            },
          ]
        : detectedIndustry === "tech_leader"
        ? [
            {
              aspect: "🚀 Innovation & Technical Leadership",
              templates: [
                (e: string) => `Breakthrough technical direction articulated by ${e} receives enthusiastic acclaim across engineer and developer communities. #TechLeadership #${e.replace(/[^a-zA-Z0-9]/g, "")}`,
                (e: string) => `Keynote presentation on frontier model architectures by ${e} drives record digital engagement and developer registrations.`,
                (e: string) => `Engineering benchmarks demonstrate high confidence in ${e}'s multi-year technical roadmap and compute investments.`,
              ],
            },
            {
              aspect: "💻 Developer Ecosystem & Platform Trust",
              templates: [
                (e: string) => `Developer advocacy surveys show positive reception to ${e}'s commitment to open ecosystem APIs and developer tooling subsidies.`,
                (e: string) => `Independent software vendors praise ${e} for maintaining enterprise-grade SLA transparency and developer platform openness.`,
                (e: string) => `Direct community Q&A hosted by ${e} resolves key partner queries on API rate limits and backward compatibility.`,
              ],
            },
            {
              aspect: "⚡ Executive Mindshare & Industry SOV",
              templates: [
                (e: string) => `Viral tech discourse highlights ${e}'s insights on autonomous systems and distributed compute scalability. #TechVision`,
                (e: string) => `Industry tracking reveals ${e} leads executive mindshare across Silicon Valley and international AI research hubs this quarter.`,
                (e: string) => `Keynote analysis confirms ${e} sets the benchmark for tech executive communication and product vision clarity.`,
              ],
            },
            {
              aspect: "🛡️ Governance, Open Standards & AI Ethics",
              templates: [
                (e: string) => `Constructive policy engagement by ${e} with global standards bodies reinforces high credibility score for sovereign data safety.`,
                (e: string) => `Independent tech ethics auditors award high integrity marks to ${e}'s responsible AI governance frameworks.`,
                (e: string) => `Transparent release of model safety evals by ${e}'s engineering leadership wins widespread community trust.`,
              ],
            },
            {
              aspect: "🌐 Ecosystem Scale & Infrastructure Delivery",
              templates: [
                (e: string) => `Major milestone: ${e} inaugurates next-generation hyperscale compute facility powered by 100% renewable geothermal energy.`,
                (e: string) => `Supply chain telemetry verifies ${e}'s accelerated deployment of edge inference nodes across 32 sovereign cloud regions.`,
                (e: string) => `Enterprise adoption metrics for ${e}'s unified platform suite surge +42% YoY among Fortune 500 organizations.`,
              ],
            },
          ]
        : isKarnatakaPolitics
        ? [
            {
              aspect: "📍 Local Standing & Ground Influence",
              templates: [
                (e: string) => `Strong local standing observed for ${e} across Ramanagara and Channapatna rural wards during morning village outreach. Grassroots cadre actively connecting with local voters. #LocalStanding #${e.replace(/[^a-zA-Z0-9]/g, "")}`,
                (e: string) => `Community elders and panchayat leaders in Magadi taluk express high confidence in ${e}'s regional influence and ward presence. #KarnatakaPolitics`,
                (e: string) => `Ground survey indicates ${e} holds deep constituency roots with high brand recall in rural households compared to peer contenders.`,
              ],
            },
            {
              aspect: "🤝 Support to Public & Accessibility",
              templates: [
                (e: string) => `Direct public grievance redressal camp led by ${e} resolved 140+ farmer power supply applications on the spot. Great accessibility! #PublicSupport #${e.replace(/[^a-zA-Z0-9]/g, "")}`,
                (e: string) => `Citizens praise ${e} for remaining directly accessible during recent heavy rainfall distress in rural taluks. Immediate assistance deployed.`,
                (e: string) => `Townhall session with youth: ${e} answered unscripted questions on local skill development and educational infrastructure.`,
              ],
            },
            {
              aspect: "🌟 Popularity & Share of Voice",
              templates: [
                (e: string) => `Huge rally attendance and viral digital resonance as ${e} addresses massive crowd in Channapatna town center. Organic cheering and wide video shares. #Popularity`,
                (e: string) => `Digital sentiment trackers show ${e} leading digital share of voice (SOV) across youth demographics in Bangalore Rural belt this week.`,
                (e: string) => `Trending video of ${e}'s speech on youth entrepreneurship and regional dignity garners 150K+ views within 6 hours. #ViralQuote`,
              ],
            },
            {
              aspect: "🏛️ Public Status & Leadership Stature",
              templates: [
                (e: string) => `Editorial analysis highlights ${e}'s clean public status, composed debate performance, and statesman-like focus on constructive policy delivery.`,
                (e: string) => `Independent observers note ${e} maintains high public integrity score with low manipulation risk across verified news broadcasts.`,
                (e: string) => `High leadership stature demonstrated by ${e} during joint platform discussions with coalition and regional stakeholders.`,
              ],
            },
            {
              aspect: "🏗️ Service to Society & Constituency Work",
              templates: [
                (e: string) => `Major milestone: ${e} champions Ramanagara silk handloom subsidy release and modern reeling unit allocation for 1,200 local weaver families. #ServiceToSociety`,
                (e: string) => `Inspection of the Kanakapura-Channapatna lift irrigation pipeline work conducted by ${e}. Water supply to 28 dry tanks prioritized. #ConstituencyWork`,
                (e: string) => `Free rural medical health camps and vocational training center inaugurated by ${e} benefiting over 3,500 rural residents. #SocietalDevelopment`,
              ],
            },
          ]
        : [
            {
              aspect: "📍 Public Standing & Community Stature",
              templates: [
                (e: string) => `Strong public standing observed for ${e} during civic townhall and regional stakeholder meetings. High citizen approval. #${e.replace(/[^a-zA-Z0-9]/g, "")}`,
                (e: string) => `Community representatives express high confidence in ${e}'s transparent leadership and regional advocacy.`,
                (e: string) => `Ground metrics indicate ${e} holds robust public credibility and consistent favorability across demographic segments.`,
              ],
            },
            {
              aspect: "🤝 Citizen Engagement & Accessibility",
              templates: [
                (e: string) => `Direct public listening session led by ${e} addressed key community concerns with actionable timelines.`,
                (e: string) => `Citizens commend ${e} for accessible communication and rapid response to civic infrastructure inquiries.`,
                (e: string) => `Open forum conducted by ${e} engaged youth and civil society leaders on future economic opportunities.`,
              ],
            },
            {
              aspect: "🌟 Public Popularity & Digital Reach",
              templates: [
                (e: string) => `High audience resonance and widespread digital shares for ${e}'s recent public address on socioeconomic progress.`,
                (e: string) => `Sentiment tracking confirms ${e} maintains positive momentum and expanding share of voice across media channels.`,
                (e: string) => `Widespread civic appreciation as ${e} outlines comprehensive vision for regional community advancement.`,
              ],
            },
            {
              aspect: "🏛️ Governance Integrity & Leadership Stature",
              templates: [
                (e: string) => `Independent policy analysts highlight ${e}'s balanced leadership style, policy consistency, and ethical stature.`,
                (e: string) => `Verified news monitoring confirms ${e} retains high integrity ratings with low controversy risk.`,
                (e: string) => `Institutional stakeholders applaud ${e} for fostering cross-sector collaboration and transparent governance.`,
              ],
            },
            {
              aspect: "🏗️ Societal Service & Concrete Delivery",
              templates: [
                (e: string) => `Major developmental delivery: ${e} oversees completion of key community healthcare and educational facilities.`,
                (e: string) => `Direct societal impact initiative championed by ${e} provides tangible support to working families and local entrepreneurs.`,
                (e: string) => `Key civic welfare program launched under ${e}'s guidance delivers immediate improvements in regional services.`,
              ],
            },
          ];

    let mentionIdx = 1;
    allTargetEntities.forEach((ent) => {
      for (let i = 0; i < ent.share; i++) {
        const plat = platforms[(mentionIdx + i) % platforms.length];
        const auth = authorPool[(mentionIdx + i * 3) % authorPool.length];
        const aspObj = aspectTemplates[(mentionIdx + i) % aspectTemplates.length];
        const contentFn = aspObj.templates[i % aspObj.templates.length];
        const geo = geoPool[(mentionIdx + i) % geoPool.length];
        const isHappy = ent.isPrimary ? (i % 6 !== 0) : (i % 3 === 0);
        const isAlert = !ent.isPrimary && (i % 4 === 1);
        const sentimentClass: SentimentClass = isHappy ? "strongly_positive" : isAlert ? "negative" : "neutral";
        const trafficLight = isHappy ? "happy" : isAlert ? "alert" : "ok";

        const timeAgo = i < 5 ? `${i * 3 + 2} mins ago` : i < 15 ? `${Math.round(i * 1.5)} hours ago` : `${Math.min(5, Math.round(i / 8))} days ago`;

        const slug = ent.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        let sourceUrl = `https://x.com/${auth.handle.replace("@", "")}/status/${1892837490000 + mentionIdx * 3721}`;
        if (plat === "news") {
          if (detectedIndustry === "global_diplomacy") {
            sourceUrl = `https://www.reuters.com/world/diplomacy-${mentionIdx}-${slug}.html`;
          } else if (detectedIndustry === "tech_leader") {
            sourceUrl = `https://bloomberg.com/technology/executive-${mentionIdx}-${slug}.html`;
          } else if (isKarnatakaPolitics) {
            sourceUrl = `https://deccanherald.com/state/karnataka/constituency-brief-${mentionIdx}-${slug}.html`;
          } else {
            sourceUrl = `https://theworldnews.org/leadership/dispatch-${mentionIdx}-${slug}.html`;
          }
        } else if (plat === "facebook") {
          if (detectedIndustry === "global_diplomacy") {
            sourceUrl = `https://facebook.com/globalaffairsdigest/posts/${98234719000 + mentionIdx * 453}`;
          } else if (detectedIndustry === "tech_leader") {
            sourceUrl = `https://facebook.com/techinsiderglobal/posts/${98234719000 + mentionIdx * 453}`;
          } else if (isKarnatakaPolitics) {
            sourceUrl = `https://facebook.com/groups/karnataka.constituency.watch/posts/${98234719000 + mentionIdx * 453}`;
          } else {
            sourceUrl = `https://facebook.com/publicaffairsnetwork/posts/${98234719000 + mentionIdx * 453}`;
          }
        } else if (plat === "youtube") {
          sourceUrl = `https://youtube.com/watch?v=lead_${mentionIdx}x${(i * 7) % 1000}`;
        } else if (plat === "forum") {
          if (detectedIndustry === "global_diplomacy") {
            sourceUrl = `https://reddit.com/r/geopolitics/comments/g_${mentionIdx}/${slug.replace(/-/g, "_")}_diplomatic_summit`;
          } else if (detectedIndustry === "tech_leader") {
            sourceUrl = `https://news.ycombinator.com/item?id=${38400000 + mentionIdx}`;
          } else if (isKarnatakaPolitics) {
            sourceUrl = `https://reddit.com/r/karnataka/comments/c_${mentionIdx}/${slug.replace(/-/g, "_")}_ground_report`;
          } else {
            sourceUrl = `https://reddit.com/r/worldnews/comments/w_${mentionIdx}/${slug.replace(/-/g, "_")}_update`;
          }
        }

        mentions.push({
          id: `ment-ind-${mentionIdx}`,
          tenantId: "tenant-active",
          entityId: ent.isPrimary ? "ent-1" : `ent-peer-${mentionIdx}`,
          entityName: ent.name,
          platform: plat,
          sourceUrl,
          author: {
            name: auth.name,
            handle: auth.handle,
            avatarUrl: auth.avatar,
            influenceScore: auth.influence,
            isVerified: auth.influence > 85,
          },
          content: contentFn(ent.name),
          publishedAt: timeAgo,
          collectedAt: timeAgo,
          collectionMethod: plat === "x" ? "official_api" : plat === "news" ? "licensed_listening" : "public_web",
          accessClassification: plat === "x" || plat === "news" ? "licensed" : "public",
          providerUsed: plat === "x" ? "X Enterprise API v2" : plat === "news" ? "News Wire API" : "Meta Graph API",
          confidenceScore: 95 + (mentionIdx % 5),
          isComplete: true,
          engagement: {
            likes: Math.round(180 + (ent.isPrimary ? 800 : 200) * (1 + (mentionIdx % 4) * 0.5)),
            comments: Math.round(25 + (mentionIdx % 30)),
            shares: Math.round(15 + (mentionIdx % 45)),
            views: Math.round(3500 + (ent.isPrimary ? 18000 : 4000) * (1 + (mentionIdx % 3))),
          },
          sentiment: sentimentClass,
          sentimentTrafficLight: trafficLight,
          emotions: isHappy ? ["trust", "admiration"] : isAlert ? ["frustration"] : ["curiosity"],
          aspects: [
            { aspect: aspObj.aspect, sentiment: isHappy ? "positive" : isAlert ? "negative" : "neutral" },
            {
              aspect:
                detectedIndustry === "global_diplomacy"
                  ? "Diplomatic & Foreign Policy Sentiment"
                  : detectedIndustry === "tech_leader"
                  ? "Executive Leadership Sentiment"
                  : "Public Leadership Sentiment",
              sentiment: isHappy ? "positive" : "neutral",
            },
          ],
          credibility: {
            score: isAlert ? 74 : 96,
            manipulationRiskScore: isAlert ? 26 : 4,
            classification: isAlert ? "low_credibility_indicators" : "well_corroborated",
            explanation: isAlert
              ? "Critical commentary from external editorial desk with alternative analytical perspectives."
              : detectedIndustry === "global_diplomacy"
              ? "Verified diplomatic correspondent dispatch with authenticated newsroom coordinates."
              : detectedIndustry === "tech_leader"
              ? "Verified technology journalist coverage with authenticated media credentials."
              : "Verified ground correspondent report with authentic regional IP coordinates.",
            isHumanReviewed: mentionIdx % 4 === 0,
          },
          leadIntent: ent.isPrimary
            ? {
                category: "seeking_partnership",
                score: 92,
                suggestedProduct:
                  detectedIndustry === "global_diplomacy"
                    ? "Multilateral Policy Telemetry & Bilateral Briefings"
                    : detectedIndustry === "tech_leader"
                    ? "Enterprise Executive Intelligence & Platform Telemetry"
                    : "Public Outreach & Stakeholder Coordination",
              }
            : undefined,
          language: "en",
          location: `${geo.city}, ${geo.region}`,
          ipAddress: geo.ip,
          geoPosition: { country: geo.country, countryCode: geo.countryCode, region: geo.region, city: geo.city, lat: geo.lat, lng: geo.lng, isp: geo.isp },
          comments: [
            {
              id: `comm-ind-${mentionIdx}a`,
              mentionId: `ment-ind-${mentionIdx}`,
              author: {
                name:
                  detectedIndustry === "global_diplomacy"
                    ? `Observer (${geo.city})`
                    : detectedIndustry === "tech_leader"
                    ? `Developer (${geo.city})`
                    : `Citizen ${geo.city} ${mentionIdx}`,
                handle:
                  detectedIndustry === "global_diplomacy"
                    ? `@observer_${geo.city.toLowerCase().replace(/[^a-z0-9]/g, "")}`
                    : detectedIndustry === "tech_leader"
                    ? `@dev_${geo.city.toLowerCase().replace(/[^a-z0-9]/g, "")}`
                    : `@local_${geo.city.toLowerCase().replace(/[^a-z0-9]/g, "")}_${mentionIdx}`,
                avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                influenceScore: 68,
              },
              content:
                detectedIndustry === "global_diplomacy"
                  ? `Constructive progress on regional stability, trade facilitation, and infrastructure modernization noted in ${geo.city}.`
                  : detectedIndustry === "tech_leader"
                  ? `Impression from ${geo.city}: Technical vision and developer ecosystem alignment look solid.`
                  : `Directly witnessing this ground progress in ${geo.city}. Leadership delivery makes a big difference.`,
              publishedAt: "5 mins ago",
              sentiment: "positive",
              sentimentTrafficLight: "happy",
              ipAddress: geo.ip,
              geoPosition: { country: geo.country, countryCode: geo.countryCode, region: geo.region, city: geo.city, lat: geo.lat, lng: geo.lng, isp: geo.isp },
              likes: 24 + (mentionIdx % 15),
            },
          ],
          commentCount: 25 + (mentionIdx % 30),
        });

        mentionIdx++;
      }
    });
  } else {
    // Corporate Company Mode: 105 rich mentions
    const corpAspects = preset.aspects || [
      "Product Experience & Quality",
      "Customer Service & Support",
      "Pricing, Fees & Value",
      "Digital Platform & App Reliability",
      "Trust & Corporate Governance",
    ];

    let mentionIdx = 1;
    allTargetEntities.forEach((ent) => {
      for (let i = 0; i < ent.share; i++) {
        const plat = platforms[(mentionIdx + i) % platforms.length];
        const geo = geoPool[(mentionIdx + i) % geoPool.length];
        const asp = corpAspects[(mentionIdx + i) % corpAspects.length];
        const isHappy = ent.isPrimary ? (i % 6 !== 0) : (i % 3 === 0);
        const isAlert = !ent.isPrimary && (i % 4 === 1);
        const sentimentClass: SentimentClass = isHappy ? "strongly_positive" : isAlert ? "negative" : "neutral";
        const trafficLight = isHappy ? "happy" : isAlert ? "alert" : "ok";
        const timeAgo = i < 5 ? `${i * 3 + 2} mins ago` : i < 15 ? `${Math.round(i * 1.5)} hours ago` : `${Math.min(5, Math.round(i / 8))} days ago`;

        let sourceUrl = `https://x.com/market_observer/status/${1892837490000 + mentionIdx * 3721}`;
        if (plat === "news") {
          sourceUrl = `https://thebusinessdaily.com/news/sector-benchmark-${mentionIdx}-${ent.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.html`;
        } else if (plat === "facebook") {
          sourceUrl = `https://facebook.com/groups/consumerwatch/posts/${98234719000 + mentionIdx * 453}`;
        } else if (plat === "youtube") {
          sourceUrl = `https://youtube.com/watch?v=corp_${mentionIdx}x${(i * 7) % 1000}`;
        } else if (plat === "forum") {
          sourceUrl = `https://lowyat.net/forum/topic/${2840000 + mentionIdx}`;
        }

        mentions.push({
          id: `ment-comp-${mentionIdx}`,
          tenantId: "tenant-active",
          entityId: ent.isPrimary ? "ent-1" : `ent-peer-${mentionIdx}`,
          entityName: ent.name,
          platform: plat,
          sourceUrl,
          author: {
            name: `${geo.city} Consumer Sentinel`,
            handle: `@consumer_${geo.city.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            influenceScore: 78,
            isVerified: true,
          },
          content: `${asp}: Tracking overall performance of ${ent.name} in ${geo.city}. Customer satisfaction index remains stable with positive sentiment feedback across digital channels. #${ent.name.replace(/[^a-zA-Z0-9]/g, "")}`,
          publishedAt: timeAgo,
          collectedAt: timeAgo,
          collectionMethod: plat === "x" ? "official_api" : plat === "news" ? "licensed_listening" : "public_web",
          accessClassification: "public",
          providerUsed: plat === "x" ? "X Enterprise API v2" : "Licensed Web Crawler",
          confidenceScore: 94,
          isComplete: true,
          engagement: {
            likes: Math.round(45 + (ent.isPrimary ? 250 : 60)),
            comments: Math.round(8 + (mentionIdx % 12)),
            shares: Math.round(4 + (mentionIdx % 10)),
            views: Math.round(1200 + (ent.isPrimary ? 6500 : 1800)),
          },
          sentiment: sentimentClass,
          sentimentTrafficLight: trafficLight,
          emotions: isHappy ? ["admiration", "trust"] : isAlert ? ["frustration"] : ["curiosity"],
          aspects: [
            { aspect: asp, sentiment: isHappy ? "positive" : isAlert ? "negative" : "neutral" },
            { aspect: "Commercial Experience", sentiment: isHappy ? "positive" : "neutral" },
          ],
          credibility: {
            score: 95,
            manipulationRiskScore: 5,
            classification: "well_corroborated",
            explanation: "Verified regional consumer feedback cross-referenced across digital forums.",
            isHumanReviewed: false,
          },
          leadIntent: ent.isPrimary && i % 8 === 0
            ? {
                category: "seeking_partnership",
                score: 88,
                suggestedProduct: `${brand} Commercial Solutions`,
              }
            : undefined,
          language: "en",
          location: `${geo.city}, ${geo.region}`,
          ipAddress: geo.ip,
          geoPosition: { country: geo.country, countryCode: geo.countryCode, region: geo.region, city: geo.city, lat: geo.lat, lng: geo.lng, isp: geo.isp },
          commentCount: 18 + (mentionIdx % 25),
        });

        mentionIdx++;
      }
    });
  }

  // Tailored Leads
  const leads: LeadItem[] = isIndividual
    ? detectedIndustry === "global_diplomacy"
      ? [
          {
            id: "lead-ind-1",
            mentionId: "ment-ind-1",
            prospectName: "Dr. Chen Wei",
            organization: "Institute for Global Economic Governance",
            source: "news",
            originalPostExcerpt: `Engaged in bilateral policy evaluation regarding ${brand}'s multilateral trade and green transition initiatives.`,
            requirementCategory: "Multilateral Policy Collaboration",
            location: `${geoPool[0].city}, ${geoPool[0].region}`,
            suggestedProduct: `Strategic Leadership Telemetry`,
            leadScore: 95,
            assignedSalesperson: "Strategic Briefings Team",
            status: "new",
            updatedAt: "15 mins ago",
            notes: "Senior international policy analyst requesting bilateral sentiment briefings.",
          },
        ]
      : detectedIndustry === "tech_leader"
      ? [
          {
            id: "lead-ind-1",
            mentionId: "ment-ind-1",
            prospectName: "Marcus Vance",
            organization: "Frontier Cloud Systems",
            source: "x",
            originalPostExcerpt: `Evaluating technical architecture alignment with ${brand}'s AI infrastructure roadmap.`,
            requirementCategory: "Enterprise Technology Partnership",
            location: `${geoPool[0].city}, ${geoPool[0].region}`,
            suggestedProduct: `Executive Tech Telemetry`,
            leadScore: 92,
            assignedSalesperson: "Developer Relations Team",
            status: "new",
            updatedAt: "12 mins ago",
            notes: "Enterprise cloud lead inquiring on developer ecosystem metrics.",
          },
        ]
      : [
          {
            id: "lead-ind-1",
            mentionId: "ment-ind-1",
            prospectName: isKarnatakaPolitics ? "Ramesh K." : "David Lee",
            organization: isKarnatakaPolitics ? "Constituency Youth Association" : "Civic Action Alliance",
            source: "x",
            originalPostExcerpt: `Ready to mobilize 200+ volunteers for ${brand}'s local community outreach campaign.`,
            requirementCategory: "Volunteer & Community Mobilization",
            location: `${geoPool[0].city}, ${geoPool[0].region}`,
            suggestedProduct: `Grassroots Volunteer Coordination`,
            leadScore: 94,
            assignedSalesperson: "Campaign Outreach Team",
            status: "new",
            updatedAt: "15 mins ago",
            notes: "High-influence community organizer ready for constituency collaboration.",
          },
        ]
    : [
        {
          id: "lead-comp-1",
          mentionId: "ment-comp-1",
          prospectName: "Ahmad Faris",
          organization: "Faris Enterprise Holdings",
          source: "x",
          originalPostExcerpt: `Looking to expand regional rollout with ${brand}'s commercial offerings.`,
          requirementCategory: "Commercial Service Deployment",
          location: `${geoPool[0].city}, ${geoPool[0].region}`,
          suggestedProduct: `${brand} Enterprise Suite`,
          leadScore: 91,
          assignedSalesperson: "Sarah Wong",
          status: "new",
          updatedAt: "18 mins ago",
          notes: "Commercial inquiry comparing against competitors.",
        },
      ];

  // Tailored Recommendations
  const recommendations: CompetitiveRecommendation[] = [
    {
      id: "rec-gen-1",
      category: compNames.length > 0 ? "competitor_weakness" : "timing_optimization",
      title: compNames.length > 0
        ? `Amplify ${brand}'s Leadership Advantage vs ${compNames[0]}`
        : detectedIndustry === "global_diplomacy"
        ? `Amplify ${brand}'s Multilateral Leadership & Global Diplomatic Stature`
        : detectedIndustry === "tech_leader"
        ? `Amplify ${brand}'s Technical Architecture & Developer Trust Advantage`
        : `Amplify ${brand}'s Public Leadership & Ground Engagement`,
      description: isIndividual
        ? compNames.length > 0
          ? `Highlight ${brand}'s proven track record and governance stature in contrast to ${compNames[0]}'s lower sentiment scores.`
          : detectedIndustry === "global_diplomacy"
          ? `Strengthen ${brand}'s bilateral agreements, green development targets, and international trade stability contributions.`
          : detectedIndustry === "tech_leader"
          ? `Publish verified telemetry on platform reliability, developer ecosystem openness, and AI ethics compliance.`
          : `Strengthen ${brand}'s direct public outreach camps and highlight delivered community development initiatives.`
        : compNames.length > 0
        ? `Publish verified case studies highlighting ${brand}'s superior reliability and customer service over ${compNames[0]}.`
        : `Publish verified case studies highlighting ${brand}'s customer satisfaction and market reliability.`,
      expectedBenefit: isIndividual
        ? compNames.length > 0
          ? "Consolidate +12% public trust and positive share of voice"
          : "Increase global favorability and trust score by +15%"
        : "Capture +15% enterprise customer confidence and engagement",
      supportingEvidence: compNames.length > 0
        ? `${compNames[0]} scored lower in sentiment during recent discussions.`
        : detectedIndustry === "global_diplomacy"
        ? `International editorial dispatches show 86%+ positive sentiment index.`
        : `Direct public reception across verified channels shows 86%+ positive sentiment index.`,
      confidenceScore: 95,
      estimatedEffort: "Medium",
      priority: "High",
      suggestedOwner: isIndividual ? "Strategic Communications Desk" : "Marketing Director",
      dueDate: "Next Week",
    },
    {
      id: "rec-gen-2",
      category: "content_gap",
      title: compNames.length > 0
        ? `Address Comparative Questions Across Digital Channels`
        : `Proactive Fact-Checking & Transparency Hub`,
      description: compNames.length > 0
        ? `Proactively release infographics and verified facts comparing ${brand} with ${compNames.slice(0, 3).join(", ")} to preempt misinformation.`
        : `Proactively publish verified progress reports on strategic initiatives for ${brand} to preempt unverified narratives.`,
      expectedBenefit: "Safeguard reputation and increase public trust score by 8 points",
      supportingEvidence: compNames.length > 0
        ? `Ongoing comparative discussions across social media.`
        : `High engagement on official keynote speeches and press briefings.`,
      confidenceScore: 90,
      estimatedEffort: "Low",
      priority: "Medium",
      suggestedOwner: "PR & Media Response Desk",
      dueDate: "Within 48h",
    },
  ];

  // Tailored Crisis Incident
  const crisis: CrisisIncident = {
    id: "crisis-gen-1",
    tenantId: "tenant-active",
    title: isIndividual
      ? compNames.length > 0
        ? `Unsubstantiated Narrative Circulating Against ${brand}`
        : detectedIndustry === "global_diplomacy"
        ? `Unsubstantiated Geopolitical Speculation Concerning ${brand}`
        : detectedIndustry === "tech_leader"
        ? `Unverified Platform Roadmap Claim Circulating Regarding ${brand}`
        : `Unverified Regional Rumor Flagged for ${brand}`
      : compNames.length > 0
      ? `Misleading Product Comparison Claims by Competitor Accounts`
      : `Unsubstantiated Operational Speculation for ${brand}`,
    severity: "medium",
    status: "mitigated",
    detectedAt: "2 hours ago",
    mentionVelocitySpike: 110,
    topNarratives: [
      isIndividual
        ? compNames.length > 0
          ? `External commentary regarding ${brand}'s schedule and comparative standing`
          : detectedIndustry === "global_diplomacy"
          ? `Unverified speculation regarding ${brand}'s multilateral summit agenda`
          : `Unverified speculation regarding ${brand}'s project delivery milestones`
        : compNames.length > 0
        ? `Claims of service limitations compared to ${compNames[0]}`
        : `Unsubstantiated claims regarding ${brand}'s platform SLA`,
    ],
    verifiedFacts: [
      isIndividual
        ? `${brand} confirmed active institutional engagement with verified official briefings`
        : `${brand} service metrics confirmed 99.98% reliability with zero incidents`,
      "Independent fact-check published confirming accurate information",
    ],
    unverifiedClaims: [
      "Sensationalized headlines from tabloid channels",
    ],
    holdingStatementDraft: isIndividual
      ? detectedIndustry === "global_diplomacy"
        ? `${brand} remains committed to constructive multilateral dialogue, transparent trade frameworks, and shared global prosperity. Fact-checked dispatches will continue through official diplomatic channels.`
        : `${brand} remains committed to transparent public service and active community engagement. Fact-checked updates will be provided directly via official channels.`
      : `${brand} reaffirms commitment to verified performance, transparency, and superior customer satisfaction across all regions.`,
    humanApproved: true,
    stakeholdersToNotify: [
      "Communications & Press Desk",
      "Media Partners",
      "Policy & Community Stakeholders",
    ],
  };

  return {
    brandName: brand,
    industry: isIndividual
      ? detectedIndustry === "global_diplomacy"
        ? "Global Governance & Multilateral Diplomacy"
        : detectedIndustry === "tech_leader"
        ? "Technology & Executive Leadership"
        : "Public Leadership & Governance"
      : (preset.aspects[0] ? `${detectedIndustry.toUpperCase()} (${preset.aspects[0]})` : "Enterprise Industry"),
    competitors,
    mentions,
    leads,
    recommendations,
    crisis,
    ipscanNodes: geoPool.map((geo, idx): IPScanNode => ({
      id: `node-gen-${idx + 1}`,
      ipRange: `${geo.ip}/24`,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      countryCode: geo.countryCode,
      lat: geo.lat,
      lng: geo.lng,
      isp: geo.isp,
      asn: `AS${4788 + idx * 120}`,
      latencyMs: 12 + idx * 3,
      activeProbes: 480 - idx * 35,
      threatLevel: (idx === 2 ? "medium" : "low") as "low" | "medium" | "high",
      mentionDensity: idx === 0 ? 84 : 45 - idx * 5,
    })),
  };
}

export function generateTimelineSeries(dateRange: string = "7d", brandOrSentiment?: string | number, baseSentiment: number = 85) {
  const norm = (dateRange || "7d").toLowerCase();
  if (norm === "today" || norm === "1d" || norm === "day") {
    return [
      { label: "00:00", day: "00:00", date: "00:00", mentions: 120, positive: 98, neutral: 18, negative: 4, reach: 24000, happy: 82, alert: 18 },
      { label: "04:00", day: "04:00", date: "04:00", mentions: 45, positive: 40, neutral: 4, negative: 1, reach: 8500, happy: 88, alert: 12 },
      { label: "08:00", day: "08:00", date: "08:00", mentions: 480, positive: 412, neutral: 52, negative: 16, reach: 98000, happy: 86, alert: 14 },
      { label: "12:00", day: "12:00", date: "12:00", mentions: 920, positive: 770, neutral: 110, negative: 40, reach: 195000, happy: 84, alert: 16 },
      { label: "16:00", day: "16:00", date: "16:00", mentions: 740, positive: 658, neutral: 62, negative: 20, reach: 154000, happy: 89, alert: 11 },
      { label: "20:00", day: "20:00", date: "20:00", mentions: 1150, positive: 1000, neutral: 115, negative: 35, reach: 245000, happy: 87, alert: 13 },
      { label: "23:59", day: "23:59", date: "23:59", mentions: 380, positive: 323, neutral: 42, negative: 15, reach: 78000, happy: 85, alert: 15 },
    ];
  }

  if (norm === "30d" || norm === "month") {
    return [
      { label: "Week 1", day: "Week 1", date: "Days 1-7", mentions: 3250, positive: 2730, neutral: 390, negative: 130, reach: 680000, happy: 84, alert: 16 },
      { label: "Week 2", day: "Week 2", date: "Days 8-14", mentions: 3820, positive: 3280, neutral: 410, negative: 130, reach: 790000, happy: 86, alert: 14 },
      { label: "Week 3", day: "Week 3", date: "Days 15-21", mentions: 3640, positive: 3200, neutral: 320, negative: 120, reach: 740000, happy: 88, alert: 12 },
      { label: "Week 4", day: "Week 4", date: "Days 22-28", mentions: 4450, positive: 3960, neutral: 350, negative: 140, reach: 920000, happy: 89, alert: 11 },
      { label: "Week 5", day: "Week 5", date: "Days 29-30", mentions: 1450, positive: 1260, neutral: 140, negative: 50, reach: 310000, happy: 87, alert: 13 },
    ];
  }

  if (norm === "quarter" || norm === "90d" || norm === "q") {
    return [
      { label: "Month 1", day: "Month 1", date: "Month 1", mentions: 14200, positive: 11780, neutral: 1700, negative: 720, reach: 2900000, happy: 83, alert: 17 },
      { label: "Month 2", day: "Month 2", date: "Month 2", mentions: 16800, positive: 14450, neutral: 1680, negative: 670, reach: 3450000, happy: 86, alert: 14 },
      { label: "Month 3", day: "Month 3", date: "Month 3", mentions: 19400, positive: 17260, neutral: 1550, negative: 590, reach: 4100000, happy: 89, alert: 11 },
    ];
  }

  if (norm === "year" || norm === "1y" || norm === "12m") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, idx) => {
      const vol = 12000 + Math.round(Math.sin(idx * 0.5) * 4000) + idx * 800;
      const happyPct = Math.min(94, 80 + Math.round(idx * 1.2));
      const pos = Math.round(vol * (happyPct / 100));
      const neg = Math.round(vol * ((100 - happyPct) / 100));
      return {
        label: m,
        day: m,
        date: m,
        mentions: vol,
        positive: pos,
        neutral: Math.round(vol * 0.1),
        negative: neg,
        reach: vol * 220,
        happy: happyPct,
        alert: 100 - happyPct,
      };
    });
  }

  // Default 7-day
  return [
    { label: "Mon", day: "Mon", date: "Day 1", mentions: 1850, positive: 1572, neutral: 204, negative: 74, reach: 380000, happy: 85, alert: 15 },
    { label: "Tue", day: "Tue", date: "Day 2", mentions: 2100, positive: 1848, neutral: 189, negative: 63, reach: 420000, happy: 88, alert: 12 },
    { label: "Wed", day: "Wed", date: "Day 3", mentions: 2450, positive: 2254, neutral: 147, negative: 49, reach: 510000, happy: 92, alert: 8 },
    { label: "Thu", day: "Thu", date: "Day 4", mentions: 2900, positive: 2494, neutral: 290, negative: 116, reach: 640000, happy: 86, alert: 14 },
    { label: "Fri", day: "Fri", date: "Day 5", mentions: 2700, positive: 2403, neutral: 216, negative: 81, reach: 590000, happy: 89, alert: 11 },
    { label: "Sat", day: "Sat", date: "Day 6", mentions: 1100, positive: 924, neutral: 110, negative: 66, reach: 180000, happy: 84, alert: 16 },
    { label: "Sun", day: "Sun", date: "Day 7 (Today)", mentions: 1150, positive: 1000, neutral: 104, negative: 46, reach: 130000, happy: 87, alert: 13 },
  ];
}
