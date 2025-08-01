<template>
    <div class="accounts-form">
      <h1>Учетные записи</h1>
      <el-button type="primary" @click="addAccount">Добавить</el-button>
      <div class="account-header">
      <span>Метки</span>
      <span>Тип записи</span>
      <span>Логин</span>
      <span>Пароль</span>
      <span>Удалить</span>
    </div>
      <div
        v-for="account in store.accounts"
        :key="account.id"
        class="account-item"
      >
      <el-tooltip content="Введите метки через ; (например: admin;test;prod)" placement="top-start">
        <el-input
          v-model="accountForms[account.id].label"
          placeholder="Метки через ;"
          maxlength="50"
          @blur="saveAccountChanges(account.id)"
        />
      </el-tooltip>

        <el-select v-model="accountForms[account.id].type" placeholder="Тип записи"  @change="saveAccountChanges(account.id)">
          <el-option label="LDAP" value="LDAP" />
          <el-option label="Локальная" value="Local" />
        </el-select>
  
        <el-input
          v-model="accountForms[account.id].login"
          placeholder="Логин"
          maxlength="100"
          @blur="saveAccountChanges(account.id)"
          :class="{ 'is-invalid': errors[account.id]?.login }"
        />
  
        <el-input
          v-if="accountForms[account.id].type === 'Local'"
          v-model="accountForms[account.id].password"
          placeholder="Пароль"
          type="password"
          maxlength="100"
          @blur="saveAccountChanges(account.id)"
          :class="{ 'is-invalid': errors[account.id]?.password }"
        />
        <div v-show="accountForms[account.id].type !== 'Local'" class="empty-cell"></div>
        <el-button type="danger" @click="removeAccount(account.id)">
          Удалить
        </el-button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, onMounted } from 'vue'
  import { useAccountsStore, type Account } from '../stores/accounts'
  import { nanoid } from 'nanoid'
  
  const store = useAccountsStore()
  const accountForms = reactive<Record<
    string,
    { label: string; type: 'LDAP' | 'Local'; login: string; password: string }
  >>({})

  const errors = reactive<Record<string, { login: boolean; password: boolean }>>({})
   
  const validateForm = (id: string) => {
  const form = accountForms[id]
  const result = { login: false, password: false }

  if (!form.login) result.login = true
  if (form.type === 'Local' && !form.password) result.password = true

  errors[id] = result
  return !result.login && !result.password 
}
  onMounted(() => {
    store.loadFromLocalStorage()
    store.accounts.forEach(account => {
    accountForms[account.id] = {
      label: account.label.map(tag => tag.text).join(';'),
      type: account.type,
      login: account.login,
      password: account.password || ''
    }
    validateForm(account.id) 
  })
})
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
    accountForms[id] = { label: '', type: 'LDAP', login: '', password: '' }
    validateForm(id)
  }
  
  const removeAccount = (id: string) => {
    store.removeAccount(id)
    delete accountForms[id]
    delete errors[id]
  }
  const saveAccountChanges = (id: string) => {
  if (!validateForm(id)) return
  const form = accountForms[id]
  const tags = form.label
    .split(';')
    .map(tag => tag.trim())
    .filter(Boolean)
    .map(tag => ({ text: tag }))

  const updatedAccount: Account = {
    id,
    label: tags,
    type: form.type,
    login: form.login,
    password: form.type === 'Local' ? form.password : null
  }

store.updateAccount(updatedAccount)
}
  </script>
  
  <style scoped>
  .account-header,
  .account-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1.5fr 1.5fr 0.8fr;
    gap: 10px;
    align-items: center;
  }
  .account-header {
    font-weight: bold;
    margin: 16px 0 8px;
  }
  .account-item {
    margin: 10px 0;
  }
  .empty-cell {
    min-height: 35px;  
  }
  .is-invalid :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px red inset !important; 
    border-color: red !important;
  }
  </style>
  