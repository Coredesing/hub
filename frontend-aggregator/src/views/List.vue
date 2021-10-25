<template>
  <div class="list">
    <mask-dot color="rgba(114, 243, 75, 0.7)" top="100"/>
    <mask-dot color="rgba(115, 83, 229, 0.7)" bottom="100" right/>
    <breadcrumb :items="breadcrumbs"/>
    <div class="list-main">
      <div class="list-main_content">
        <template v-if="list && list.length">
          <div class="grid">
            <latest-item v-for="(item, i) in list" :key="i"
                         :game_name="item.game_name" :verified="item.verified" :category="item.category"
                         :desc="item.desc" :thumbnail="item.thumbnail" :ticker="item.ticker"
                         :slug="item.slug" :sponsor="item.sponsor" :tokenomic="item.tokenomic"
                         :token_price="item.token_price" :icon_token_link="item.icon_token_link"
            />
          </div>
          <div class="pagination">
            <div class="pagination-prev" @click="changePage(-1)">
              <img alt src="../assets/images/arrow_left.svg"/>
            </div>
            <div :class="`pagination-item ${pagination === n-1 ? 'selected' : ''}`" v-for="n in total" :key="n" @click="pagination = (n - 1)">{{ n }}</div>
            <div class="pagination-next" @click="changePage(1)">
              <img alt src="../assets/images/arrow_right.svg"/>
            </div>
          </div>
        </template>
        <template v-else>
          No matching result found.
        </template>
      </div>
      <div class="list-main_side">
        <div class="search">
          <img alt src="../assets/images/search.svg"/>
          <input type="text" placeholder="Search" v-model="searchText"/>
        </div>
        <div class="category-title">
          <img alt src="../assets/images/category.svg"/>
          Category
        </div>
        <div class="divider"/>
        <div class="category-list">
          <div :class="`category-list_item ${selectedCategory === item ? 'selected' : ''}`"
               v-for="(item, i) in CATEGORY_LIST" :key="i" @click="selectCategory(item)">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { CATEGORY_LIST } from "@/constant/category";
import MaskDot from "@/components/MaskDot";
import LatestItem from "@/components/LatestItem";

export default {
  name: "List",
  components: {LatestItem, MaskDot, Breadcrumb},
  data() {
    return {
      CATEGORY_LIST,
      breadcrumbs: [
        {
          text: 'Game List',
          href: '/list'
        }
      ],
      searchText: '',
      pagination: 0,
    }
  },
  async created() {
    if((!this.listAll || this.listAll.length === 0) && !this.selectedCategory) {
      await this.$store.dispatch('getListAll')
    }
  },
  computed: {
    selectedCategory() {
      return this.$store.state.category
    },
    listAll() {
      return this.$store.state.listAll
    },
    total() {
      return Math.ceil(this.listAll.length / 12)
    },
    list() {
      const page = this.pagination * 12
      let list = this.listAll
      if(this.searchText) {
        list = list.filter(item => (item.game_name.toLowerCase().includes(this.searchText.toLowerCase())))
      }
      return list.slice(page, page + 12)
    }
  },
  methods: {
    async selectCategory(item) {
      await this.$store.dispatch('searchByCategory', item)
    },
    changePage(payload) {
      const page = this.pagination + payload
      if(page <= 0)
        this.pagination = 0
      else if(page === this.total)
        this.pagination = this.total - 1
      else
        this.pagination = page
    }
  }
}
</script>

<style scoped lang="scss">
.list {
  padding: 40px var(--padding-section);
  position: relative;

  &-main {
    margin-top: 32px;
    display: flex;

    &_content {
      flex: 1;

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto;
        grid-gap: 48px 24px;

        .item ::v-deep .item-image {
          height: 168px;

          img {
            height: 100%;
            width: 100%;
          }
        }
      }

      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;

        div {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        &-item {
          color: #AEAEAE;
          font-weight: 600;
          font-size: 16px;
        }

        .selected {
          color: black;
          border-radius: 4px;
          background: #72F34B;
        }
      }
    }

    &_side {
      flex: 0 0 224px;
      margin-left: 64px;

      .search {
        background: #2E2E2E;
        border: 1px solid #44454B;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding: 12px;

        img {
          margin-right: 12px;
        }

        input {
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          margin: 0;
          color: white;

          &::placeholder {
            color: #FFF8
          }
        }
      }

      .category {

        &-title {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 20px;
          line-height: 28px;
          padding: 8px 4px;
          margin-top: 8px;

          img {
            margin-right: 12px;
          }
        }

        &-list {
          &_item {
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 2px;
            position: relative;

            &:before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              width: 0;
              background: #fff2;
              transition: width 0.4s;
              border-radius: 2px;
            }

            &.selected:before {
              width: 100%;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .list {
    &-main {
      &_side {
         display: none;
      }

      &_content {
        .grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      }
    }
  }
}
</style>