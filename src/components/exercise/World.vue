<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'World',
  props: {
    size: {
      type: Number,
      default: 10
    }
  },
  setup (props) {
    const world = ref()
    const canvas = ref()

    const drawCanvas = () => {
      if (!world.value) {
        console.error('World not found in dom.')
        return
      }

      const size = Math.min((world.value.clientWidth - 4) / props.size, (world.value.clientHeight - 4) / props.size)

      const canvas = document.getElementById('canvas')
      canvas.width = props.size * size
      canvas.height = props.size * size

      const context = canvas.getContext('2d')
      for (let x = 0; x < props.size; x++) {
        for (let y = 0; y < props.size; y++) {
          context.beginPath();
          context.strokeStyle = 'black'
          context.strokeRect(x * size, y * size, size, size)
          context.closePath()
        }
      }
    }

    onMounted(() => {
      drawCanvas()
      new ResizeObserver(drawCanvas).observe(world.value)
    })

    return {
      world,
      canvas
    }
  }
})
</script>

<template>
  <div ref="world" class="world">
    <canvas id="canvas" />
  </div>
</template>

<style lang="scss" scoped>
  .world {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
