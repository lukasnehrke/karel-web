<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { RouteLocationNormalizedLoaded, useRouter } from "vue-router";
import { Niklas } from "@evorto/niklas";
import Split from "split.js";

import Editor from "../components/Editor.vue";
import World from "@/components/exercise/World.vue";
import Console from "../components/Console.vue";

export default defineComponent({
  name: "Exercise",
  components: {
    Editor,
    World,
    Console,
  },
  setup() {
    const router = useRouter();
    const console = ref();

    const editor = ref(false);
    const code = ref();
    const running = ref(false);
    const currentRun = ref(-1);

    const exercise = ref();
    const world = ref();

    let exerciseId: string;
    let niklas: Niklas;

    const routeUpdated = async (route: RouteLocationNormalizedLoaded) => {
      if (route.params.exercise) {
        exerciseId = route.params.exercise as string;

        exercise.value = await import(`@/lib/exercises/${exerciseId}`);
        world.value = exercise.value.generateWorld(0);

        niklas = configureDefault();
        if (exercise.value.configureLang) {
          niklas = exercise.value.configureNiklas(niklas);
        }

        code.value = loadCode();
      } else {
        saveCode();
      }
    };

    const loadCode = () => {
      if (localStorage) {
        return localStorage.getItem(exerciseId);
      }
    };

    const saveCode = () => {
      if (localStorage && code.value) {
        localStorage.setItem(exerciseId, code.value);
      }
    };

    const configureDefault = () => {
      const niklas = new Niklas();
      niklas.registerDefaults();
      niklas.addFunction("print", (params: any) => console.value.append(params[0] || ""));
      niklas.addFunction("moveForward", () => world.value.moveForward());
      niklas.addFunction("turnLeft", () => world.value.turnLeft());
      niklas.addFunction("turnRight", () => world.value.turnRight());
      niklas.addFunction("turnAround", () => world.value.turnAround());
      niklas.addFunction("pickBeeper", () => world.value.pickBeeper());
      niklas.addFunction("dropBeeper", () => world.value.dropBeeper());
      niklas.addFunction("frontIsClear", () => world.value.frontIsClear());
      niklas.addFunction("wallAhead", () => world.value.wallAhead());
      niklas.addFunction("boxAhead", () => world.value.boxAhead());
      niklas.getVariable("delay").value = 500;
      return niklas;
    };

    const runGoal = async () => {
      if (!running.value) {
        world.value.apply(exercise.value.generateWorld(0));
        try {
          running.value = true;
          await niklas.run(exercise.value.solution);
        } finally {
          running.value = false;
        }
      }
    };

    const runCode = async () => {
      if (!running.value) {
        world.value.apply(exercise.value.generateWorld(0));
        try {
          running.value = true;
          await niklas.run(code.value);
        } finally {
          running.value = false;
        }
      }
    };

    const reset = async () => {
      if (running.value) {
        running.value = false;
      }
      world.value.apply(exercise.value.generateWorld(0));
      console.value.reset();
    };

    onMounted(() => {
      Split(["#editor", "#output"], { direction: "horizontal", gutterSize: 4 });
      Split(["#world", "#console"], { sizes: [80, 20], direction: "vertical", gutterSize: 4 });
    });

    routeUpdated(router.currentRoute.value);
    watch(router.currentRoute, routeUpdated);

    return {
      exercise,
      world,
      console,
      editor,
      code,
      running,
      currentRun,
      runGoal,
      runCode,
      reset,
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
          <div id="button-reset" class="button" @click="reset">
            <div class="button__content">
              <svg style="width: 24px; height: 24px; margin-right: 6px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"
                />
              </svg>
              <span>Zurücksetzen</span>
            </div>
          </div>
          <div
            id="button-goal"
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
            <div v-if="editor" class="exercise__editor">
              <div class="exercise__actions">
                <div class="button">
                  <div class="button__content">
                    <svg style="width: 24px; height: 24px; margin-right: 6px" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 16C13.66 16 15 14.66 15 13C15 11.88 14.39 10.9 13.5 10.39L3.79 4.77L9.32 14.35C9.82 15.33 10.83 16 12 16M12 3C10.19 3 8.5 3.5 7.03 4.32L9.13 5.53C10 5.19 11 5 12 5C16.42 5 20 8.58 20 13C20 15.21 19.11 17.21 17.66 18.65H17.65C17.26 19.04 17.26 19.67 17.65 20.06C18.04 20.45 18.68 20.45 19.07 20.07C20.88 18.26 22 15.76 22 13C22 7.5 17.5 3 12 3M2 13C2 15.76 3.12 18.26 4.93 20.07C5.32 20.45 5.95 20.45 6.34 20.06C6.73 19.67 6.73 19.04 6.34 18.65C4.89 17.2 4 15.21 4 13C4 12 4.19 11 4.54 10.1L3.33 8C2.5 9.5 2 11.18 2 13Z"
                      />
                    </svg>
                    <span>Langsam</span>
                  </div>
                </div>
                <div :class="{ button: true, 'button--disabled': running }" @click="runCode">
                  <div class="button__content">
                    <svg style="width: 24px; height: 24px; margin-right: 6px" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z"
                      />
                    </svg>
                    <span v-if="running && currentRun >= 0">Lauf {{ currentRun + 1 }}/{{ exercise.runs || 1 }}</span>
                    <span v-else>Ausführen</span>
                  </div>
                </div>
              </div>
              <editor v-model="code" />
            </div>
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
          <console ref="console" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#button-goal {
  color: #ffffff;
  background-color: #1976d2;
  margin-left: 6px;
}

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
