<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";

export default defineComponent({
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    const element = ref();
    let editor: EditorView;

    const init = () => {
      if (!editor) {
        editor = new EditorView({
          state: EditorState.create({
            doc: props.modelValue,
            extensions: [
              basicSetup,
              EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                  emit("update:modelValue", update.view.state.doc.toString());
                }
              }),
            ],
          }),
          parent: element.value,
        });
      }
    };

    onMounted(() => init());

    return { element };
  },
});
</script>

<template>
  <div ref="element" class="editor" />
</template>

<style lang="scss">
.editor, .cm-editor {
  outline: none !important;
  height: 100%;
}
</style>
