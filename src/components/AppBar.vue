<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppBar'
})
</script>

<template>
  <header class="app-bar">
    <div class="app-bar__content">
      <router-link class="app-bar__brand" :to="{ name: 'home' }">
        <span class="app-bar__brand-title">Karel</span>
      </router-link>
      <div class="app-bar__nav"></div>
      <div class="app-bar__actions" aria-label="Created with Love">❤️</div>
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
