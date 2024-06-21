const formatFavIcon = (iconUrl, pageUrl) => {
  const url = new URL(pageUrl);
  const baseUrl = `${url.protocol}//${url.hostname}`;
  
  if(!iconUrl) return null;

  if (iconUrl.startsWith("./") || iconUrl.startsWith("../")) {
    return `${baseUrl}/${iconUrl.replace("../", "")}`;
  } else {
    return iconUrl;
  }
};

export default formatFavIcon;
