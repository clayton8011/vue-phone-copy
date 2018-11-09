// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from'vuex'
import mutations from'./store/mutations'
import actions from './store/action'
import getters from './store/getters'
Vue.use(Vuex);

const state ={
  latitude:'',
  longitude:'',
  cartList:{},
    shopDetail:null,
    userInfo:null,
    shopid:null,
    remarkText:null,
    inputText:null,
    invoice:false,
    newAddress:[],
    geohash:'31.22299.121.36025',
    choosedAddress:null,
    addressIndex:null,
    needValidation:null,
    cartId:null,
    sig:null,
    orderParam:null,
    orderMessage:null,
    orderdetail:null,
    login:true,
    imgPath:null,
    removeAddress:[],
    addAddress:'',
    question:null,
    cartPrice:null,



};
const store=new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
});
import  './images/icons/index'
import './config/rem'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
