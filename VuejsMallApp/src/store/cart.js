
export default {
  namespaced: true,
  state: {
    list: [],
  },
  getters: {
    listLength(state) {
      return state.list.length;
    },
    selectedItemsCount(state) {
      return state.list.reduce((total, current) => {
        if (current.isChecked) {
          return total + 1;
        }
        return total;
      }, 0);
    },
    selectedItemsTotalPrice(state) {
      return state.list.reduce((total, current) => {
        if (current.isChecked) {
          return total += current.count * current.presentPrice;
        }
        return total;
      }, 0);
      //let totalPrice = 0;
      //for (let item of state.list) {
      //  if (item.isChecked) {
      //    totalPrice += item.count * item.presentPrice;
      //  }
      //}
      //return totalPrice;
    },
  },
  actions: {
    toList(context, payload) {
      return new Promise((resolve) => {
        let item = context.state.list.find(current => current.id == payload.id);
        if (item != undefined) {
          item.count++;
          context.commit('ReplaceItem', item);
          resolve('increase');
        }
        else {
          payload.count = 1;
          context.commit('AddItem', payload);
          resolve('pushNew');
        }
      });
    },
    checkAllItems(context, payload) {
      for (let item of context.state.list) {
        if (item.isChecked != payload) {
          item.isChecked = payload;
          context.commit('ReplaceItem', item);
        }
      }
    },
  },
  mutations: {
    AddItem(state, payload) {
      state.list.push(payload);
    },
    DropItem(state, payload) {
      let targetIndex = -1;
      let l = state.list.length;
      for (let i = 0; i < l; i++) {
        if (state.list[i].id == payload.id) {
          targetIndex = i;
          break;
        }
      }
      if (targetIndex > -1) {
        state.list.splice(targetIndex, 1);
      }
    },
    ReplaceItem(state, payload) {
      let targetIndex = -1;
      let l = state.list.length;
      for (let i = 0; i < l; i++) {
        if (state.list[i].id == payload.id) {
          targetIndex = i;
          break;
        }
      }
      if (targetIndex > -1) {
        state.list.splice(targetIndex, 1, payload);
      }
    },
  }
}
