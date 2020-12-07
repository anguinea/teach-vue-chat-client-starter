<template>
  <div class="community">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input
            class="prompt"
            type="text"
            placeholder="Rechercher un utilisateur" v-model="search"
          />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>

    <div class="users">
      <div v-for="user in filterusers" :key="user.username">
      <!-- //:class="{ 'selected': toggle }" @click="Select(user)"-->
        <div :class="[ isSelected(user) ? 'selected user ' : 'user' ]" @click="toggleSelected(user)">
          <img :src="user.picture_url"/><span
            class=""
            >{{user.username}}</span
          >
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="ui primary big button" @click="openConversation">
        <i class="conversation icon"></i>
        <span>
          Ouvrir la conversation (2)
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";


export default {
  name: "Community",
  data() {
    return {
      search: "",
      selected: false,
      selectedUser: []
    };
  },
  methods: {
    ...mapActions(["createOneToOneConversation"]),
    openConversation() {
      let promise = this.createOneToOneConversation("Alice");

      promise.finally(() => {
        console.log("Conversation ouverte !");
      });
    },
    toggleSelected(user){
    
      if(!this.selectedUser.includes(user.username)){
        this.selectedUser.push(user.username);
          console.log(this.selectedUser);
      }else{
        const index = this.selectedUser.indexOf(user.username);
        if (index > -1) {
          this.selectedUser.splice(index, 1);
        }
      }
  
    },
    isSelected(user){ 
        console.log("tete")
        return this.selectedUser.includes(user.username);

    }
  },
  computed: {
    ...mapGetters(["users"]),
      filterusers() {
       return this.users.filter(user=>user.username.toLowerCase().includes(this.search.toLowerCase()));

      }
  }
};
</script>

<style src="./Community.css" scoped />
