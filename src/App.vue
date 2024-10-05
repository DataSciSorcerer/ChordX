<script setup>
import TopBar from './components/TopBar.vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import { sortKeys } from './util/sortKeys';
import { drawScore } from './util/drawScore';
import { WebMidi } from 'webmidi';
import { Chord } from 'tonal'

// 数据
const keys = ref("C E G");
const chords = ref([]);
const keyScore = ref(['C/4', 'E/4', 'G/4']);
const activeKeys = ref([]);
const isSoundOn = ref(false);

// 将 pianoNotes 移到顶层作用域
const pianoNotes = ref([
  { note: 'C', octave: 1 }, { note: 'C#', octave: 1 }, { note: 'D', octave: 1 },
  { note: 'D#', octave: 1 }, { note: 'E', octave: 1 }, { note: 'F', octave: 1 },
  { note: 'F#', octave: 1 }, { note: 'G', octave: 1 }, { note: 'G#', octave: 1 },
  { note: 'A', octave: 1 }, { note: 'A#', octave: 1 }, { note: 'B', octave: 1 },
  { note: 'C', octave: 2 }, { note: 'C#', octave: 2 }, { note: 'D', octave: 2 },
  { note: 'D#', octave: 2 }, { note: 'E', octave: 2 }, { note: 'F', octave: 2 },
  { note: 'F#', octave: 2 }, { note: 'G', octave: 2 }, { note: 'G#', octave: 2 },
  { note: 'A', octave: 2 }, { note: 'A#', octave: 2 }, { note: 'B', octave: 2 },
  { note: 'C', octave: 3 }, { note: 'C#', octave: 3 }, { note: 'D', octave: 3 },
  { note: 'D#', octave: 3 }, { note: 'E', octave: 3 }, { note: 'F', octave: 3 },
  { note: 'F#', octave: 3 }, { note: 'G', octave: 3 }, { note: 'G#', octave: 3 },
  { note: 'A', octave: 3 }, { note: 'A#', octave: 3 }, { note: 'B', octave: 3 },
  { note: 'C', octave: 4 }, { note: 'C#', octave: 4 }, { note: 'D', octave: 4 },
  { note: 'D#', octave: 4 }, { note: 'E', octave: 4 }, { note: 'F', octave: 4 },
  { note: 'F#', octave: 4 }, { note: 'G', octave: 4 }, { note: 'G#', octave: 4 },
  { note: 'A', octave: 4 }, { note: 'A#', octave: 4 }, { note: 'B', octave: 4 },
  { note: 'C', octave: 5 }, { note: 'C#', octave: 5 }, { note: 'D', octave: 5 },
  { note: 'D#', octave: 5 }, { note: 'E', octave: 5 }, { note: 'F', octave: 5 },
  { note: 'F#', octave: 5 }, { note: 'G', octave: 5 }, { note: 'G#', octave: 5 },
  { note: 'A', octave: 5 }, { note: 'A#', octave: 5 }, { note: 'B', octave: 5 },
  { note: 'C', octave: 6 }, { note: 'C#', octave: 6 }, { note: 'D', octave: 6 },
  { note: 'D#', octave: 6 }, { note: 'E', octave: 6 }, { note: 'F', octave: 6 },
  { note: 'F#', octave: 6 }, { note: 'G', octave: 6 }, { note: 'G#', octave: 6 },
  { note: 'A', octave: 6 }, { note: 'A#', octave: 6 }, { note: 'B', octave: 6 },
  { note: 'C', octave: 7 }, { note: 'C#', octave: 7 }, { note: 'D', octave: 7 },
  { note: 'D#', octave: 7 }, { note: 'E', octave: 7 }, { note: 'F', octave: 7 },
  { note: 'F#', octave: 7 }, { note: 'G', octave: 7 }, { note: 'G#', octave: 7 },
  { note: 'A', octave: 7 }, { note: 'A#', octave: 7 }, { note: 'B', octave: 7 },
  { note: 'C', octave: 8 }
]);

// 监听 keys.value 的变化
watch(keys, (newValue, oldValue) => {
    console.log(newValue.split(' ').map(note => note[0] + '/' + note[1]));
    drawScore(newValue.split(' ').map(note => note[0] + '/' + note[1]))
})

// 添加滚动控制
const pianoRef = ref(null);
const scrollAmount = 200;

const scrollPiano = (direction) => {
    if (pianoRef.value) {
        pianoRef.value.scrollLeft += direction * scrollAmount;
    }
};

function handleSoundToggle(isOn) {
  isSoundOn.value = isOn;
  console.log("声音状态改变:", isOn);
}

