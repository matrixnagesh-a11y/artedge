"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { PlatformSource, SentimentClass, CredibilityClassification, MentionItem } from "@/types";
import { generateTrafficLightSentimentPdf, generateNegativeSentimentRiskPdf } from "@/lib/pdfReportEngine";
import {
  Search,
  Radio,
  ExternalLink,
  Bookmark,
  UserPlus,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Lock,
  Globe,
  MapPin,
  Wifi,
  Server,
  Activity,
  Layers,
  FileText,
  ChevronDown,
  ChevronUp,
  Send,
  SlidersHorizontal,
  Info,
  X,
  Code2,
} from "lucide-react";

export default function UniversalListeningPage() {
  const {
    primaryEntity,
    competitors,
    mentions,
    ipscanNodes,
    ipscanFilter,
    setIpscanFilter,
    correctMentionSentiment,
    toggleBookmarkMention,
    assignAnalyst,
    addInternalNote,
    addCommentToMention,
    clearWorkspaceData,
    startNewComparisonPrompt,
  } = useTenant();

  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [credibilityFilter, setCredibilityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [selectedForensicsMention, setSelectedForensicsMention] = useState<MentionItem | null>(null);

  // IPSCAN Search Query & Node Matcher
  const activeNode = ipscanNodes.find((node) => {
    if (ipscanFilter.isGlobalWorldwide) return false;
    if (ipscanFilter.selectedNodeId && node.id === ipscanFilter.selectedNodeId) return true;
    if (ipscanFilter.query && ipscanFilter.query !== "all") {
      const q = ipscanFilter.query.toLowerCase();
      return (
        node.city.toLowerCase().includes(q) ||
        node.country.toLowerCase().includes(q) ||
        node.region.toLowerCase().includes(q) ||
        node.ipRange.toLowerCase().includes(q) ||
        node.asn.toLowerCase().includes(q) ||
        node.isp.toLowerCase().includes(q)
      );
    }
    return false;
  });

  // Filter mentions by IPSCAN Geographic Position or Worldwide
  const filteredMentions = mentions.filter((item) => {
    // 1. Geographic / IPSCAN Filter
    if (!ipscanFilter.isGlobalWorldwide && ipscanFilter.query && ipscanFilter.query !== "all") {
      const q = ipscanFilter.query.toLowerCase();
      const matchCity = item.geoPosition?.city.toLowerCase().includes(q) || false;
      const matchCountry = item.geoPosition?.country.toLowerCase().includes(q) || false;
      const matchRegion = item.geoPosition?.region.toLowerCase().includes(q) || false;
      const matchLocation = item.location?.toLowerCase().includes(q) || false;
      const matchIP = item.ipAddress?.includes(q) || false;
      const matchRange = item.geoPosition?.ipRange?.includes(q) || false;
      const matchISP = item.geoPosition?.isp?.toLowerCase().includes(q) || false;
      const matchASN = item.geoPosition?.asn?.toLowerCase().includes(q) || false;

      // Also check nested comments for geographic match
      const matchComments =
        item.comments?.some(
          (c) =>
            c.geoPosition?.city.toLowerCase().includes(q) ||
            c.geoPosition?.country.toLowerCase().includes(q) ||
            c.ipAddress?.includes(q)
        ) || false;

      if (!matchCity && !matchCountry && !matchRegion && !matchLocation && !matchIP && !matchRange && !matchISP && !matchASN && !matchComments) {
        return false;
      }
    }

    // 2. Standard Filters
    if (platformFilter !== "all" && item.platform !== platformFilter) return false;
    if (sentimentFilter !== "all" && item.sentiment !== sentimentFilter) return false;
    if (credibilityFilter !== "all" && item.credibility.classification !== credibilityFilter) return false;
    if (
      searchQuery &&
      !item.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.author.handle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.ipAddress?.includes(searchQuery)
    ) {
      return false;
    }
    return true;
  });

  // Total mentions & comments count in current scope
  const totalCommentsInScope = filteredMentions.reduce(
    (acc, m) => acc + (m.comments?.length || m.commentCount || 0),
    0
  );

  const toggleCommentsView = (mentionId: string) => {
    setExpandedComments((prev) => ({ ...prev, [mentionId]: !prev[mentionId] }));
  };

  const handleSendComment = (mentionId: string) => {
    const text = replyInputs[mentionId];
    if (!text || text.trim() === "") return;
    addCommentToMention(mentionId, text.trim(), "neutral");
    setReplyInputs((prev) => ({ ...prev, [mentionId]: "" }));
    setExpandedComments((prev) => ({ ...prev, [mentionId]: true }));
  };

  const handleSelectIPNode = (node: typeof ipscanNodes[0]) => {
    setIpscanFilter({
      query: node.city,
      isGlobalWorldwide: false,
      selectedNodeId: node.id,
      targetCity: node.city,
      targetCountry: node.country,
    });
  };

  const handleSetWorldwide = () => {
    setIpscanFilter({
      query: "all",
      isGlobalWorldwide: true,
      selectedNodeId: undefined,
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-slate-200/80 shadow-ios">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Universal Data Stream & IPSCAN Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Universal Listening & Geo-Position Feed
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Normalized digital content from official platform APIs, RSS feeds, and permitted public channels with live IP scan provenance, ASN geolocation, and nested threaded comments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to completely clear all workspace data to input a new comparison?")) {
                clearWorkspaceData();
                startNewComparisonPrompt("individual");
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1.5 transition-all border border-red-200 cursor-pointer"
            title="Wipe all data and input a fresh comparison"
          >
            <span>🧹 Clear All Data & Input New</span>
          </button>

          <button
            onClick={() => startNewComparisonPrompt("individual")}
            className="px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>+ Compare 5 New Entities</span>
          </button>

          <button
            onClick={() =>
              generateNegativeSentimentRiskPdf(
                primaryEntity,
                filteredMentions,
                competitors,
                ipscanFilter.isGlobalWorldwide ? "Global / Worldwide" : (ipscanFilter.query || "Filtered Geographic Area")
              )
            }
            className="px-3.5 py-2 rounded-xl bg-coral/10 hover:bg-coral/20 text-coral text-xs font-bold flex items-center gap-1.5 transition-all border border-coral/30"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-coral" />
            <span>Negative Sentiment PDF</span>
          </button>

          <button
            onClick={() =>
              generateTrafficLightSentimentPdf(
                primaryEntity,
                filteredMentions,
                competitors,
                ipscanFilter.isGlobalWorldwide ? "Global / Worldwide" : (ipscanFilter.query || "Filtered Geographic Area")
              )
            }
            className="px-3.5 py-2 rounded-xl bg-green/10 hover:bg-green/20 text-green text-xs font-bold flex items-center gap-1.5 transition-all border border-green/30"
          >
            <FileText className="w-3.5 h-3.5 text-green" />
            <span>Traffic Light PDF</span>
          </button>
        </div>
      </div>

      {/* IPSCAN & GEOGRAPHIC LOCATION CONTROLLER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 rounded-3xl border border-slate-700/60 shadow-ios space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-primary-light animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">IPSCAN Geographic Intelligence Radar</h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-teal/20 text-teal-light border border-teal/30 rounded-md">
                  Live Resolution
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Filter mentions, discussions & comments by specific IP subnet, city, or ASN node. When unselected, takes the whole world into consideration.
              </p>
            </div>
          </div>

          {/* Worldwide vs Area Mode Toggle */}
          <div className="flex items-center bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
            <button
              onClick={handleSetWorldwide}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                ipscanFilter.isGlobalWorldwide
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Whole World (Global)</span>
            </button>
            <button
              onClick={() => {
                if (ipscanFilter.isGlobalWorldwide) {
                  handleSelectIPNode(ipscanNodes[0]);
                }
              }}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                !ipscanFilter.isGlobalWorldwide
                  ? "bg-teal text-white shadow-md shadow-teal/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Target Geographic Area / IP</span>
            </button>
          </div>
        </div>

        {/* IPSCAN Search Input & Node Quick Select */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search geographic area (e.g. Kuala Lumpur, 175.143.0.0/16, Cyberjaya, Penang, Singapore, London, AS4788)..."
              value={ipscanFilter.isGlobalWorldwide ? "" : ipscanFilter.query === "all" ? "" : ipscanFilter.query}
              onChange={(e) => {
                const val = e.target.value;
                setIpscanFilter({
                  query: val,
                  isGlobalWorldwide: val.trim() === "",
                  selectedNodeId: undefined,
                });
              }}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono"
            />
            {!ipscanFilter.isGlobalWorldwide && (
              <button
                onClick={handleSetWorldwide}
                className="absolute right-3 top-2.5 px-2 py-1 text-[10px] font-bold bg-slate-700 text-slate-300 hover:text-white rounded-lg"
              >
                Reset to Worldwide
              </button>
            )}
          </div>

          {/* Quick Regional Nodes Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold text-slate-300">
            <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 flex items-center gap-1 shrink-0">
              <Layers className="w-3 h-3 text-primary" /> Nodes:
            </span>
            {ipscanNodes.slice(0, 5).map((node) => (
              <button
                key={node.id}
                onClick={() => handleSelectIPNode(node)}
                className={`px-2.5 py-1.5 rounded-xl shrink-0 transition-all ${
                  !ipscanFilter.isGlobalWorldwide && (ipscanFilter.selectedNodeId === node.id || ipscanFilter.query.toLowerCase() === node.city.toLowerCase())
                    ? "bg-teal text-white font-bold border border-teal-light/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {node.countryCode === "MY" ? "🇲🇾" : node.countryCode === "SG" ? "🇸🇬" : "🌐"} {node.city}
              </button>
            ))}
          </div>
        </div>

        {/* Live IPSCAN Diagnostic Node Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Scanning Scope</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Globe className="w-3 h-3 text-primary-light" />
              {ipscanFilter.isGlobalWorldwide ? "Worldwide (All Nodes)" : (ipscanFilter.query || "Custom Target")}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Target IP Range</span>
            <span className="font-mono text-teal-light font-bold">
              {activeNode ? activeNode.ipRange : ipscanFilter.isGlobalWorldwide ? "0.0.0.0/0 (Global)" : "Dynamic Subnet"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold">ISP / ASN Gateway</span>
            <span className="font-bold text-slate-200 truncate block" title={activeNode ? `${activeNode.isp} (${activeNode.asn})` : "Global Routing Matrix"}>
              {activeNode ? `${activeNode.isp}` : "Global Anycast Matrix"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Node Latency</span>
            <span className="font-bold text-green flex items-center gap-1">
              <Activity className="w-3 h-3 text-green" />
              {activeNode ? `${activeNode.latencyMs} ms` : "14 ms (Avg)"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Active Probes</span>
            <span className="font-bold text-white">
              {activeNode ? `${activeNode.activeProbes} probes` : "180+ global nodes"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Captured in Area</span>
            <span className="font-bold text-primary-light">
              {filteredMentions.length} posts ({totalCommentsInScope} comments)
            </span>
          </div>
        </div>
      </div>

      {/* FILTERING BAR */}
      <div className="bg-card p-5 rounded-3xl border border-slate-200/80 shadow-ios space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search mention text, author handle, comment keywords, or exact IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Platform Select */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X (Twitter)</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="news">News</option>
              <option value="forum">Forums</option>
              <option value="rss">RSS Feeds</option>
            </select>

            {/* Sentiment Select */}
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
            >
              <option value="all">All Sentiments</option>
              <option value="strongly_positive">Strongly Positive (Happy 🟢)</option>
              <option value="positive">Positive (Happy 🟢)</option>
              <option value="neutral">Neutral (OK 🟡)</option>
              <option value="negative">Negative (Alert 🔴)</option>
              <option value="strongly_negative">Strongly Negative (Alert 🔴)</option>
            </select>

            {/* Credibility Filter */}
            <select
              value={credibilityFilter}
              onChange={(e) => setCredibilityFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
            >
              <option value="all">All Credibility Classes</option>
              <option value="well_corroborated">Well Corroborated</option>
              <option value="partially_corroborated">Partially Corroborated</option>
              <option value="possible_coordinated_amplification">Coordinated Amplification</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Displaying <strong>{filteredMentions.length}</strong> posts with <strong>{totalCommentsInScope}</strong> threaded comments in {ipscanFilter.isGlobalWorldwide ? "Worldwide (Whole World) Scope" : `Area: "${ipscanFilter.query}"`}
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-teal" /> Verified Compliant: Public & Authorized OAuth Streams
          </span>
        </div>
      </div>

      {/* FEED LIST WITH DEEP MENTIONS & THREADED COMMENTS */}
      <div className="space-y-5">
        {filteredMentions.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-3xl border border-slate-200 shadow-ios space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-primary-light text-primary flex items-center justify-center mx-auto font-black text-2xl shadow-sm">
              🧹
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Workspace Cleaned & Empty</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                All prior data has been cleared from memory. Ready to input your fresh 5-individual or 5-company comparison.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => startNewComparisonPrompt("individual")}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20 cursor-pointer flex items-center gap-2"
              >
                <span>👤 Input 5 New Individuals (Primary + 4 Peers)</span>
              </button>
              <button
                onClick={() => startNewComparisonPrompt("company")}
                className="px-5 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-2xl hover:bg-slate-200 transition-all border border-slate-200 cursor-pointer flex items-center gap-2"
              >
                <span>🏢 Input 5 New Companies</span>
              </button>
            </div>
          </div>
        ) : (
          filteredMentions.map((item) => {
            const isCommentsOpen = !!expandedComments[item.id];
            const commentsList = item.comments || [];

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all ${
                  item.isBookmarked
                    ? "bg-primary-light/20 border-primary/40 shadow-ios"
                    : item.sentimentTrafficLight === "alert"
                    ? "bg-coral-light/20 border-coral/30 hover:shadow-ios"
                    : "bg-card border-slate-200/80 hover:shadow-ios"
                }`}
              >
                {/* Top Row: Author Details + IPSCAN Geo Badge + Sentiment Traffic Light */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.author.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
                      alt={item.author.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{item.author.name}</span>
                        <span className="text-xs text-slate-400">{item.author.handle}</span>
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-slate-900 text-white">
                          {item.platform}
                        </span>
                      </div>

                      {/* IPSCAN Origin Badge */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal" />
                          {item.geoPosition ? `${item.geoPosition.city}, ${item.geoPosition.countryCode}` : item.location}
                        </span>

                        <button
                          onClick={() => {
                            if (item.geoPosition) {
                              setIpscanFilter({
                                query: item.geoPosition.city,
                                isGlobalWorldwide: false,
                                targetCity: item.geoPosition.city,
                                targetCountry: item.geoPosition.country,
                              });
                            }
                          }}
                          className="px-2 py-0.5 rounded-md bg-teal-light text-teal font-mono text-[10px] font-semibold hover:bg-teal hover:text-white transition-all"
                          title="Click to filter by this IP area"
                        >
                          IP: {item.ipAddress || "175.143.x.x"}
                        </button>

                        <span>•</span>
                        <span className="font-medium text-slate-600">Influence: {item.author.influenceScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Badge & Manual Correction Loop */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 ${
                        item.sentimentTrafficLight === "happy"
                          ? "bg-green-light text-green border border-green/20"
                          : item.sentimentTrafficLight === "alert"
                          ? "bg-coral-light text-coral border border-coral/20"
                          : "bg-amber-light text-amber border border-amber/20"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                      {item.sentiment.replace("_", " ").toUpperCase()}
                    </span>

                    <select
                      value={item.sentiment}
                      onChange={(e) => correctMentionSentiment(item.id, e.target.value as SentimentClass)}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 cursor-pointer hover:bg-slate-200"
                      title="Analyst Manual Sentiment Correction"
                    >
                      <option value="strongly_positive">Strongly Positive (Happy 🟢)</option>
                      <option value="positive">Positive (Happy 🟢)</option>
                      <option value="neutral">Neutral (OK 🟡)</option>
                      <option value="negative">Negative (Alert 🔴)</option>
                      <option value="strongly_negative">Strongly Negative (Alert 🔴)</option>
                    </select>
                  </div>
                </div>

                {/* Main Post Body */}
                <p className="text-xs md:text-sm text-slate-800 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100 my-3 font-normal">
                  "{item.content}"
                </p>

                {/* HIGH-VISIBILITY LIVE SOURCE URL BANNER */}
                <div className="flex items-center justify-between gap-3 p-3 bg-blue-50/90 border border-blue-200/90 rounded-2xl my-3 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-2xs">
                      <span>🔗 Post URL</span>
                    </span>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-blue-800 hover:text-blue-950 hover:underline truncate font-semibold text-xs"
                      title={item.sourceUrl}
                    >
                      {item.sourceUrl}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.sourceUrl);
                        alert(`Copied Post URL to clipboard:\n${item.sourceUrl}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-800 hover:bg-blue-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>Copy URL</span>
                    </button>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                    >
                      <span>Open Live Post</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </a>
                  </div>
                </div>

                {/* Provenance Metadata Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-100/70 text-[11px] text-slate-600 font-medium mb-3">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Collection Method</span>
                    <span className="font-bold text-slate-800">{item.collectionMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">API / Provider</span>
                    <span className="font-bold text-slate-800">{item.providerUsed}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Credibility Class</span>
                    <span className="font-bold text-teal">{item.credibility.classification.replace(/_/g, " ")}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Confidence Score</span>
                    <span className="font-bold text-slate-900">{item.confidenceScore}%</span>
                  </div>
                </div>

                {/* Aspects, Lead Intent, & Actions Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.aspects.map((asp, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-lg ${
                          asp.sentiment === "positive"
                            ? "bg-green-light text-green border border-green/20"
                            : "bg-coral-light text-coral border border-coral/20"
                        }`}
                      >
                        Aspect: {asp.aspect} ({asp.sentiment})
                      </span>
                    ))}

                    {item.leadIntent && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-violet-light text-violet rounded-lg border border-violet/20 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Lead Intent Score: {item.leadIntent.score}/100
                      </span>
                    )}
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex items-center gap-2">
                    {/* Expand Comments Button */}
                    <button
                      onClick={() => toggleCommentsView(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isCommentsOpen
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      <span>
                        {commentsList.length} {commentsList.length === 1 ? "Comment" : "Comments"}
                      </span>
                      {isCommentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Forensics Inspection */}
                    <button
                      onClick={() => setSelectedForensicsMention(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-500" />
                      <span>Forensics</span>
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => toggleBookmarkMention(item.id)}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                        item.isBookmarked ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      title={item.isBookmarked ? "Remove Bookmark" : "Bookmark for Report"}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    {/* Assign */}
                    <button
                      onClick={() => {
                        const analyst = prompt("Enter Analyst Name to assign:", item.assignedAnalyst || "Analyst Team");
                        if (analyst) assignAnalyst(item.id, analyst);
                      }}
                      className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
                      title={item.assignedAnalyst ? `Assigned: ${item.assignedAnalyst}` : "Assign to Analyst"}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>

                    {/* Prominent Direct External Link */}
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      title="Open source URL in new tab to audit and confirm content"
                    >
                      <span>Confirm Post URL</span>
                      <ExternalLink className="w-3.5 h-3.5 text-primary-light" />
                    </a>
                  </div>
                </div>

                {/* THREADED COMMENTS & CONVERSATION STREAM (EXPANDABLE) */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 bg-slate-50/90 p-4 rounded-2xl">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        Threaded Public Comments & Replies ({commentsList.length})
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Normalized IP & Origin Telemetry Attached
                      </span>
                    </div>

                    {/* Comments List */}
                    {commentsList.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">No user comments captured yet. Add an analyst note or reply below.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {commentsList.map((cmt) => (
                          <div
                            key={cmt.id}
                            className={`p-3 rounded-xl border text-xs transition-all ${
                              cmt.sentimentTrafficLight === "alert"
                                ? "bg-coral-light/30 border-coral/30 text-coral-900"
                                : cmt.sentimentTrafficLight === "happy"
                                ? "bg-green-light/20 border-green/30 text-slate-900"
                                : "bg-white border-slate-200 text-slate-800"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{cmt.author.name}</span>
                                <span className="text-[11px] text-slate-400">{cmt.author.handle}</span>
                                {cmt.ipAddress && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-mono bg-slate-100 text-slate-600 rounded">
                                    IP: {cmt.ipAddress}
                                  </span>
                                )}
                              </div>

                              <span
                                className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase ${
                                  cmt.sentimentTrafficLight === "happy"
                                    ? "bg-green text-white"
                                    : cmt.sentimentTrafficLight === "alert"
                                    ? "bg-coral text-white"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {cmt.sentiment.replace("_", " ")}
                              </span>
                            </div>

                            <p className="text-slate-800">{cmt.content}</p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1 border-t border-slate-100">
                              <span>{new Date(cmt.publishedAt).toLocaleString()}</span>
                              {cmt.likes !== undefined && <span>{cmt.likes} Likes / Endorsements</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Analyst Reply Box */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add analyst comment or simulated response..."
                        value={replyInputs[item.id] || ""}
                        onChange={(e) => setReplyInputs({ ...replyInputs, [item.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendComment(item.id);
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        onClick={() => handleSendComment(item.id)}
                        className="px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-primary-dark shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FORENSICS & DATA ANALYSIS MODAL */}
      {selectedForensicsMention && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Server className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Data Forensics & IPSCAN Provenance</h3>
                  <p className="text-[11px] text-slate-500">Record ID: {selectedForensicsMention.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedForensicsMention(null)}
                className="p-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900 text-white font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">IP Address</span>
                  <span className="text-teal-light font-bold">{selectedForensicsMention.ipAddress || "175.143.120.45"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">ISP & ASN</span>
                  <span>{selectedForensicsMention.geoPosition?.isp || "TM Net Berhad (AS4788)"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Geo Coordinates</span>
                  <span>
                    Lat: {selectedForensicsMention.geoPosition?.lat || 3.139}, Lng: {selectedForensicsMention.geoPosition?.lng || 101.6869}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Regional Node</span>
                  <span>{selectedForensicsMention.geoPosition?.nodeName || "Kuala Lumpur Central Hub"}</span>
                </div>
              </div>

              {/* Credibility & Fact Check Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal" /> Credibility Assessment
                </h4>
                <p className="text-slate-700">{selectedForensicsMention.credibility.explanation}</p>
                <div className="flex items-center gap-3 text-[11px] font-semibold pt-1">
                  <span>Score: {selectedForensicsMention.credibility.score}/100</span>
                  <span>•</span>
                  <span>Manipulation Risk: {selectedForensicsMention.credibility.manipulationRiskScore}/100</span>
                </div>
              </div>

              {/* Raw Normalized Payload */}
              <div className="space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                  <Code2 className="w-3 h-3" /> Raw JSON Schema Payload
                </span>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto max-h-48 custom-scrollbar">
                  {JSON.stringify(selectedForensicsMention, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50">
              <button
                onClick={() => setSelectedForensicsMention(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Forensics View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
