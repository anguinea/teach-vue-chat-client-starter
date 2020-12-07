<template>
  <div class="infogroup">

    <div class="image">

    </div>

    <div class="groupe">
      <h1>Groupe :</h1>
    </div>

    <div v-for="(user, index) in groupe" :key="index" class="membre">
        <span class="nom">{{user.name}}</span>
    </div>

  </div>

</template>

<script>

export default {
   name: "infogroup",
  data(){
    return{
      groupe: [
        {name: "Emeric"},
        {name: "Mathieu"},
        {name: "Anguinéa"}
      ]
    }
  }
}
</script>