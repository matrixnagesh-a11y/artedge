export type UserRole =
  | "platform_super_admin"
  | "agency_admin"
  | "client_admin"
  | "marketing_manager"
  | "analyst"
  | "sales_user"
  | "executive_viewer"
  | "compliance_auditor";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "professional" | "agency" | "enterprise";
  mode: "company" | "personal_brand" | "agency" | "public_affairs";
  logoUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type PlatformSource =
  | "facebook"
  | "instagram"
  | "x"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "web"
  | "news"
  | "blog"
  | "forum"
  | "rss";

export type CollectionMethod =
  | "official_api"
  | "oauth_authorized"
  | "rss_feed"
  | "public_web"
  | "licensed_listening"
  | "customer_upload"
  | "search_discovery"
  | "webhook";

export type DataAccessClassification = "public" | "authorized_owned" | "licensed" | "sampled";

export type SentimentClass =
  | "strongly_positive"
  | "positive"
  | "neutral"
  | "negative"
  | "strongly_negative"
  | "mixed"
  | "unclear";

export type SentimentTrafficLight = "happy" | "ok" | "alert";

export type EmotionClass =
  | "satisfaction"
  | "trust"
  | "excitement"
  | "admiration"
  | "curiosity"
  | "confusion"
  | "disappointment"
  | "frustration"
  | "anger"
  | "fear"
  | "sarcasm"
  | "humour";

export type CredibilityClassification =
  | "well_corroborated"
  | "partially_corroborated"
  | "unverified"
  | "conflicting_evidence"
  | "low_credibility_indicators"
  | "possible_coordinated_amplification"
  | "possible_manipulated_media"
  | "requires_human_review";

export interface Entity {
  id: string;
  tenantId: string;
  name: string;
  type: "company" | "product" | "individual" | "campaign" | "industry" | "topic" | "location";
  websiteUrl: string;
  socialUrls: {
    facebook?: string;
    instagram?: string;
    x?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
  };
  industry: string;
  country: string;
  state: string;
  city: string;
  aliases: string[];
  hashtags: string[];
  keywords: string[];
  exclusions: string[];
  isPrimary: boolean;
}

export interface GeoPosition {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lng: number;
  isp?: string;
  asn?: string;
  ipRange?: string;
  nodeName?: string;
}

export interface MentionComment {
  id: string;
  mentionId: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
    influenceScore?: number;
    isVerified?: boolean;
  };
  content: string;
  publishedAt: string;
  sentiment: SentimentClass;
  sentimentTrafficLight: SentimentTrafficLight;
  ipAddress?: string;
  geoPosition?: GeoPosition;
  likes?: number;
  isNegativeAlert?: boolean;
}

export interface IPScanNode {
  id: string;
  ipRange: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  isp: string;
  asn: string;
  latencyMs: number;
  activeProbes: number;
  threatLevel: "low" | "medium" | "high";
  mentionDensity: number;
}

export interface IPScanFilter {
  query: string; // IP, Subnet, City, Country, or 'all'
  isGlobalWorldwide: boolean;
  selectedNodeId?: string;
  targetCountry?: string;
  targetCity?: string;
  targetRadiusKm?: number;
}

export interface MentionItem {
  id: string;
  tenantId: string;
  entityId: string;
  entityName: string;
  platform: PlatformSource;
  sourceUrl: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
    influenceScore: number; // 0 - 100
    isVerified?: boolean;
  };
  content: string;
  publishedAt: string;
  collectedAt: string;
  collectionMethod: CollectionMethod;
  accessClassification: DataAccessClassification;
  providerUsed: string;
  confidenceScore: number; // 0 - 100
  isComplete: boolean;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  sentiment: SentimentClass;
  sentimentTrafficLight: SentimentTrafficLight;
  emotions: EmotionClass[];
  aspects: { aspect: string; sentiment: "positive" | "neutral" | "negative" }[];
  credibility: {
    score: number; // 0 - 100
    manipulationRiskScore: number; // 0 - 100
    classification: CredibilityClassification;
    explanation: string;
    isHumanReviewed: boolean;
    factCheckMatches?: { title: string; url: string; publisher: string }[];
  };
  leadIntent?: {
    category:
      | "looking_for_supplier"
      | "requesting_recommendations"
      | "comparing_products"
      | "dissatisfied_with_competitor"
      | "requesting_quotation"
      | "seeking_partnership"
      | "tender_discussion";
    score: number; // 0 - 100
    suggestedProduct?: string;
  };
  language: string;
  location?: string;
  ipAddress?: string;
  geoPosition?: GeoPosition;
  comments?: MentionComment[];
  commentCount?: number;
  isBookmarked?: boolean;
  assignedAnalyst?: string;
  internalNote?: string;
  internalNotes?: string[];
  manuallyOverridden?: boolean;
}

export interface CompetitorComparison {
  id: string;
  name: string;
  logoUrl?: string;
  isPrimary: boolean;
  entityType?: "company" | "individual";
  titleOrRole?: string;
  metrics: {
    mentionVolume: number;
    shareOfVoicePercent: number;
    reach: number;
    engagementRate: number;
    sentimentScore: number; // 0 - 100
    reputationRiskScore: number; // 0 - 100
    credibilityIndex: number; // 0 - 100
    leadIntentCount: number;
    brandVisibilityIndex: number;
    competitiveEdgeScore: number;
  };
  individualPillars?: {
    localStanding: number; // 0 - 100
    publicSupport: number; // 0 - 100
    popularity: number; // 0 - 100
    publicStatus: number; // 0 - 100
    serviceToSociety: number; // 0 - 100
    constituencyFocus?: string;
  };
  radarScores: {
    visibility: number;
    engagement: number;
    sentiment: number;
    content: number;
    reputation: number;
    localStanding?: number;
    publicSupport?: number;
    popularity?: number;
    publicStatus?: number;
    serviceToSociety?: number;
  };
  postingFrequency: number; // per week
  topTopics: string[];
}

