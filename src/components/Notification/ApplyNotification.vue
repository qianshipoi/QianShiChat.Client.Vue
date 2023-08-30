<template>
  <div class="apply-notification">
    <el-image :src="apply.user!.avatar" fit="cover"></el-image>
    <div class="apply-notification-content">
      <p>收到来自[{{ apply.user!.nickName }}]的好友申请，备注：{{ apply.remark }}</p>
      <div class="apply-notification-actions">
        <button class="success" @click="emits('success')">{{ i18n.global.t('actions.pass') }}</button>
        <button class="warning" @click="emits('reject')">{{ i18n.global.t('actions.reject') }}</button>
        <button @click="emits('detail')">{{ i18n.global.t('actions.detail') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { FriendApply } from '../../types/Types'
import i18n from '../../lang/index'

defineProps<{
  apply: FriendApply
}>();

const emits = defineEmits<{
  (e: 'success'): void,
  (e: 'reject'): void,
  (e: 'detail'): void
}>()

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
    align-items: start;
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
