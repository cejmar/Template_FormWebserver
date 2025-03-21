<template>
    <div style="max-width: 400px; margin: 4rem auto; font-family: sans-serif">
      <h2>Admin-Login</h2>
      <form @submit.prevent="login">
        <div>
          <label>Benutzername</label>
          <input v-model="username" required />
        </div>
        <div>
          <label>Passwort</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p v-if="error" style="color: red">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        username: "",
        password: "",
        error: "",
      };
    },
    methods: {
      async login() {
        try {
          const res = await axios.post("http://localhost:5000/admin/login", {
            username: this.username,
            password: this.password,
          });
  
          if (res.data.success) {
            localStorage.setItem("admin_user", JSON.stringify(res.data.user));
            this.$router.push("/admin/panel");
          } else {
            this.error = "Login fehlgeschlagen.";
          }
        } catch (err) {
          this.error = "Fehler beim Login.";
        }
      },
    },
  };
  </script>
  