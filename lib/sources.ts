export interface Source {
  id: number;
  name: string;
  url: string;
  rssUrl: string;
  paywalled?: boolean;
  audience?: "practitioner" | "executive" | "both";
}

export const SOURCES: Source[] = [
  // ── PRACTITIONER SOURCES ──
  { id: 1, name: "BleepingComputer", url: "https://www.bleepingcomputer.com", rssUrl: "https://www.bleepingcomputer.com/feed/" },
  { id: 2, name: "The Hacker News", url: "https://thehackernews.com", rssUrl: "https://feeds.feedburner.com/TheHackersNews" },
  { id: 3, name: "Dark Reading", url: "https://www.darkreading.com", rssUrl: "https://www.darkreading.com/rss.xml" },
  { id: 4, name: "SecurityWeek", url: "https://www.securityweek.com", rssUrl: "https://feeds.feedburner.com/securityweek" },
  { id: 5, name: "Krebs on Security", url: "https://krebsonsecurity.com", rssUrl: "https://krebsonsecurity.com/feed/", audience: "both" },
  { id: 6, name: "CyberScoop", url: "https://cyberscoop.com", rssUrl: "https://cyberscoop.com/feed/", audience: "both" },
  { id: 7, name: "The Register", url: "https://www.theregister.com", rssUrl: "https://www.theregister.com/security/headlines.atom" },
  { id: 8, name: "Ars Technica", url: "https://arstechnica.com", rssUrl: "https://feeds.arstechnica.com/arstechnica/security" },
  { id: 9, name: "HelpNet Security", url: "https://www.helpnetsecurity.com", rssUrl: "https://www.helpnetsecurity.com/feed/" },
  { id: 10, name: "SC Magazine", url: "https://www.scmagazine.com", rssUrl: "https://www.scmagazine.com/feed" },
  { id: 11, name: "Infosecurity Magazine", url: "https://www.infosecurity-magazine.com", rssUrl: "https://www.infosecurity-magazine.com/rss/news/" },
  { id: 12, name: "CISA Alerts", url: "https://www.cisa.gov", rssUrl: "https://www.cisa.gov/cybersecurity-advisories/all.xml" },
  { id: 13, name: "Microsoft Security", url: "https://www.microsoft.com/security/blog", rssUrl: "https://www.microsoft.com/security/blog/feed/" },
  { id: 14, name: "Cisco Talos", url: "https://blog.talosintelligence.com", rssUrl: "https://blog.talosintelligence.com/rss/" },
  { id: 15, name: "CrowdStrike", url: "https://www.crowdstrike.com/blog", rssUrl: "https://www.crowdstrike.com/blog/feed/" },
  { id: 16, name: "SentinelOne", url: "https://www.sentinelone.com/blog", rssUrl: "https://www.sentinelone.com/blog/feed/" },
  { id: 17, name: "Sophos News", url: "https://news.sophos.com", rssUrl: "https://news.sophos.com/en-us/feed/" },
  { id: 18, name: "Cloudflare Security", url: "https://blog.cloudflare.com/tag/security", rssUrl: "https://blog.cloudflare.com/tag/security/rss/" },
  { id: 19, name: "Check Point Research", url: "https://research.checkpoint.com", rssUrl: "https://research.checkpoint.com/feed/" },
  { id: 20, name: "ESET WeLiveSecurity", url: "https://www.welivesecurity.com", rssUrl: "https://www.welivesecurity.com/en/rss/feed/" },
  { id: 21, name: "Schneier on Security", url: "https://www.schneier.com", rssUrl: "https://www.schneier.com/feed/", audience: "both" },
  { id: 22, name: "Troy Hunt", url: "https://www.troyhunt.com", rssUrl: "https://www.troyhunt.com/rss/" },
  { id: 23, name: "Graham Cluley", url: "https://grahamcluley.com", rssUrl: "https://grahamcluley.com/feed/" },
  { id: 24, name: "Daniel Miessler", url: "https://danielmiessler.com", rssUrl: "https://danielmiessler.com/feed/", audience: "both" },
  { id: 25, name: "SANS ISC", url: "https://isc.sans.edu", rssUrl: "https://isc.sans.edu/rssfeed.xml" },
  { id: 26, name: "Risky Business", url: "https://risky.biz", rssUrl: "https://risky.biz/feeds/risky-business/" },
  { id: 27, name: "Last Watchdog", url: "https://www.lastwatchdog.com", rssUrl: "https://www.lastwatchdog.com/feed/" },
  { id: 28, name: "Packet Storm", url: "https://packetstormsecurity.com", rssUrl: "https://rss.packetstormsecurity.com/news/" },
  { id: 29, name: "CSO Online", url: "https://www.csoonline.com", rssUrl: "https://www.csoonline.com/feed/", paywalled: true, audience: "both" },
  { id: 30, name: "Reddit r/cybersecurity", url: "https://reddit.com/r/cybersecurity", rssUrl: "https://www.reddit.com/r/cybersecurity/.rss" },
  { id: 31, name: "Reddit r/netsec", url: "https://reddit.com/r/netsec", rssUrl: "https://www.reddit.com/r/netsec/.rss" },
  { id: 32, name: "NIST NVD", url: "https://nvd.nist.gov", rssUrl: "https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss.xml" },
  { id: 33, name: "Google Security Blog", url: "https://security.googleblog.com", rssUrl: "https://security.googleblog.com/feeds/posts/default" },
  { id: 34, name: "Cisco Security Blog", url: "https://blogs.cisco.com/security", rssUrl: "https://blogs.cisco.com/security/feed" },
  { id: 35, name: "Bitdefender Labs", url: "https://www.bitdefender.com/blog/labs", rssUrl: "https://www.bitdefender.com/blog/api/rss/labs/" },

  // ── EXECUTIVE SOURCES ──
  { id: 36, name: "WSJ Tech", url: "https://www.wsj.com/tech", rssUrl: "https://feeds.content.dowjones.io/public/rss/WSJcomUSBusiness", paywalled: true, audience: "executive" },
  { id: 37, name: "WSJ Risk & Compliance", url: "https://www.wsj.com/news/types/risk-compliance", rssUrl: "https://feeds.content.dowjones.io/public/rss/RSSWSJD", paywalled: true, audience: "executive" },
  { id: 38, name: "CNBC Cybersecurity", url: "https://www.cnbc.com/cybersecurity", rssUrl: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19854910", audience: "executive" },
  { id: 39, name: "Fortune Tech", url: "https://fortune.com/section/tech", rssUrl: "https://fortune.com/feed/fortune-feeds/?id=3230629", paywalled: true, audience: "executive" },
  { id: 40, name: "Harvard Business Review", url: "https://hbr.org/topic/technology", rssUrl: "https://hbr.org/resources/images/article_assets/hbr_rss/topic_feeds/technology.xml", paywalled: true, audience: "executive" },
];
