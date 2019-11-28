<template>
  <div>
    <bounce-loader
      v-bind:loading="loading"
      v-bind:color="'#68d391'"
      v-bind:size="100"
    />
    <px-assets-table v-bind:assets="assets" v-if="!loading" />
  </div>
</template>

<script>
import api from '@/api'
import PxAssetsTable from '@/components/PxAssetsTable'

export default {
  name: 'Home',
  components: {
    PxAssetsTable
  },
  data() {
    return {
      loading: false,
      assets: []
    }
  },
  created() {
    this.loading = true

    api
      .getAssets()
      .then(assets => (this.assets = assets))
      .finally(() => (this.loading = false))
  }
}
</script>