// 优化 MIDI 相关函数
const setupMIDI = () => {
  const MIDIDevice = [];
  let pressedKeys = [];
  const MIDINoteNames = [
    'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
    'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
    'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
    'C8'
  ];

  WebMidi
    .enable()
    .then(() => {
      console.log('WebMidi 已启用!');
      WebMidi.inputs.forEach(input => MIDIDevice.push(input.name));
      const myMIDI = WebMidi.getInputByName(MIDIDevice[0]);

      myMIDI.addListener('noteon', 'all', handleNoteOn);
      myMIDI.addListener('noteoff', 'all', handleNoteOff);
    })
    .catch(err => alert(err));

  const handleNoteOn = (e) => {
    const noteName = MIDINoteNames[e.note.number];
    pressedKeys.push(noteName);
    pressedKeys = sortKeys(pressedKeys);

    keys.value = pressedKeys.join(' ');
    chords.value = Chord.detect(pressedKeys);
    activeKeys.value.push(noteName);
  };

  const handleNoteOff = (e) => {
    const noteName = MIDINoteNames[e.note.number];
    const index = pressedKeys.indexOf(noteName);

    if (index > -1) {
      pressedKeys.splice(index, 1);
      activeKeys.value = activeKeys.value.filter(key => key !== noteName);
    }
  };
};

// 生命周期钩子
onMounted(() => {
  drawScore(keyScore.value);
  setupMIDI();
});
</script>

<template>
    <div id="content">
        <div class="top-bar">
            <TopBar @sound-toggle="handleSoundToggle" />
        </div>
        <div class="view-content">
            <div class="chord-content">
                <div id="key-score"></div>
                <div class="key-note">
                    <div class="chord-name">
                        <span class="main-chord">{{ chords[0] || '' }}</span>
                        <span class="sub-chords">{{ chords.slice(1).join(' ') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="piano-container">
            <div class="piano-controls">
                <button class="scroll-button left" @click="scrollPiano(-1)">
                    <icon-left theme="outline" size="26" fill="#333" />
                </button>
                <button class="scroll-button right" @click="scrollPiano(1)">
                    <icon-right theme="outline" size="26" fill="#333" />
                </button>
            </div>
            <div class="piano" ref="pianoRef">
                <div v-for="{ note, octave } in pianoNotes" :key="`${note}${octave}`"
                    :class="['key', note.includes('#') ? 'black' : 'white', 
                             activeKeys.includes(`${note}${octave}`) ? 'active' : '']">
                    <span class="note-name">{{ note }}{{ octave }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#content {
    height: 100vh;
}

.top-bar {
    height: 90px;
}

.view-content {
    height: calc(100vh - 90px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-family: 'Times New Roman', Times, serif;
}

.chord-content {
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 90px;
}

#key-score {
    transform: scale(3);
}

.keys-name {
    font-size: 78px;
}

.chord-name {
    font-size: 86px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.main-chord {
    font-size: 86px;
}

.sub-chords {
    font-size: 48px;
    margin-top: 10px;
}

.piano-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 140px;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
}

.piano-controls {
    display: flex;
    justify-content: flex-end;
    padding: 5px;
    background: #ECE3CA;
}

.piano {
    flex: 1;
    display: flex;
    overflow-x: hidden;
    scroll-behavior: smooth;
}

.key {
    flex: 0 0 2.5%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 5px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #ccc;
    border-top: none;
    box-sizing: border-box;
}

.white {
    background-color: #fff;
}

.black {
    background-color: #333;
    color: #fff;
    height: 60%;
    margin-left: -1.25%;
    margin-right: -1.25%;
    z-index: 1;
    width: 1.5%;
}

.white:hover,
.white:active {
    background-color: #e6e6e6;
}

.black:hover,
.black:active {
    background-color: #555;
}

.note-name {
    font-family: Arial, sans-serif;
    font-weight: bold;
    opacity: 0.7;
    font-size: 7px;
}

.white .note-name {
    color: #333;
}

.black .note-name {
    color: #fff;
}

.key.active {
    background-color: #45a049;
    color: white;
}

.black.active {
    background-color: #45a049;
}

.scroll-button {
    width: 30px;
    height: 30px;
    background-color: #ddd;
    border: none;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
    transition: background-color 0.3s ease;
}

.scroll-button.left {
    left: 0;
    background: #E4D8B4;
}

.scroll-button.right {
    right: 0;
    background: #E4D8B4;
}

.scroll-button:hover {
    background-color: #D4C8A4;
}
</style>