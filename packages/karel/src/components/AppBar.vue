<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppBar",
});
</script>

<template>
  <header class="app-bar">
    <div class="app-bar__content">
      <router-link class="app-bar__brand" :to="{ name: 'home' }">
        <span class="app-bar__brand-title">Karel</span>
      </router-link>
      <div class="app-bar__nav"></div>
      <a class="app-bar__actions" href="https://github.com/evorto/karel" target="_blank" rel="noopener">
        <span>GitHub</span>
        <svg style="width: 18px; height: 18px; margin-left: 6px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
          />
        </svg>
      </a>
    </div>
  </header>
</template>

<style lang="scss">
.app-bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: column;
  contain: layout;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 20;

  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  background-color: #34495e;
  color: #fff;

  a {
    color: #fff;
  }

  &__content {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
    padding: 0 16px;
  }

  &__nav-icon {
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    margin-right: 18px;
  }

  &__brand {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }

  &__brand-title {
    margin-left: 8px;
    font-weight: 400;
    font-size: 20px;
    line-height: 30px;
  }

  &__nav {
    flex: 1 1 auto;
    margin-left: 35px;
    a {
      padding: 8px;
    }
    @media (max-width: 960px) {
      display: none;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    @media (max-width: 1280px) {
      display: none;
    }
  }

  @media (max-width: 960px) {
    .app-bar__nav-icon {
      display: flex;
    }
  }
}
</style>
