<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Console",
  setup() {
    const text = ref<string[]>([]);

    const append = (out: string) => text.value.push(out);
    const reset = () => (text.value = []);

    return { text, append, reset };
  },
});
</script>

<template>
  <div class="console body-2">
    <span v-if="text.length > 0">
      <span v-for="(item, i) in text" :key="i">{{ item }}<br /></span>
    </span>
    <span v-else>Benutze print() um auf der Konsole auszugeben.</span>
  </div>
</template>

<style lang="scss" scoped>
.console {
  width: 100%;
  height: 100%;
  resize: none;
  padding: 6px;
  background-color: #eceff1;
}
</style>
