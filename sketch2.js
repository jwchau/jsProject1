const drawMandel = () => {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {

      let a = map(x, 0, width, -2, 2);
      let b = map(y, 0, height, -2, 2);

      let n = 0;
      let z = 0;

      while (n < 100) {
        let aa = a * a - b * b;
        let bb = 2 * a * b;

        a = aa;
        b = bb;

        if (abs(a + b) > 16) break;

        n++;
      }

      let bright = 0;
      if (n === 100) {
        bright = 255;
      }

      const pix = (x + y * width) * 4;
      pixels[pix + 0] = bright;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = bright;
      pixels[pix + 3] = 255; 
    }
  }

}

function setup() {
  createCanvas(500, 500);
  angelMode(DEGREES);
  colorMode(HSB);
  pixelDensity(1);
  loadPixels();

  drawMandel();

  updatePixels();
}