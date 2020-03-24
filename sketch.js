//globals
const songs = {};
let song;

//part 1
let amp;
let playButton;
let jumpButton;
let volumeSlider;

//part 2
let wave;
let freqSlider;
let envelope;
let mic;

//part 3
let fft;
let bandWidth;
let colorSlider;

//init data
const volData = [0];
for (let i = 0; i < 360; i++) {
  volData.push(0);
}
let k = 0;


function preload() {
  for (let i = 1; i <= 5; i++) {
    const song = loadSound(`sounds/sound_${i}.mp3`);
    songs[i] = song;
    songs[i].setVolume(0.125);
  }
  song = songs[Math.floor(Math.random() * 4) + 1];
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    playButton.html("paws");
   } else {
    song.pause();
    playButton.html("play");
  }
}

function createControls() {
  playButton = createButton("play");
  playButton.mousePressed(togglePlaying);
  // jumpButton = createButton("jump");
  // jumpButton.mousePressed(jumpSong);
  colorSlider = createSlider(0, 360, 0, 1);
  volumeSlider = createSlider(0, 0.5, 0.25, 0.0125);
  bandWidth = createSlider(2, 64, 16, 2);
  amp = new p5.Amplitude();
}

const jumpSong = (len = song.duration()) => {
  let t = random(len);
  console.log(t);
  song.jump(t);
}

const drawAmplitude = (vol) => {
  const diam = map(vol, 0, 0.1, 1, 100);
  ellipse(width / 2, height / 2, diam, diam);
}

const createWave = () => {
  freqSlider = createSlider(200, 1200, 440, 20);
  wave = new p5.Oscillator();
  wave.setType('sine');
  wave.start();
  wave.freq(200);
  wave.amp(envelope);
}

const createEnvelope = () => {
  envelope = new p5.Envelope();
  envelope.setADSR(0.05, 0.1, 0.25, 0.25);
  envelope.setRange(0.05, 0);
}

const createMic = () => {
  mic = new p5.AudioIn();
  mic.start();
}

const drawEllipse = (val) => {
  const size = map(val, 0, 0.5, 0, height);
  ellipse(width / 2, height / 2, size, size);
}

const drawLine = () => {
  const vol = amp.getLevel();
  volData.push(vol);
  stroke(255);
  noFill();

  beginShape();
  for (let i = 0; i < volData.length; i++) {
    const y = map(volData[i], 0, 0.25, height / 2, 0);
    vertex(i, y);
  }
  endShape();

  if (volData.length > width - 200) volData.splice(0, 1);
}

const drawCircle = () => {
  background(0);
  const spectrum = fft.analyze();
  const bw = bandWidth.value();
  noStroke();
  translate(width / 2, height / 2);
  for (let i = 0; i < spectrum.length; i += bw) {
    const angle = map(i, 0, spectrum.length, 0, 360);
    const amp = spectrum[i];
    const c = map(i, 0, spectrum.length, 0, 255);
    const color = (c + colorSlider.value()) % 360;
    const r = map(amp, 0, 256, 100, width / 2);
    const x = r * cos(angle);
    const y = r * sin(angle);
    stroke(color, 255, 255);
    line(0, 0, x, y);
  }
}

const drawCircleRects = () => {
  background(0);
  const spectrum = fft.analyze();
  const bw = bandWidth.value();
  noStroke();
  translate(width / 2, height / 2);
  for (let i = 0; i < spectrum.length; i += bw) {
    const angle = map(i, 0, spectrum.length, 0, 10);
    const amp = spectrum[i];
    const c = map(i, 0, spectrum.length, 0, 255);
    const color = (c + colorSlider.value()) % 360;
    const h = map(amp, 0, 256, 100, height / 2);
    rotate(-angle);
    noStroke();
    fill(color, 255, 255);
    rect(0, 0, bw, h);
  }
}

const createFFT = () => {
  fft = new p5.FFT(0.90, 1024);
}

const drawSpectrum = () => {
  background(0);
  const spectrum = fft.analyze();
  const bw = bandWidth.value();
  noStroke();
  for (let i = 0; i < spectrum.length; i += bw) {
    const amp = spectrum[i];
    const y = map(amp, 0, 256, height, 0);
    const c = map(i, 0, spectrum.length, 0, 360);
    const color = (c + colorSlider.value()) % 360;
    fill(color, 255, 255);
    rect(i, y, bw, height - y);
  }
}

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  colorMode(HSB);
  background(0);
  createControls();
  createFFT();
}

function draw() {
  // ellipse(mouseX, mouseY, 10, 10);
  song.setVolume(volumeSlider.value());
  // drawLine();
  // drawCircle();
  // drawSpectrum();
  // drawCircle();
  // drawCircleRects();
}

function keyTyped() {
  // if (key === ' ') {
  //   envelope.play();  
  // }
}