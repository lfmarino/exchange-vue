<template>
  <button
    @click="buttonClick"
    class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-2 border border-green-500 hover:border-transparent rounded"
  >
    <bar-loader :loading="loading" :color="'#68d391'" :size="8" />
    <p v-show="!loading">
    <slot></slot>
    </p>
  </button>
</template>

<script>
export default {
  name: 'PxButton',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    buttonClick() {
      this.$emit('custom-click')
    }
  }
}
</script>
