<template>
  <div class="audio-message">
    <span class="duration">{{ durationFormat(duration) }}</span>
    <div class="progress">
      <Vue3Lottie :height="28" ref="playLottieRef" :pause-animation="!playing" :auto-play="false"
        :animation-data="audioPlayJSON" />
    </div>
    <div class="action" @click="changePlayHandle">
      <Vue3Lottie @on-animation-loaded="onAnimationLoaded" ref="playPauseLottieRef" :height="28"
        :animation-data="playPauseJSON" :speed="2" :loop="false" :auto-play="false" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Attachment } from '../../types/Types';
import { Vue3Lottie } from 'vue3-lottie';
import audioPlayJSON from '../../assets/json/audio-play.json'
import playPauseJSON from '../../assets/json/play-pause.json'
import { Howl } from 'howler'

const props = defineProps<{
  content: Attachment
}>()
const playLottieRef = ref<InstanceType<typeof Vue3Lottie>>()
const playPauseLottieRef = ref<InstanceType<typeof Vue3Lottie>>()

const onAnimationLoaded = () => {
  playPauseLottieRef.value?.goToAndStop(31, true)
}

const playing = ref(false)

watch(() => playing.value, (playing) => {
  if (playing) {
    playPauseLottieRef.value?.playSegments([[31, 61]], true)
  } else {
    playPauseLottieRef.value?.playSegments([[0, 31]], true)
  }
})

let sound: Howl = new Howl({
  src: props.content.rawPath,
  html5: true,
  preload: 'metadata'
});

const duration = ref(0);

sound.on('load', () => {
  duration.value = sound.duration()
});

sound.on('end', () => {
  playing.value = false
})

sound.on('loaderror', () => {
  pause();
})

const changePlayHandle = () => {
  playing.value = !playing.value
  playing.value ? play() : pause()
}

const play = () => {
  sound.play()
  updateDuration()
}

let timer: number | null = null;

const updateDuration = () => {
  timer = requestAnimationFrame(updateDuration)
  duration.value = sound.duration() - sound.seek()
}

const pause = () => {
  timer && cancelAnimationFrame(timer);
  sound.pause()
}

const durationFormat = (duration: number) => {
  return `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`
}

</script>

<style lang="scss" scoped>
.audio-message {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 6px 8px;
  height: 40px;
  min-width: 160px;
}

.duration {
  font-size: 12px;
}

.action {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 28px;
  border-radius: 4px;
  cursor: pointer;
  transition: all .3s ease;

  &:hover {
    background-color: #cccccc;
  }
}
</style>
