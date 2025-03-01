<template>
  <h1
      ref="textEl"
      :data-value="text"
      class="text-green-400 text-8xl font-bold cursor-pointer w-fit"
      @mouseover="handleMouseOver"
  >
    {{ text }}
  </h1>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
    default: "SYCO"
  }
})

const textEl = ref(null)
let interval = null

const shuffleText = (target) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let iteration = 0

  clearInterval(interval)

  interval = setInterval(() => {
    target.innerText = target.innerText
        .split("")
        .map((letter, index) => {
          if(index < iteration) {
            return target.dataset.value[index]
          }

          return letters[Math.floor(Math.random() * 26)]
        })
        .join("")

    if(iteration >= target.dataset.value.length){
      clearInterval(interval)
    }

    iteration += 1 / 3
  }, 40)
}

const handleMouseOver = (event) => {
  shuffleText(event.target)
}

onMounted(() => {
  if (textEl.value) {
    shuffleText(textEl.value)
  }
})
</script>