<script setup lang="ts">
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NDivider,
  NText,
} from 'naive-ui'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5">
    <n-card style="width: 400px" title="登入">
      <n-form>
        <n-form-item label="電子郵件">
          <n-input placeholder="example@email.com" />
        </n-form-item>
        <n-form-item label="密碼">
          <n-input type="password" placeholder="請輸入密碼" show-password-on="click" />
        </n-form-item>
      </n-form>

      <n-button type="primary" block>登入</n-button>

      <n-divider>或</n-divider>

      <n-button block secondary>
        使用 Google 帳號登入
      </n-button>

      <div style="margin-top: 16px; text-align: center">
        <n-text depth="3">還沒有帳號？</n-text>
        <RouterLink to="/register" style="margin-left: 4px">註冊</RouterLink>
      </div>
    </n-card>
  </div>
</template>
