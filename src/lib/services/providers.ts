import { browser } from "$app/environment";
import { get } from "svelte/store";
import { providerUrls } from "$lib/stores/provider-urls";

export interface Provider {
  id: string;
  name: string;
  getEmbedUrl: (
    mediaId: string | number,
    type: "movie" | "tv" | "anime",
    season?: number,
    episode?: number
  ) => string;
}

const prox = (u: string) => `/proxy?u=${encodeURIComponent(u)}`;

export const providers: Provider[] = [
  {
    id: "vidsrc",
    name: "VidSrc",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls); if (!urls) return "";
      if (type === "movie") return prox(`${urls.vidsrc}/movie/${mediaId}?autoPlay=true`);
      if (season && episode) return prox(`${urls.vidsrc}/tv/${mediaId}/${season}/${episode}?autoPlay=true&autoNext=true`);
      return prox(`${urls.vidsrc}/tv/${mediaId}?autoPlay=true`);
    }
  },
  {
    id: "vidsrcpro",
    name: "VidSrc Pro",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls); if (!urls) return "";
      if (type === "movie") return prox(`${urls.vidsrcpro}/movie/${mediaId}`);
      if (season && episode) return prox(`${urls.vidsrcpro}/tv/${mediaId}/${season}/${episode}`);
      return prox(`${urls.vidsrcpro}/tv/${mediaId}`);
    }
  },
  {
    id: "embedsu",
    name: "Embed.su",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls); if (!urls) return "";
      if (type === "movie") return prox(`${urls.embedsu}/movie/${mediaId}`);
      if (season && episode) return prox(`${urls.embedsu}/tv/${mediaId}/${season}/${episode}`);
      return prox(`${urls.embedsu}/tv/${mediaId}`);
    }
  },
  {
    id: "smashystream",
    name: "SmashyStream",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls); if (!urls) return "";
      if (type === "movie") return prox(`${urls.smashystream}/movie/${mediaId}`);
      if (season && episode) return prox(`${urls.smashystream}/tv/${mediaId}/${season}/${episode}`);
      return prox(`${urls.smashystream}/tv/${mediaId}`);
    }
  },
  {
    id: "movieapi",
    name: "MovieAPI",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls); if (!urls) return "";
      if (type === "movie") return prox(`${urls.movieapi}/movie/${mediaId}`);
      if (season && episode) return prox(`${urls.movieapi}/tv/${mediaId}/${season}/${episode}`);
      return prox(`${urls.movieapi}/tv/${mediaId}`);
    }
  },
  {
    id: "upcloud",
    name: "UpCloud",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls); if (!urls) return "";
      if (type === "movie") return prox(`${urls.upcloud}/movie/${mediaId}`);
      if (season && episode) return prox(`${urls.upcloud}/tv/${mediaId}/${season}/${episode}`);
      return prox(`${urls.upcloud}/tv/${mediaId}`);
    }
  },
  {
    id: "multiembed",
    name: "MultiEmbed",
    getEmbedUrl: (mediaId, type, season, episode) => {
      const urls = get(providerUrls); if (!urls) return "";
      if (type === "movie") return prox(`${urls.multiembed}/movie/${mediaId}`);
      if (season && episode) return prox(`${urls.multiembed}/tv/${mediaId}/${season}/${episode}`);
      return prox(`${urls.multiembed}/tv/${mediaId}`);
    }
  },

  // Anime providers
  {
    id: "gogoanime",
    name: "Gogoanime",
    getEmbedUrl: (mediaId) => {
      const urls = get(providerUrls); if (!urls) return "";
      return prox(`${urls.gogoanime}/streaming.php?id=${mediaId}`);
    }
  },
  {
    id: "zoro",
    name: "Zoro",
    getEmbedUrl: (mediaId) => {
      const urls = get(providerUrls); if (!urls) return "";
      return prox(`${urls.zoro}/watch/${mediaId}`);
    }
  },
  {
    id: "animepahe",
    name: "Animepahe",
    getEmbedUrl: (mediaId) => {
      const urls = get(providerUrls); if (!urls) return "";
      return prox(`${urls.animepahe}/play/${mediaId}`);
    }
  },
  {
    id: "nineanime",
    name: "9Anime",
    getEmbedUrl: (mediaId) => {
      const urls = get(providerUrls); if (!urls) return "";
      return prox(`${urls.nineanime}/watch/${mediaId}`);
    }
  }
];

export function getProvider(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function getDefaultProvider(): Provider {
  if (!browser) return providers[0];
  const saved = localStorage.getItem("selectedProvider");
  if (saved) {
    const p = providers.find((x) => x.id === saved);
    if (p) return p;
  }
  return providers.find((p) => p.id === "vidsrc") || providers[0];
}
