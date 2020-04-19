import Vue from 'vue'
import Router from 'vue-router'
import auth from './auth'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Tournaments from './views/Tournaments.vue'
import Profile from './views/Profile.vue'
import CreateTournament from './views/CreateTournament.vue'
import MyTournaments from './views/MyTournaments.vue'
import MyInvites from './views/MyInvites.vue'
import PastTournaments from './views/PastTournaments.vue'
import Invite from './views/Invite.vue'
import TournamentDetails from './views/TournamentDetails.vue'
import ManageTournament from './views/ManageTournament.vue'

Vue.use(Router)

/**
 * The Vue Router is used to "direct" the browser to render a specific view component
 * inside of App.vue depending on the URL.
 *
 * It also is used to detect whether or not a route requires the user to have first authenticated.
 * If the user has not yet authenticated (and needs to) they are redirected to /login
 * If they have (or don't need to) they're allowed to go about their way.
 */

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/tournaments/:list",
      name: "tournaments",
      component: Tournaments,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/tournament/:id",
      name: "tournament",
      component: TournamentDetails,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
    path: "/createTournament",
    name: "createTournament",
    component: CreateTournament,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile/tournaments",
    name: "myTournaments",
    component: MyTournaments,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile/tournaments/manage/:id",
    name: "manageTournament",
    component: ManageTournament,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile/invites",
    name: "myInvites",
    component: MyInvites,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile/pastTournaments",
    name: "pastTournaments",
    component: PastTournaments,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/invite",
    name: "invite",
    component: Invite,
    meta: {
      requiresAuth: true
    }
  },
  ]
})

router.beforeEach((to, from, next) => {
  // Determine if the route requires Authentication
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const user = auth.getUser();

  // If it does and they are not logged in, send the user to "/login"
  if (requiresAuth && !user) {
    next("/login");
  } else {
    // Else let them go to their next destination
    next();
  }
});

export default router;