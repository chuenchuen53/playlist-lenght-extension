import type { Result, Item, WebResponse } from "../typing/api-typing";

function convertTimeStrToSec(timeStr: string): number {
  const arr = timeStr.split(":");
  if (arr.length === 3) {
    const [hour, min, sec] = arr;
    return parseInt(hour) * 3600 + parseInt(min) * 60 + parseInt(sec);
  } else if (arr.length === 2) {
    const [min, sec] = arr;
    return parseInt(min) * 60 + parseInt(sec);
  }

  return parseInt(timeStr);
}

function getYoutubePlaylistDataInPlaylistPage(): Result | null {
  const metadataContainer = document.querySelector(".metadata-wrapper");
  const listContainer = document.querySelector("ytd-playlist-video-list-renderer #contents");

  if (metadataContainer === null || listContainer === null) return null;

  const title = metadataContainer.querySelector(".ytd-playlist-header-renderer #text")?.textContent?.trim() ?? "";
  const author = metadataContainer.querySelector(".metadata-owner #owner-text a")?.textContent?.trim() ?? "";

  const items: Item[] = [];
  const listElements = listContainer.querySelectorAll("ytd-playlist-video-renderer");
  listElements.forEach((ele, idx) => {
    const index = idx + 1;
    const title = ele.querySelector("#meta #video-title")?.textContent?.trim() ?? "";
    const durationStr = ele.querySelector("#time-status #text")?.textContent?.trim() ?? "00:00";
    const durationSec = convertTimeStrToSec(durationStr);
    items.push({ index, title, durationSec });
  });

  return { author, title, items };
}

function getYoutubePlaylistDataInWatchPage(): Result | null {
  const container = document.querySelector("#secondary #playlist") ?? document.querySelector("#primary #below #playlist");
  if (container === null) return null;

  const author = container.querySelector("#publisher-container .publisher a")?.textContent?.trim() ?? "";
  const title = container.querySelector("#header-description .title a")?.textContent?.trim() ?? "";

  const items: Item[] = [];
  const listElements = container.querySelectorAll("#items>*");
  listElements.forEach((ele, idx) => {
    // don't use the dom, coz for the currently playing item, the index is hidden
    const index = idx + 1;
    const title = ele.querySelector("#meta #video-title")?.textContent?.trim() ?? "";
    const durationStr = ele.querySelector("#thumbnail-container #time-status #text")?.textContent?.trim() ?? "00:00";
    const durationSec = convertTimeStrToSec(durationStr);
    items.push({ index, title, durationSec });
  });

  return { author, title, items };
}

function getBilibiliPlaylistData(): Result | null {
  const author = document.querySelector(".up-info-container .up-name")?.textContent?.trim() ?? "";
  const title = document.querySelector(".video-title")?.textContent?.trim() ?? "";

  const items: Item[] = [];

  let listContainer = document.querySelector("#multi_page .list-box");
  if (listContainer) {
    const listElements = listContainer.querySelectorAll("li");
    listElements.forEach((ele) => {
      const index = parseInt(ele.querySelector(".page-num")?.textContent?.replace("P", "") ?? "0");
      const title = ele.querySelector(".part")?.textContent?.trim() ?? "";
      const durationStr = ele.querySelector(".duration")?.textContent?.trim() ?? "00:00";
      const durationSec = convertTimeStrToSec(durationStr);
      items.push({ index, title, durationSec });
    });
  } else {
    listContainer = document.querySelector(".video-sections-content-list .video-section-list");
    if (listContainer) {
      const listElements = listContainer.querySelectorAll(".video-episode-card__info");
      listElements.forEach((ele, idx) => {
        const index = idx + 1;
        const title = ele.querySelector(".video-episode-card__info-title")?.textContent?.trim() ?? "";
        const durationStr = ele.querySelector(".video-episode-card__info-duration")?.textContent?.trim() ?? "00:00";
        const durationSec = convertTimeStrToSec(durationStr);
        items.push({ index, title, durationSec });
      });
    }
  }

  return { author, title, items };
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "playlist-data") {
    let support = false;

    try {
      const isBillibili = window.location.href.includes("bilibili.com");
      if (isBillibili) {
        support = true;
        const data = getBilibiliPlaylistData();
        sendResponse({ support, data } satisfies WebResponse);
        return;
      }

      const isYoutube = window.location.href.includes("youtube.com");
      if (isYoutube) {
        support = true;
        const data = getYoutubePlaylistDataInWatchPage() ?? getYoutubePlaylistDataInPlaylistPage();
        sendResponse({ support, data } satisfies WebResponse);
        return;
      }

      sendResponse({ support, data: null } satisfies WebResponse);
    } catch (e) {
      sendResponse({ support: false, data: null } satisfies WebResponse);
    }
  }
});
