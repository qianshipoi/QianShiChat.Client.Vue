<template>
  <div class="friend-apply">
    <header>
      <h4>群通知</h4>
      <div class="actions">
        <el-icon>
          <Filter />
        </el-icon>
        <el-icon>
          <Delete />
        </el-icon>
      </div>
    </header>
    <el-scrollbar>
      <main>
        <section v-for="apply in applies" :key="apply.id">
          <el-image :src="apply.user!.avatar" style="width: 42px; height: 42px; border-radius: 50%;" fit="cover"
            :lazy="true"></el-image>
          <div class="base-info">
            <div class="up">
              <span class="name">{{ apply.user!.nickName }}</span>
              <span>申请加入群:[{{ apply.group.name }}]</span>
              <span class="time">{{ timeFormat(apply.createTime) }}</span>
            </div>
            <span class="remark" v-show="apply.remark">留言：{{ apply.remark }}</span>
          </div>
          <span class="action-text" v-if="apply.status === ApplyStatus.Ignored">已忽略</span>
          <span class="action-text" v-else-if="apply.status === ApplyStatus.Rejected">已拒绝</span>
          <span class="action-text" v-else-if="apply.status === ApplyStatus.Passed">已同意</span>
          <el-dropdown v-loading="storeLoading" v-else split-button size="small" type="default"
            @click="groupStore.approval(apply, 'pass')">
            {{ t('actions.pass') }}
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="groupStore.approval(apply, 'ignore')">{{ t('actions.ignore') }}</el-dropdown-item>
                <el-dropdown-item
                  @click="groupStore.approval(apply, 'reject')">{{ t('actions.reject') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </section>
      </main>
    </el-scrollbar>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { ApplyStatus, GroupApply } from '../../types/Types';
import { Filter, Delete } from '@element-plus/icons-vue'
import { pending } from '../../api/group'
import { ElNotification } from 'element-plus';
import { timeFormat } from '../../utils/timeUtils';
import { useGroupStore } from '../../store/useGroupStore';
import { storeToRefs } from 'pinia';

const applies = reactive<GroupApply[]>([])

const { t } = useI18n()
const loading = ref<boolean>(false)
let lastTime = 0;
const groupStore = useGroupStore();

const { loading: storeLoading } = storeToRefs(groupStore)

const loadData = async () => {
  loading.value = true;
  try {
    const result = await pending({
      size: 10,
      beforeLastTime: lastTime
    })
    if (!result.succeeded) {
      throw new Error(result.errors as string)
    }
    result.data && applies.push(...result.data.items);
  } catch (error: any) {
    ElNotification.error(error);
  } finally {
    loading.value = false
  }
}

loadData();

</script>

<style lang="scss" scoped>
.friend-apply {
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 1.2rem;
  height: 100%;
  overflow: hidden;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .actions {
    display: flex;
    gap: .5rem;

    .el-icon {
      cursor: pointer;

      &:hover {
        color: var(--primary);
      }
    }
  }
}

main {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &>section {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
    height: 80px;
    padding: 1rem 2rem;
    margin: 0 1rem;
    background-color: var(--friend-apply-item-bg-color);
    border-radius: .8rem;

    .base-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
      text-align: left;
      font-size: 12px;

      .up {
        display: flex;
        gap: 6px;
      }

      .name {
        color: var(--primary);
      }

      .time {
        color: #999;
      }
    }

    .action-text {
      font-size: .6rem;
    }
  }
}
</style>
