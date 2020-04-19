<template>
  <div id="create" class="container text-center">
    <form id="tournamentForm" class="form-register" @submit.prevent="validate">
      <h1 class="h3 mb-3 font-weight-normal">Create Tournament</h1>
      <!-- <div
        class="alert alert-danger"
        role="alert"
        v-if="registrationErrors"
      >There were problems creating your tournament.</div> -->
      <div class="form-input">
      <div class="alert alert-danger" role="alert" v-if="regDeadlineErrors">
        Registration Deadline cannot be after Start date.
      </div>
      <div class="alert alert-danger" role="alert" v-if="startDateErrors">
        Tournament Start must be before or on End date.
      </div>
      <div class="alert alert-danger" role="alert" v-if="tournamentDateErrors">
        Tournament cannot take place in the past.
      </div>
      <div class="alert alert-danger" role="alert" v-if="participantErrors">
        Number of Participants must be between 4 and 32.
      </div>
        <label for="name" class="form-label">Tournament Name</label>
        <input
            type="text"
            class="form-control"
            placeholder="Tournament Name"
            v-model="tournament.name"
            required
            autofocus
        />
      </div>
      <div class="form-input">
        <label for="description" class="form-label">Tournament Description</label>
        <input
            type="text"
            class="form-control"
            placeholder="Tournament Description"
            v-model="tournament.description"
            required
        />
      </div>
      <div class="form-input">
        <label for="startDate" class="form-label">Tournament Start</label>
        <input
            type="date"
            ref="startDate"
            class="form-control"
            placeholder="Tournament Start"
            v-model="tournament.startDate"
        />
      </div>
      <div class="form-input">
        <label for="endDate" class="form-label">Tournament End</label>
        <input
            type="date"
            ref="endDate"
            class="form-control"
            placeholder="Tournament End"
            v-model="tournament.endDate"
        />
      </div>
      <div class="form-input">
        <label for="regEnd" class="form-label">Registration Deadline</label>
        <input
            type="date"
            ref="regDeadline"
            class="form-control"
            placeholder="Registration Deadline"
            v-model="tournament.regDeadline"
        />
      </div>
      <!-- <div class="form-input">
        <label for="tournamentType" class="form-label">Tournament Type</label>
        <select
            class="form-control"
            v-model="tournament.type"
            required
            name="tournamentType"
        >
            <option value="0" selected="selected">Single Elimination</option>
        </select>
      </div> -->
      <div class="form-input">
        <label for="activity" class="form-label">Activity From Database</label>
        <select
            type="text"
            class="form-control"
            placeholder="Single Elimination"
            v-model="tournament.sportId"
            required
        >
        <option v-for="activity in activities" :value="activity.id" v-bind:key="activity.id" >
            {{ activity.name }}
          </option>
        </select>
      </div>
      <div class="form-input">
        <label for="participantMax" class="form-label">Max Participants (Up to 32)</label>
        <input
            type="number"
            ref="participantCount"
            class="form-control"
            placeholder="Max Participants Up to 32"
            v-model="tournament.participantMax"
            required
        />
      </div>
      <div class="form-input">
        <label for="organizerPlayer" class="form-label">Will you participate in this tournament?</label>
        <select
            type="text"
            class="form-control"
            placeholder="Single Elimination"
            v-model="tournament.participate"
            required
        >
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Create Tournament</button>

    </form>
  </div>
</template>

<script>
import auth from '@/auth.js';
import dates from 'date-fns';

export default {
  name: 'tournament',
  data() {
    return {
      user: auth.getUser(),
      activities: {
        id: '',
        name: ''
      },
      tournament: {
        id: '',
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        regDeadline: '',
        type: 'Single Elimination',
        participantMax: 0,
        sportId: 1,
        participate: '',
      },
      invite: {
        tournamentId: '',
        email: '',
        response: "PENDING"
      },
      participantErrors: false,
      regDeadlineErrors: false,
      startDateErrors: false,
      tournamentDateErrors: false,
    };
  },
  methods: {
    validate() {
      if (this.confirmCreateTournament()) {
        this.createTournament();
      }
    },

    confirmCreateTournament() {

      const participantsConfirmed = this.confirmParticipants('participantCount');
      const regDeadlineConfirmed = this.confirmRegDeadline('regDeadline', 'startDate', 'endDate');
      const startDateConfirmed = this.confirmStartDate('startDate', 'endDate');
      const tournamentDateConfirmed = this.confirmTournamentDate('regDeadline')

      this.participantErrors = !participantsConfirmed;
      this.regDeadlineErrors = !regDeadlineConfirmed;
      this.startDateErrors = !startDateConfirmed;
      this.tournamentDateErrors = !tournamentDateConfirmed;

      return participantsConfirmed && regDeadlineConfirmed && startDateConfirmed && tournamentDateConfirmed;
    },
    confirmParticipants(field1) {
        return this.$refs[field1].value >= 4 && this.$refs[field1].value <= 32;
    },
    confirmRegDeadline(field1, field2, field3){
      return this.$refs[field1].value <= this.$refs[field2].value && this.$refs[field1].value <= this.$refs[field3].value;
    },
    confirmStartDate(field2, field3){
      return this.$refs[field2].value <= this.$refs[field3].value;
    },
     confirmTournamentDate(field1){
       return  dates.isFuture(dates.parse(this.$refs[field1].value)) || dates.isToday(dates.parse(this.$refs[field1].value));
    },
    createTournament() {

      fetch(`${process.env.VUE_APP_REMOTE_API}/tournaments/createTournament`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.getToken(),
        },
        body: JSON.stringify(this.tournament),
      })
        .then((response) => {
            return (response.json());
        })
        .then ((parsedData) => {
            if (parsedData) {
            this.$router.push({ path: '/invite'});
            }
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
      fetch(`${process.env.VUE_APP_REMOTE_API}/sports`)
      .then(response => {
        return response.json();
      })
      .then(parsedData => {
        this.activities = parsedData;
      })
      .catch(err => console.log(err));
  }
}

</script>

<style>
#create {
  display: flex;
  justify-content: space-around;
}
</style>
