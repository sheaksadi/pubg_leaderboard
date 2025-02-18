<script setup lang="ts">


const store = useTestStore()
console.log(await store.getHello())
</script>

<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>

<style scoped>

</style>