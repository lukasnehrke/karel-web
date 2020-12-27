<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Split from 'split.js'

import Editor from '@/components/exercise/Editor.vue'
import World from '@/components/exercise/World.vue'
import Console from '@/components/exercise/Console.vue'

export default defineComponent({
  name: 'Exercise',
  components: {
    Editor,
    World,
    Console
  },
  setup () {
    const router = useRouter()

    const exercise = ref()
    const code = ref()
    const running = ref(false)
    const currentRun = ref(-1)

    onMounted(() => {
      Split(['#editor', '#output'], { direction: 'horizontal', gutterSize: 4 })
      Split(['#world', '#console'], { sizes: [80, 20], direction: 'vertical', gutterSize: 4 })
    })

    const routeUpdated = async (route) => {
      exercise.value = await import('@/lib/exercises/' + route.params.exercise + '.ts')
    }

    const runGoal = () => {

    }

    const runCode = () => {

    }

    routeUpdated(router.currentRoute.value)
    watch(router.currentRoute, routeUpdated)

    return {
      code,
      running,
      currentRun,
      runGoal,
      runCode
    }
  }
})
</script>

<template>
  <div id="exercise" class="content__wrapper">
    <div class="split-horizontal">
      <div id="editor">
        <div class="exercise__actions">
          <div class="button">
            <div class="button__content">
              <span>Langsam</span>
            </div>
          </div>
          <div :class="{ button: true, 'button--disabled': running && currentRun > 0 }" @click="runGoal">
            <div class="button__content">
              <span v-if="running">Abbrechen</span>
              <span v-else>Ziel anzeigen</span>
            </div>
          </div>
          <div :class="{ button: true, 'button--disabled': running }" @click="runCode">
            <div class="button__content">
              <span v-if="running && currentRun >= 0">Lauf {{ currentRun + 1 }}/{{ exerciseOptions.runs || 1 }}</span>
              <span v-else>Code Ausführen</span>
            </div>
          </div>
        </div>
        <editor v-model="code" />
      </div>
      <div id="output" class="split">
        <div id="world">
          <world />
        </div>
        <div id="console">
          <console />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  #exercise {
    height: calc(100vh - 48px);
    width: 100%;
  }
  .split-horizontal {
    display: flex;
    flex-direction: row;
    height: 100%;
    > div {
      height: 100%;
    }
  }
  .gutter-vertical {
    background-color: gray;
    cursor: ns-resize;
  }
  .gutter-horizontal {
    background-color: gray;
    cursor: ew-resize;
  }
  .CodeMirror {
    height: calc(100% - 45px);
  }
  .exercise__actions {
    display: flex;
    justify-content: flex-end;
    padding: 0 8px;
    background-color: #f7f7f7;
    .button {
      margin-left: 6px;
      color: #fff;
      background-color: #42b983
    }
  }
</style>
