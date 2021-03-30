<script lang="ts">
import { defineComponent, ref, watch, onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import { Niklas } from "@evorto/niklas";
import Split from "split.js";

import Editor from "@/components/exercise/Editor.vue";
import World from "@/components/exercise/World.vue";
import Console from "@/components/exercise/Console.vue";

export default defineComponent({
  name: "Exercise",
  components: {
    Editor,
    World,
    Console,
  },
  setup() {
    const router = useRouter();

    const exercise = ref();
    const world = ref();

    const editor = ref(false);
    const code = ref();
    const running = ref(false);
    const currentRun = ref(-1);

    const routeUpdated = async (route: any) => {
      exercise.value = await import("@/lib/exercises/" + route.params.exercise);
      world.value = exercise.value.generateWorld(0);
    };

    const configureLang = () => {
      const lang = new Niklas();
      lang.addFunction("moveForward", () => world.value.moveForward());
      lang.addFunction("turnLeft", () => world.value.turnLeft());
      lang.addFunction("turnRight", () => world.value.turnRight());
      lang.addFunction("turnAround", () => world.value.turnAround());
      lang.addFunction("pickBeeper", () => world.value.pickBeeper());
      lang.addFunction("frontIsClear", () => world.value.frontIsClear());
      lang.addFunction("wallAhead", () => world.value.wallAhead());
      lang.addFunction("boxAhead", () => world.value.boxAhead());
      lang.getVariable("delay").value = 500;
      exercise.value.configureLang && exercise.value.configureLang(lang);
      return lang;
    };

    const runGoal = async () => {
      if (!running.value) {
        const lang = configureLang();
        world.value.apply(exercise.value.generateWorld(0));
        try {
          running.value = true;
          await lang.run(exercise.value.solution);
        } finally {
          running.value = false;
        }
      }
    };

    const runCode = async () => {
      if (!running.value) {
        const lang = configureLang();
        world.value.apply(exercise.value.generateWorld(0));
        try {
          running.value = true;
          await lang.run(code.value);
        } finally {
          running.value = false;
        }
      }
    };

    onMounted(() => {
      Split(["#editor", "#output"], { direction: "horizontal", gutterSize: 4 });
      Split(["#world", "#console"], {
        sizes: [80, 20],
        direction: "vertical",
        gutterSize: 4,
      });
    });

    routeUpdated(router.currentRoute.value);
    watch(router.currentRoute, routeUpdated);

    provide("running", running);
    provide("currentRun", currentRun);
    provide("exercise", exercise);
    provide("runCode", runCode);

    return {
      exercise,
      world,
      editor,
      code,
      running,
      currentRun,
      runGoal,
      runCode,
    };
  },
});
</script>

<template>
  <div id="exercise" class="content__wrapper">
    <div class="split-horizontal">
      <div id="editor">
        <div class="exercise-header">
          <div :class="{ tab: true, 'button-text': true, 'tab--active': !editor }" @click="editor = false">INFO</div>
          <div :class="{ tab: true, 'button-text': true, 'tab--active': editor }" @click="editor = true">CODE</div>
          <div style="flex-grow: 1" />
          <div
            :class="{
              button: true,
              'button--disabled': running && currentRun > 0,
            }"
            @click="runGoal"
          >
            <div class="button__content">
              <svg style="width: 24px; height: 24px; margin-right: 6px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M8.58,17.25L9.5,13.36L6.5,10.78L10.45,10.41L12,6.8L13.55,10.45L17.5,10.78L14.5,13.36L15.42,17.25L12,15.19L8.58,17.25M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"
                />
              </svg>
              <span v-if="running">Abbrechen</span>
              <span v-else>Ziel anzeigen</span>
            </div>
          </div>
        </div>
        <div v-if="exercise" style="height: 100%">
          <keep-alive>
            <editor v-if="editor" v-model="code" />
            <div v-else style="height: 100%; overflow-y: scroll">
              <div class="exercise-article" v-html="exercise.info" />
            </div>
          </keep-alive>
        </div>
      </div>
      <div id="output" class="split">
        <div id="world">
          <world v-if="world" v-model="world" />
        </div>
        <div id="console">
          <console />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.exercise {
  &__editor {
    height: 100%;
  }
}

.line--active {
  background-color: green;
}

#exercise {
  height: calc(100vh - 48px);
  width: 100%;
  overflow: hidden;
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
  height: calc(100% - 88px);
}

.exercise-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 8px;
  background-color: #f7f7f7;
  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0 16px;
    height: 36px;
    margin-right: 4px;
    color: rgba(0, 0, 0, 0.54);
    position: relative;
    &--active {
      color: #1976d2;
      &:after {
        position: absolute;
        content: "";
        background-color: #1976d2;
        bottom: 0;
        height: 2px;
        width: 100%;
      }
    }
    &:hover {
      background-color: rgba(25, 119, 210, 0.2);
    }
  }
  .button {
    color: #ffffff;
    background-color: #1976d2;
  }
}

.exercise-article {
  padding: 12px 12px 48px;
  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    margin-bottom: 16px;
    tbody tr {
      border: 1px solid #c6cbd1;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    td,
    th {
      text-align: left;
      padding: 10px 12px;
      border: 1px solid #ddd;
    }
  }
  code {
    border-radius: 5px;
    background-color: rgba(27, 31, 35, 0.05);
    padding: 2px;
  }
}

.exercise__actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 8px;
  background-color: #f7f7f7;
  .button {
    margin-left: 6px;
    color: #fff;
    background-color: #42b983;
  }
}
</style>
