<template>
  <div class="breadcrumb">
    <a href="/">
      <img alt src="../assets/images/home.svg"/>
    </a>
    <template v-for="(item, i) in items">
      <div class="row align-center" :key="i">
        <img class="breadcrumb-divider" src="../assets/images/arrow_right.svg"/>
        <a :href="item.href">{{ item.text }}</a>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    items: Array
  }
}
</script>

<style scoped lang="scss">
  .breadcrumb {
    display: flex;
    align-items: center;

    &-divider {
      margin: 0 24px;
    }

    a {
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
    }
  }

  @media screen and (max-width: 600px) {
    .breadcrumb {
      &-divider {
        margin: 0 10px;
      }
    }
  }
</style>