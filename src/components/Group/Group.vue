<template>
  <div class="group">
    <div class="ui fluid search">
      <div class="ui icon input">
        <input
          type="text"
          placeholder="Rechercher un utilisateur"
          class="prompt"
          v-model="search"
        />
        <i class="search icon"></i>
      </div>
    </div>
    <div class="spanner">
      <hr />
      <span>Participants</span>
      <hr />
    </div>

    <div v-for="groupUser in UsersInGroup" :key="groupUser.username">
      <div class="user">
        <img :src="groupUser.picture_url" />
        <span>{{groupUser.username}}<br /><i class="nickname"></i></span>
          <i title="Modifier le surnom" class="circular quote left link icon"></i>

          <i v-if="conversation.participants.length > 3" title="Enlever de la conversation" 
          class="circular times icon link" 
          style=""  
          v-on:click="DeleteSomeone(groupUser.username)"></i>
      </div>
    </div>
    
    <div class="spanner">
      <hr />
      <span>Communauté</span>
      <hr />
    </div>

    <div v-for="groupUser in UsersOutGroup"  :key="groupUser.username">
      <div class="user">
        <img :src="groupUser.picture_url" />
        <span>{{groupUser.username}}</span>
        <i 
        title="Ajouter à la conversation" 
        class="circular plus icon link"
        v-on:click="AddSomeone(groupUser.username)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Group",
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapGetters(["conversation", "users"]),

    UsersInGroup(){
        let array = [];

        this.conversation.participants.forEach(element => {
          this.users.find(user => { 

            if (user.username === element) 
            { array.push(user) }

            return false;
          })
        });
        return array.filter(user=>user.username.toLowerCase().includes(this.search.toLowerCase()));
    },

    UsersOutGroup(){
      let array = [];
      this.users.forEach(user => {
        let exist = this.conversation.participants.some(element => {
          return element === user.username;
        })

        if(!exist){
          array.push(user);
        }
      })
      return array.filter(user=>user.username.toLowerCase().includes(this.search.toLowerCase()));
    }
  },
  methods: {
    ...mapActions(["AddParticipant", "DeleteParticipant"]),
    
    AddSomeone(username){
      let promise;
  
      promise = this.AddParticipant({
        username: username,
        conversation: this.conversation
      });

      promise.finally(() => {
        console.log("AAAAAAAAAAA");
        //TODO
      });
    },

    DeleteSomeone(username){
      let promise;
  
      promise = this.DeleteParticipant({
        username: username,
        conversation: this.conversation
      });

      promise.finally(() => {
        console.log("AAAAAAAAAAA");
        //TODO
      });
    }

  }
};
</script>

<style src="./Group.css" scoped />
