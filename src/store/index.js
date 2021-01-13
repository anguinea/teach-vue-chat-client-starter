import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticating: false,
    user: {
      username: null,
      token: null,
      picture_url: null
    },
    users: [],
    conversation: {},
    conversations: [],
    currentConversationId: null,
    usersAvailable: []
  },
  getters: {
    authenticating(state) {
      return state.authenticating;
    },
    authenticated(state) {
      return state.user.token !== null;
    },
    user(state) {
      return state.user;
    },
    users(state) {
      return state.users.map((user) => ({
        ...user
        //TODO
      }));
    },
    conversations(state, getters) {
      return state.conversations.map((conversation) => {
        let titre;

        if (conversation.type === "many_to_many") {
          titre = getters.getConversationTitle(conversation);
        } else {
          conversation.participants.forEach((element) => {
            if (element !== state.user.username) {
              titre = element;
            }
          });
        }

        return {
          ...conversation,
          //TODO
          updated_at: new Date(conversation.updated_at),
          title: titre
        };
      });
    },
    conversation(state, getters) {
      return getters.conversations.find(
        (conversation) => conversation.id === state.currentConversationId
      );
    },

    getConversationTitle: () => (conversation) => {
      let title = conversation.title;

      if (!title) {
        title = "";

        console.log(conversation);

        for (let i = 0; i < conversation.participants.length; i++) {
          //if participant === connected user
          //then not store in title
          //else
          console.log(conversation.participants[i]);

          if (i === conversation.participants.length - 1) {
            title = title + conversation.participants[i];
          } else {
            title = title + conversation.participants[i] + ", ";
          }
        }
      }

      return title;
    }
  },
  mutations: {
    syncCurrentConversation(state, conversationId) {
      state.currentConversationId = conversationId;
    },
    setAuthenticating(state, authenticating) {
      state.authenticating = authenticating;
    },
    setUser(state, { username, token, picture_url }) {
      Vue.set(state.user, "username", username);
      Vue.set(state.user, "token", token);
      Vue.set(state.user, "picture_url", picture_url);
    },
    setUsers(state, users) {
      state.users = users;
    },

    upsertUser(state, { user }) {
      const localUserIndex = state.users.findIndex(
        (_user) => _user.username === user.username
      );

      if (localUserIndex !== -1) {
        Vue.set(state.users, localUserIndex, user);
      } else {
        state.users.push({
          ...user
        });
      }
    },

    upsertConversation(state, { conversation }) {
      const localConversationIndex = state.conversations.findIndex(
        (_conversation) => _conversation.id === conversation.id
      );

      if (localConversationIndex !== -1) {
        Vue.set(state.conversations, localConversationIndex, conversation);
      } else {
        state.conversations.push({
          ...conversation
        });
      }
    },

    upsertMessage(state, { conversation_id, message }) {
      const localConversationIndex = state.conversations.findIndex(
        (_conversation) => _conversation.id === conversation_id
      );

      let conversation = state.conversations.find(
        (conv) => conv.id === conversation_id
      );

      if (localConversationIndex !== -1) {
        conversation.messages.push({
          ...message
        });
      }
    }
  },
  actions: {
    authenticate({ commit, dispatch }, { username, password }) {
      if (!username || !password) {
        return;
      }
      commit("setAuthenticating", true);
      Vue.prototype.$client
        .authenticate(username, password)
        .then((user) => {
          commit("setUser", user);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);

          dispatch("initializeAfterAuthentication");
        })
        .catch(() => {
          alert("Erreur d'authentification !");
        })
        .finally(() => {
          commit("setAuthenticating", false);
        });
    },

    deauthenticate() {
      localStorage.removeItem("password");
      window.location.reload();
    },

    initializeAfterAuthentication({ dispatch }) {
      dispatch("fetchUsers");
      //TODO: dispatch("fetchConversations");
    },

    fetchUsers({ commit }) {
      Vue.prototype.$client.getUsers().then(({ users }) => {
        commit("setUsers", users);
      });
    },

    createOneToOneConversation({ commit }, username) {
      const promise = Vue.prototype.$client.getOrCreateOneToOneConversation(
        username
      );

      promise.then(({ conversation }) => {
        commit("upsertConversation", {
          conversation
        });

        router.push({
          name: "Conversation",
          params: { id: conversation.id }
        });
      });

      return promise;
    },

    createManyToManyConversation({ commit }, usernames) {
      const promise = Vue.prototype.$client.createManyToManyConversation(
        usernames
      );

      promise.then(({ conversation }) => {
        commit("upsertConversation", {
          conversation
        });

        router.push({
          name: "Conversation",
          params: { id: conversation.id }
        });
      });

      return promise;
    },

    createMessage({ commit }, { conversation_id, message }) {
      console.log("createMessage: " + conversation_id + " " + message);

      const promise = Vue.prototype.$client.postMessage(
        conversation_id,
        message
      );

      promise.then(({ conversation_id, message }) => {
        commit("upsertMessage", {
          conversation_id,
          message
        });
      });

      return promise;
    }
  }
});
