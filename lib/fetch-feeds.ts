import Parser from "rss-parser";
import { SOURCES, Source } from "./sources";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "CyberPulse/1.0 (cybersecurity news aggregator)" },
});

export interface Article {
  id: number;
  title: string;
  url: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  hoursAgo: number;
  tags: string[];
  paywalled: boolean;
  audience: "practitioner" | "executive" | "both";
  score: number;
  alsoReportedBy: string[];
}

// ── SOURCE TIERS ──
// Tier 1: Authoritative, low-volume, high-signal
// Tier 2: Quality editorial, daily publishing
// Tier 3: Vendor research (good intel, some marketing)
// Tier 4: Magazines, aggregators, mixed quality
// Tier 5: Community, raw feeds

const SOURCE_TIERS: Record<string, number> = {
  "CISA Alerts": 1.0,
  "Krebs on Security": 1.0,
  "Schneier on Security": 1.0,
  "NIST NVD": 0.95,
  "SANS ISC": 0.95,
  "Google Security Blog": 0.95,

  "BleepingComputer": 0.85,
  "Dark Reading": 0.85,
  "SecurityWeek": 0.85,
  "CyberScoop": 0.85,
  "The Hacker News": 0.85,
  "Ars Technica": 0.85,
  "The Register": 0.80,
  "HelpNet Security": 0.80,

  "Cisco Talos": 0.75,
  "CrowdStrike": 0.75,
  "SentinelOne": 0.75,
  "Microsoft Security": 0.75,
  "Cloudflare Security": 0.75,
  "Check Point Research": 0.70,
  "Sophos News": 0.70,
  "ESET WeLiveSecurity": 0.70,
  "Bitdefender Labs": 0.70,
  "Palo Alto Unit 42": 0.75,

  "SC Magazine": 0.60,
  "Infosecurity Magazine": 0.60,
  "CSO Online": 0.60,
  "Daniel Miessler": 0.65,
  "Troy Hunt": 0.70,
  "Graham Cluley": 0.65,
  "Risky Business": 0.70,
  "Last Watchdog": 0.50,
  "Packet Storm": 0.50,
  "Cisco Security Blog": 0.55,

  "WSJ Tech": 0.80,
  "WSJ Risk & Compliance": 0.80,
  "CNBC Cybersecurity": 0.70,
  "Fortune Tech": 0.70,
  "Harvard Business Review": 0.75,

  "Reddit r/cybersecurity": 0.40,
  "Reddit r/netsec": 0.45,
};

function getSourceTier(name: string): number {
  return SOURCE_TIERS[name] || 0.50;
}

// ── TAG RULES ──

const TAG_RULES: { tags: string[]; keywords: string[] }[] = [
  { tags: ["ransomware"], keywords: ["ransomware", "ransom", "lockbit", "blackcat", "alphv", "clop", "extortion", "akira"] },
  { tags: ["vulnerabilities"], keywords: ["vulnerability", "cve-", "zero-day", "0day", "exploit", "patch", "rce", "critical flaw", "buffer overflow", "patch tuesday"] },
  { tags: ["cloud-security"], keywords: ["cloud", "aws", "azure", "gcp", "s3 bucket", "iam", "kubernetes", "container", "serverless"] },
  { tags: ["privacy-policy"], keywords: ["privacy", "gdpr", "regulation", "compliance", "policy", "legislation", "ftc", "sec ", "sanction", "data protection"] },
  { tags: ["ai-security"], keywords: ["ai ", "artificial intelligence", "machine learning", "llm", "gpt", "chatgpt", "deepfake", "generative ai", "ai-powered"] },
  { tags: ["devsecops"], keywords: ["devsecops", "sast", "dast", "ci/cd", "supply chain", "sbom", "open source", "dependency", "github actions"] },
  { tags: ["ics-ot"], keywords: ["ics", "scada", "operational technology", "industrial", "plc", "critical infrastructure"] },
  { tags: ["threat-intel"], keywords: ["apt", "threat actor", "campaign", "espionage", "nation-state", "lazarus", "fancy bear", "volt typhoon", "salt typhoon", "sandworm", "mandiant"] },
  { tags: ["appsec"], keywords: ["application security", "api security", "owasp", "injection", "xss", "csrf", "authentication bypass", "ssrf"] },
];

