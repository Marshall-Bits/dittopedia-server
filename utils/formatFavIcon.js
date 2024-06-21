const formatFavIcon = (iconUrl, pageUrl) => {
  const url = new URL(pageUrl);
  const baseUrl = `${url.protocol}//${url.hostname}`;

  if (!iconUrl) return `${baseUrl}/favicon.ico`;

  if (!iconUrl.startsWith("https://")) {
    const iconPathArray = iconUrl.split("/");
    if (iconPathArray[0] === ".." || iconPathArray[0] === ".") {
      const iconPath = iconPathArray[iconPathArray.length - 1];
      return `${baseUrl}/${iconPath}`;
    }else {
      return `${baseUrl}${iconPathArray.join("/")}`;
    }
   
  } else {
    console.log(iconUrl);
    return iconUrl;
  }
};

export default formatFavIcon;
