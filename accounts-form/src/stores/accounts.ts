import { defineStore } from 'pinia'

export type AccountType = 'LDAP' | 'Local'

export interface Account {
  id: string
  label: { text: string }[]
  type: AccountType
  login: string
  password: string | null
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[]
  }),
  
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account)
      this.saveToLocalStorage()
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter(acc => acc.id !== id)
      this.saveToLocalStorage()
    },
    updateAccount(account: Account) {
      const idx = this.accounts.findIndex(a => a.id === account.id)
      if (idx !== -1) this.accounts[idx] = account
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
    loadFromLocalStorage() {
      const data = localStorage.getItem('accounts')
      if (data) this.accounts = JSON.parse(data)
    },
  },
})
