<template>
  <div v-bind:class="loading ? '' : 'flex-col'">
    <bounce-loader
      v-bind:loading="loading"
      v-bind:color="'#68d391'"
      v-bind:size="100"
    />
    <template v-if="!loading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD`}}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                :placeholder="fromUsd ? `Valor en USD` : `Valor en ${asset.symbol}`"
              />
            </label>
          </div>

          <span class="text-xl">
            {{ convertResult }} {{fromUsd ? asset.symbol : 'USD'}}
          </span>
        </div>
      </div>
      <line-chart
        class="my-10"
        v-bind:colors="['orange']"
        v-bind:min="min"
        v-bind:max="max"
        v-bind:data="
          history.map(h => [h.date, parseFloat(h.priceUsd).toFixed(2)])
        "
      />
      <h3 class="text-xl my-10">Mejores ofertas de cambio</h3>
      <table>
        <tr
          v-for="market in markets"
          class="border-b"
          v-bind:key="`${market.exchangeId}-${market.priceUsd}`"
        >
          <td>
            <b>{{ market.exchangeId }}</b>
          </td>
          <td>{{ market.priceUsd | dollar }}</td>
          <td>{{ market.baseSymbol }} / {{ market.quoteSymbol }}</td>
          <td>
            <px-button
              :loading="market.loading || false"
              v-if="!market.url"
              v-on:custom-click="getWebsite(market)"
            >
              <slot>Obtener Link</slot>
            </px-button>
            <a
              v-else
              href=""
              class="hover:underline text-green-600"
              target="_blank"
              >{{ market.url }}</a
            >
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import api from '@/api'
import PxButton from '../components/PxButton'

export default {
  name: 'CoinDetail',
  components: { PxButton },
  data() {
    return {
      loading: false,
      asset: {},
      history: [],
      markets: [],
      fromUsd: true,
      convertValue: null
    }
  },

  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0
      }

      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd

      return result.toFixed(4)
    },

    min() {
      return Math.min(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    max() {
      return Math.max(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    avg() {
      return Math.abs(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      )
    }
  },

  watch: {
    $route() {
      this.getCoin()
    }
  },

  created() {
    this.getCoin()
  },

  methods: {
    toggleConverter() {
      this.fromUsd = !this.fromUsd
    },

    getWebsite(exchange) {
      this.$set(exchange, 'loading', true)

      return api
        .getExchange(exchange.exchangeId)
        .then(response => this.$set(exchange, 'url', response.exchangeUrl))
        .finally(() => this.$set(exchange, 'loading', false))
    },

    getCoin() {
      const id = this.$route.params.id

      this.loading = true

      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id)
      ])
        .then(([asset, history, markets]) => {
          this.asset = asset
          this.history = history
          this.markets = markets
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
