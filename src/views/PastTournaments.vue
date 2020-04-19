<template>
  <div class="container">
    <profile-subnav />
    
    <h3>Past Tournaments</h3>
    <table class="table">
      <tr class="headings">
        <th>Name</th>
        <th>Description</th>
        <th>Sport</th>
        <th>Result</th>
      </tr>
      <tr v-if="tournaments.length == 0">
        <td>You do not have any past tournaments.</td><td></td><td></td><td></td>
      </tr>
      <tr v-for="(tournament, index) in tournaments" :key="index">
        <td>{{tournament.name}}</td>
        <td>{{tournament.description}}</td>
        <td>{{tournament.sportName}}</td>
        <td>{{tournament.results}}</td>
    </tr>
    </table>

    <router-view @updateProfileNavBar="updateProfileNavBar"/>
    
  </div>
</template>
<script>
import ProfileSubnav from '@/components/ProfileSubnav.vue';
import auth from "@/auth.js";
import ProfileService from "@/ProfileService.js";


export default {
  components: {
    ProfileSubnav,
  },
  props: {
    apiPath: String
  },
  data() {
    return {
      user: auth.getUser(),
      tournaments: [],
    };
  },
  methods: { 
    updateProfileNavBar() {
      ProfileService.getUser()
      .then((user) => {
          this.user = user;
      });
    }
  },
  created() {
    fetch(this.apiPath + '/profile/pastTournaments',
    {
      method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.getToken(),
        },
    })
    .then(response => {
      return response.json();
    })
    .then(parsedData => {
      this.tournaments = parsedData;
    })
    .catch(err => console.log(err));
    this.updateProfileNavBar();
  }
};
</script>

<style>
.heading{
    display: flex;
}
.links{
    display: flex;
}

</style>