export interface CompetitiveRecommendation {
  id: string;
  title: string;
  category: "content_gap" | "competitor_weakness" | "lead_opportunity" | "timing_optimization" | "geographic_expansion";
  description: string;
  expectedBenefit: string;
  supportingEvidence: string;
  confidenceScore: number;
  estimatedEffort: "Low" | "Medium" | "High";
  priority: "Critical" | "High" | "Medium";
  suggestedOwner: string;
  dueDate: string;
}

export interface LeadItem {
  id: string;
  mentionId: string;
  prospectName: string;
  organization: string;
  source: PlatformSource;
  originalPostExcerpt: string;
  requirementCategory: string;
  location: string;
  suggestedProduct: string;
  leadScore: number; // 0 - 100
  assignedSalesperson?: string;
  status: "new" | "reviewing" | "qualified" | "contacted" | "meeting_arranged" | "proposal_sent" | "won" | "lost";
  updatedAt: string;
  notes?: string;
}

export interface CrisisIncident {
  id: string;
  tenantId: string;
  title: string;
  severity: "critical" | "high" | "medium";
  status: "active" | "mitigated" | "resolved";
  detectedAt: string;
  mentionVelocitySpike: number; // e.g. +340%
  topNarratives: string[];
  verifiedFacts: string[];
  unverifiedClaims: string[];
  holdingStatementDraft: string;
  humanApproved: boolean;
  stakeholdersToNotify: string[];
}

export interface CampaignPlan {
  id: string;
  name: string;
  goal: string;
  targetAudience: string;
  budgetRange: string;
  startDate: string;
  endDate: string;
  platforms: PlatformSource[];
  conceptSummary: string;
  contentPillars: string[];
  suggestedCaptions: { platform: string; text: string; hashtags: string[] }[];
  influencerBrief: string;
  status: "draft" | "under_review" | "approved" | "active";
}

export interface ComplianceRecord {
  dpoApplicability: {
    isRequired: boolean;
    rationale: string;
    dpoName?: string;
    dpoEmail?: string;
  };
  dpiaCompleted: boolean;
  dataSubjectRequests: {
    id: string;
    requestType: "download_data" | "anonymize" | "delete";
    requesterEmail: string;
    status: "pending" | "processing" | "completed";
    receivedAt: string;
  }[];
  crossBorderTransfers: {
    destinationCountry: string;
    lawfulBasis: string;
    safeguards: string;
  }[];
}

export interface ConnectorHealth {
  id: string;
  platform: PlatformSource;
  name: string;
  status: "healthy" | "warning" | "error" | "rate_limited";
  collectionMethod: CollectionMethod;
  lastSyncAt: string;
  quotaUsedPercent: number;
  rateLimitRemaining: number;
  commercialStatus: "Authorized API" | "OAuth Active" | "Permitted Web";
}

export type SubscriptionPlanId = "free_trial" | "pro_growth" | "enterprise_sovereign";

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  badge: string;
  monthlyPriceMYR: number;
  annualPriceMYR: number;
  monthlyPriceUSD: number;
  isTrial: boolean;
  trialDurationDays: number;
  allowCustomBranding: boolean; // strictly false on free_trial (enforces Matrix IoT watermark)
  features: string[];
  limits: {
    brandProfiles: number;
    competitors: number;
    monthlyMentions: number;
    pdfExports: boolean;
    ipscanEnabled: boolean;
    counterJournalismEnabled: boolean;
    dedicatedS3Residency: boolean;
    customDomainEnabled: boolean;
  };
}

export interface SaaSBrandingConfig {
  productName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  darkNavyColor: string;
  logoUrl: string;
  faviconUrl: string;
  customDomain: string;
  supportEmail: string;
  customFooterText: string;
  hideMatrixIoTPoweredBy: boolean; // strictly false if active plan is free_trial
}

export type OnboardingMethodology =
  | "ios_wizard"
  | "enterprise_assisted"
  | "agency_bulk_csv";

export interface TenantSaaSConfig {
  tenantId: string;
  currentPlanId: SubscriptionPlanId;
  trialStartedAt: string;
  trialExpiresAt: string;
  isTrialActive: boolean;
  onboardingMethodology: OnboardingMethodology;
  branding: SaaSBrandingConfig;
}

export interface PastProject {
  id: string;
  projectName: string;
  prompt: string;
  entityType: "company" | "individual";
  primaryBrand: string;
  competitors: string[];
  industry: string;
  region: string;
  createdAt: string;
  timestamp: number;
  datasetSnapshot: {
    entities: Entity[];
    competitors: CompetitorComparison[];
    mentions: MentionItem[];
    ipscanNodes: IPScanNode[];
    recommendations: CompetitiveRecommendation[];
    leads: LeadItem[];
    crisis: CrisisIncident;
    campaigns: CampaignPlan[];
  };
}


