import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { base64_decode } from "../../utils/base64";
import { resolve } from "path";

const IMG_WIDTH = 1200;
const IMG_HEIGHT = 600;

GlobalFonts.registerFromPath(resolve("./public", "fonts", "Avenir-Next.ttc"));
GlobalFonts.registerFromPath(resolve("./public", "fonts", "OpenSans-Bold.ttf"));

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(" ");
  var line = "";

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function handler(req, res) {
  const reqTitle = req.query["title"] || "";
  const reqPath = req.query["path"] || "";
  const reqSubtitle = req.query["subtitle"] || "";

  let imageData = null;
  let xPath, xTitle, xSubtitle;

  xPath = base64_decode(reqPath);
  xTitle = base64_decode(reqTitle);
  xSubtitle = base64_decode(reqSubtitle);

  const canvas = createCanvas(IMG_WIDTH, IMG_HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, IMG_WIDTH, IMG_HEIGHT);
  ctx.fillStyle = "#EDF2F7";
  ctx.fillRect(0, 0, IMG_WIDTH, 170);

  const fontHeading = "'Open Sans', serif";
  const fontBody = "'Avenir Next', serif";

  ctx.font = "bold 40px" + " " + fontBody;
  ctx.fillStyle = "#718096";
  ctx.fillText("Healthcare.vn", 70, 100);

  if (xPath) {
    ctx.font = "bold 40px" + " " + fontBody;
    ctx.fillStyle = "#2D3748";
    ctx.fillText("/ " + xPath, 294, 100);
  }

  if (xSubtitle) {
    ctx.font = "bold 44px" + " " + fontBody;
    ctx.fillStyle = "#a0aec0";
    ctx.fillText(xSubtitle, 70, 260);
  }

  if (xTitle) {
    ctx.font = "bold 76px" + " " + fontHeading;
    ctx.fillStyle = "#1a202c";
    wrapText(ctx, xTitle, 70, 355, IMG_WIDTH - 100, 92);
  }

  imageData = canvas.toBuffer("image/png");

  res.setHeader("Cache-Control", "s-maxage=86400");
  res.setHeader("Content-Type", "image/png");
  res.send(imageData);
}

export default handler;
