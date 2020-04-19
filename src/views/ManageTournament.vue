<template>
  <div class="container">
    <div class="manageHead">
      <h1>{{ tournament.name }}</h1>
      <h2>{{ tournament.status }}</h2>
    </div>
    <!-- //////////////////////// -->
    <!-- Button needs to grey out once bracket is created!!! -->
    <!-- //////////////////////// -->
    <!-- <button v-if="!generateButtonPressed" @click.prevent="createBracket(tournament.id)" >
        GENERATE BRACKET</button> -->
    <button @click.prevent="createMatchups(tournament.id)">
        ASSIGN PLAYERS</button>

    <table class="table">
      <nav class="links">
        <tr class="full-width">
          <router-link :to="{name: 'invite'}" tag="th" class="subnav">Manage Invites</router-link>
          <!-- <router-link :to="('/profile/tournaments')" tag="th" class="subnav">Matches</router-link>
          <router-link :to="('/profile/invites')" tag="th" class="subnav">Bracket</router-link> -->
        </tr>
      </nav>
    </table>

    <tournament-bracket v-if="tournament.participantMax <= 32 && tournament.participantMax > 16"/>
    <sixteen-bracket v-if="tournament.participantMax <= 16 && tournament.participantMax > 8"/>
    <eight-bracket v-if="tournament.participantMax <= 8 && tournament.participantMax > 4"/>
    <four-bracket v-if="tournament.participantMax === 4"/>
    
    </div>

    

</template>

<script>
import TournamentBracket from "@/components/TournamentBracket.vue";
import SixteenBracket from "@/components/SixteenBracket.vue";
import EightBracket from "@/components/EightBracket.vue";
import FourBracket from "@/components/FourBracket.vue";
import auth from "@/auth.js";

export default {
  components: {
    TournamentBracket,
    SixteenBracket,
    EightBracket,
    FourBracket
  },
  props: {
    apiPath: String
  },
  data() {
    return {
      generateButtonPressed: false,
      playersAssigned: false,
      user: auth.getUser(),
      tournament: [],
      matches: []
    };
  },
  methods: {
    createBracket(id) {
      fetch(`${this.apiPath}/bracket/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.getToken()
        }
      })
        .then(response => {
          return response.json();
        })
        .then(parsedData => {
          this.matches = parsedData;
          this.generateButtonPressed = true;
        })
        .catch(err => console.log(err));
    },
    createMatchups(id) {
        fetch(`${this.apiPath}/bracket/matchups/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.getToken()
          }
        })
          .then(response => {
            return response.json();
          })
          .then(parsedData => {
            this.matches = parsedData;
            this.playersAssigned = true;
          })
          .catch(err => console.log(err))
    },
    getTournament(id) {
      fetch(`${this.apiPath}/tournaments/${id}`)
        .then(response => {
          console.log(id);
          return response.json();
        })
        .then(tournament => {
          this.tournament = tournament;
        })
        .catch(err => console.log(err));
    },
  },
  created() {
        this.getTournament(this.$route.params.id);
  }
};
</script>

<style>
.full-width {
  width: 100%;
  border-top: 1px solid #dee2e6;
}
.full-width th {
  border: 0px;
}
.manageHead {
  display: flex;
  justify-content: space-between;
}
.manageHead h2 {
  text-transform: uppercase;
  margin: auto 0;
}
</style>
