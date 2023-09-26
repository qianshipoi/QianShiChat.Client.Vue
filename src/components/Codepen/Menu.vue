<template>
  <div class="container">
    <!-- code here -->
    <div class="menu">
      <!-- <ul class="menu-list">
        <li class="menu-item">
          <button class="menu-button">
            <i data-feather="corner-up-right"></i>Share</button>
        </li>
        <li class="menu-item">
          <button class="menu-button"><i data-feather="edit-2"></i>Rename</button>
        </li>
      </ul> -->
      <ul class="menu-list" v-for="group in menuData" :key="group.name">
        <li class="menu-item" v-for="(action, index) in group.actions" :key="index">
          <button class="menu-button menu-button--black">
            <i data-feather="circle"></i>
            {{ action.name }}
            <svg class="right" v-if="action.child" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
              viewBox="0 0 48 48">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
                d="m19 12l12 12l-12 12" />
            </svg>
          </button>

          <ul class="menu-sub-list" v-if="action.child">
            <li class="menu-item" v-for="(child, cIndex) in action.child" :key="cIndex">
              <button class="menu-button menu-button--orange">
                <i data-feather="square"></i>
                {{ child.name }}
              </button>
            </li>
            <!-- <li class="menu-item"><button class="menu-button menu-button--purple"><i data-feather="octagon"></i>In
                progress</button></li>
            <li class="menu-item"><button class="menu-button menu-button--green"><i
                  data-feather="triangle"></i>Approved</button></li>
            <li class="menu-item"><button class="menu-button menu-button--black menu-button--checked"><i
                  data-feather="circle"></i>No status<i data-feather="check"></i></button></li> -->
          </ul>
        </li>
        <!-- <li class="menu-item"><button class="menu-button"><i data-feather="link"></i>Copy Link Address</button></li>
        <li class="menu-item"><button class="menu-button"><i data-feather="folder-plus"></i>Move to</button></li>
        <li class="menu-item"><button class="menu-button"><i data-feather="copy"></i>Copy to</button></li>
        <li class="menu-item"><button class="menu-button"><i data-feather="lock"></i>Make Private</button></li>
        <li class="menu-item"><button class="menu-button"><i data-feather="download"></i>Download</button></li> -->
      </ul>
      <ul class="menu-list">
        <li class="menu-item"><button class="menu-button menu-button--delete"><i
              data-feather="trash-2"></i>Delete</button></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang='ts'>

interface GroupMenuAction {
  name: string;
  actions: MenuAction[]
}

interface MenuAction {
  name: string | (() => string);
  execute?: () => void;
  child?: MenuAction[]
}

const menuData: GroupMenuAction[] = [
  {
    name: 'aaa', actions: [
      { name: 'Share' },
      { name: 'Rename' },
    ]
  }, {
    name: 'options', actions: [
      {
        name: "Status", child: [
          { name: "Needs review" }
        ]
      }
    ]
  }
]

</script>

<style lang="scss" scoped>
*:after,
*:before {
  box-sizing: border-box;
}

.container {
  --color-bg-primary: #d0d6df;
  --color-bg-primary-offset: #f1f3f7;
  --color-bg-secondary: #fff;
  --color-text-primary: #3a3c42;
  --color-text-primary-offset: #898c94;
  --color-orange: #dc9960;
  --color-green: #1eb8b1;
  --color-purple: #657cc4;
  --color-black: var(--color-text-primary);
  --color-red: #d92027;
}

.menu {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(#404040, 0.15);
}

.menu-list {
  margin: 0;
  display: block;
  width: 100%;
  padding: 8px;
  min-width: 200px;

  &+.menu-list {
    border-top: 1px solid #ddd;
  }
}

.menu-sub-list {
  display: none;
  padding: 8px;
  background-color: var(--color-bg-secondary);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(#404040, 0.15);
  position: absolute;
  left: 100%;
  right: 0;
  z-index: 100;
  width: 100%;
  top: 0;
  flex-direction: column;

  // &:after {
  //   content: "";
  //   position: absolute;
  //   left: -12px;
  //   top: 0;
  //   right: 0;
  //   bottom: 0;
  //   display: block;
  //   outline: 2px solid hotpink;
  // }
  &:hover {
    display: flex;
  }
}

.menu-item {
  position: relative;
}

.menu-button {
  font: inherit;
  border: 0;
  padding: 8px 8px;
  padding-right: 36px;
  width: 100%;
  border-radius: 8px;
  text-align: left;
  display: flex;
  align-items: center;
  position: relative;
  background-color: var(--color-bg-secondary);
  text-wrap: nowrap;

  &:hover {
    background-color: var(--color-bg-primary-offset);

    &+.menu-sub-list {
      display: flex;
    }

    svg {
      stroke: var(--color-text-primary);
    }
  }

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    stroke: var(--color-text-primary-offset);

    &.right,
    &:nth-of-type(2) {
      margin-right: 0;
      position: absolute;
      right: 8px;
    }
  }

  &--delete {
    &:hover {
      color: var(--color-red);

      svg:first-of-type {
        stroke: var(--color-red);
      }
    }
  }

  &--orange {
    svg:first-of-type {
      stroke: var(--color-orange);
    }
  }

  &--green {
    svg:first-of-type {
      stroke: var(--color-green);
    }
  }

  &--purple {
    svg:first-of-type {
      stroke: var(--color-purple);
    }
  }

  &--black {
    svg:first-of-type {
      stroke: var(--color-black);
    }
  }

  &--checked {
    svg:nth-of-type(2) {
      stroke: var(--color-purple);
    }
  }
}

// Codepen spesific styling - only to center the elements in the pen preview and viewport
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

// End Codepen spesific styling
</style>
