<script lang="ts">
import { defineComponent, onMounted, watch, ref } from 'vue'

export default defineComponent({
  name: 'World',
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const world = ref()
    const canvas = ref()

    const toDegrees = () => {
      switch (props.modelValue.robot.direction) {
        case 0:
          return 0
        case 1:
          return 90
        case 2:
          return 180
        case 3:
          return -90
      }
    }

    const drawCanvas = () => {
      if (!world.value) {
        console.error('World not found in dom.')
        return
      }

      const size = Math.min((world.value.clientWidth - 4) / props.modelValue.size, (world.value.clientHeight - 4) / props.modelValue.size)

      const karel = document.getElementById('karel') as HTMLImageElement
      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      canvas.width = props.modelValue.size * size
      canvas.height = props.modelValue.size * size

      const context = canvas.getContext('2d') as CanvasRenderingContext2D
      for (let x = 0; x < props.modelValue.size; x++) {
        for (let y = 0; y < props.modelValue.size; y++) {
          if (props.modelValue.boxes.find((_: any) => _.x === x && _.y === y)) {
            context.beginPath()
            context.fillStyle = '#000'
            context.fillRect(x * size, y * size, size, size)
            context.closePath()
            continue
          }
          context.beginPath()
          context.strokeStyle = 'rgba(0, 0, 0, .12)'
          context.strokeRect(x * size, y * size, size, size)
          context.closePath()
        }
      }

      context.beginPath()
      context.lineWidth = 4
      context.strokeStyle = '#000'
      context.strokeRect(0, 0, props.modelValue.size * size, props.modelValue.size * size)
      context.closePath()

      drawImage(context, karel, props.modelValue.robot.x * size, props.modelValue.robot.y * size, size, size, toDegrees())

      function drawImage (ctx: any, image: any, x: any, y: any, w: any, h: any, degrees: any) {
        ctx.save()
        ctx.translate(x+w/2, y+h/2)
        ctx.rotate(degrees*Math.PI/180.0)
        ctx.translate(-x-w/2, -y-h/2)
        ctx.drawImage(image, x, y, w, h)
        ctx.restore()
      }
    }

    onMounted(() => {
      const karel = document.getElementById('karel') as HTMLImageElement
      karel.addEventListener('load', () => {
        drawCanvas()
      })

      // @ts-ignore
      new ResizeObserver(drawCanvas).observe(world.value)
    })

    watch(props.modelValue, () => {
      drawCanvas()
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
    <div style="display:none;" aria-hidden="true">
      <img id="karel" alt="Karel" src="@/assets/robot.svg">
    </div>
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
