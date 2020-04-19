<template>
  <div class="container">
      <div>
        <input type="text" class="searchBar form-control" placeholder="Search Tournaments by Name" v-model="searchText" />
      </div>

    <table class="table">
      <nav class="links">
        <tr>
            <router-link to="/tournaments/current" tag="th" class="subnav">Current Tournaments</router-link>
            <router-link to="/tournaments/past" tag="th" class="subnav">Past Tournaments</router-link>
            <router-link to="/tournaments/future" tag="th" class="subnav">Future Tournaments</router-link>
        </tr>
      </nav>
    </table>

    <h3>{{title}}</h3>
    <table class="table">
      <tr>
        <th class="name-column">Tournament</th>
        <th class="start-column">Start</th>
        <th class="end-column">End</th>
        <th class="type-column">Type</th>
        <th class="status-column">Status</th>
      </tr>
      <tr v-for="(tournament, index) in filterTournaments" :key="index">
        <router-link :to="{name: 'tournament', params: {id: tournament.id}}" class="subnav" tag="td">{{tournament.name}}</router-link>
        <td>{{tournament.startDate}}</td>
        <td>{{tournament.endDate}}</td>
        <td>{{tournament.type}}</td>
        <td>{{tournament.status}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    apiPath: String
  },
  data() {
    return {
      tournaments: [],
      searchText: '',
      sortBy: "name"
    };
  },
  computed: {
    title() {
      if (this.$route.params.list === "current") {
        return "Current Tournaments";
      }
      if (this.$route.params.list === "past") {
        return "Past Tournaments";
      } 
      else {
        return "Future Tournaments";
      }
    },
    filterTournaments() {
      return this.tournaments.filter(tourney => 
        tourney.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
    }
  },

  methods: {

    loadTournaments(currentRoute) {
      if (currentRoute.params.list === "past") {
        fetch(this.apiPath + "/tournaments/past")
          .then(response => {
            return response.json();
          })
          .then(parsedData => {
            this.tournaments = parsedData;
          })
          .catch(err => console.log(err));
      } else if (currentRoute.params.list === "future") {
        fetch(this.apiPath + "/tournaments/future")
          .then(response => {
            return response.json();
          })
          .then(parsedData => {
            this.tournaments = parsedData;
          })
          .catch(err => console.log(err));
      } else {
        fetch(this.apiPath + "/tournaments/current")
          .then(response => {
            return response.json();
          })
          .then(parsedData => {
            this.tournaments = parsedData;
          })
          .catch(err => console.log(err));
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.loadTournaments(to);
    next();
  },
  created() {
    this.loadTournaments(this.$route);
  }
};
</script>

<style>
.form-inline {
  padding-bottom: 20px;
}
form .form-control {
  width: 500px;
  margin-right: 10px;
}
.searchBar {
  margin-bottom: 20px;
}
.subnav {
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
}
.table .links .subnav.router-link-exact-active {
  color: white;
  background-color: #007bff;
}
.name-column{
  width: 35%;
}
.start-column{
  width: 15%;
}
.end-column{
  width: 15%;
}
.type-column{
  width: 15%;
}
.status-column{
  width: 15%;
}
</style>