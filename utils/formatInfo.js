import { JSDOM } from "jsdom";

const getAllHeadings = (html) => {
  const dom = new JSDOM(html);
  const headings = [];

  for (let i = 1; i <= 6; i++) {
    const allh = dom.window.document.querySelectorAll(`h${i}`);
    allh.forEach((h) => {
      headings.push(h.textContent);
    });
  }

  return headings;
};

const getMetaDescription = (html) => {
  const dom = new JSDOM(html);
  const metaDescription =
    dom.window.document.querySelector("meta[name='description']")?.content ||
    "No meta description found";
  return metaDescription;
};

const getFavIcon = (html) => {
  const dom = new JSDOM(html);
  const favIcon = dom.window.document.querySelector("link[rel='icon']")?.href;
  return favIcon;
};

const getHtmlInfo = (html) => {
  const headings = getAllHeadings(html);
  const metaDescription = getMetaDescription(html);
  const favIcon = getFavIcon(html);
  return { headings, metaDescription, favIcon };
};

export { getHtmlInfo };
