<template>
  <fh-layout>
    <router-view :key="$route.fullPath" />
  </fh-layout>
</template>

<script>
export default {
  computed: {
    routeKey() {
      // 只要路径或者参数有变化，key就会改变
      return this.$route.path + JSON.stringify(this.$route.query)
    },
  },
}
</script>
