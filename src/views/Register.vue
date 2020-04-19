<template>
  <div id="register" class="container text-center">
    <form id="registrationForm" class="form-register" @submit.prevent="validate">
      <h1 class="h3 mb-3 font-weight-normal">Create Account</h1>
      <div class="alert alert-danger" role="alert" v-if="registrationErrors">
        Username or Email already taken.
      </div> 
      <div class="alert alert-danger" role="alert" v-if="passwordErrors">
        Passwords did not match.
      </div>
      <div class="alert alert-danger" role="alert" v-if="emailErrors">
        Emails did not match.
      </div>
      <div class="form-input">
      <label for="username" class="form-label">Username</label>
      <input
        type="text"
        id="username"
        class="form-control"
        placeholder="Username"
        v-model="user.username"
        required
        autofocus
      />
      </div>
      <div class="form-input">
      <label for="password" class="form-label">Password</label>
      <input
        type="password"
        ref="password"
        class="form-control"
        placeholder="Password"
        v-model="user.password"
        required
      />
      </div>
      <div class="form-input">
      <label for="confirmpassword" class="form-label">Confirm Password</label>
      <input
        type="password"
        ref="confirmPassword"
        class="form-control"
        placeholder="Confirm Password"
        v-model="user.confirmPassword"
        required
      />
      </div>
      <div class="form-input">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          ref="email"
          class="form-control"
          placeholder="Email"
          v-model="user.email"
          email
          required
        />
      </div>
      <div class="form-input">
      <label for="confirmemail" class="form-label">Confirm Email</label>
      <input
        type="email"
        ref="confirmEmail"
        class="form-control"
        placeholder="Confirm Email"
        v-model="user.confirmEmail"
        email
        required
      />
      </div>
      <div class="form-input">
      <router-link :to="{ name: 'login' }">
        Have an account?
      </router-link>
      <button class="btn btn-lg btn-primary btn-block" type="submit">
        Create Account
      </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      user: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        role: 'user',
      },
      registrationErrors: false,
      passwordErrors: false,
      emailErrors: false,
    };
  },
  methods: {
    validate() {
      if (this.confirmRegistration()) {
        this.register();
      }
    },
    register() {
      fetch(`${process.env.VUE_APP_REMOTE_API}/register`, {
        method: 'POST',

        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.user),
      })
        .then((response) => {
          if (response.ok) {
            return (response.json());
          } else {
            this.registrationErrors = true;
            throw 'Register returned: ' + response.status;
          }
        })
        .then ((parsedData) => {
            if (parsedData.success) {
              this.$router.push({ path: '/login', query: { registration: 'success' } });
            } else {
              this.registrationErrors = true;
            }
        })
        .catch((err) => console.log(err));
    },
    confirmRegistration() {

      const emailConfirmed = this.confirmFieldsMatch('email', 'confirmEmail');
      const passConfirmed = this.confirmFieldsMatch('password', 'confirmPassword');

      this.emailErrors = !emailConfirmed;
      this.passwordErrors = !passConfirmed;

      return emailConfirmed && passConfirmed;
    },

    confirmFieldsMatch(field1, field2) {
      return this.$refs[field1].value === this.$refs[field2].value;
    }

  },
};
</script>

<style>
#register {
  display: flex;
  justify-content: space-around;
}
</style>
