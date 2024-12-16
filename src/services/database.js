// src/services/database.js
import PouchDB from 'pouchdb';

const db = new PouchDB('shopping-list');

export const addListToDB = async (list) => {
  try {
    await db.put({ _id: `list_${list.id}`, ...list });
  } catch (error) {
    console.error('Erro ao adicionar lista:', error);
  }
};

export const getListsFromDB = async () => {
  try {
    const result = await db.allDocs({ include_docs: true });
    return result.rows.map(row => row.doc);
  } catch (error) {
    console.error('Erro ao obter listas:', error);
    return [];
  }
};

export const addItemToDB = async (item) => {
  try {
    await db.put({ _id: `item_${item.id}`, ...item });
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
  }
};

export const getItemsFromDB = async () => {
  try {
    const result = await db.allDocs({ include_docs: true });
    return result.rows.map(row => row.doc).filter(doc => doc._id.startsWith('item_'));
  } catch (error) {
    console.error('Erro ao obter itens:', error);
    return [];
  }
};
