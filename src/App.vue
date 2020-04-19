<template>
  <div id="main">
    <header id="header">
      <ul class="nav">
        <li><router-link :to="{name: 'home'}" class="logo" exact>Bracket <span class="bold">Master</span></router-link></li>
        <li><router-link :to="('/tournaments/current')" >Tournaments</router-link></li>
        <li><router-link :to="{name: 'createTournament'}" >Create Tournament</router-link></li>
      </ul>
      <ul class="nav navRight">
        <li v-if="!user"><router-link :to="{name: 'login'}">Login</router-link></li>
        <li v-if="user">
          <router-link :to="{name: 'profile'}">Hello, {{ user.username }}!</router-link>
        </li>

        <li v-if="user" @click="logout"><router-link :to="{name: 'login'}">Logout</router-link></li>
      </ul>
    </header>
    <div id="body">
    <router-view :apiPath="apiPath" @updateNavBar="updateNavBar" @checkLoggedIn="checkLoggedIn"/>
    </div>
    <footer id="footer">
      <span>©2019 MAAD Productions LLC.</span>
    </footer>
  </div>
</template>

<script>
// Need to install for project to work:
// npm install date-fns --save
// -megan


import auth from '@/auth.js'
import ProfileService from '@/ProfileService.js'

export default {
  name: 'home',
  data() {
    return {
      loggedIn: false,
      user: auth.getUser(), 
      apiPath: process.env.VUE_APP_REMOTE_API
    }
  },
  methods: {
    logout() {
      auth.logout();
      this.user = null;
      this.$router.push('/login');
      // this.user = [];
      // this.user = null;
      this.loggedIn = false;
    },
    updateNavBar() {
      // console.log("updateNavBar: " + auth.getToken());
      if (auth.getToken() != null) {
      ProfileService.getUser()
      .then((user) => {
          this.user = user;
      });
      }
    },
    checkLoggedIn() { 
      if (this.user == null) { 
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    }
  },
  created() { 
    this.updateNavBar();
    this.checkLoggedIn();
  }
}
</script>

<style>
html,
body {
   margin:0;
   padding:0;
   height:100%;
}
#main {
  min-height:100%;
  position:relative;
  background-color: #fff;
  background-image: linear-gradient(315deg, #fff 0%, #fdfdfd 74%);
}

#body {
  height: 100%;
  padding-bottom:88px;
}

.container{
  padding-top: 125px;
  padding-bottom: 50px;
}
.content {
  width:800px;
  margin: 20px auto !important;
}
.bold{
  font-weight: bold;
}
.logo {
  font-size: 1.6em;
}
#header {
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #2a2e37;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  box-shadow: 0px 3px 10px rgba(0,0,0,.8);
  z-index: 12;
}
.nav {
  width: 45%;
  display: inline-block;
  margin:0;
  padding:0;
  list-style-type: none;
  display: flex;
  justify-content: flex-start;
}
.navRight {
  justify-content: flex-end;
}
.nav li {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0;
  color: #fff;
  background-color: #2a2e37;
}

.nav li a {
  display: flex;
  padding: 20px;
  height: 88px;
  color: #fff;
  text-decoration: none;
  align-items: center;

}
.nav li:hover {
  background-color: rgb(216, 216, 216);
  cursor: pointer;
  color:rgb(44, 44, 44);
}
.nav li a:hover {
  background-color: rgb(216, 216, 216);
  cursor: pointer;
  color:rgb(44, 44, 44);
}
.nav .router-link-active {
  background-color: #f07138;
}
.form-input{
  margin-top: 20px;
  margin-bottom: 20px;
}
.form-label{
    display: block;
    text-align: left;
    margin: 0;
    text-transform: uppercase;
    font-size: .8em;
    color: #f07138;
}
#footer {
  position:absolute;
  bottom:0;
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: .8em;
  background-color: #2a2e37;
  color: white;
  text-align: center;
  height: 88px;
  box-shadow: 0px -3px 10px rgba(0,0,0,.8);
}
</style>

