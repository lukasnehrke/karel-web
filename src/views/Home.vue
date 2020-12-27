<script lang="ts">
import { defineComponent } from 'vue'
import { exercises } from '@/lib/exercise'

export default defineComponent({
  name: 'Home',
  setup () {
    const getExerciseColor = (exercise: Exercise) => {
      switch (exercise.difficulty) {
        case 0:
          return '#00701a'
        case 1:
          return '#1976d2'
       case 2:
           return '#d32f2f'
        default:
          return '#78002e'
      }
    }

    return {
      exercises,
      getExerciseColor
    }
  }
})
</script>

<template>
  <div class="content__wrapper">
    <template v-for="i in 4" :key="i">
      <ul class="exercise-container">
        <template v-for="item in exercises.filter(_ => _.difficulty === i - 1)" :key="item.title">
          <router-link  class="exercise" :to="{ name: 'exercise', params: { exercise: item.slug } }">
            <div class="icon" v-bind:style="{ 'background-color': getExerciseColor(item) }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px"><path d="M18 2C17.1 2 16 3 16 4H8C8 3 6.9 2 6 2H2V11C2 12 3 13 4 13H6.2C6.6 15 7.9 16.7 11 17V19.08C8 19.54 8 22 8 22H16C16 22 16 19.54 13 19.08V17C16.1 16.7 17.4 15 17.8 13H20C21 13 22 12 22 11V2H18M6 11H4V4H6V11M16 11.5C16 13.43 15.42 15 12 15C8.59 15 8 13.43 8 11.5V6H16V11.5M20 11H18V4H20V11Z"></path></svg>
            </div>
            {{ item.title }}
          </router-link>
        </template>
      </ul>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .exercise-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    list-style-type: none;
    .exercise {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      min-width: 180px;
      min-height: 90px;
      margin: 8px;
      padding: 12px;
      text-align: center;
      cursor: pointer;
      transition: .3s cubic-bezier(0.25, 0.8, 0.5, 1);
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        width: 48px;
        border-radius: 50%;
        background-color: #1976d2;
        fill: #fff;
        margin-bottom: 12px;
      }
      &:hover {
        background-color: rgba(25, 119, 210, 0.2);
      }
    }
  }
</style>
