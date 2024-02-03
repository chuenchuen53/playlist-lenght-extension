export function formatTotalSeconds(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let result = "";
  if (days > 0) {
    result += `${days} day${days > 1 ? "s" : ""}, `;
  }
  if (days > 0 || hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""}, `;
  }
  if (days > 0 || hours > 0 || minutes > 0) {
    result += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
  }
  result += `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;
  return result;
}

export function formatSeconds(seconds: number) {
  const hr = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const min = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hr}:${min}:${sec}`;
}
