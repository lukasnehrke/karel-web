<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Console",
});
</script>

<template>
  <div class="console body-2">Benutze print() um auf der Konsole auszugeben.</div>
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
