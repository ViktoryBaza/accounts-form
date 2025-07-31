<template>
    <div class="accounts-form">
      <h1>Учетные записи</h1>
      <el-button type="primary" @click="addAccount">Добавить</el-button>
  
      <div
        v-for="account in store.accounts"
        :key="account.id"
        class="account-item"
      >
        <el-input
          v-model="drafts[account.id].label"
          placeholder="Метки через ;"
          maxlength="50"
        />
  
        <el-select v-model="drafts[account.id].type" placeholder="Тип записи">
          <el-option label="LDAP" value="LDAP" />
          <el-option label="Локальная" value="Local" />
        </el-select>
  
        <el-input
          v-model="drafts[account.id].login"
          placeholder="Логин"
          maxlength="100"
        />
  
        <el-input
          v-if="drafts[account.id].type === 'Local'"
          v-model="drafts[account.id].password"
          placeholder="Пароль"
          type="password"
          maxlength="100"
        />
  
        <el-button type="danger" @click="removeAccount(account.id)">
          Удалить
        </el-button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue'
  import { useAccountsStore, type Account } from '../stores/accounts'
  import { nanoid } from 'nanoid'
  
  const store = useAccountsStore()
  const drafts = reactive<Record<
    string,
    { label: string; type: 'LDAP' | 'Local'; login: string; password: string }
  >>({})
  
  const addAccount = () => {
    const id = nanoid()
    const newAccount: Account = {
      id,
      label: [],
      type: 'LDAP',
      login: '',
      password: null,
    }
    store.addAccount(newAccount)
    drafts[id] = { label: '', type: 'LDAP', login: '', password: '' }
  }
  
  const removeAccount = (id: string) => {
    store.removeAccount(id)
    delete drafts[id]
  }
  </script>
  
  <style scoped>
  .account-item {
    display: flex;
    gap: 10px;
    margin: 15px 0;
    align-items: center;
  }
  </style>
  