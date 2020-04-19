<template>
  <div class="container">
    <div class="manageHead">
      <h1>{{ tournament.name }}</h1>
      <h2>{{ tournament.status }}</h2>
    </div>

    <div class="dates">
      <p>
        <span class="bold blue">Start Date:</span>
        {{tournament.startDate}}
      </p>
      <p>
        <span class="bold blue">End Date:</span>
        {{tournament.endDate}}
      </p>
      <p>
        <span class="bold blue">Registration Deadline:</span>
        {{tournament.regDeadline}}
      </p>
    </div>

    <div class="description">
      <p>
        <span class="bold blue">Tournament Description:</span>
        {{tournament.description}}
      </p>
    </div>

    <!-- <div class="playerDetails">
      <div>
        <span class="bold blue">Sport:</span>
        {{tournament.sportName}}
      </div>
      <div>
        <span class="bold blue">Spots Left:</span>
        {{tournament.spotsLeft}}/{{tournament.participantMax}}
      </div>
    </div> -->

    <div id="invites">
      <h4 class="title">Participating Players</h4>

      <div class="playerEmail">
        <div class="player" v-for="(invite, index) in sortAcceptedInvites" :key="index">{{invite.username}}</div>
      </div>
    </div>

    <tournament-bracket v-if="tournament.participantMax <= 32 && tournament.participantMax > 16"/>
    <sixteen-bracket v-if="tournament.participantMax <= 16 && tournament.participantMax > 8"/>
    <eight-bracket v-if="tournament.participantMax <= 8 && tournament.participantMax > 4"/>
    <four-bracket v-if="tournament.participantMax === 4"/>
  </div>
</template>

<script>
import auth from "@/auth.js";
import TournamentBracket from "@/components/TournamentBracket.vue";
import SixteenBracket from "@/components/SixteenBracket.vue";
import EightBracket from "@/components/EightBracket.vue";
import FourBracket from "@/components/FourBracket.vue";



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
      tournament: [],
      matches: [],
      acceptedInvites: [],
      invites: []
    };
  },
  methods: {
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
    handleBackButton() {
      this.$router.push({ name: "tournaments" });
    },
    getInvitations(id) {
      fetch(`${process.env.VUE_APP_REMOTE_API}/invite/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.getToken()
        }
      })
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(parsedData => {
          if (parsedData != null) {
            this.invites = parsedData;
          }
        })
        .catch(err => console.log(err));
    }
   
  },
  computed: {
    sortAcceptedInvites() {
      return this.invites.filter(invite => invite.response === 'ACCEPTED');
    }
  },
  created() {
    this.getTournament(this.$route.params.id);
    this.getInvitations(this.$route.params.id);
  }
};
</script>

<style>
.dates {
  display: flex;
  justify-content: space-between;
}

.playerDetails div {
  display: inline;
  margin-right: 20%;
}

.blue {
  color: #007bff;
}

.playerEmail {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.player {
  width: 25%;
}

#invites {
  margin-top: 2%;
}
</style>
