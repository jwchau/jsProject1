//globals
const WIDTH = 512;
const HEIGHT = 512;
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
  song = songs[2];
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
  jumpButton = createButton("jump");
  jumpButton.mousePressed(jumpSong);
  volumeSlider = createSlider(0, 0.5, 0.25, 0.0125);
  amp = new p5.Amplitude();
}

const jumpSong = (len = song.duration()) => {
  let t = random(len);
  console.log(t);
  song.jump(t);
}

const drawAmplitude = (vol) => {
  const diam = map(vol, 0, 0.1, 1, 100);
  ellipse(WIDTH / 2, HEIGHT / 2, diam, diam);
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
  const size = map(val, 0, 0.5, 0, HEIGHT);
  ellipse(WIDTH / 2, HEIGHT / 2, size, size);
}

const drawLine = () => {
  const vol = amp.getLevel();
  volData.push(vol);
  stroke(255);
  noFill();

  beginShape();
  for (let i = 0; i < volData.length; i++) {
    const y = map(volData[i], 0, 0.25, HEIGHT / 2, 0);
    vertex(i, y);
  }
  endShape();

  if (volData.length > WIDTH - 200) volData.splice(0, 1);
}

const drawCircle = () => {
  background(0);
  const vol = amp.getLevel();
  volData.push(vol);
  noFill();
  stroke(255);

  translate(WIDTH / 2, HEIGHT / 2);

  beginShape();
  for (let i = 0; i < 360; i++) {
    const r = map(volData[i], 0, 0.25, 50, 300);
    const x = r * cos(i);
    const y = r * sin(i);
    vertex(x, y);
  }
  endShape();

  if (volData.length > 360) volData.splice(0, 1);
}

const createFFT = () => {
  fft = new p5.FFT(0, 512);
}

const drawSpectrum = () => {
  background(0);
  const spectrum = fft.analyze();
  stroke(255);
  noFill();
  for (let i = 0; i < spectrum.length; i++) {
    const amp = spectrum[i];
    const y = map(amp, 0, 256, height, 0);
    drawLine(i, height, i, y);
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  angleMode(DEGREES);
  background(0);
  createControls();
  createFFT();
}

function draw() {
  // ellipse(mouseX, mouseY, 10, 10);
  song.setVolume(volumeSlider.value());
  // drawLine();
  // drawCircle();
  drawSpectrum();
}

function keyTyped() {
  // if (key === ' ') {
  //   envelope.play();  
  // }
}