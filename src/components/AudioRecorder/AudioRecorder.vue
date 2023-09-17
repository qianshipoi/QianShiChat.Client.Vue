<template>
  <div class="audio-recorder">
    <div class="duration-box">
      <span>duration</span>
      <span>{{ duration }} s</span>
    </div>
    <div class="center">
      <canvas class="warp" ref="bgCanvas"></canvas>
      <div class="actions">
        <Vue3Lottie v-if="showCompleted" @click="yesHandle" :animation-data="yesJSON"
          :width="yesOrCancelIconWidthAndHeight" :height="yesOrCancelIconWidthAndHeight" :loop="false" />
        <Vue3Lottie @click="playing = !playing" :pause-animation="!playing" :height="payIconWidthAndHeight"
          :width="payIconWidthAndHeight" :animation-data="microphoneJSON" :auto-play="false" direction="alternate" />
        <Vue3Lottie v-if="showCompleted" @click="cancelHandle" :animation-data="cancelJSON"
          :width="yesOrCancelIconWidthAndHeight" :height="yesOrCancelIconWidthAndHeight" :loop="false" />
      </div>
    </div>
    <Icon @click="$emit('back')" class="icon" icon="bi:keyboard-fill" />
  </div>
</template>

<script setup lang='ts'>
import { usePermission } from '@vueuse/core'
import { Vue3Lottie } from 'vue3-lottie'
import { Icon } from '@iconify/vue'
import { drawRoundedRect, Rect } from '../../utils/canvasUtils'
import microphoneJSON from '../../assets/json/microphone.json'
import cancelJSON from '../../assets/json/cancel.json'
import yesJSON from '../../assets/json/yes.json'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';

const emits = defineEmits<{
  (e: 'completed', file: File): void,
  (e: 'back'): void
}>()

const playing = ref(false)
const duration = ref('0.00')
const bgCanvas = ref<HTMLCanvasElement>()
const payIconWidthAndHeight = 48;
const yesOrCancelIconWidthAndHeight = 32;
let drawRecordId: number = 0
let recorder: typeof Recorder | null = null
let recordPowerLevelArray: number[] = Array(32).fill(0)

watch(() => playing.value, (playing) => playing ? start() : pause())

const microphoneAccess = usePermission('microphone', {
  controls: true
})

onMounted(() => {
  microphoneAccess.query().then(() => {
    drawRecord()
  }).catch(err => {
    console.error(err);
    ElNotification.error("获取麦克风权限失败")
  })
})

onUnmounted(() => destroy())

function cycleArray(theArray: number[], lastValue: number) {
  const newArray = [...theArray]
  for (let i = newArray.length - 2;i >= 0;i--) {
    const element = newArray[i];
    newArray[i + 1] = element
  }
  newArray[0] = lastValue
  return newArray;
}

const start = () => {
  if (!recorder) {
    recorder = new Recorder({
      type: "mp3",
      sampleRate: 16000,
      bitRate: 16,
      onProcess: (_buffer: Int16Array[], powerLevel: number, bufferDuration: number, _bufferSampleRate: number, _newBufferIdx: number, _asyncEnd: () => void) => {
        duration.value = (bufferDuration / 1000).toFixed(2);
        recordPowerLevelArray = cycleArray(recordPowerLevelArray, powerLevel)
      }
    })
    recorder.open(() => {
      ElNotification.success('开始录制')
      recorder.start()
      !drawRecordId && drawRecord()
    }, (msg: string, _isUserNotAllow: boolean) => {
      ElNotification.error(msg);
    })
  } else {
    recorder.resume()
  }
}

const pause = () => {
  drawRecordId && cancelAnimationFrame(drawRecordId)
  drawRecordId = 0;
  recorder?.pause()
}

const destroy = () => {
  drawRecordId && cancelAnimationFrame(drawRecordId)
  drawRecordId = 0;
  recorder?.close()
  recorder = null;
  duration.value = '0.00'
}

const showCompleted = computed(() => !playing.value && !!recorder && !!duration.value)

const yesHandle = () => {
  if (!recorder) return
  recorder?.stop((blob: Blob, _duration: number) => {
    emits('completed', new File([blob], new Date().getTime() + ".mp3", { type: blob.type }))
  }, destroy);
}

const cancelHandle = () => {
  pause()
  recorder?.stop(destroy);
}

const drawRecord = () => {
  if (!bgCanvas.value) return
  const oCanvas = bgCanvas.value;
  const ctx = oCanvas.getContext('2d')!

  ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);

  // 设定波形绘制颜色
  ctx.strokeStyle = "#00A28B";
  ctx.fillStyle = "#00A28B";

  ctx.beginPath();

  const padding = 4; // 绘制区域边框
  const space = 4;  // 绘制线条间隔
  const rectCount = recordPowerLevelArray.length;
  const rectWidth = (oCanvas.width - padding * 2) / rectCount;
  let currentX = padding;
  const height = oCanvas.height - padding * 2;

  for (let i = 0;i < rectCount;i++) {
    const v = Math.max(recordPowerLevelArray[i], 2) / 100 * height;
    const y = height - v;

    const rect: Rect = {
      x: currentX + space / 2,
      y: y,
      width: rectWidth - space,
      height: v
    }
    drawRoundedRect(rect, 2, ctx);
    ctx.fill()
    // 依次平移，绘制所有点
    currentX += rectWidth;
  }

  ctx.stroke();
  drawRecordId = requestAnimationFrame(drawRecord);
}
</script>

<style lang="scss" scoped>
.audio-recorder {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 8px;
}

.duration-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
}

.icon {
  cursor: pointer;
  font-size: 28px;
  color: #999;
  transition: color .2s ease;

  &:hover {
    color: #00A28B;
  }
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.warp {
  width: 200px;
  height: 60px;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &>* {
    cursor: pointer;
  }
}
</style>
