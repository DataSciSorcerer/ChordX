<template>
    <!-- Top-bar -->
    <div class="navbar fixed">
        <!-- config -->
        <div class="tooltip tooltip-bottom">
            <a class="btn btn-ghost ml-2 btn-circle" @click="openConfigModal"><icon-config size="26" /></a>
        </div>

        <!-- config modal -->
        <dialog ref="configModal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg">⚙️Config</h3>
                <div class="py-4">
                    <h2 class="font-bold">显示</h2>
                    <div class="form-control">
                        <label v-for="option in displayOptions" :key="option.key" class="label cursor-pointer">
                            <span class="label-text font-bold">{{ option.label }}</span>
                            <input type="checkbox" class="toggle toggle-primary" v-model="config[option.key]" />
                        </label>
                    </div>
                    <h2 class="font-bold">声音</h2>
                    <label class="label cursor-pointer">
                        <span class="label-text font-bold">开启声音</span>
                        <input type="checkbox" class="toggle toggle-primary"/>
                    </label>
                </div>
                <div class="modal-action">
                    <button class="btn" @click="closeConfigModal">❌</button>
                </div>
            </div>
        </dialog>

        <!-- change language -->
        <div class="tooltip tooltip-bottom">
            <details class="dropdown z-20">
                <summary class="m-1 btn btn-ghost ml-2 btn-circle"><icon-translate size="26" /></summary>
                <ul class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-48">
                    <li v-for="lang in languages" :key="lang.code"><a class="text-xl" @click="changeLanguage(lang.code)">{{ lang.icon }}{{ lang.name }}</a></li>
                </ul>
            </details>
        </div>

        <!-- Change screen -->
        <div class="tooltip tooltip-bottom">
            <label class="swap swap-rotate">
                <input type="checkbox" v-model="isFullScreen" @change="toggleFullScreen" />
                <!-- full screen icon -->
                <a class="btn btn-ghost btn-circle swap-off" @click="changeScreen">
                    <icon-full-screen size="26" />
                </a>
                <!-- off screen icon -->
                <a class="btn btn-ghost btn-circle swap-on" @click="changeScreen">
                    <icon-off-screen size="26" />
                </a>
            </label>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";

const configModal = ref(null);
const isFullScreen = ref(false);

const config = reactive({
    showChords: false,
    showNoteName: false,
    showRollCall: false,
    showRange: false,
    showNoteVelocity: false,
    soundOn: false,
});

const displayOptions = [
    { key: 'showChords', label: '显示和弦' },
    { key: 'showNoteName', label: '显示音符名称' },
    { key: 'showRollCall', label: '显示点名' },
    { key: 'showRange', label: '显示范围' },
    { key: 'showNoteVelocity', label: '显示音符力度' },
];

const languages = [
    { code: 'zh', name: '中文', icon: '🀄' },
    { code: 'fr', name: 'Français', icon: '🍷' },
    { code: 'en', name: 'English', icon: '🗽' },
    { code: 'ja', name: '日本語', icon: '🎎' },
];

const openConfigModal = () => configModal.value.showModal();
const closeConfigModal = () => configModal.value.close();

const changeLanguage = (langCode) => {
    // 实现语言切换逻辑
    console.log(`切换到语言：${langCode}`);
};

const toggleFullScreen = () => {
    if (isFullScreen.value) {
        enterFullScreen();
    } else {
        exitFullScreen();
    }
};

const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

const exitFullScreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
};
</script>