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
      <button class="ui primary big button" @click="openConversation" v-if="this.selectedUser.length > 0">
        <i class="conversation icon"></i>
        <span v-if="open">Ouverture de la conversation...</span>
        <span v-else>Ouvrir la conversation ({{this.selectedUser.length}})</span>
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
      selectedUser: [],
      open: false
    };
  },
  methods: {
    ...mapActions(["createOneToOneConversation", "createManyToManyConversation"]),
    openConversation() {
       
      let promise;

      if (this.selectedUser.length > 1){
        promise = this.createManyToManyConversation(this.selectedUser);
      

      } else {
        promise = this.createOneToOneConversation(this.selectedUser[0]);
      }

      promise.finally(() => {
        this.open = !this.open;
        console.log("Conversation ouverte ! " + this.open);
      });
      
    },
    
    toggleSelected(user){
    
      if(!this.selectedUser.includes(user.username)){
        this.selectedUser.push(user.username);
          
      }else{
        const index = this.selectedUser.indexOf(user.username);
        if (index > -1) {
          this.selectedUser.splice(index, 1);
        }
      }
  
    },
    isSelected(user){ 
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
