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

const getHtmlInfo = (html) => {
  const headings = getAllHeadings(html);
  const metaDescription = getMetaDescription(html);
  return { headings, metaDescription };
};

export { getHtmlInfo };
