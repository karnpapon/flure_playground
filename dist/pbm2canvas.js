const supportedFormats = ["P1", "P2"];

function draw(canvas, image, current_y) {
  let { format, height, width } = image;
  let ctx = canvas.getContext("2d");
  canvas.height = height * 6 - 20;
  canvas.width = width * 6;
  ctx.scale(6, 6);
  switch (format) {
    case "P1":
      drawPBM(ctx, image, current_y);
      break;
    case "P2":
      drawPGM(ctx, image, current_y);
      break;
  }
}

function drawPBM(ctx, { height, width, data: _data }, current_y) {
  if (!_data) return;
  // for (let y = 0; y < current_y; y++) {
  //   for (let x = 0; x < width; x++) {
  //     ctx.fillStyle = data[y][x] === 1 ? "black" : "white";
  //     ctx.fillRect(x, y, 1, 1);
  //     ctx.fillStyle = "black";
  //     ctx.fillRect(x, y + 1, 1, 1);
  //   }
  // }

  const nx = width;
  const ny = nx;

  // https://observablehq.com/@stringertheory/bit-field-patterns
  ctx.fillRect(0, 0, width, height);
  const imData = ctx.getImageData(0, 0, nx, ny);
  const { data } = imData;
  for (let x = 0; x < nx; x++) {
    for (let y = 0; y < ny; y++) {
      if (_data[y] && _data[y][x] === 0) {
        let a = 4 * (x + y * nx);
        data[a++] = data[a++] = data[a++] = 255;
      }
    }
  }
  ctx.putImageData(imData, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(ctx.canvas, 0, 0, nx, ny, 0, 0, width, height);
}

function drawPGM(ctx, { height, width, data, maxValue }) {
  let imageData = ctx.createImageData(width, height);
  let pixels = imageData.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rawValue = data[y][x];
      let grayValue = (rawValue / maxValue) * 255;
      let pixelAddress = (x + y * width) * 4;
      pixels[pixelAddress] = grayValue;
      pixels[pixelAddress + 1] = grayValue;
      pixels[pixelAddress + 2] = grayValue;
      pixels[pixelAddress + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

//
// {
//   format: 'P1',
//   comment: '# test',
//   maxValue: 1,
//   width: 5,
//   height: 5,
//   data: [
//     [1, 0, 0, 0, 1],
//     [0, 1, 0, 1, 0],
//     [0, 0, 1, 0, 0],
//     [0, 1, 0, 1, 0],
//     [1, 0, 0, 0, 1]
//   ]
// }
//
function parse(string) {
  let lines = string.split("\n");
  let format = lines.shift().match(/^(P\d)$/)[0];
  if (!format || supportedFormats.indexOf(format) === -1) {
    throw new Error("Could not determine image format");
  }
  let comment = lines.shift();
  let [width, height] = lines
    .shift()
    .match(/^(\d+) (\d+)$/)
    .slice(1)
    .map(Number);

  let maxValue;
  switch (format) {
    case "P1":
      maxValue = 1;
      break;
    case "P2":
      maxValue = Number(lines.shift());
      break;
  }

  let data = lines.map(parseLine);

  return { format, comment, width, height, data, maxValue };
}

function parseLine(line) {
  return line.replace(/\s+/g, "|").replace(/^\|/, "").split("|").map(Number);
}

function pbm2canvas(pbmString, canvas, current_y) {
  let parsed = parse(pbmString);
  if (!parsed.format) {
    throw new Error("Could not determine format");
  }
  if (!canvas) {
    canvas = document.createElement("canvas");
  }
  draw(canvas, parsed, current_y);
  return canvas;
}
