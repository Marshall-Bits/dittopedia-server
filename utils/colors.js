import { createCanvas, loadImage } from "canvas";
import { parseICO } from "icojs";

const fetchImageBuffer = async (imageUrl) => {
  const response = await fetch(imageUrl, { mode: "cors" });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const getCanvasFromICO = (icoImage) => {
  const canvas = createCanvas(icoImage.width, icoImage.height);
  const context = canvas.getContext("2d");
  const imgData = context.createImageData(icoImage.width, icoImage.height);
  imgData.data.set(new Uint8ClampedArray(icoImage.buffer));
  context.putImageData(imgData, 0, 0);
  return canvas;
};

const loadImageFromBuffer = async (buffer) => {
  const image = await loadImage(buffer);
  return { image, width: image.width, height: image.height };
};

const applyBlur = (context, width, height) => {
  context.filter = "blur(8px)";
  context.drawImage(context.canvas, 0, 0, width, height, 0, 0, width, height);
};

const collectNonTransparentPixels = (imageData) => {
  const colors = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const alpha = imageData[i + 3];
    if (alpha > 0) {
      colors.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
    }
  }
  return colors;
};

const calculateDominantColor = (colors) => {
  const colorCount = {};
  let dominantColor = colors[0];
  let maxCount = 0;

  colors.forEach((color) => {
    const key = color.join(",");
    colorCount[key] = (colorCount[key] || 0) + 1;
    if (colorCount[key] > maxCount) {
      maxCount = colorCount[key];
      dominantColor = color;
    }
  });

  return dominantColor;
};

const getDominantColor = async (imageUrl) => {
  try {
    const buffer = await fetchImageBuffer(imageUrl);
    let image, width, height;

    if (imageUrl.endsWith(".ico")) {
      const images = await parseICO(buffer);
      if (images.length > 0) {
        const icoImage = images[0];
        console.log(`ICO Image Size: ${icoImage.width}x${icoImage.height}`);
        image = getCanvasFromICO(icoImage);
        width = icoImage.width;
        height = icoImage.height;
      } else {
        throw new Error("Failed to parse ICO image");
      }
    } else {
      ({ image, width, height } = await loadImageFromBuffer(buffer));
    }

    const scaledWidth = width * 20;
    const scaledHeight = height * 20;
    const canvas = createCanvas(scaledWidth, scaledHeight);
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, scaledWidth, scaledHeight);

    applyBlur(context, scaledWidth, scaledHeight);

    const smallCanvas = createCanvas(16, 16);
    const smallContext = smallCanvas.getContext("2d");
    smallContext.drawImage(
      canvas,
      0,
      0,
      scaledWidth,
      scaledHeight,
      0,
      0,
      16,
      16
    );

    const imageData = smallContext.getImageData(0, 0, 16, 16).data;
    const colors = collectNonTransparentPixels(imageData);

    if (colors.length === 0) {
      throw new Error("Any non-transparent pixels found");
    }

    return calculateDominantColor(colors);
  } catch (error) {
    console.error("Error in getDominantColor:", error.message);
    return [0, 0, 0];
  }
};

const invertColor = ([r, g, b]) => {
  return [255 - r, 255 - g, 255 - b];
};

const convertToRGB = (color) => {
  if (color.startsWith("rgba")) {
    return color;
  }
  // if it's just RGB we should add the alpha value 0.5
  else if (color.startsWith("rgb")) {
    return color.replace("rgb", "rgba").replace(")", ", 0.5)");
  }

  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

const convertToHex = (color) => {
  if (color.startsWith("#")) {
    return color;
  }

  const [r, g, b] = color
    .replace("rgba(", "")
    .replace(")", "")
    .split(",")
    .map((c) => parseInt(c.trim()));

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export { getDominantColor, invertColor, convertToRGB, convertToHex };
