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

function drawBinaryNumber(canvas, { height, width, data }, current_y) {
  if (!data) return;
  let offset_y = 32;
  let offset_x = 26;
  let ctx = canvas.getContext("2d");
  let _width = canvas.clientWidth * 1.7;
  let _height = canvas.clientHeight * 1.7;
  canvas.height = _height + 1.2;
  canvas.width = _width;
  ctx.font = "10px monospace";
  ctx.scale(1.5, 1.5);
  if (current_y > offset_y) {
    for (let y = offset_y + 1; y < current_y; y++) {
      // console.log("data bin", data, y, current_y)
      for (let x = 0; x < width; x++) {
        if (x > offset_x) {
          // console.log("data bin", data[y], x)
          if (!data[y]) return;
          if (window.theme === "dark") {
            ctx.fillStyle = data[y][x] === 0 ? "white" : "#c9c9c9";
          } else {
            ctx.fillStyle = data[y][x] === 0 ? "black" : "grey";
          }
          ctx.fillText(
            data[y][x],
            -4.5 + (x - offset_x) * 8,
            10 * (y - offset_y)
          );
        }
      }
    }
  }
}

function drawNav(canvas, { height, width, data }, current_y) {
  if (!data) return;
  let ctx = canvas.getContext("2d");
  let _width = 60;
  let _height = 1280;
  canvas.height = _height;
  canvas.width = _width;
  ctx.fillStyle = "rgb(100,100,100)";
  ctx.font = "16px monospace";
  for (let y = 0; y < current_y; y++) {
    for (let x = 0; x < width; x++) {
      if (y > 5) {
        ctx.clearRect(0, 0, _width, _height);
        ctx.fillText(height == y + 1 ? "END" : "START", 0, y * 10 - 20);
        ctx.fillText(`y:${y}`, 0, y * 10);
      }
    }
  }
}

// var cond = "(x|y)%5 " + "== 0"

// function drawPBMWithSlider(ctx, { height, width }, cond) {
//   const nx = width;
//   const ny = nx;

//   ctx.fillRect(0, 0, width, height);
//   const imData = ctx.getImageData(0, 0, nx, ny);
//   const { data } = imData;
//   for (let x = 0; x < nx; x++) {
//     for (let y = 0; y < ny; y++) {
//         if (eval(cond + " == 0")) {
//         let a = 4 * (x + y * nx);
//         data[a++] = data[a++] = data[a++] = 255;
//       }
//     }
//   }
//   ctx.putImageData(imData, 0, 0);
//   ctx.imageSmoothingEnabled = false;
//   ctx.drawImage(ctx.canvas, 0, 0, nx, ny, 0, 0, width, height);
// }

function drawPBM(ctx, { height, width, data: _data }, current_y) {
  if (!_data) return;
  // for (let y = 0; y < current_y; y++) {
  //   for (let x = 0; x < width; x++) {
  //     if (data[y] && data[y][x] === 1) {
  //       // if (x % 2 || y % 2) {
  //       //   ctx.fillStyle = "red";
  //       //   ctx.fillRect(x + 1, y + 1, 1, 1);
  //       // }
  //       ctx.fillStyle = data[y][x] === 1 ? "black" : "";
  //       ctx.fillRect(x, y, 1, 1);
  //     }
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
        // if (eval(cond)) {
        //   if (x % 2 || y % 2) {
        //   //   ctx.fillRect(x + 1, y + 1, 1, 1);
        //   let a = 4 * (x+1 + (y+1) * nx);
        //   data[a++] = 255;
        //   data[a++] =  data[a++] = 0
        // } else {
        // }
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
  let lines = string.trimEnd().split("\n");
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

function pbm2canvas(pbmString, canvas, binary_canvas, current_y) {
  let parsed = parse(pbmString);
  if (!parsed.format) {
    throw new Error("Could not determine format");
  }
  if (!canvas) {
    canvas = document.createElement("canvas");
  }
  draw(canvas, parsed, current_y);
  drawBinaryNumber(binary_canvas, parsed, current_y);
  // drawNav(flure_canvas_nav, parsed, current_y);
  // draw(canvas, parsed);
  return canvas;
}
