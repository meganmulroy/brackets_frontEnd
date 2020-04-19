<template>
  <div class="sect">
    <div id="homeMain">
      <div id="mainMessage">
      <h1>Create. Host. Join. Manage. Play.</h1>
      <p id="siteDescription">Host and create reliable tournaments with BracketMaster.
        Tournament organizers can register events, invite participants, schedule play, and do all the other things
        that go into managing a tournament.</p>
      </div>
    </div>
    <!-- <div id="testomonialsList">
      <p class="testomonial">"I clicked a few Majiggers and within minutes I had a fully functioning bracket." - Delaney B.</p>
      <p class="testomonial">"The best thing since Squirrel Cigar Parties for Dummies." - David P.</p>
      <p class="testomonial">"Made setting up my egg eating competition a breeze." - Brendan B.</p>
    </div> -->
      <div class="slider">
        <div class="slider-text1">"I clicked a few majiggers and within minutes I had a fully functioning bracket." — Delaney B.</div>
        <div class="slider-text2">"The best thing since Squirrel Cigar Parties for Dummies." — David P.</div>
        <div class="slider-text3">"Made setting up my egg eating competition a breeze." — Brendan B.</div>
      </div>
  </div>
</template>

<script>
import auth from '@/auth.js'

export default {
  name: 'home',
  props: {
    apiPath: String
  },
  data() {
    return {
      user: auth.getUser(),
      tournaments: [
        {
          name: 'Testing'
        },
        {
          name: 'Did not populate correctly'
        }
      ]
    }
  },
  methods: {
    logout() {
      auth.logout();
      this.$router.push('/login');
    }
  },
  created() {
      fetch(this.apiPath + '/tournaments')
      .then(response => {
        return response.json();
      })
      .then(parsedData => {
        this.tournaments = parsedData;
      })
      .catch(err => console.log(err));
    }
}
</script>

<style scoped>

#homeMain {
  display: flex;
  justify-content: center;
  flex-direction: row;
  min-height: 0;
  margin: 0 auto;
  padding-top: 120px;
  padding-bottom: 30px;
  color: #fff;
  text-align: center;
  background-color: #2a2e37;
  overflow: hidden;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGUlEQVQImWPo7OyUwoUZOjs7pRhwgcEmCQDMWxYyR2ZtqQAAAABJRU5ErkJggg==);
  width: 100%;  
}

#mainMessage {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin:0 30px 0 30px; 
  background: linear-gradient( rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65) ), url(http://benficapodcast.com/wp-content/uploads/2014/06/soccer-field-wallpaper-3.jpg);
  height: 225px;
}

h1, h2 {
  font-size: 1.8em;
  text-align: center;
  font-weight: bold;
}

#siteDescription {
  font-size: 1em;
  line-height: 27px;
  text-align: center;
  display: block;
  margin: 0px 100px 0px 100px
}

#testomonialsList {
  margin-top: 130px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.testomonial {
  font-size: 1em;
  line-height: 27px;
  text-align: center;
  display: block;
  margin: 0px 20px 10px 20px;
  width: 360px;
  font-weight: bold;
}

.slider {
  margin-top: 130px;
  height: 50px;
  overflow: hidden; 
  font-size: 1.5em;
}

.slider div{
  color: #2a2e37;
  height: 50px;
  margin-bottom: 50px;
  text-align: center;
  line-height: 27px;
  font-weight: bold;
}

.slider-text1{
  animation: slide 12s linear infinite;
}

@keyframes slide {
  0% {margin-top:-300px;}
  5% {margin-top:-200px;}
  33% {margin-top:-200px;}
  38% {margin-top:-100px;}
  66% {margin-top:-100px;}
  71% {margin-top:0px;}
  100% {margin-top:0px;}
}

</style>
