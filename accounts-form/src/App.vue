  <template>
  <div>
    <h1>Учетные записи</h1>
    <ul>
      <li v-for="acc in store.accounts" :key="acc.id">{{ acc.login }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from './stores/accounts'
const store = useAccountsStore()
</script>


<style>
body { margin: 0; font-family: sans-serif; }
</style>