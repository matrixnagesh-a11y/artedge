"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Tenant,
  UserProfile,
  Entity,
  MentionItem,
  MentionComment,
  IPScanNode,
  IPScanFilter,
  CompetitorComparison,
  CompetitiveRecommendation,
  LeadItem,
  CrisisIncident,
  CampaignPlan,
  ComplianceRecord,
  ConnectorHealth,
  SentimentClass,
  UserRole,
  SubscriptionPlan,
  SubscriptionPlanId,
  SaaSBrandingConfig,
  OnboardingMethodology,
  TenantSaaSConfig,
  PastProject,
  AutoSelfServiceRule,
  PermissionDefinition,
  AccessAuditLog,
  TenantMfaPolicy,
} from "@/types";
import {
  MOCK_TENANTS,
  MOCK_USER,
  MOCK_USERS,
  MOCK_ENTITIES,
  MOCK_COMPETITORS_FIVE_WAY,
  MOCK_MENTIONS,
  MOCK_IPSCAN_NODES,
  MOCK_RECOMMENDATIONS,
  MOCK_LEADS,
  MOCK_CRISIS,
  MOCK_CAMPAIGNS,
  MOCK_COMPLIANCE,
  MOCK_CONNECTORS,
  MOCK_SUBSCRIPTION_PLANS,
  MOCK_TENANT_SAAS_CONFIGS,
  MOCK_AUTO_SELF_SERVICE_RULES,
  MOCK_PERMISSIONS,
  MOCK_ACCESS_AUDIT_LOGS,
  MOCK_TENANT_MFA_POLICY,
} from "@/data/mockData";
import { generateReplenishedDataset, ReplenishParams } from "@/lib/dataGenerator";

interface TenantContextType {
  activeTenant: Tenant;
  setActiveTenant: (tenant: Tenant) => void;
  user: UserProfile;
  setUserRole: (role: UserRole) => void;
  tenants: Tenant[];
  entities: Entity[];
  primaryEntity: Entity;
  competitors: CompetitorComparison[];
  mentions: MentionItem[];
  ipscanNodes: IPScanNode[];
  ipscanFilter: IPScanFilter;
  setIpscanFilter: React.Dispatch<React.SetStateAction<IPScanFilter>>;
  recommendations: CompetitiveRecommendation[];
  leads: LeadItem[];
  crisis: CrisisIncident;
  campaigns: CampaignPlan[];
  compliance: ComplianceRecord;
  connectors: ConnectorHealth[];

  // Date Range Filter & Entity Mode
  dateRange: "today" | "7d" | "30d" | "quarter" | "year";
  setDateRange: (range: "today" | "7d" | "30d" | "quarter" | "year") => void;
  entityType: "company" | "individual";
  setEntityType: (type: "company" | "individual") => void;

  // Data Replenishment Engine & Clean Workspace
  isReplenishing: boolean;
  replenishPhase: "idle" | "purging" | "populating" | "complete";
  replenishProgress: number; // 0 - 100
  replenishStatus: string;
  replenishTimeRemaining: number; // in seconds, e.g. 3.2
  replenishLogs: string[];
  lastReplenishSummary: {
    brand: string;
    purgedMentionsCount: number;
    populatedMentionsCount: number;
    durationSeconds: number;
    completedAt: string;
  } | null;
  clearLastReplenishSummary: () => void;
  replenishTenantData: (params: ReplenishParams) => Promise<void>;
  cleanDataMode: boolean;
  setCleanDataMode: (enabled: boolean) => void;
  clearWorkspaceData: () => void;

  // Past Projects & Prompt History Archive
  pastProjects: PastProject[];
  activeProjectId: string | null;
  restorePastProject: (projectId: string) => void;
  deletePastProject: (projectId: string) => void;

  // Comparison Setup Modals
  isPromptModalOpen: boolean;
  setIsPromptModalOpen: (open: boolean) => void;
  promptModalScope: "single" | "multi";
  setPromptModalScope: (scope: "single" | "multi") => void;
  isPastProjectsModalOpen: boolean;
  setIsPastProjectsModalOpen: (open: boolean) => void;
  startNewComparisonPrompt: (mode?: "company" | "individual", scope?: "single" | "multi") => void;
  refreshCurrentData: (saveSnapshot?: boolean) => Promise<void>;

  // SaaS & White-Label Management
  subscriptionPlans: SubscriptionPlan[];
  tenantSaaSConfigs: { [tenantId: string]: TenantSaaSConfig };
  currentTenantSaaSConfig: TenantSaaSConfig;
  updateTenantBranding: (branding: Partial<SaaSBrandingConfig>) => void;
  updateTenantPlan: (tenantId: string, planId: SubscriptionPlanId) => void;
  updateOnboardingMethodology: (tenantId: string, methodology: OnboardingMethodology) => void;
  extendTenantTrial: (tenantId: string, additionalDays: number) => void;

  // Interactive Actions
  correctMentionSentiment: (mentionId: string, newSentiment: SentimentClass) => void;
  toggleBookmarkMention: (mentionId: string) => void;
  assignAnalyst: (mentionId: string, analystName: string) => void;
  addInternalNote: (mentionId: string, note: string) => void;
  addCommentToMention: (mentionId: string, commentText: string, sentiment?: SentimentClass) => void;
  updateLeadStatus: (leadId: string, status: LeadItem["status"]) => void;
  approveHoldingStatement: (statementText: string) => void;
  addEntity: (newEntity: Partial<Entity>) => void;

