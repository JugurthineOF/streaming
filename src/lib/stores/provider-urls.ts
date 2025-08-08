import { writable } from "svelte/store";

export const providerUrls = writable({
  vidsrc: "https://vidsrc.me/embed",
  vidsrcpro: "https://vidsrc.pro/embed",
  embedsu: "https://embed.su",
  smashystream: "https://smashystream.com",
  movieapi: "https://movieapi.club",
  upcloud: "https://upcloud.stream",
  multiembed: "https://multiembed.mov",

  // Anime sources
  gogoanime: "https://gogoanime.llc",
  zoro: "https://zoro.to",
  animepahe: "https://animepahe.ru",
  nineanime: "https://9anime.id"
});
