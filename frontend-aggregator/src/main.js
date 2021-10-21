import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/assets/style/font.css'
import '@/assets/style/common.css'

import VueGtag from "vue-gtag";
Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_GTAG }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
