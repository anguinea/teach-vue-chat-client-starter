<template>
  <div v-if="message.from === user.username">
    <div class="time">{{TimeMessage(message.posted_at).toLocaleTimeString('fr-FR')}}</div>

              <div class="message mine">
                <div class="bubble top bottom">{{message.content}}</div>
                <div class="reacts"></div>
                <div class="controls">
                  <i title="Supprimer" class="circular trash icon"></i>
                  <i title="Editer" class="circular edit icon"></i>
                  <i title="Répondre" class="circular reply icon"></i>
                </div>
              </div>
  </div>

    <div v-else>
    <div class="time">{{TimeMessage(message.posted_at).toLocaleTimeString('fr-FR')}}</div>



              <div class="message">
                  
                <img
                  :title= from
                  :src= getPicture(message.from)
                 />
                <div class="bubble top bottom">{{message.content}}</div>
                <div class="reacts"></div>
                <div class="controls">
                  <i title="Supprimer" class="circular trash icon"></i>
                  <i title="Editer" class="circular edit icon"></i>
                  <i title="Répondre" class="circular reply icon"></i>
                </div>
              </div>
  </div>

</template>

<script>

import {mapGetters } from "vuex";

export default {
  name: "Sidebar",
  props: ["message", "from", "picture"],
  data(){
    return {
      
    }
  },

   computed: {
    ...mapGetters(["conversation", "user", "users"]),
  },

  methods: {
    TimeMessage(data){
      
      let time = new Date(data);
      return time;
    },

 getPicture(name) {
      let picture;
      this.users.forEach((user) => {
        if (user.username === name) {
          picture = user.picture_url;
        }
      });
      console.log(picture);
      return picture;
    }

  }


  
};



</script>

<style src="../Conversation/Conversation.css" scoped />