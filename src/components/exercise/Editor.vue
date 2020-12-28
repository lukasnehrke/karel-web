<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, inject } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/selection/mark-selection'

export default defineComponent({
  name: 'Editor',
  props: {
    modelValue: String
  },
  setup (props, { emit }) {
    const textarea = ref()
    const codemirror = ref()

    const init = () => {
      if (!codemirror.value) {
        codemirror.value = CodeMirror.fromTextArea(textarea.value, {
          mode: 'javascript',
          lineNumbers: true,
          styleActiveLine: true,
          styleActiveSelected: true,
          styleSelectedText: true,
          tabSize: 2
        } as any)
        codemirror.value.on('change', (cm: any) => {
          emit('update:modelValue', cm.getValue())
        })
      }
    }

    watch(textarea, () => {
      init()
    })

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      if (codemirror.value) {
        const element = codemirror.value.doc.cm.getWrapperElement()
        element && element.remove && element.remove()
      }
    })

    const running = inject('running')
    const currentRun = inject('currentRun')
    const exercise = inject('exercise')
    const runCode = inject('runCode')

    return {
      textarea,
      running,
      currentRun,
      exercise,
      runCode
    }
  }
})
</script>

<template>
  <div class="exercise__editor">
    <div class="exercise__actions">
      <div class="button">
        <div class="button__content">
          <svg style="width:24px;height:24px;margin-right:6px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 16C13.66 16 15 14.66 15 13C15 11.88 14.39 10.9 13.5 10.39L3.79 4.77L9.32 14.35C9.82 15.33 10.83 16 12 16M12 3C10.19 3 8.5 3.5 7.03 4.32L9.13 5.53C10 5.19 11 5 12 5C16.42 5 20 8.58 20 13C20 15.21 19.11 17.21 17.66 18.65H17.65C17.26 19.04 17.26 19.67 17.65 20.06C18.04 20.45 18.68 20.45 19.07 20.07C20.88 18.26 22 15.76 22 13C22 7.5 17.5 3 12 3M2 13C2 15.76 3.12 18.26 4.93 20.07C5.32 20.45 5.95 20.45 6.34 20.06C6.73 19.67 6.73 19.04 6.34 18.65C4.89 17.2 4 15.21 4 13C4 12 4.19 11 4.54 10.1L3.33 8C2.5 9.5 2 11.18 2 13Z" />
          </svg>
          <span>Langsam</span>
        </div>
      </div>
      <div :class="{ button: true, 'button--disabled': running }" @click="runCode">
        <div class="button__content">
          <svg style="width:24px;height:24px;margin-right:6px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z" />
          </svg>
          <span v-if="running && currentRun >= 0">Lauf {{ currentRun + 1 }}/{{ exercise.runs || 1 }}</span>
          <span v-else>Ausführen</span>
        </div>
      </div>
    </div>
    <textarea ref="textarea" aria-label="Editor" />
  </div>
</template>
