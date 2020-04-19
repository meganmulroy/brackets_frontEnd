<template>
  <div>
    
    <section id="bracket">
      <div class="container">
        <div class="split split-one">
          <div class="round round-one current">
            <div class="round-details">Round 1</div>

            <ul v-if="detailMatches.length > 0" class="matchup">
              <li v-for="(match, index) in rdOneMatches" :key="index" class="team">{{ match.username }}<span v-if="match.winner" class="score">W</span></li>
            </ul>
          </div>

          <div class="round round-two current">
            <div class="round-details">Round 2</div>
            <ul v-if="detailMatches.length > 8" class="matchup">
              <li v-for="(match, index) in rdTwoMatches" :key="index" class="team">{{ match.username }}<span v-if="match.winner" class="score">W</span></li>
            </ul>
            </div>
          </div> 

          <div class="round round-three current">
            <div class="round-details">Championship</div>
            <ul v-if="detailMatches.length > 10" class="matchup">
              <li v-for="(match, index) in championshipMatch" :key="index" class="team">{{ match.username }}<span v-if="match.winner" class="score">W</span></li>
            </ul>
          </div>
      </div>
    </section>

    <div v-if="(this.$route.name == 'manageTournament')">
        <h3>Result form</h3>
        <div class="form-input">
          <div class="form-options">
            <div class="half-page">
              <label for="tournament" class="form-label">Select Round</label>
              <select class="form-control" v-model="selectedRound" name="ticket_invoice_no">
                <option :value="currentRoundOneList">Round 1 </option>
                <option :value="currentRoundTwoList">Round 2</option>
                <option :value="currentRoundThreeList">Championship</option>
              </select>
            </div>
            <div class="half-page">
              <label for="tournament" class="form-label">Select Winner</label>
              <select
                class="form-control"
                v-model="selectedMatch"          
                name="ticket_invoice_no">
                <option
                v-for="(match, index) in selectedRound"
                :key="index"
                :value="match">
                    {{ match.username }}
                </option>
              </select>
            </div>
          </div>
          <button
              class="btn btn-primary"
              type="submit"
              @click.prevent="updateBracketResults(match)">
              Submit Winner
          </button>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/auth.js";

export default {
  props: {
    apiPath: String,
  },
  data() {
    return {
      selectedMatch: null,
      selectedRound: null,
      user: auth.getUser(),
      tournament: [],
      emptyMatches: [],
      detailMatches: []
    };
  },
  computed: {
    rdOneMatches() {
      return this.detailMatches.filter(match => match.round === 1);
    },
    rdTwoMatches() {
      return this.detailMatches.filter(match => match.round === 2)
    },
    championshipMatch() {
      return this.detailMatches.filter(match => match.round === 3)
    },
    currentRoundOneList() {return this.detailMatches.filter(match => match.round === 1 && match.completed === false && match.username != null)},
    currentRoundTwoList() {return this.detailMatches.filter(match => match.round === 2 && match.completed === false && match.username != null)},
    currentRoundThreeList() {return this.detailMatches.filter(match => match.round === 3 && match.completed === false && match.username != null)},

  },
  methods: {
    getMatchDetails(id) {
      fetch(`http://localhost:8080/AuthenticationApplication/bracket/matches/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.getToken()
        }
      })
        .then(response => {
          console.log(id);
          return response.json();
        })
        .then(parsedData => {
          this.detailMatches = parsedData;
        })
        .catch(err => console.log(err));
    }, 
    updateBracketResults() { 
      fetch(`http://localhost:8080/AuthenticationApplication/bracket`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.getToken()
        },
        body: JSON.stringify(this.selectedMatch)
        })
        .then(response => {
          return response.json();
        })
        .catch(error => console.error('Error: ', error))
        .then(parsedData => {
          this.detailMatches = parsedData;
        })
      }
  },
  created() {
    this.getMatchDetails(this.$route.params.id);
  }
};
</script>

