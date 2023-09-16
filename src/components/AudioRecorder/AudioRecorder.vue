<template>
  <div class="audio-recorder">
    <canvas class="warp" ref="bgCanvas"></canvas>
    <div class="actions">
      <Vue3Lottie v-if="showCompleted" @click="yesHandle" style="cursor: pointer;" :animation-data="yesJSON" :width="48"
        :height="48" :loop="false" />
      <Vue3Lottie @click="playing = !playing" style="cursor: pointer;" @on-animation-loaded="onAnimationLoaded"
        ref="playPauseLottieRef" :height="60" :width="60" :animation-data="microphoneJSON" :auto-play="false"
        direction="alternate" />
      <Vue3Lottie v-if="showCompleted" @click="cancelHandle" style="cursor: pointer;" :animation-data="cancelJSON"
        :width="48" :height="48" :loop="false" />
      <!-- <span>{{ duration }}</span> -->
    </div>
  </div>
</template>

<script setup lang='ts'>
import { usePermission } from '@vueuse/core'
import Recorder from 'js-audio-recorder'
import { Vue3Lottie } from 'vue3-lottie'
import { drawRoundedRect, Rect } from '../../utils/canvasUtils'
import microphoneJSON from '../../assets/json/microphone.json'
import cancelJSON from '../../assets/json/cancel.json'
import yesJSON from '../../assets/json/yes.json'

const playing = ref(false)
const playPauseLottieRef = ref<InstanceType<typeof Vue3Lottie>>()
const duration = ref('')
const bgCanvas = ref<HTMLCanvasElement>()
let drawRecordId: number = 0
let recorder: Recorder | null = null

const onAnimationLoaded = () => {
  playPauseLottieRef.value?.goToAndStop(31, true)
}

watch(() => playing.value, (playing) => {
  if (playing) {
    playPauseLottieRef.value?.play()
    start()
  } else {
    playPauseLottieRef.value?.pause()
    pause()
  }
})

const microphoneAccess = usePermission('microphone', {
  controls: true
})

onMounted(() => {
  microphoneAccess.query().then(() => {
  }).catch(err => {
    console.error(err);
    ElNotification.error("获取麦克风权限失败")
  })
})

onUnmounted(() => {
  pause()
  recorder?.destroy()
})

const start = () => {
  if (!recorder) {
    recorder = new Recorder({
      sampleBits: 16,
      sampleRate: 16000, // 浏览器默认的输入采样率,
      numChannels: 1,
      compiling: true,
    })
    recorder.onprogress = (params) => {
      duration.value = params.duration.toFixed(2)
    }
    recorder.start().then(() => {
      ElNotification.success('开始录制')
      drawRecord()
    }, err => {
      console.error(err);
    })
  } else {
    recorder.resume()
    drawRecord()
  }
}

const pause = () => {
  drawRecordId && cancelAnimationFrame(drawRecordId)
  recorder?.pause();
}

const showCompleted = computed(() => !playing.value && !!duration.value)

const yesHandle = () => {

}

const cancelHandle = () => {
  pause()
  recorder?.destroy();
  recorder = null;
  duration.value = ''
}

const drawRecord = () => {
  if (!recorder || !bgCanvas.value) return
  drawRecordId = requestAnimationFrame(drawRecord);
  const dataArray = recorder.getRecordAnalyseData() as Uint8Array;
  const bufferLength = dataArray.length;
  const oCanvas = bgCanvas.value;
  const ctx = oCanvas.getContext('2d')!

  ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);

  // 设定波形绘制颜色
  ctx.strokeStyle = "#00A28B";
  ctx.fillStyle = "#00A28B";

  ctx.beginPath();

  const rectCount = 32;
  const skipCount = bufferLength / rectCount;
  const rectWidth = (oCanvas.width - 8) / rectCount;
  let currentX = 4;

  for (var i = 0;i < bufferLength;i += skipCount) {
    let v = dataArray[i] / 128.0;
    let y = v * oCanvas.height / 2;
    const height = Math.abs((oCanvas.height / 2 - y)) * 2 * 2;
    y = (oCanvas.height / 2) - height / 2
    // if (y > oCanvas.height / 2) {
    //   y = y - height
    // }
    const rect: Rect = {
      x: currentX + 2,
      y: y,
      width: rectWidth - 4,
      height: height
    }
    drawRoundedRect(rect, 1, ctx);
    ctx.fill()
    // 依次平移，绘制所有点
    currentX += rectWidth;
  }

  ctx.stroke();
}
</script>

<style lang="scss" scoped>
.audio-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.warp {
  width: 200px;
  height: 100px;
}

.actions {
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