const CYBER_RELEVANCE_KEYWORDS = [
  "cyber", "hack", "breach", "malware", "ransomware", "phishing",
  "security", "privacy", "data leak", "data breach", "exploit",
  "vulnerability", "zero-day", "threat", "attack", "ciso",
  "infosec", "encryption", "firewall", "spyware", "botnet",
  "credential", "authentication", "password", "identity theft",
  "dark web", "darknet", "surveillance", "espionage",
  "compliance", "regulation", "gdpr", "hipaa", "pci",
  "incident response", "forensic", "siem", "edr", "soc ",
  "nation-state", "apt", "fraud", "scam", "deepfake",
  "artificial intelligence", "ai risk", "ai safety",
  "disinformation", "misinformation",
];

function isCyberRelevant(title: string): boolean {
  const lower = title.toLowerCase();
  return CYBER_RELEVANCE_KEYWORDS.some((kw) => lower.includes(kw));
}

function autoTag(title: string): string[] {
  const lower = title.toLowerCase();
  const matched = new Set<string>();
  TAG_RULES.forEach((rule) => {
    rule.keywords.forEach((kw) => {
      if (lower.includes(kw)) rule.tags.forEach((t) => matched.add(t));
    });
  });
  if (matched.size === 0) matched.add("general");
  return Array.from(matched);
}

function hoursAgo(dateStr: string | undefined): number {
  if (!dateStr) return 999;
  const published = new Date(dateStr).getTime();
  if (isNaN(published)) return 999;
  return (Date.now() - published) / 3600000;
}

// ── CLUSTERING ──
// Extract significant words from a title for comparison

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "it", "its", "are", "was", "were",
  "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "could", "should", "may", "might", "can", "shall",
  "not", "no", "nor", "so", "if", "then", "than", "that", "this",
  "these", "those", "what", "which", "who", "whom", "how", "why",
  "when", "where", "all", "each", "every", "both", "few", "more",
  "most", "other", "some", "such", "only", "over", "also", "after",
  "before", "between", "under", "about", "into", "through", "during",
  "up", "out", "off", "down", "just", "now", "new", "says", "said",
  "report", "reports", "according", "via", "here", "your", "our",
  "their", "his", "her", "we", "they", "you", "he", "she",
]);

