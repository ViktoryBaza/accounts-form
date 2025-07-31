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
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter(acc => acc.id !== id)
    },
  },
})
