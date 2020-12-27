<script lang="ts">
import { defineComponent, ref, onBeforeUnmount, watch } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

export default defineComponent({
  name: 'Editor',
  props: {
    modelValue: String
  },
  setup (props, { emit }) {
    const textarea = ref()
    const codemirror = ref()

    watch(textarea, () => {
      if (!codemirror.value) {
        codemirror.value = CodeMirror.fromTextArea(textarea.value, {
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
          tabSize: 2
        })
        codemirror.value.on('change', cm => {
          emit('update:modelValue', cm.getValue())
        })
      }
    })

    onBeforeUnmount(() => {
      if (codemirror.value) {
        const element = codemirror.value.doc.cm.getWrapperElement()
        element && element.remove && element.remove()
      }
    })

    return {
      textarea
    }
  }
})
</script>

<template>
  <textarea ref="textarea" aria-label="Editor" />
</template>
