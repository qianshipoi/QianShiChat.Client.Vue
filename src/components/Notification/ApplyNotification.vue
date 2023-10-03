<template>
  <div class="apply-notification">
    <el-image :src="apply.user!.avatar" fit="cover"></el-image>
    <div class="apply-notification-content">
      <p>收到来自[{{ apply.user!.nickName }}]的{{ applyType === 'friend' ? "好友" : "进群" }}申请，备注：{{ apply.remark }}</p>
      <div class="apply-notification-actions">
        <button class="success" @click="emits('success')">{{ i18n.global.t('actions.pass') }}</button>
        <button class="warning" @click="emits('reject')">{{ i18n.global.t('actions.reject') }}</button>
        <button @click="emits('detail')">{{ i18n.global.t('actions.detail') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { FriendApply, GroupApply } from '../../types/Types'
import i18n from '../../lang/index'
import { useCurrentElement, useElementHover } from '@vueuse/core';

const props = withDefaults(defineProps<{
  apply: FriendApply | GroupApply,
  applyType: "friend" | "group",
  duration?: number
}>(), {
  duration: 5000
});

const emits = defineEmits<{
  (e: 'success'): void;
  (e: 'reject'): void;
  (e: 'detail'): void;
  (e: 'close'): void;
}>()

const currentElement = useCurrentElement<HTMLDivElement>()

let timer: number | null = null

let startTime: number = 0;
let duration = props.duration;

onMounted(() => {
  start();
})

const close = () => {
  emits('close')
}

const start = () => {
  if (duration <= 0) {
    close()
    return
  }
  startTime = Date.now()
  timer = setTimeout(() => {
    close()
  }, duration);
}

const pause = () => {
  if (timer) {
    duration = duration - (Date.now() - startTime)
    clearTimeout(timer)
  }
}

const reset = () => {
  duration = props.duration
  timer && clearTimeout(timer)
  start()
}

const isHover = useElementHover(currentElement)

watch(() => isHover.value, (isHover) => {
  isHover ? pause() : start()
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

defineExpose({
  reset,
  close
})

</script>

<style lang="scss">
.apply-notification {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;

  &>.el-image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  &>.apply-notification-content {
    display: flex;
    flex-direction: column;
    align-items: startTime;
    gap: 4px;

    .apply-notification-actions {
      display: flex;
      gap: 4px;

      button {
        padding: .4rem .6rem;
      }

      .success {
        background-color: var(--success);
        color: white;
      }

      .warning {
        background-color: var(--warning);
        color: white;
      }
    }
  }
}
</style>
