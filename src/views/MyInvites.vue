<template>
    <div class="container">
    <profile-subnav />

    <h3>Current Invites</h3>
    <table class="table">
      <tr class="headings">
          <th class="name-column">Tournament Name</th>
          <th class="deadline-column">Registration Deadline</th>
          <th class="status-column">Status</th>
          <th class="rsvp-column">RSVP</th>
      </tr>
      <tr v-if="sortCurrentInvites.length == 0">
        <td>You do not have any pending invitations.</td><td></td><td></td><td></td>
      </tr>
      <tr v-for="(invite, index) in sortCurrentInvites" :key="index">
        <td>{{invite.tournamentName}}</td>
        <td>{{invite.regDeadline}}</td>
        <td>{{(getTournamentForInvite(invite).status === 'Full' && invite.response === 'PENDING')? 'FULL': invite.response}}</td>
        <td>
          <span v-if="invite.response != 'ACCEPTED' && invite.response != 'REJECTED'">
          <button v-if="!userSelected" @click="updateInvite(invite, 'ACCEPTED')" >Accept</button>
          <button v-if="!userSelected" @click="updateInvite(invite, 'REJECTED')">Reject</button>
          </span>
        </td>
      </tr>
    </table>

    <h3>Past Invites</h3>
    <table class="table">
      <tr class="headings">
          <th class="name-column">Tournament Name</th>
          <th class="deadline-column">Registration Deadline</th>
          <th class="status-column">Status</th>
          <th class="rsvp-column"></th>
      </tr>
      <tr v-if="sortPastInvites.length == 0">
        <td>You do not have any old invitations.</td><td></td><td></td>
      </tr>
      <tr v-for="(invite, index) in sortPastInvites" :key="index">
        <td>{{invite.tournamentName}}</td>
        <td>{{invite.regDeadline}}</td>
        <td>{{invite.response}}</td>
        <td></td>
      </tr>
    </table>

    <router-view @updateProfileNavBar="updateProfileNavBar" @updateInvite="updateInvite"/>

  </div>
</template>

<script>
import ProfileSubnav from '@/components/ProfileSubnav.vue';
import dates from 'date-fns'; 
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
      userSelected: false,
      user: auth.getUser(),
      tournaments: [],
      invites: [
        {
          tournamentName: '',
          regDeadline: '',
          response: '',
        }
      ],
      pastInvites: [],
      currentInvites: [],
    };
  },
  computed: {
    sortPastInvites() {
      let pastInvites = this.invites;
        pastInvites = this.invites.filter(
          invite => dates.isPast(dates.parse(invite.regDeadline))
        );
      return pastInvites;
    },
    sortCurrentInvites() {
      let currentInvites = this.invites;
        currentInvites = this.invites.filter(
          invite => dates.isFuture(dates.parse(invite.regDeadline))
        )
      return currentInvites;
    }
  },
  methods: { 
    updateProfileNavBar() {
      ProfileService.getUser()
      .then((user) => {
          this.user = user;
      });
    },
    updateInvite(invite, response) {
      invite.response = response;
      console.log(invite.tournamentId);
      fetch(this.apiPath + '/invite/' + invite.tournamentId, {
      method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.getToken(),
        },
        body: JSON.stringify(invite)
      })
      .then((response) => {
        if( response.ok ) {
          this.userSelected = true;
          this.$emit('created');
        }
      })
      .catch((err) => console.error(err));
    },

    getTournamentForInvite(invite){
      return this.tournaments.find(tournament => tournament.id == invite.tournamentId)

    }
  },
  created() {

    fetch(this.apiPath + '/profile/tournaments',
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
    

    fetch(this.apiPath + '/profile/invites',
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
      this.invites = parsedData;
    })
    .catch(err => console.log(err));
    this.updateProfileNavBar();
  },

}

</script>

<style>
.name-column{
  width: 40%
}
.deadline-column{
  width: 25%
}
.status-column{
  width: 15%
}
.rsvp-column{
  width: 20%
}
</style>
