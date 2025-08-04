export function Urlify(text: string) {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Replace URLs with clickable links, adding the "primary" class
  return text.replace(urlRegex, function (url) {
    return `<a target="_blank" href="${url}" class="primary">${url}</a>`;
  });
}
