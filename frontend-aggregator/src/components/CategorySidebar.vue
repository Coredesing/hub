<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-item" v-for="(category, i) in CATEGORY" :key="i">
      <div
        class="sidebar-item_header"
        @click.prevent.stop="category.show = !category.show"
      >
        <span>{{ category.title }}</span>
      </div>
      <accordion-transition name="slide">
        <div v-show="category.show" :class="`sidebar-item_list ${category.level === 2 && ('sidebar-item_parent' + category.id)}`">
          <template v-if="category.level === 1">
            <div
              v-for="(item, j) in category.list"
              :key="`${category.title}-${j}`"
              @click="selectItem(item)"
              :class="`sidebar-item_list-item ${
                item.id === selectedCategory.id ? 'selected' : ''
              }`"
            >
              {{ item.title }}
            </div>
          </template>
          <template v-else>
            <div
              v-for="(sub, j) in category.list"
              :key="`${category.title}-${j}`"
              class="sidebar-sub"
            >
              <div
                class="sidebar-sub_header"
                @click.prevent.stop="toggleSubItem(sub, category.id)"
              >
                {{ sub.title }}
              </div>
              <accordion-transition name="slide">
                <div v-show="sub.show" class="sidebar-sub_list">
                  <div
                    v-for="(item) in sub.list"
                    :key="item.id"
                    @click="selectItem(item)"
                    :class="`sidebar-sub_list-item ${
                      item.id === selectedCategory.id ? 'selected' : ''
                    }`"
                  >
                    {{ item.title }}
                  </div>
                </div>
              </accordion-transition>
            </div>
          </template>
        </div>
      </accordion-transition>
    </div>
  </div>
</template>

<script>
import { CATEGORY } from "@/constant/category";
import AccordionTransition from "@/components/accordionTransition";

export default {
  name: "CategorySidebar",
  components: { AccordionTransition },
  data() {
    return {
      CATEGORY,
      selectedCategory: {},
    };
  },
  mounted() {

  },
  methods: {
    selectItem(item) {
      this.selectedCategory = item;
    },
    toggleSubItem(item, id) {
      item.show = !item.show;
      const parent = document.querySelector('.sidebar-item_parent' + id)
      parent.style.height = 'auto'
    }
  },
};
</script>

<style scoped lang="scss">
.sidebar {

  &-wrapper {
    --color: #000;
    border-bottom: 1px solid var(--color);
  }

  &-item {
    text-align: left;
    border-top: 1px solid var(--color);
    padding: 8px;

    &_header {
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
    }

    &_list {
      transition: all 0.4s;

      &-item {
        font-size: 14px;
        padding: 2px 0;
        cursor: pointer;

        &:hover {
          background: #0001
        }
      }
    }
  }

  &-sub {
    &_header {
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
    }

    &_list {
      transition: all 0.4s;

      &-item {
        font-size: 14px;
        cursor: pointer;

        &:hover {
          background: #0001
        }
      }
    }
  }
}
</style>
