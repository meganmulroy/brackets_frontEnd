<template>
  <div id="invite" class="container text-center">
    <form id="tournamentForm" class="form-register" @submit.prevent="createInvite">
      <h1 class="h3 mb-3 font-weight-normal">Invite Player</h1>
      <div
        class="alert alert-danger"
        role="alert"
        v-if="registrationErrors"
      >There were problems inviting the players.</div>
      <div
        class="alert alert-danger"
        role="alert"
        v-if="duplicateEmail"
      >This player was already invited.</div>
      <div
        class="alert alert-danger"
        role="alert"
        v-if="nonexistentEmail"
      >This email is not a registered user.</div>
      <div
        class="alert alert-danger"
        role="alert"
        v-if="maxedOut"
      >This tournament is full; no more players can be added. </div>

      <div class="form-input">
        <label for="tournament" class="form-label">Tournament</label>
        <select
          class="form-control"
          @change="getInvitations(invite.tournamentId)"
          v-model="invite.tournamentId"
          name="ticket_invoice_no"
        >
          <option
            v-for="tournament in tourneyShouldNotShowUpPastRegDeadline"
            :key="tournament.id"
            :value="tournament.id"
          >{{ tournament.name }}</option>
        </select>
      </div>

      <div class="form-input">
        <label class="form-label">Player</label>
        <input
          type="text"
          class="form-control"
          v-model="invite.email"
          placeholder="Email of Invitee"
          required
        />
      </div>
      <button
        class="btn btn-lg btn-primary btn-block"
        type="submit"
        @click="getInvitations(invite.tournamentId)"
      >Invite Player</button>
      <router-link :to="{ name: 'home' }">Finished? Return to Home Page</router-link>
    </form>

    <div id="invitations">
      <h1 class="h3 mb-3 font-weight-normal">Invited Players</h1>

      <table class="table">
        <tr class="headings">
          <th class="half-column">Invited</th>
          <th class="half-column">Response</th>
        </tr>
        <tr v-for="(invite, index) in issuedInvitations" :key="index">
          <td>{{ invite.email }}</td>
          <td>{{ invite.response }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import auth from "@/auth.js";
import dates from 'date-fns'; 

export default {
  name: "invite",
  data() {
    return {
      users: [],
      user: {
        id: "",
        username: ""
      },
      selectedTournament: [],
      issuedInvitations: [],
      tournaments: [],
      tournament: {
        id: "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        regDeadline: "",
        type: "Single Elimination",
        participantMax: 0,
        sportId: 1
      },
      invite: {
        tournamentId: 0,
        email: "",
        response: "PENDING"
      },
      registrationErrors: false,
      duplicateEmail: false,
      nonexistentEmail: false,
      maxedOut: false,
      pastRegTourney: false
    };
  },
  methods: {
    createInvite() {
      
      this.findDuplicateEmail();
      if (this.duplicateEmail === false) {
        fetch(`${process.env.VUE_APP_REMOTE_API}/invite/createInvite`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.getToken()
          },
          body: JSON.stringify(this.invite)
        })
          .then(response => {
            if(response.ok){
              this.nonexistentEmail = false;
               return response.json();
            }else{
              
              this.nonexistentEmail = (response.status == 404);
              this.maxedOut = (response.status == 409);
            }
           
           
          })
          .then(parsedData => {
            if (parsedData) {
              this.issuedInvitations = parsedData;
              this.invite.email = "";
            }
          })
          .catch(err => console.log(err));
      }
    },

    getInvitations(id) {
      return fetch(`${process.env.VUE_APP_REMOTE_API}/invite/${id}`, {
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
            this.issuedInvitations = parsedData;
          }
        })
        .catch(err => console.log(err));
    },
    findDuplicateEmail() {
      if (
        this.issuedInvitations.filter(i => i.email === this.invite.email)
          .length > 0
      ) {
        this.duplicateEmail = true;
      } else {
        this.duplicateEmail = false;
      }
    },

  
  
    
  },
  computed: {
      tourneyShouldNotShowUpPastRegDeadline(){
      
      return this.tournaments.filter(i => dates.isFuture(dates.parse(i.regDeadline)))
      
    }

  },
  created() {
    fetch(`${process.env.VUE_APP_REMOTE_API}/tournaments`, {
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
        this.tournaments = parsedData;
      })
      .catch(err => console.log(err));
    }
  }


 </script>

<style>
#invite {
  display: flex;
  justify-content: space-around;
}
#formInvite {
  width: 50%;
}
#invitations {
  width: 40%;
}
.half-column {
  width: 50%;
}
</style>