  // Access Control, Auto Self-Service & Optional MFA
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  autoSelfServiceRules: AutoSelfServiceRule[];
  mfaPolicy: TenantMfaPolicy;
  permissions: PermissionDefinition[];
  auditLogs: AccessAuditLog[];
  selfServiceRegister: (data: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    requestedRole?: UserRole;
    enableOptionalMfa?: boolean;
    mfaMethod?: "totp" | "sms" | "passkey" | "recovery";
    tenantId?: string;
  }) => { success: boolean; requiresApproval: boolean; message: string; user?: UserProfile };
  approveSelfServiceUser: (userId: string) => void;
  rejectSelfServiceUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  updateUserMfaPreference: (
    userId: string,
    enabled: boolean,
    method?: "totp" | "sms" | "passkey" | "recovery",
    optionalPref?: "disabled" | "optional_prompt" | "always_required"
  ) => void;
  addAutoDomainRule: (rule: Omit<AutoSelfServiceRule, "id" | "createdAt">) => void;
  toggleAutoDomainRule: (ruleId: string) => void;
  deleteAutoDomainRule: (ruleId: string) => void;
  updateTenantMfaPolicy: (policy: Partial<TenantMfaPolicy>) => void;
  hasPermission: (permissionId: string) => boolean;
  switchActiveUser: (userId: string) => void;

  // 14-Day Free Version & 2-Day Paid Reminder
  trialStartedAt: string;
  trialExpiresAt: string;
  lastPaidPromptAt: string;
  trialDaysRemaining: number;
  trialDaysElapsed: number;
  isPaidUpgradeModalOpen: boolean;
  setIsPaidUpgradeModalOpen: (open: boolean) => void;
  dismissPaidPrompt: () => void;
  startOrRefreshFreeTrial: (email?: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const defaultInitDataset = generateReplenishedDataset({
  brandName: "Nikhil Kumaraswamy",
  entityType: "individual",
  competitorNames: ["C.P. Yogeshwara", "D.K. Suresh", "H.D. Kumaraswamy", "A. Manjunath"],
  industry: "politics",
  region: "India",
});

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [activeTenant, setActiveTenant] = useState<Tenant>({
    ...MOCK_TENANTS[0],
    name: "Nikhil Kumaraswamy Intelligence (Personal Brand)",
    mode: "personal_brand",
  });
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [entities, setEntities] = useState<Entity[]>([
    {
      id: "ent-nikhil",
      tenantId: "tenant-active",
      name: "Nikhil Kumaraswamy",
      type: "individual",
      websiteUrl: "https://nikhilkumaraswamy.in",
      socialUrls: { x: "https://x.com/nikhil_kswamy" },
      industry: "Public Leadership & Politics",
      country: "India",
      state: "Karnataka",
      city: "Ramanagara",
      aliases: ["Nikhil Kumaraswamy", "Nikhil K", "Nikhil Ramanagara"],
      hashtags: ["#NikhilKumaraswamy", "#Ramanagara", "#Channapatna", "#Karnataka"],
      keywords: ["Nikhil", "Kumaraswamy", "Ramanagara", "Channapatna", "constituency"],
      exclusions: [],
      isPrimary: true,
    },
  ]);
  const [competitors, setCompetitors] = useState<CompetitorComparison[]>(defaultInitDataset.competitors);
  const [mentions, setMentions] = useState<MentionItem[]>(defaultInitDataset.mentions);
  const [ipscanNodes, setIpscanNodes] = useState<IPScanNode[]>(defaultInitDataset.ipscanNodes);
  const [ipscanFilter, setIpscanFilter] = useState<IPScanFilter>({
    query: "all",
    isGlobalWorldwide: true,
  });
  const [recommendations, setRecommendations] = useState<CompetitiveRecommendation[]>(defaultInitDataset.recommendations);
  const [leads, setLeads] = useState<LeadItem[]>(defaultInitDataset.leads);
  const [crisis, setCrisis] = useState<CrisisIncident>(defaultInitDataset.crisis);
  const [campaigns, setCampaigns] = useState<CampaignPlan[]>(MOCK_CAMPAIGNS);
  const [compliance] = useState<ComplianceRecord>(MOCK_COMPLIANCE);
  const [connectors] = useState<ConnectorHealth[]>(MOCK_CONNECTORS);

  // Access Control, Auto Self-Service & Optional MFA
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [autoSelfServiceRules, setAutoSelfServiceRules] = useState<AutoSelfServiceRule[]>(MOCK_AUTO_SELF_SERVICE_RULES);
  const [mfaPolicy, setMfaPolicy] = useState<TenantMfaPolicy>(MOCK_TENANT_MFA_POLICY);
  const [permissions] = useState<PermissionDefinition[]>(MOCK_PERMISSIONS);
  const [auditLogs, setAuditLogs] = useState<AccessAuditLog[]>(MOCK_ACCESS_AUDIT_LOGS);

  // Global Setup Modals
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptModalScope, setPromptModalScope] = useState<"single" | "multi">("single");
  const [isPastProjectsModalOpen, setIsPastProjectsModalOpen] = useState(false);

  // Date Range and Entity Mode State
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d" | "quarter" | "year">("7d");
  const [entityType, setEntityTypeState] = useState<"company" | "individual">("individual");

  // Dynamic 2-Phase Replenishment Engine State
  const [isReplenishing, setIsReplenishing] = useState(false);
  const [replenishPhase, setReplenishPhase] = useState<"idle" | "purging" | "populating" | "complete">("idle");
  const [replenishProgress, setReplenishProgress] = useState(0);
  const [replenishStatus, setReplenishStatus] = useState("");
  const [replenishTimeRemaining, setReplenishTimeRemaining] = useState(0);
  const [replenishLogs, setReplenishLogs] = useState<string[]>([]);
  const [lastReplenishSummary, setLastReplenishSummary] = useState<{
    brand: string;
    purgedMentionsCount: number;
    populatedMentionsCount: number;
    durationSeconds: number;
    completedAt: string;
  } | null>(null);

  // Past Projects & Clean Data State
  const [cleanDataMode, setCleanDataMode] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>("proj-init-1");
  const [pastProjects, setPastProjects] = useState<PastProject[]>([
    {
      id: "proj-init-1",
      projectName: "Maybank vs Regional Peer Banks (5-Way Benchmark)",
      prompt: "Benchmark mobile banking satisfaction, digital security trust, and 5-way competitor market share of voice.",
      entityType: "company",
      primaryBrand: "Maybank",
      competitors: ["CIMB Bank", "Public Bank", "RHB Bank", "Hong Leong Bank"],
      industry: "Banking & Financial Services",
      region: "Malaysia & ASEAN",
      createdAt: "Aug 31, 2026, 09:30 AM",
      timestamp: Date.now() - 86400000,
      datasetSnapshot: {
        entities: MOCK_ENTITIES,
        competitors: MOCK_COMPETITORS_FIVE_WAY,
        mentions: MOCK_MENTIONS,
        ipscanNodes: MOCK_IPSCAN_NODES,
        recommendations: MOCK_RECOMMENDATIONS,
        leads: MOCK_LEADS,
        crisis: MOCK_CRISIS,
        campaigns: MOCK_CAMPAIGNS,
      },
    },
  ]);

  // SaaS Subscription and Branding State
  const [subscriptionPlans] = useState<SubscriptionPlan[]>(MOCK_SUBSCRIPTION_PLANS as SubscriptionPlan[]);
  const [tenantSaaSConfigs, setTenantSaaSConfigs] = useState<{ [tenantId: string]: TenantSaaSConfig }>(
    MOCK_TENANT_SAAS_CONFIGS
  );

  const currentTenantSaaSConfig: TenantSaaSConfig = tenantSaaSConfigs[activeTenant.id] || {
    tenantId: activeTenant.id,
    currentPlanId: "free_trial",
    trialStartedAt: new Date().toISOString(),
    trialExpiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    isTrialActive: true,
    onboardingMethodology: "ios_wizard",
    branding: {
      productName: "ArtEDGE SaaS",
      tagline: "Social Media Intelligence & Benchmarking",
      primaryColor: "#4C7FF7",
      accentColor: "#E8A317",
      darkNavyColor: "#0F172A",
      logoUrl: "",
      faviconUrl: "",
      customDomain: "",
      supportEmail: "support@matrix-iot.com",
      customFooterText: "© Matrix IoT Solutions Sdn Bhd",
      hideMatrixIoTPoweredBy: false, // Locked to false on free tier
    },
  };

  const primaryEntity = entities.find((e) => e.isPrimary) || entities[0];

  // 14-Day Free Version & 2-Day Paid Reminder State
  const defaultTrialStart = new Date(Date.now() - 2 * 86400000).toISOString(); // Defaults to Day 2
  const [trialStartedAt, setTrialStartedAt] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("artedge_trial_started_at") || defaultTrialStart;
    }
    return defaultTrialStart;
  });

  const [trialExpiresAt, setTrialExpiresAt] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("artedge_trial_expires_at");
      if (stored) return stored;
    }
    const started = typeof window !== "undefined" ? (localStorage.getItem("artedge_trial_started_at") || defaultTrialStart) : defaultTrialStart;
    return new Date(new Date(started).getTime() + 14 * 86400000).toISOString();
  });

  const [lastPaidPromptAt, setLastPaidPromptAt] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("artedge_last_paid_prompt_at") || defaultTrialStart;
    }
    return defaultTrialStart;
  });

  const [isPaidUpgradeModalOpen, setIsPaidUpgradeModalOpen] = useState<boolean>(false);

  // Calculate elapsed days & remaining days
  const nowMs = Date.now();
  const startMs = new Date(trialStartedAt).getTime();
  const expiryMs = new Date(trialExpiresAt).getTime();
  const trialDaysElapsed = Math.min(14, Math.max(1, Math.floor((nowMs - startMs) / 86400000) + 1));
  const trialDaysRemaining = Math.max(0, Math.ceil((expiryMs - nowMs) / 86400000));

  // Check if 2 days (48h) have passed since last prompt
  React.useEffect(() => {
    const lastPromptMs = new Date(lastPaidPromptAt).getTime();
    const diffHours = (Date.now() - lastPromptMs) / (1000 * 60 * 60);
    // If 48+ hours have elapsed (every 2 days) and still on free trial, trigger modal
    if (diffHours >= 48) {
      const timer = setTimeout(() => {
        setIsPaidUpgradeModalOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lastPaidPromptAt]);

  const dismissPaidPrompt = () => {
    const newPromptTime = new Date().toISOString();
    setLastPaidPromptAt(newPromptTime);
    setIsPaidUpgradeModalOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("artedge_last_paid_prompt_at", newPromptTime);
    }
  };

  const startOrRefreshFreeTrial = (email?: string) => {
    const newStart = new Date().toISOString();
    const newExpiry = new Date(Date.now() + 14 * 86400000).toISOString();
    setTrialStartedAt(newStart);
    setTrialExpiresAt(newExpiry);
    setLastPaidPromptAt(newStart);
    setIsPaidUpgradeModalOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("artedge_trial_started_at", newStart);
      localStorage.setItem("artedge_trial_expires_at", newExpiry);
      localStorage.setItem("artedge_last_paid_prompt_at", newStart);
      if (email) localStorage.setItem("artedge_current_user_email", email);
    }
  };

  const setUserRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
  };

  // Past Projects & Clean Data Methods
  const clearWorkspaceData = () => {
    // Snapshot current before clearing
    const snapshotProject: PastProject = {
      id: `proj-${Date.now()}`,
      projectName: `${primaryEntity.name} Snapshot (${entityType === "individual" ? "Individual" : "Company"})`,
      prompt: activeTenant.name || `Intelligence scan for ${primaryEntity.name}`,
      entityType: entityType,
      primaryBrand: primaryEntity.name,
      competitors: competitors.filter((c) => !c.isPrimary).map((c) => c.name),
      industry: primaryEntity.industry,
      region: primaryEntity.country,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      datasetSnapshot: {
        entities: [...entities],
        competitors: [...competitors],
        mentions: [...mentions],
        ipscanNodes: [...ipscanNodes],
        recommendations: [...recommendations],
        leads: [...leads],
        crisis: { ...crisis },
        campaigns: [...campaigns],
      },
    };

    setPastProjects((prev) => [snapshotProject, ...prev]);
    setActiveProjectId(null);
    setMentions([]);
    setLeads([]);
  };

  const restorePastProject = (projectId: string) => {
    const found = pastProjects.find((p) => p.id === projectId);
    if (!found) return;

    setActiveProjectId(found.id);
    setEntityTypeState(found.entityType);
    setEntities(found.datasetSnapshot.entities);
    setCompetitors(found.datasetSnapshot.competitors);
    setMentions(found.datasetSnapshot.mentions);
    setIpscanNodes(found.datasetSnapshot.ipscanNodes);
    setRecommendations(found.datasetSnapshot.recommendations);
    setLeads(found.datasetSnapshot.leads);
    setCrisis(found.datasetSnapshot.crisis);
    setCampaigns(found.datasetSnapshot.campaigns);
    setActiveTenant((prev) => ({
      ...prev,
      name: `${found.primaryBrand} Intelligence (${found.entityType === "individual" ? "Personal Brand" : "Company"})`,
      mode: found.entityType === "individual" ? "personal_brand" : "company",
    }));
  };

  const deletePastProject = (projectId: string) => {
    setPastProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
    }
  };

  // SaaS Actions
  const updateTenantBranding = (newBranding: Partial<SaaSBrandingConfig>) => {
    const isFreeTrial = currentTenantSaaSConfig.currentPlanId === "free_trial";
    setTenantSaaSConfigs((prev) => {
      const current = prev[activeTenant.id] || currentTenantSaaSConfig;
      return {
        ...prev,
        [activeTenant.id]: {
          ...current,
          branding: {
            ...current.branding,
            ...newBranding,
            // Enforce free tier branding rule: Free trial cannot remove Matrix IoT watermark!
            hideMatrixIoTPoweredBy: isFreeTrial ? false : (newBranding.hideMatrixIoTPoweredBy ?? current.branding.hideMatrixIoTPoweredBy),
          },
        },
      };
    });
  };

  const updateTenantPlan = (tenantId: string, planId: SubscriptionPlanId) => {
    setTenantSaaSConfigs((prev) => {
      const current = prev[tenantId] || currentTenantSaaSConfig;
      const isFree = planId === "free_trial";
      return {
        ...prev,
        [tenantId]: {
          ...current,
          currentPlanId: planId,
          isTrialActive: isFree,
          branding: {
            ...current.branding,
            // If downgraded to free, restore Matrix IoT watermark
            hideMatrixIoTPoweredBy: isFree ? false : current.branding.hideMatrixIoTPoweredBy,
          },
        },
      };
    });
  };

  const updateOnboardingMethodology = (tenantId: string, methodology: OnboardingMethodology) => {
    setTenantSaaSConfigs((prev) => {
      const current = prev[tenantId] || currentTenantSaaSConfig;
      return {
        ...prev,
        [tenantId]: {
          ...current,
          onboardingMethodology: methodology,
        },
      };
    });
  };

  const extendTenantTrial = (tenantId: string, additionalDays: number) => {
    setTenantSaaSConfigs((prev) => {
      const current = prev[tenantId] || currentTenantSaaSConfig;
      const expiry = new Date(current.trialExpiresAt);
      expiry.setDate(expiry.getDate() + additionalDays);
      return {
        ...prev,
        [tenantId]: {
          ...current,
          trialExpiresAt: expiry.toISOString(),
          isTrialActive: true,
        },
      };
    });
  };

  const correctMentionSentiment = (mentionId: string, newSentiment: SentimentClass) => {
    setMentions((prev) =>
      prev.map((m) => {
        if (m.id === mentionId) {
          const trafficLight =
            newSentiment.includes("positive") ? "happy" : newSentiment.includes("negative") ? "alert" : "ok";
          return {
            ...m,
            sentiment: newSentiment,
            sentimentTrafficLight: trafficLight,
            manuallyOverridden: true,
          };
        }
        return m;
      })
    );
  };

  const toggleBookmarkMention = (mentionId: string) => {
    setMentions((prev) =>
      prev.map((m) => (m.id === mentionId ? { ...m, isBookmarked: !m.isBookmarked } : m))
    );
  };

  const assignAnalyst = (mentionId: string, analystName: string) => {
    setMentions((prev) =>
      prev.map((m) => (m.id === mentionId ? { ...m, assignedTo: analystName } : m))
    );
  };

  const addInternalNote = (mentionId: string, note: string) => {
    setMentions((prev) =>
      prev.map((m) =>
        m.id === mentionId
          ? {
              ...m,
              internalNotes: [...(m.internalNotes || []), `${new Date().toLocaleDateString()}: ${note}`],
            }
          : m
      )
    );
  };

  const addCommentToMention = (mentionId: string, commentText: string, sentiment: SentimentClass = "neutral") => {
    const newComment: MentionComment = {
      id: `comm-manual-${Date.now()}`,
      mentionId,
      author: {
        name: user.name,
        handle: `@${user.name.toLowerCase().replace(/\s+/g, "_")}`,
        avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        influenceScore: 70,
        isVerified: true,
      },
      content: commentText,
      sentiment: sentiment,
      sentimentTrafficLight: sentiment.includes("positive") ? "happy" : sentiment.includes("negative") ? "alert" : "ok",
      publishedAt: "Just now",
      ipAddress: "175.143.120.45",
      geoPosition: {
        country: "Malaysia",
        countryCode: "MY",
        region: "Wilayah Persekutuan",
        city: "Kuala Lumpur",
        lat: 3.139,
        lng: 101.6869,
        isp: "TM Net",
      },
      likes: 0,
    };

    setMentions((prev) =>
      prev.map((m) => {
        if (m.id === mentionId) {
          const currentComments = m.comments || [];
          return {
            ...m,
            comments: [newComment, ...currentComments],
            commentCount: (m.commentCount || currentComments.length) + 1,
          };
        }
        return m;
      })
    );
  };

  const updateLeadStatus = (leadId: string, status: LeadItem["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
  };

  const approveHoldingStatement = (statementText: string) => {
    setCrisis((prev) => ({
      ...prev,
      holdingStatement: statementText,
      status: "mitigated",
    }));
  };

  // Entity Type Toggle
  const setEntityType = async (type: "company" | "individual") => {
    setEntityTypeState(type);
    const currentName = primaryEntity?.name || "";
    const isCurrentlyIndividual = type === "individual";
    const defaultBrand = isCurrentlyIndividual ? "Nikhil Kumaraswamy" : "Maybank";
    await replenishTenantData({
      brandName: currentName.includes("Maybank") || currentName.includes("Tan Sri") || currentName.includes("Nikhil") ? defaultBrand : currentName,
      entityType: type,
      competitorNames: isCurrentlyIndividual
        ? ["C.P. Yogeshwara", "D.K. Suresh", "H.D. Kumaraswamy", "A. Manjunath"]
        : ["CIMB Bank", "Public Bank", "RHB Bank", "Hong Leong Bank"],
      prompt: isCurrentlyIndividual
        ? "Compare constituency voter sentiment, campaign rally reach, infrastructure development promises, and public trust across all 5 political candidates in Ramanagara."
        : "Benchmark mobile banking satisfaction, digital security trust, and 5-way competitor market share of voice.",
    });
  };

  // Data Replenishment Engine with Auto Past Project Archiving & 2-Phase Progress
  const replenishTenantData = async (params: ReplenishParams) => {
    const activeType = params.entityType || entityType;
    setEntityTypeState(activeType);
    setIsReplenishing(true);
    setReplenishPhase("purging");
    setReplenishProgress(5);
    setReplenishTimeRemaining(3.8);

    const logs: string[] = [];
    const addLog = (msg: string) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      setReplenishLogs([...logs]);
    };

    const priorBrand = primaryEntity?.name || "Previous Brand";
    const oldMentionsCount = mentions.length;
    const oldCompetitorsCount = competitors.length;

    addLog(`Initiating replenishment routine for: "${params.brandName}" (${activeType === "individual" ? "Executive Leader" : "Corporate Enterprise"})`);

    // Step 1: Archive previous project snapshot into pastProjects if requested
    if (params.saveCurrentProject !== false && primaryEntity?.name) {
      addLog(`Archiving current workspace for "${priorBrand}" into Past Projects...`);
      setReplenishProgress(12);
      setReplenishTimeRemaining(3.5);
      setReplenishStatus(`Archiving "${priorBrand}" dataset to Past Projects...`);

      const priorProject: PastProject = {
        id: `proj-${Date.now()}`,
        projectName: `${primaryEntity.name} (${entityType === "individual" ? "Individual" : "Company"})`,
        prompt: params.prompt || `Competitive scan for ${primaryEntity.name}`,
        entityType: entityType,
        primaryBrand: primaryEntity.name,
        competitors: competitors.filter((c) => !c.isPrimary).map((c) => c.name),
        industry: primaryEntity.industry,
        region: primaryEntity.country,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        timestamp: Date.now(),
        datasetSnapshot: {
          entities: [...entities],
          competitors: [...competitors],
          mentions: [...mentions],
          ipscanNodes: [...ipscanNodes],
          recommendations: [...recommendations],
          leads: [...leads],
          crisis: { ...crisis },
          campaigns: [...campaigns],
        },
      };

      setPastProjects((prev) => {
        const filtered = prev.filter((p) => p.projectName !== priorProject.projectName);
        return [priorProject, ...filtered.slice(0, 19)];
      });
      addLog(`✓ Snapshot saved successfully. Past Projects archive count: ${pastProjects.length + 1}`);
    } else {
      addLog(`Permanent delete requested — skipping archive for "${priorBrand}".`);
    }

    await new Promise((r) => setTimeout(r, 400));

    // Step 2: WIPE THE OLD DATA IMMEDIATELY (Phase 1 Clean Bar)
    setReplenishProgress(28);
    setReplenishTimeRemaining(2.9);
    setReplenishStatus(`🧹 Purging old data: Clearing ${oldMentionsCount} mentions & resetting workspace memory...`);
    addLog(`Purging ${oldMentionsCount} old mentions, ${oldCompetitorsCount} competitor models, and lead caches.`);

    // Genuine immediate memory clear so workspace is truly empty
    setMentions([]);
    setCompetitors([]);
    setLeads([]);
    setRecommendations([]);
    setIpscanNodes([]);

    await new Promise((r) => setTimeout(r, 600));

    setReplenishProgress(42);
    setReplenishTimeRemaining(2.2);
    setReplenishStatus(`🧹 Cleaning cache indices, sentiment graphs & forensic telemetry buffers...`);
    addLog(`✓ Memory buffer cleared. Workspace verified clean (0 items).`);

    await new Promise((r) => setTimeout(r, 500));

    // Phase 2: SYNTHESIZE & POPULATE NEW DATA ACCORDING TO PROMPT
    setReplenishPhase("populating");
    setReplenishProgress(58);
    setReplenishTimeRemaining(1.6);
    setReplenishStatus(`📡 Connecting to 6 ASEAN social channels for "${params.brandName}"...`);
    addLog(`Crawling X, Facebook, TikTok, Lowyat, Reddit & digital news streams for "${params.brandName}"...`);

    await new Promise((r) => setTimeout(r, 500));

    setReplenishProgress(75);
    setReplenishTimeRemaining(1.0);
    setReplenishStatus(`⚖️ Synthesizing 5-way competitor arena & Share of Voice for "${params.brandName}"...`);
    addLog(`Constructing 5-way competitor benchmark matrices and topic heatmaps...`);

    await new Promise((r) => setTimeout(r, 500));

    setReplenishProgress(90);
    setReplenishTimeRemaining(0.4);
    setReplenishStatus(`🧠 Processing multilingual sentiment NLP (BM, Manglish, EN) & traffic lights...`);
    addLog(`Classifying emotional triggers, credibility indicators, and sales lead opportunities...`);

    const dataset = generateReplenishedDataset({ ...params, entityType: activeType });

    const newProjectId = `proj-active-${Date.now()}`;
    setActiveProjectId(newProjectId);

    // Update primary entity & tenant title
    const updatedPrimaryEntity: Entity = {
      id: `ent-${Date.now()}`,
      tenantId: activeTenant.id,
      name: dataset.brandName,
      type: activeType === "individual" ? "individual" : "company",
      websiteUrl: `https://${dataset.brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com.my`,
      socialUrls: {},
      industry: dataset.industry,
      country: params.region || "Malaysia",
      state: "Wilayah Persekutuan",
      city: "Kuala Lumpur",
      aliases: [dataset.brandName, `${dataset.brandName} MY`, `${dataset.brandName} Asia`],
      hashtags: [`#${dataset.brandName.replace(/\s+/g, "")}`, "#Malaysia", "#ASEAN"],
      keywords: [dataset.brandName, "interview", "leadership", "policy", "industry"],
      exclusions: [],
      isPrimary: true,
    };

    setEntities([updatedPrimaryEntity]);
    setActiveTenant((prev) => ({
      ...prev,
      name: `${dataset.brandName} Intelligence (${activeType === "individual" ? "Personal Brand" : "Company"})`,
      mode: activeType === "individual" ? "personal_brand" : "company",
    }));

    setCompetitors(dataset.competitors);
    setMentions(dataset.mentions);
    setLeads(dataset.leads);
    setRecommendations(dataset.recommendations);
    setCrisis(dataset.crisis);
    setIpscanNodes(dataset.ipscanNodes);

    await new Promise((r) => setTimeout(r, 300));

    setReplenishProgress(100);
    setReplenishTimeRemaining(0);
    setReplenishPhase("complete");
    setReplenishStatus(`✅ Clean data replenishment 100% complete for ${dataset.brandName}!`);
    addLog(`✓ Populated ${dataset.mentions.length} fresh mentions, ${dataset.competitors.length} competitors, and lead signals.`);

    setLastReplenishSummary({
      brand: dataset.brandName,
      purgedMentionsCount: oldMentionsCount,
      populatedMentionsCount: dataset.mentions.length,
      durationSeconds: 3.8,
      completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    });

    await new Promise((r) => setTimeout(r, 800));
    setIsReplenishing(false);
    setReplenishPhase("idle");
  };

  const clearLastReplenishSummary = () => setLastReplenishSummary(null);

  const refreshCurrentData = async (saveSnapshot: boolean = true) => {
    const isSingle = competitors.length <= 1;
    const compNames = competitors.filter((c) => !c.isPrimary).map((c) => c.name);
    await replenishTenantData({
      brandName: primaryEntity.name,
      entityType: entityType,
      isSingleEntity: isSingle,
      competitorNames: isSingle ? [] : compNames,
      industry: primaryEntity.industry,
      region: primaryEntity.country,
      location: primaryEntity.city,
      saveCurrentProject: saveSnapshot,
      prompt: isSingle
        ? `Refreshed real-time telemetry, sentiment audit and 5-pillar standing profile for ${primaryEntity.name}`
        : `Refreshed real-time comparative benchmark for ${primaryEntity.name} against ${compNames.join(", ")}`,
    });
  };

  const addEntity = (newEntity: Partial<Entity>) => {
    const created: Entity = {
      id: `ent-${Date.now()}`,
      tenantId: activeTenant.id,
      name: newEntity.name || "New Monitored Brand",
      type: newEntity.type || "company",
      websiteUrl: newEntity.websiteUrl || "https://example.com",
      socialUrls: newEntity.socialUrls || {},
      industry: newEntity.industry || "General",
      country: newEntity.country || "Malaysia",
      state: newEntity.state || "Kuala Lumpur",
      city: newEntity.city || "Kuala Lumpur",
      aliases: newEntity.aliases || [],
      hashtags: newEntity.hashtags || [],
      keywords: newEntity.keywords || [],
      exclusions: newEntity.exclusions || [],
      isPrimary: false,
    };
    setEntities((prev) => [...prev, created]);
  };

  // Access Control, Auto Self-Service & Optional MFA Functions
  const selfServiceRegister = (data: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    requestedRole?: UserRole;
    enableOptionalMfa?: boolean;
    mfaMethod?: "totp" | "sms" | "passkey" | "recovery";
    tenantId?: string;
  }) => {
    const emailDomain = data.email.includes("@") ? data.email.split("@")[1].toLowerCase() : "";
    const matchedRule = autoSelfServiceRules.find(
      (r) => r.status === "active" && emailDomain === r.domain.toLowerCase().replace(/^@/, "")
    );

    const targetTenantId = data.tenantId || matchedRule?.tenantId || activeTenant.id;
    const assignedRole = matchedRule ? matchedRule.defaultRole : (data.requestedRole || "analyst");
    const autoApprove = matchedRule ? matchedRule.autoApprove : false;
    const initialStatus: "active" | "pending_approval" = autoApprove ? "active" : "pending_approval";

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      tenantId: targetTenantId,
      name: data.name,
      email: data.email,
      role: assignedRole,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      department: data.department || "General",
      jobTitle: data.jobTitle || "Team Member",
      phone: "+60 12-000 0000",
      status: initialStatus,
      provisioningType: matchedRule ? "auto_domain_self_service" : "manual_invite",
      mfaEnabled: !!data.enableOptionalMfa,
      mfaMethod: data.mfaMethod || "totp",
      mfaOptionalPreference: data.enableOptionalMfa ? "optional_prompt" : "disabled",
      createdAt: new Date().toISOString(),
      lastLoginAt: autoApprove ? new Date().toISOString() : undefined,
    };

    setUsers((prev) => [newUser, ...prev]);

    const newLog: AccessAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: newUser.id,
      userName: newUser.name,
      userEmail: newUser.email,
      action: "self_service_register",
      details: matchedRule
        ? `Self-service auto-registered via domain rule '${matchedRule.domain}' (Role: ${assignedRole}, Status: ${initialStatus}, MFA: ${newUser.mfaEnabled ? "Optional " + newUser.mfaMethod : "Disabled"}).`
        : `Self-service registration submitted without auto-approval rule. Status queued as pending_approval for admin review.`,
      ipAddress: "175.143.19.22",
      location: "Kuala Lumpur, Malaysia",
      severity: autoApprove ? "info" : "warning",
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    return {
      success: true,
      requiresApproval: !autoApprove,
      message: autoApprove
        ? `Account verified and active! Welcome to ArtEDGE (${assignedRole.replace("_", " ")}).`
        : `Registration received! Your corporate account has been queued for Client Admin approval.`,
      user: newUser,
    };
  };

  const approveSelfServiceUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status: "active" as const };
          setAuditLogs((l) => [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              userId: u.id,
              userName: u.name,
              userEmail: u.email,
              action: "self_service_approved",
              details: `Self-service user registration approved by administrator (${user.name}). Full access granted.`,
              ipAddress: "175.143.22.84",
              location: "Kuala Lumpur, Malaysia",
              severity: "info",
            },
            ...l,
          ]);
          return updated;
        }
        return u;
      })
    );
  };

  const rejectSelfServiceUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status: "suspended" as const };
          setAuditLogs((l) => [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              userId: u.id,
              userName: u.name,
              userEmail: u.email,
              action: "self_service_rejected",
              details: `Self-service user registration rejected / suspended by administrator (${user.name}).`,
              ipAddress: "175.143.22.84",
              location: "Kuala Lumpur, Malaysia",
              severity: "warning",
            },
            ...l,
          ]);
          return updated;
        }
        return u;
      })
    );
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const oldRole = u.role;
          setAuditLogs((l) => [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              userId: u.id,
              userName: u.name,
              userEmail: u.email,
              action: "role_changed",
              details: `RBAC role updated from '${oldRole}' to '${newRole}' by administrator (${user.name}).`,
              ipAddress: "175.143.22.84",
              location: "Kuala Lumpur, Malaysia",
              severity: "security",
            },
            ...l,
          ]);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
    if (user.id === userId) {
      setUser((prev) => ({ ...prev, role: newRole }));
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "active" ? ("suspended" as const) : ("active" as const);
          setAuditLogs((l) => [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              userId: u.id,
              userName: u.name,
              userEmail: u.email,
              action: "status_changed",
              details: `User status changed to '${newStatus}' by administrator (${user.name}).`,
              ipAddress: "175.143.22.84",
              location: "Kuala Lumpur, Malaysia",
              severity: newStatus === "suspended" ? "warning" : "info",
            },
            ...l,
          ]);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const updateUserMfaPreference = (
    userId: string,
    enabled: boolean,
    method: "totp" | "sms" | "passkey" | "recovery" = "totp",
    optionalPref: "disabled" | "optional_prompt" | "always_required" = enabled ? "optional_prompt" : "disabled"
  ) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = {
            ...u,
            mfaEnabled: enabled,
            mfaMethod: method,
            mfaOptionalPreference: optionalPref,
          };
          setAuditLogs((l) => [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              userId: u.id,
              userName: u.name,
              userEmail: u.email,
              action: "mfa_toggled",
              details: `User MFA configuration updated: enabled=${enabled}, method=${method}, policy=${optionalPref}.`,
              ipAddress: "175.143.22.84",
              location: "Kuala Lumpur, Malaysia",
              severity: "security",
            },
            ...l,
          ]);
          return updated;
        }
        return u;
      })
    );
    if (user.id === userId) {
      setUser((prev) => ({
        ...prev,
        mfaEnabled: enabled,
        mfaMethod: method,
        mfaOptionalPreference: optionalPref,
      }));
    }
  };

  const addAutoDomainRule = (rule: Omit<AutoSelfServiceRule, "id" | "createdAt">) => {
    const newRule: AutoSelfServiceRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAutoSelfServiceRules((prev) => [newRule, ...prev]);
    setAuditLogs((l) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userName: user.name,
        userEmail: user.email,
        action: "policy_updated",
        details: `Added new auto self-service corporate domain rule '${newRule.domain}' (Default Role: ${newRule.defaultRole}, Auto-approve: ${newRule.autoApprove}).`,
        ipAddress: "175.143.22.84",
        location: "Kuala Lumpur, Malaysia",
        severity: "info",
      },
      ...l,
    ]);
  };

  const toggleAutoDomainRule = (ruleId: string) => {
    setAutoSelfServiceRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, status: r.status === "active" ? "paused" : "active" } : r))
    );
  };

  const deleteAutoDomainRule = (ruleId: string) => {
    setAutoSelfServiceRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const updateTenantMfaPolicy = (policy: Partial<TenantMfaPolicy>) => {
    setMfaPolicy((prev) => {
      const updated = { ...prev, ...policy };
      setAuditLogs((l) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userName: user.name,
          userEmail: user.email,
          action: "policy_updated",
          details: `Workspace MFA Policy updated to enforcement='${updated.enforcementLevel}', rememberDeviceDays=${updated.rememberDeviceDays}.`,
          ipAddress: "175.143.22.84",
          location: "Kuala Lumpur, Malaysia",
          severity: "security",
        },
        ...l,
      ]);
      return updated;
    });
  };

  const hasPermission = (permissionId: string): boolean => {
    const perm = permissions.find((p) => p.id === permissionId);
    if (!perm) return true;
    return perm.defaultRoles.includes(user.role);
  };

  const switchActiveUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      setAuditLogs((l) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: found.id,
          userName: found.name,
          userEmail: found.email,
          action: "login_success",
          details: `Switched active workspace user session to ${found.name} (${found.role}).`,
          ipAddress: "175.143.22.84",
          location: "Kuala Lumpur, Malaysia",
          severity: "info",
        },
        ...l,
      ]);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        activeTenant,
        setActiveTenant,
        user,
        setUserRole,
        tenants,
        entities,
        primaryEntity,
        competitors,
        mentions,
        ipscanNodes,
        ipscanFilter,
        setIpscanFilter,
        recommendations,
        leads,
        crisis,
        campaigns,
        compliance,
        connectors,
        dateRange,
        setDateRange,
        entityType,
        setEntityType,
        isReplenishing,
        replenishPhase,
        replenishProgress,
        replenishStatus,
        replenishTimeRemaining,
        replenishLogs,
        lastReplenishSummary,
        clearLastReplenishSummary,
        replenishTenantData,
        cleanDataMode,
        setCleanDataMode,
        clearWorkspaceData,
        pastProjects,
        activeProjectId,
        restorePastProject,
        deletePastProject,
        isPromptModalOpen,
        setIsPromptModalOpen,
        promptModalScope,
        setPromptModalScope,
        isPastProjectsModalOpen,
        setIsPastProjectsModalOpen,
        startNewComparisonPrompt: (mode?: "company" | "individual", scope?: "single" | "multi") => {
          if (mode) {
            setEntityTypeState(mode);
          }
          if (scope) {
            setPromptModalScope(scope);
          }
          setIsPromptModalOpen(true);
        },
        refreshCurrentData,
        subscriptionPlans,
        tenantSaaSConfigs,
        currentTenantSaaSConfig,
        updateTenantBranding,
        updateTenantPlan,
        updateOnboardingMethodology,
        extendTenantTrial,
        correctMentionSentiment,
        toggleBookmarkMention,
        assignAnalyst,
        addInternalNote,
        addCommentToMention,
        updateLeadStatus,
        approveHoldingStatement,
        addEntity,
        users,
        setUsers,
        autoSelfServiceRules,
        mfaPolicy,
        permissions,
        auditLogs,
        selfServiceRegister,
        approveSelfServiceUser,
        rejectSelfServiceUser,
        updateUserRole,
        toggleUserStatus,
        updateUserMfaPreference,
        addAutoDomainRule,
        toggleAutoDomainRule,
        deleteAutoDomainRule,
        updateTenantMfaPolicy,
        hasPermission,
        switchActiveUser,
        trialStartedAt,
        trialExpiresAt,
        lastPaidPromptAt,
        trialDaysRemaining,
        trialDaysElapsed,
        isPaidUpgradeModalOpen,
        setIsPaidUpgradeModalOpen,
        dismissPaidPrompt,
        startOrRefreshFreeTrial,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
