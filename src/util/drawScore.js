import { Renderer, Stave, StaveNote, Formatter } from 'vexflow';

// 创建乐谱的函数
const drawScore = (notes) => {
    // 定义高音谱和低音谱的音符映射位移变量
    const highStaveDisplacement = 0;
    const lowStaveDisplacement = 12;

    // 音符映射函数
    const mapNote = (note, displacement) => {
        const [pitch, octave] = note.split('/');
        const pitches = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        let pitchIndex = pitches.indexOf(pitch);
        let octaveNum = parseInt(octave);

        pitchIndex += displacement;
        while (pitchIndex >= 7) {
            pitchIndex -= 7;
            octaveNum++;
        }
        while (pitchIndex < 0) {
            pitchIndex += 7;
            octaveNum--;
        }

        return `${pitches[pitchIndex]}/${octaveNum}`;
    };

    // 如果乐谱容器已存在，则清空乐谱
    const keyScore = document.getElementById('key-score');
    keyScore.innerHTML = '';

    // 创建一个SVG渲染器并将其附加到名为"keyScore"的DIV元素。
    const renderer = new Renderer(keyScore, Renderer.Backends.SVG);

    // 配置渲染上下文。
    renderer.resize(200, 200);
    const context = renderer.getContext();

    // 创建一个高音五线谱
    const highStave = new Stave(15, 10, 140);
    highStave.setStyle({ strokeStyle: 'black' }); // 设置颜色为黑色
    highStave.addKeySignature('C'); // 添加C大调
    highStave.setClef('treble').setContext(context).draw();

    // 创建一个低音五线谱
    const lowStave = new Stave(15, 75, 140);
    lowStave.setStyle({ strokeStyle: 'black' }); // 设置颜色为黑色
    lowStave.addKeySignature('C'); // 添加C大调
    lowStave.setClef('bass').setContext(context).draw(); // 使用低音谱号

    // 根据输入的音符分配到高音和低音音符数组
    const highNotes = [];
    const lowNotes = [];

    notes.forEach(note => {
        const [pitch, octave] = note.split('/');
        if (parseInt(octave) >= 4) {
            const mappedNote = mapNote(note, highStaveDisplacement);
            highNotes.push(new StaveNote({ keys: [mappedNote], duration: 'w', align_center: true }));
        } else {
            const mappedNote = mapNote(note, lowStaveDisplacement);
            lowNotes.push(new StaveNote({ keys: [mappedNote], duration: 'w', align_center: true }));
        }
    });

    // 格式化并绘制高音音符
    if (highNotes.length > 0) {
        Formatter.FormatAndDraw(context, highStave, highNotes);
    }

    // 格式化并绘制低音音符
    if (lowNotes.length > 0) {
        Formatter.FormatAndDraw(context, lowStave, lowNotes);
    }
};

export { drawScore };
