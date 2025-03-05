<template>
  <h1
      ref="textEl"
      :data-value="text"
      class="text-green-400 text-[8rem] font-bold cursor-pointer w-fit"
      @mouseover="handleMouseOver"
  >
    {{ displayText }}
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

const displayText = ref("PUBG")
const textEl = ref(null)
let interval = null

const shuffleText = (target, finalText) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let iteration = 0

  clearInterval(interval)

  interval = setInterval(() => {
    if (!target || !target.innerText) {
      return
    }
    target.innerText = target.innerText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return finalText[index]
          }

          return letters[Math.floor(Math.random() * 26)]
        })
        .join("")

    if (iteration >= finalText.length) {
      clearInterval(interval)
    }

    iteration += 1 / 3
  }, 40)
}

const handleMouseOver = (event) => {
  shuffleText(event.target, props.text)
}

onMounted(() => {
  if (textEl.value) {
    // Start with PUBG and transition to the prop text
    setTimeout(() => {
      shuffleText(textEl.value, props.text)
    }, 500) // Short delay for visual effect
  }
})
</script>