<style scoped>
h3{
  margin-top: 20px;
  margin-bottom: 0;
}
.form-options{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.half-page {
  width: 48%;
}
li:nth-child(even) { 
  margin-bottom: 20px;
}
#bracket {
  overflow: hidden;
  background-color: #2a2e37;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGUlEQVQImWPo7OyUwoUZOjs7pRhwgcEmCQDMWxYyR2ZtqQAAAABJRU5ErkJggg==);
  padding-top: 20px;
  font-size: 12px;
  padding: 10px 0;
}
.container {
  padding: 2%;
  max-width: 1100px;
  margin: 0 auto;
  display: block;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
}
.split {
  display: block;
  float: left;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  width: 100%;
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  flex-direction: row;
}
.round {
  display: block;
  float: left;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  width: 95%;
  width: 30.8333%\9;
}
.split-one .round {
  margin: 0 2.5% 0 0;
}
.matchup {
  margin: 0;
  width: 80%;
  padding: 10px 0;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}
.score {
  font-size: 11px;
  text-transform: uppercase;
  float: right;
  color: #f07138;
  font-weight: bold;
  font-family: "Roboto Condensed", sans-serif;
  position: absolute;
  right: 5px;
}
.team {
  padding: 0 5px;
  margin: 3px 0;
  height: 25px;
  line-height: 25px;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}
.round-two .matchup {
  margin: 0;
  height: 60px;
  padding: 50px 0;
}
.round-three .matchup {
  margin: 0;
  height: 60px;
  padding: 100px 0;
}
.round-details {
  font-family: "Roboto Condensed", sans-serif;
  font-size: 13px;
  color: #f07138;
  text-transform: uppercase;
  text-align: center;
  height: 40px;
}
.current li {
  opacity: 1;
}
.current li.team {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  opacity: 1;
}
.vote-options {
  display: block;
  height: 52px;
}
.share .container {
  margin: 0 auto;
  text-align: center;
}
.share-icon {
  font-size: 24px;
  color: #fff;
  padding: 25px;
}
.share-wrap {
  max-width: 1100px;
  text-align: center;
  margin: 60px auto;
}
.final {
  margin: 4.5em 0;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  50% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }

  50% {
    -webkit-transform: scale(1.3);
    -ms-transform: scale(1.3);
    transform: scale(1.3);
  }

  100% {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}

.share-icon {
  color: #fff;
  opacity: 0.35;
}
.share-icon:hover {
  opacity: 1;
  -webkit-animation: pulse 0.5s;
  animation: pulse 0.5s;
}

@media screen and (min-width: 981px) and (max-width: 1099px) {
  .container {
    margin: 0 1%;
  }
  .champion {
    width: 14%;
  }
  .split {
    width: 43%;
  }
  .split-one .vote-box {
    margin-left: 138px;
  }
  .hero p.intro {
    font-size: 28px;
  }
  .hero p.year {
    margin: 5px 0 10px;
  }
}

@media screen and (max-width: 980px) {
  .container {
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    flex-direction: column;
  }
  .split,
  .champion {
    width: 90%;
    margin: 35px 5%;
  }
  .champion {
    -webkit-box-ordinal-group: 3;
    -moz-box-ordinal-group: 3;
    -ms-flex-order: 3;
    -webkit-order: 3;
    order: 3;
  }
  .split {
    border-bottom: 1px solid #b6b6b6;
    padding-bottom: 20px;
  }
  .hero p.intro {
    font-size: 24px;
  }
  .hero h1 {
    font-size: 3em;
    margin: 15px 0;
  }
  .hero p {
    font-size: 1em;
  }
}

@media screen and (max-width: 400px) {
  .split {
    width: 95%;
    margin: 25px 2.5%;
  }
  .round {
    width: 21%;
  }
  .current {
    -webkit-flex-grow: 1;
    -moz-flex-grow: 1;
    flex-grow: 1;
  }
  .hero h1 {
    font-size: 2.15em;
    letter-spacing: 0;
    margin: 0;
  }
  .hero p.intro {
    font-size: 1.15em;
    margin-bottom: -10px;
  }
  .round-details {
    font-size: 90%;
  }
  .hero-wrap {
    padding: 2.5em;
  }
  .hero p.year {
    margin: 5px 0 10px;
    font-size: 18px;
  }
}
</style>