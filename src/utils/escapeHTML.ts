export const escapeHTML = (html: string) => {
  return html.
    replace(/&/g, "&amp;").
    replace(/</g, "&lt;").
    replace(/>/g, "&gt;").
    replace(/\"/g, "&quot;");
};