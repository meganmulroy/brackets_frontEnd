<template>
  <div class="container">
    <profile-subnav />

    <h3>Account Details</h3>
    <table class="table">
      <tr>
        <td>
            <tr>Username: {{ user.username }}</tr>
            <tr>Email: {{ user.email }}</tr>
        </td>
      </tr>
    </table>

    <router-view @updateProfileNavBar="updateProfileNavBar"/>

  </div>
</template>

<script>
import ProfileSubnav from '@/components/ProfileSubnav.vue';
import auth from '@/auth.js';
import ProfileService from '@/ProfileService.js';

export default {
  components: {
    ProfileSubnav,
  },
  props: {
    apiPath: String
  },
  data() {
    return {
      user: auth.getUser()
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
    this.updateProfileNavBar();
    
    ////////////////////
    // This fetch doesn't seem to be doing anything!
    ////////////////////
    // fetch(this.apiPath + '/profile')
    //   .then(response => {
    //       return response.json();
    //   })
    //   .then(parsedData => {
    //       this.user = parsedData;
    //   })
    //   .catch(err => console.log(err));
  }
};
</script>

<style>
.details {
  list-style-type: none;
}
.links{
  display: flex;
}
.links .router-link-exact-active {
  background-color: #f07138;
}


</style>
