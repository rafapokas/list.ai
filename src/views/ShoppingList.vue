<!-- src/views/ShoppingList.vue -->
<template>
  <div class="shopping-list">
    <h1>Shopping List App</h1>
    
    <!-- Criação de uma nova lista -->
    <div class="create-list">
      <input v-model="newListTitle" placeholder="Título da nova lista" />
      <input v-model.number="listLimit" placeholder="Limite monetário" type="number" />
      <button @click="addList">Criar Lista</button>
    </div>

    <!-- Exibição das listas -->
    <div class="lists">
      <div v-for="list in lists" :key="list.id" class="list">
        <h2>{{ list.title }}</h2>
        <p>Limite: ${{ list.limit }}</p>
        <p>Total: ${{ calculateTotal(list.id) }}</p>
        <p v-if="calculateTotal(list.id) > list.limit" class="warning">Você excedeu o orçamento!</p>
        
        <!-- Adição de itens -->
        <div class="add-item">
          <input v-model="newItemTitle" placeholder="Novo item" />
          <input v-model.number="newItemPrice" placeholder="Preço (opcional)" type="number" />
          <input v-model.number="newItemQuantity" placeholder="Quantidade" type="number" min="1" />
          <button @click="addItem(list.id)">Adicionar Item</button>
        </div>

        <!-- Lista de itens -->
        <ul>
          <li v-for="(item, index) in getItems(list.id)" :key="item.id">
            {{ item.title }} - ${{ item.price || 'N/A' }} x {{ item.quantity }}
            <button @click="removeItem(list.id, index)">Remover</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      newListTitle: '',
      listLimit: 0,
      newItemTitle: '',
      newItemPrice: null,
      newItemQuantity: 1,
    };
  },
  computed: {
    ...mapGetters(['allLists', 'allItems']),
    lists() {
      return this.allLists;
    },
  },
  methods: {
    ...mapActions(['createList', 'createItem', 'deleteItem']),
    addList() {
      if (!this.newListTitle || this.listLimit <= 0) {
        alert('Por favor, forneça um título válido e um limite monetário maior que zero.');
        return;
      }
      const newList = { id: Date.now(), title: this.newListTitle, limit: this.listLimit };
      this.createList(newList);
      this.newListTitle = '';
      this.listLimit = 0;
    },
    getItems(listId) {
      return this.allItems.filter(item => item.listId === listId);
    },
    addItem(listId) {
      if (!this.newItemTitle) {
        alert('Por favor, forneça um título para o item.');
        return;
      }
      const item = {
        id: Date.now(),
        title: this.newItemTitle,
        price: this.newItemPrice,
        quantity: this.newItemQuantity,
        listId: listId,
      };
      this.createItem(item);
      this.newItemTitle = '';
      this.newItemPrice = null;
      this.newItemQuantity = 1;
    },
    removeItem(listId, index) {
      const items = this.getItems(listId);
      const globalIndex = this.allItems.findIndex(
        item => item.id === items[index].id
      );
      if (globalIndex !== -1) {
        this.deleteItem(globalIndex);
      }
    },
    calculateTotal(listId) {
      const items = this.getItems(listId);
      return items.reduce((total, item) => {
        return total + ((item.price || 0) * item.quantity);
      }, 0);
    },
  },
};
</script>

<style scoped>
.shopping-list {
  padding: 20px;
}

.create-list, .add-item {
  margin-bottom: 20px;
}

.lists {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.list {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
}

.warning {
  color: red;
}
</style>
