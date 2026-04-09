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
}

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

async function fetchSingleFeed(source: Source): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.rssUrl);
    return (feed.items || []).slice(0, 20).map((item) => {
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
        audience: source.audience || "practitioner",
      };
    }).filter((a) => a.title && a.url);
  } catch {
    return [];
  }
}

export async function fetchAllFeeds(): Promise<Article[]> {
  const results = await Promise.allSettled(
    SOURCES.map((source) => fetchSingleFeed(source))
  );

  const allArticles: Article[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  });

  // Deduplicate by URL
  const seen = new Set<string>();
  const deduped = allArticles.filter((a) => {
    const canonical = a.url.replace(/\/+$/, "").replace(/^https?:\/\/(www\.)?/, "");
    if (seen.has(canonical)) return false;
    seen.add(canonical);
    return true;
  });

  // Sort newest first
  deduped.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Assign sequential IDs
  deduped.forEach((a, i) => (a.id = i + 1));

  // Cap at 300 most recent
  return deduped.slice(0, 300);
}
