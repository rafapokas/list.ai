// src/store/index.js
import { createStore } from 'vuex';
import { addListToDB, getListsFromDB, addItemToDB, getItemsFromDB } from '../services/database';

const store = createStore({
  state: {
    shoppingLists: [],
    shoppingListItems: [],
  },
  mutations: {
    setLists(state, lists) {
      state.shoppingLists = lists;
    },
    setItems(state, items) {
      state.shoppingListItems = items;
    },
    addList(state, list) {
      state.shoppingLists.push(list);
    },
    addItem(state, item) {
      state.shoppingListItems.push(item);
    },
    removeItem(state, index) {
      state.shoppingListItems.splice(index, 1);
    },
    updateItemQuantity(state, { index, quantity }) {
      if (state.shoppingListItems[index]) {
        state.shoppingListItems[index].quantity = quantity;
      }
    },
  },
  actions: {
    async fetchLists({ commit }) {
      const lists = await getListsFromDB();
      commit('setLists', lists);
    },
    async fetchItems({ commit }) {
      const items = await getItemsFromDB();
      commit('setItems', items);
    },
    async createList({ commit }, list) {
      commit('addList', list);
      await addListToDB(list);
    },
    async createItem({ commit }, item) {
      commit('addItem', item);
      await addItemToDB(item);
    },
    deleteItem({ commit }, index) {
      commit('removeItem', index);
      // Adicionar lógica para remover do PouchDB se necessário
    },
    changeItemQuantity({ commit }, payload) {
      commit('updateItemQuantity', payload);
      // Adicionar lógica para atualizar no PouchDB se necessário
    },
  },
  getters: {
    allLists(state) {
      return state.shoppingLists;
    },
    allItems(state) {
      return state.shoppingListItems;
    },
    totalCost(state) {
      return state.shoppingListItems.reduce((total, item) => {
        return total + ((item.price || 0) * item.quantity);
      }, 0);
    },
  },
});

export default store;
