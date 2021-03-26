<script lang="ts">
import { defineComponent } from "vue";
import AppBar from "@/components/AppBar.vue";

export default defineComponent({
  name: "App",
  components: {
    AppBar,
  },
});
</script>

<template>
  <app-bar />
  <main class="content">
    <router-view />
  </main>
</template>
