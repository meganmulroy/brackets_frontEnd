<template>
  <div>
    <h1>Welcome, {{user.username}}!</h1>
    <table class="table">
      <nav class="links">
        <tr>
            <router-link :to="('/profile')" tag="th" class="subnav">Overview</router-link>
            <router-link :to="('/profile/tournaments')" tag="th" class="subnav">My Tournaments</router-link>
            <router-link :to="('/profile/invites')" tag="th" class="subnav">My Invites</router-link>
            <router-link :to="('/profile/pastTournaments')" tag="th" class="subnav">My Past Tournaments</router-link>
        </tr>
      </nav>
    </table>
  </div>
</template>

<script>
import auth from '@/auth.js';
import ProfileService from '@/ProfileService.js';

export default {
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
  }
};
</script>

<style>
.links{
    display: flex;
}
</style>
