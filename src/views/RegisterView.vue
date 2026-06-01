<script setup lang="ts">
import { ref } from 'vue'
import {
  NCard,
  NSteps,
  NStep,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NDivider,
  NText,
} from 'naive-ui'
import { RouterLink } from 'vue-router'

const currentStep = ref(1)
</script>

<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5">
    <n-card style="width: 480px" title="註冊">

      <n-steps :current="currentStep" style="margin-bottom: 28px">
        <n-step title="建立帳號" />
        <n-step title="基本資訊" />
      </n-steps>

      <!-- Step 1: 帳號建立 -->
      <template v-if="currentStep === 1">
        <n-form>
          <n-form-item label="電子郵件">
            <n-input placeholder="example@email.com" />
          </n-form-item>
          <n-form-item label="密碼">
            <n-input type="password" placeholder="請輸入密碼" show-password-on="click" />
          </n-form-item>
          <n-form-item label="確認密碼">
            <n-input type="password" placeholder="再次輸入密碼" show-password-on="click" />
          </n-form-item>
        </n-form>

        <n-button type="primary" block @click="currentStep = 2">下一步</n-button>

        <n-divider>或</n-divider>

        <n-button block secondary>使用 Google 帳號繼續</n-button>
      </template>

      <!-- Step 2: 基本資訊 -->
      <template v-else>
        <n-form>
          <n-form-item label="姓名">
            <n-input placeholder="請輸入姓名" />
          </n-form-item>
          <n-form-item label="聯絡電話">
            <n-input placeholder="請輸入聯絡電話" />
          </n-form-item>
          <n-form-item label="服務單位">
            <n-input placeholder="請輸入服務單位" />
          </n-form-item>
        </n-form>

        <n-button type="primary" block>完成註冊</n-button>
        <n-button block quaternary style="margin-top: 8px" @click="currentStep = 1">上一步</n-button>
      </template>

      <div style="margin-top: 16px; text-align: center">
        <n-text depth="3">已有帳號？</n-text>
        <RouterLink to="/login" style="margin-left: 4px">登入</RouterLink>
      </div>

    </n-card>
  </div>
</template>
