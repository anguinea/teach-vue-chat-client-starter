<template>
  <div class="sidebar">
    <div class="user">
      <div class="user-picture">
        <img :src="user.picture_url" class="ui circular image" />
      </div>

      <div class="user-info">
        <div class="user-info-pseudo">{{ user.username }}</div>

        <div class="user-info-status ui simple dropdown">
          <div class="available text">
            En ligne
          </div>
          <i class="dropdown icon"> </i>
          <div class="menu">
            <div class="item" @click="deauthenticate">
              <i class="logout icon"> </i>
              Déconnexion
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="menu">
      <div class="blue button" @click="openCommunity">
        <i class="users icon"> </i>
        <br />
        <span>Communauté</span>
      </div>
      <div v-if="true" class="blue button" @click="openMessageSearch">
        <i class="search icon"> </i>
        <br />
        <span>Messages</span>
      </div>
    </div>

    <div class="conversations">
      <div class="conversation-search">
        <div class="ui fluid search">
          <div class="ui icon input">
            <input
              class="prompt"
              placeholder="Rechercher une conversation"
              type="text"
              v-model="search"
            />
            <i class="search icon"> </i>
          </div>
        </div>
      </div>

      <div 
        v-for="conversation in filterConversations" :key="conversation.title" 
        class="conversation" :class="[ isSeen(conversation) && 'seen ']" 
        :title="conversation.title" 
        @click="openConversation(conversation.id)"
      >
        <!-- MANY TO MANY -->
        <div v-if="conversation.type === 'many_to_many'" style="display:flex">
          <a class="avatar">
            <span><i class="ui users icon"></i></span>
          </a>

          <div class="content">
            <div class="metadata">
              <div class="title" v-if="!conversation.title"><i class="ui small icon circle"> </i> Groupe: <span v-for="(participants, index) in conversation.participants" :key="index">{{ participants }}, </span></div>
            <!--<div class="title" ><i class="ui small icon circle"> </i> <span v-for="username in conversation.participants.filter(userimg => userimg !== user.username)" :key="username"> {{ username }} </span></div>-->
              <span class="time">{{conversation.updated_at}}</span>
            </div>
            <div class="text">{{ conversation.messages[conversation.messages.length -1] != null ? conversation.messages[conversation.messages.length -1]: "Nouvelle conversation" }}</div>
          </div>
          
        </div>

        <!-- ONE TO ONE -->
        <div v-else style="display:flex">
          <a class="avatar">
            <img :src="getUserPicture(conversation.participants[1])" />
          </a>

          <div class="content">
            <div class="metadata">
              <div class="title"><i class="ui small icon circle"></i>{{ conversation.participants[1] }}</div>
              <span class="time">{{conversation.updated_at}}</span>
            </div>
            <div class="text">{{ conversation.messages[conversation.messages.length -1] != null ? conversation.messages[conversation.messages.length -1]: "Nouvelle conversation" }}</div>
          </div>
        
        </div>
        
      </div>

      
      
      <div
        class="conversation"
        title="Groupe: Gael, Bob"
        @click="log()"
      >
        <a class="avatar">
          <span>
            <i class="users icon"> </i>
          </span>
        </a>
        <div class="content">
          <div class="metadata">
            <div class="title">Groupe: Gael, Bob</div>
            <span class="time">01:36:38</span>
          </div>
          <div class="text">Incroyable !</div>
        </div>
      </div>

      <div
        class="conversation available"
        title="Cha"
        @click="openConversation(0)">
        <a class="avatar">
          <img src="https://source.unsplash.com/8wbxjJBrl3k/100x100" />
        </a>
        <div class="content">
          <div class="metadata">
            <div class="title"><i class="ui small icon circle"> </i> Cha</div>
            <span class="time">01:47:50</span>
          </div>
          <div class="text">Nouvelle conversation</div>
        </div>
      </div>

      <div
        class="conversation selected"
        title="Derek"
        @click="openConversation(0)"
      >
      <div style="display:flex">
              <a class="avatar">
                <img src="https://source.unsplash.com/FUcupae92P4/100x100" />
              </a>
              <div class="content">
                <div class="metadata">
                  <div class="title">Derek</div>
                  <span class="time">01:48:00</span>
                </div>
                <div class="text">Nouvelle conversation</div>
              </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { mapActions, mapGetters } from "vuex";
import _ from 'lodash';

export default {
  name: "Sidebar",
  data() {
    return {
      search: ""
    };
  },
  methods: {
    ...mapActions(["deauthenticate"]),
    getUserPicture(username) {
      let userimg = null;
      this.users.forEach(user => {
          if(user.username === username){
              userimg = user;
          }
      });

      return userimg.picture_url; //CA MARCHEEEEEEEE
    },
    isSeen(conversation){
      console.log('seen: ' + conversation.seen);
      return null;
    },
    openCommunity() {
      router.push({ name: "Community" });
    },
    openMessageSearch() {
      router.push({ name: "Search" });
    },
    openConversation(id) {
      router.push({ name: "Conversation", params: { id } });
    }
  },
  computed: {
    ...mapGetters(["user", "conversations", "users"]),
    filterConversations(){
      let filteredConvs = this.conversations;

      filteredConvs = filteredConvs.filter(conv =>
          conv.participants[1].toLowerCase().includes(this.search.toLowerCase())
      );

      return filteredConvs;
    },
    orderedConversations: function () {
      return _.sortBy(this.conversations, ['update_at'], ['desc'])
    }
  }
};
</script>

<style scoped src="./Sidebar.css" />
