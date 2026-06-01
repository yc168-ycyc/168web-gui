<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NPageHeader,
  NSpace,
  NTag,
  NImage,
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NDivider,
  NCard,
  NGrid,
  NGridItem,
  NText,
} from 'naive-ui'

const route  = useRoute()
const router = useRouter()

// Placeholder data — replace with API fetch by route.params.id
const item = {
  id:        route.params.id as string,
  name:      '範例資料名稱',
  address:   '台北市信義區信義路五段7號',
  type:      '建物',
  assetType: '商業',
  downtown:  '市中心',
  price:     12_000_000,
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
  // Source flags — determine which tags are shown
  sources: {
    web:        true,   // 同行開發
    government: true,   // 高鐵開發
    address:    false,  // 大樓開發
  },
  photoUrl: '',   // placeholder: single main photo URL
  pdfPath:  '',   // placeholder: Dropbox file path
}

// ── Access Log ────────────────────────────────────────
// TODO: call API to write access log entry on page load
onMounted(() => {
  console.log('[AccessLog] page_view — item:', item.id)
})

// ── PDF Download ──────────────────────────────────────
function downloadPdf() {
  // TODO: call Dropbox API to get download URL, then trigger download
  // TODO: call API to write access log entry (event: pdf_download)
  console.log('[AccessLog] pdf_download — item:', item.id)
}

// ── Google Map ────────────────────────────────────────
// TODO: replace with real Google Maps Embed API key
const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(item.address)}&output=embed`
</script>

<template>
  <!-- Page Header -->
  <n-page-header
    :title="item.name"
    :subtitle="`ID: ${item.id}`"
    style="margin-bottom: 20px"
    @back="router.push({ name: 'list' })"
  >
    <template #extra>
      <n-space>
        <n-tag v-if="item.sources.web"        type="info"    round>同行開發 · Web</n-tag>
        <n-tag v-if="item.sources.government" type="success" round>高鐵開發 · Government</n-tag>
        <n-tag v-if="item.sources.address"    type="warning" round>大樓開發 · Address</n-tag>
      </n-space>
    </template>
  </n-page-header>

  <!-- Main Content: two columns -->
  <n-grid :cols="2" :x-gap="24" :y-gap="16">

    <!-- Left: Photo + Basic Info -->
    <n-grid-item>
      <n-card title="主要照片" style="margin-bottom: 16px">
        <n-image
          v-if="item.photoUrl"
          :src="item.photoUrl"
          width="100%"
          object-fit="cover"
        />
        <div
          v-else
          style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center"
        >
          <n-text depth="3">尚無照片</n-text>
        </div>
      </n-card>

      <n-card title="基本資訊">
        <n-descriptions :column="1" bordered>
          <n-descriptions-item label="地址">{{ item.address }}</n-descriptions-item>
          <n-descriptions-item label="資料類型">{{ item.type }}</n-descriptions-item>
          <n-descriptions-item label="資產類型">{{ item.assetType }}</n-descriptions-item>
          <n-descriptions-item label="區域">{{ item.downtown }}</n-descriptions-item>
          <n-descriptions-item label="價格">{{ item.price.toLocaleString() }}</n-descriptions-item>
          <n-descriptions-item label="建立日期">{{ item.createdAt }}</n-descriptions-item>
          <n-descriptions-item label="更新日期">{{ item.updatedAt }}</n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-grid-item>

    <!-- Right: Google Map + PDF -->
    <n-grid-item>
      <n-card title="地圖位置" style="margin-bottom: 16px">
        <!-- TODO: add &key=YOUR_API_KEY to mapSrc for production -->
        <iframe
          :src="mapSrc"
          width="100%"
          height="300"
          style="border: none; border-radius: 4px"
          allowfullscreen
          loading="lazy"
        />
      </n-card>

      <n-card title="附件">
        <n-button
          type="primary"
          :disabled="!item.pdfPath"
          @click="downloadPdf"
        >
          下載 PDF
        </n-button>
        <n-text v-if="!item.pdfPath" depth="3" style="margin-left: 12px; font-size: 13px">
          尚無附件
        </n-text>
      </n-card>
    </n-grid-item>

  </n-grid>
</template>
