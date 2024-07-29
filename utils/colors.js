// const { createCanvas, loadImage } = require('canvas');
import { createCanvas, loadImage } from "canvas";
import { parseICO } from 'icojs';

async function getDominantColor(imageUrl) {
  try {
    const response = await fetch(imageUrl, { mode: "cors" });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const image = await loadImage(buffer);
    
    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, 1, 1);
    const imageData = context.getImageData(0, 0, 1, 1).data;
    return [imageData[0], imageData[1], imageData[2]];
  } catch (error) {
    console.error("Error in getDominantColor:", error.message);
    console.log(imageUrl.slice(-3));
    return "none";
  }
}

function invertColor([r, g, b]) {
  return [255 - r, 255 - g, 255 - b];
}

export { getDominantColor, invertColor };