function extractSignificantTokens(title: string): Set<string> {
  const tokens = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(tokens);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

interface RawArticle {
  id: number;
  title: string;
  url: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  hoursAgo: number;
  tags: string[];
  paywalled: boolean;
  audience: "practitioner" | "executive" | "both";
}

function clusterAndScore(articles: RawArticle[]): Article[] {
  const SIMILARITY_THRESHOLD = 0.30;

  // Precompute tokens for each article
  const tokenSets = articles.map((a) => extractSignificantTokens(a.title));

  // Assign cluster IDs using greedy single-linkage
  const clusterIds = new Array(articles.length).fill(-1);
  let nextCluster = 0;

  for (let i = 0; i < articles.length; i++) {
    if (clusterIds[i] !== -1) continue;
    clusterIds[i] = nextCluster;

    // Find all articles similar to this one
    for (let j = i + 1; j < articles.length; j++) {
      if (clusterIds[j] !== -1) continue;
      // Only cluster articles within 24 hours of each other
      if (Math.abs(articles[i].hoursAgo - articles[j].hoursAgo) > 24) continue;

      const sim = jaccardSimilarity(tokenSets[i], tokenSets[j]);
      if (sim >= SIMILARITY_THRESHOLD) {
        clusterIds[j] = nextCluster;
      }
    }
    nextCluster++;
  }

  // Group articles by cluster
  const clusters = new Map<number, RawArticle[]>();
  for (let i = 0; i < articles.length; i++) {
    const cid = clusterIds[i];
    if (!clusters.has(cid)) clusters.set(cid, []);
    clusters.get(cid)!.push(articles[i]);
  }

  // Score and pick representative for each cluster
  const results: Article[] = [];

  for (const [, group] of clusters) {
    const sourceCount = new Set(group.map((a) => a.source)).size;
    const maxTier = Math.max(...group.map((a) => getSourceTier(a.source)));
    const freshest = Math.min(...group.map((a) => a.hoursAgo));
    const allTags = new Set(group.flatMap((a) => a.tags.filter((t) => t !== "general")));

    // Freshness decay: 1.0 at 0h, ~0.5 at 12h, ~0.2 at 24h
    const freshnessScore = Math.exp(-0.06 * freshest);

    // Convergence: multiple sources covering same story is the strongest signal
    // 1 source = 0, 2 sources = 0.4, 3 = 0.65, 5+ = 0.9, 8+ = 1.0
    const convergenceScore =
      sourceCount <= 1
        ? 0
        : Math.min(1.0, (sourceCount - 1) / 7);

    // Exclusive bonus: only 1 source AND it's tier 1 = likely a scoop
    const exclusiveBonus =
      sourceCount === 1 && maxTier >= 0.9 ? 0.3 : 0;

    // Tag richness: more categories = broader impact story
    const tagScore = Math.min(1.0, allTags.size / 3);

    // Final weighted score
    const score =
      convergenceScore * 35 +
      maxTier * 25 +
      freshnessScore * 25 +
      tagScore * 10 +
      exclusiveBonus * 5;

    // Pick the best article in the cluster as the representative
    // Prefer: highest source tier, then freshest
    const sorted = [...group].sort((a, b) => {
      const tierDiff = getSourceTier(b.source) - getSourceTier(a.source);
      if (Math.abs(tierDiff) > 0.05) return tierDiff;
      return a.hoursAgo - b.hoursAgo;
    });

    const representative = sorted[0];
    const alsoReportedBy = sorted
      .slice(1)
      .map((a) => a.source)
      .filter((name, idx, arr) => arr.indexOf(name) === idx) // dedupe names
      .slice(0, 5);

    results.push({
      ...representative,
      score: Math.round(score * 100) / 100,
      alsoReportedBy,
      tags: Array.from(allTags).length > 0 ? Array.from(allTags) : ["general"],
    });
  }

  return results;
}

// ── FEED FETCHING ──

async function fetchSingleFeed(source: Source): Promise<RawArticle[]> {
  try {
    const feed = await parser.parseURL(source.rssUrl);
    const isExecSource = source.audience === "executive";

    return (feed.items || [])
      .slice(0, 20)
      .map((item) => {
        const h = hoursAgo(item.pubDate || item.isoDate);
        return {
          id: 0,
          title: (item.title || "").trim(),
          url: (item.link || "").trim(),
          source: source.name,
          sourceUrl: source.url,
          publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
          hoursAgo: Math.round(h * 10) / 10,
          tags: autoTag(item.title || ""),
          paywalled: source.paywalled || false,
          audience: (source.audience || "practitioner") as "practitioner" | "executive" | "both",
        };
      })
      .filter((a) => a.title && a.url)
      .filter((a) => !isExecSource || isCyberRelevant(a.title));
  } catch {
    return [];
  }
}

export async function fetchAllFeeds(): Promise<Article[]> {
  const results = await Promise.allSettled(
    SOURCES.map((source) => fetchSingleFeed(source))
  );

  const allArticles: RawArticle[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  });

  // Deduplicate by URL (exact match)
  const seen = new Set<string>();
  const deduped = allArticles.filter((a) => {
    const canonical = a.url
      .replace(/\/+$/, "")
      .replace(/^https?:\/\/(www\.)?/, "");
    if (seen.has(canonical)) return false;
    seen.add(canonical);
    return true;
  });

  // Cluster similar articles and score them
  const scored = clusterAndScore(deduped);

  // Sort by score descending (Top Stories default)
  scored.sort((a, b) => b.score - a.score);

  // Assign sequential IDs
  scored.forEach((a, i) => (a.id = i + 1));

  // Cap at 300
  return scored.slice(0, 300);
}
