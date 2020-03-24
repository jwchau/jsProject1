const minval = -1.5;
const maxval = 1.5;

let jaSlider;
let jbSlider;

let jA = -0.70176;
let jB = -0.3842;

const drawMandel = () => {
  const maxIterations = 100;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {

      let a = map(x, 0, width, minval, maxval);
      let b = map(y, 0, width, minval, maxval);

      let ca = a;
      let cb = b;

      let n = 0;

      while (n < maxIterations) {
        let aa = a * a;
        let bb = b * b;
        let twoab = 2 * a * b;
        
        if (abs(a + b) > 4) break;

        a = aa - bb + jaSlider.value();
        b = twoab + jbSlider.value();
        n++;
      }

      let bright = map(n, 0, 100, 0, 1);
      bright = map(bright, 0, 1, 0, 255);
      if (n === maxIterations) bright = 0;

      const pix = (x + y * width) * 4;
      pixels[pix + 0] = bright;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = bright;
      pixels[pix + 3] = 255;
    }
  }
}

const createControls = () => {
  jaSlider = createSlider(-1, 1, 0, 0.001);
  jbSlider = createSlider(-1, 1, 0, 0.001);
}

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  colorMode(HSB);
  pixelDensity(1);
  createControls();
}

function draw() {
  // frameRate(30);
  loadPixels();
  drawMandel();
  updatePixels();

  noLoop();
}

function keyTyped() {
  if (key === ' '){
    loadPixels();
    drawMandel();
    updatePixels();
  }
}