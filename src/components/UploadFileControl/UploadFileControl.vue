<template>
  <div class="upload-file-control">
    <span class="progress-value">{{ progressValueText }}</span>
    <div class="progress-bar"></div>
    <div class="actions">
      <div class="icon pause" v-if="uploading" @click="pause">
        <Icon icon="material-symbols:pause" />
      </div>
      <div class="icon start" @click="start(true)" v-else>
        <Icon icon="teenyicons:play-solid" />
      </div>
      <div class="icon cancel" @click="cancel">
        <Icon icon="pajamas:stop" />
      </div>
      <div class="icon more">
        <Icon icon="mingcute:more-2-line" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Icon } from '@iconify/vue';
import { TusUpload } from '../../utils/tusUtils';
import { useCurrentUserStore } from '../../store/useCurrentUserStore';
import { bindTusFile } from '../../api/attachment';
import { Attachment } from '../../types/Types';

const emits = defineEmits<{
  (e: 'completed', attachment: Attachment): void,
  (e: 'cancel'): void
}>()

const props = defineProps<{
  file: File
}>()

const progressValue = ref(0);
const uploading = ref(false);

const progressValueText = computed(() => progressValue.value + '%');

const currentUserStore = useCurrentUserStore()

let upload: TusUpload | null = null;

let manualPasue = false

const start = (force: boolean = false) => {
  if (!force && manualPasue) return;
  if (uploading.value) return;
  upload = new TusUpload(props.file)
    .addAuthorizationFactory(() => `Bearer ${currentUserStore.token}`)
    .setProgress((loaded, total) => {
      progressValue.value = Math.ceil(loaded / (total ?? props.file.size) * 100)
    })
    .setSuccess((fileId: string) => {
      bindTusFile(fileId).then(res => {
        if (!res.succeeded) {
          throw new Error('upload file error.')
        }
        const attachment = res.data as Attachment;
        emits('completed', attachment)
        pause()
      }).catch(err => {
        ElNotification.error(err)
      })
    })
    .setError(() => {
      stop()
      ElNotification.error('upload failure.')
    })
    .build();
  upload.start();
  uploading.value = true
}

const pause = () => {
  uploading.value = false
  manualPasue = true;
  upload && upload.pause();
}

const cancel = () => {
  pause()
  progressValue.value = 0;
  emits('cancel')
}

defineExpose({
  start
})

</script>

<style lang="scss" scoped>
.upload-file-control {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  background-color: white;
  border-radius: 12px;
  padding: 8px 16px;
  user-select: none;
}

.progress-value {
  font-size: 14px;
  color: black;
}

.progress-bar {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    background-color: aquamarine;
    width: v-bind(progressValueText);
    height: 6px;
    transition: width .3s linear;
  }
}

.actions {
  display: flex;
  gap: 8px;

  &>.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;

    &.pause,
    &.start {
      background-color: #EFEFF4;
      color: #D4D6DD;
    }

    &.cancel {
      background-color: #FCEFF0;
      color: #DF9EAF;
    }

  }

}
</style>
