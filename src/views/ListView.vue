<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard,
  NSpace,
  NSelect,
  NInputNumber,
  NText,
  NRadioGroup,
  NRadioButton,
  NDataTable,
  NModal,
  NButton,
  NDivider,
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const router = useRouter()

// ── Filters ───────────────────────────────────────────
const filterType     = ref<string | null>(null)
const filterDowntown = ref<string | null>(null)
const filterPriceMin = ref<number | null>(null)
const filterPriceMax = ref<number | null>(null)
const filterAsset    = ref<string | null>(null)

const typeOptions = [
  { label: '建物', value: 'building' },
  { label: '土地', value: 'land' },
]
const downtownOptions = [
  { label: '市中心', value: 'downtown' },
  { label: '精華區', value: 'prime' },
]
const assetOptions = [
  { label: '住宅', value: 'residential' },
  { label: '商業', value: 'commercial' },
  { label: '工業', value: 'industrial' },
]

// ── Sort ──────────────────────────────────────────────
const sortBy = ref<'created_at' | 'updated_at'>('updated_at')

// ── Table ─────────────────────────────────────────────
type Row = {
  id: string
  name: string
  type: string
  assetType: string
  downtown: string
  price: number
  createdAt: string
  updatedAt: string
}

const columns: DataTableColumns<Row> = [
  { title: 'ID',       key: 'id',        width: 80 },
  { title: '名稱',     key: 'name' },
  { title: '資料類型', key: 'type' },
  { title: '資產類型', key: 'assetType' },
  { title: '區域',     key: 'downtown' },
  { title: '價格',     key: 'price' },
  { title: '建立日期', key: 'createdAt' },
  { title: '更新日期', key: 'updatedAt' },
]

// Placeholder rows — replace with API data
const tableData: Row[] = [
  { id: '001', name: '範例資料 A', type: '建物', assetType: '住宅', downtown: '市中心', price: 5_000_000,  createdAt: '2024-01-01', updatedAt: '2024-06-01' },
  { id: '002', name: '範例資料 B', type: '土地', assetType: '商業', downtown: '精華區', price: 12_000_000, createdAt: '2024-02-15', updatedAt: '2024-05-20' },
]

const rowProps = (row: Row) => ({
  style: 'cursor: pointer',
  onClick: () => handleRowClick(row),
})

// ── Confirm Dialog ────────────────────────────────────
const showConfirm  = ref(false)
const pendingRowId = ref<string | null>(null)

function handleRowClick(row: Row) {
  pendingRowId.value = row.id
  showConfirm.value = true
}

function confirmNavigate() {
  showConfirm.value = false
  if (pendingRowId.value) {
    router.push({ name: 'detail', params: { id: pendingRowId.value } })
  }
}

function cancelNavigate() {
  showConfirm.value = false
  pendingRowId.value = null
}
</script>

<template>
  <!-- Filter Bar -->
  <n-card style="margin-bottom: 16px">
    <n-space wrap>
      <n-select
        v-model:value="filterType"
        :options="typeOptions"
        placeholder="資料類型"
        clearable
        style="width: 140px"
      />
      <n-select
        v-model:value="filterDowntown"
        :options="downtownOptions"
        placeholder="市中心／精華區"
        clearable
        style="width: 160px"
      />
      <n-space align="center" :size="4">
        <n-input-number
          v-model:value="filterPriceMin"
          placeholder="最低價格"
          :min="0"
          clearable
          style="width: 140px"
        />
        <n-text depth="3">—</n-text>
        <n-input-number
          v-model:value="filterPriceMax"
          placeholder="最高價格"
          :min="0"
          clearable
          style="width: 140px"
        />
      </n-space>
      <n-select
        v-model:value="filterAsset"
        :options="assetOptions"
        placeholder="資產類型"
        clearable
        style="width: 140px"
      />
    </n-space>
  </n-card>

  <!-- Sort Bar + Table -->
  <n-card>
    <n-space align="center" style="margin-bottom: 12px">
      <n-text>排序：</n-text>
      <n-radio-group v-model:value="sortBy">
        <n-radio-button value="created_at">建立日期</n-radio-button>
        <n-radio-button value="updated_at">更新日期</n-radio-button>
      </n-radio-group>
    </n-space>

    <n-data-table
      :columns="columns"
      :data="tableData"
      :row-props="rowProps"
    />
  </n-card>

  <!-- Confirm Dialog -->
  <n-modal v-model:show="showConfirm" preset="dialog" title="進入詳情頁">
    <template #default>
      <n-text>此頁面包含敏感資料，確認進入後系統將記錄本次存取。</n-text>
    </template>
    <template #action>
      <n-button @click="cancelNavigate">取消</n-button>
      <n-button type="primary" style="margin-left: 8px" @click="confirmNavigate">確認進入</n-button>
    </template>
  </n-modal>
</template>
