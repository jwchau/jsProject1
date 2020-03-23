//globals
const WIDTH = 800;
const HEIGHT = 600;
const songs = {};
let playButton;
let jumpButton;
let volumeSlider;

function preload() {
  for (let i = 1; i <= 5; i++) {
    const song = loadSound(`sounds/sound_${i}.mp3`);
    songs[i] = song;
    songs[i].setVolume(0.25);
  }
}

function togglePlaying() {
  if (!songs[1].isPlaying()) {
    songs[1].play();
    playButton.html("paws");
   } else {
    songs[1].pause();
    playButton.html("play");
  }
}

function createControls() {
  playButton = createButton("play");
  playButton.mousePressed(togglePlaying);
  jumpButton = createButton("jump");
  jumpButton.mousePressed(jumpSong);
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
}

const jumpSong = () => {
  var len = songs[1].duration();
  songs[1].jump(len / 2);
}


function setup() {
  createCanvas(WIDTH, HEIGHT);
  createControls();
}

function draw() {
  background(0);
  ellipse(mouseX, mouseY, 5, 5);
  songs[1].setVolume(volumeSlider.value());
}