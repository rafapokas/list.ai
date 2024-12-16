import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

const app = createApp(App);

app.use(store);
app.use(router);

store.dispatch('fetchLists');
store.dispatch('fetchItems');

app.mount('#app');
