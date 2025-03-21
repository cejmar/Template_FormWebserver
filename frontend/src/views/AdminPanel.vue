<template>
    <div style="padding: 2rem; font-family: sans-serif">
      <h2>Admin-Panel</h2>
      <p>Willkommen, {{ user?.username }}</p>
      <button @click="logout">Logout</button>
      <div v-if="list.length > 0">
        <h3>Anmeldungen:</h3>
        <table border="1" cellpadding="6" style="margin-top: 1rem">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Zahlung</th>
              <th>Nachricht</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in list" :key="entry.id">
              <td>{{ entry.name }}</td>
              <td>{{ entry.email }}</td>
              <td>{{ entry.payment_method }}</td>
              <td>{{ entry.questions_suggestions }}</td>
              <td>{{ entry.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        user: null,
        list: [],
      };
    },
    mounted() {
      const user = JSON.parse(localStorage.getItem("admin_user"));
      if (!user) {
        this.$router.push("/admin");
        return;
      }
  
      this.user = user;
  
      axios.get("http://localhost:5000/admin/registrations").then((res) => {
        this.list = res.data;
      });
    },
    methods: {
      logout() {
        localStorage.removeItem("admin_user");
        this.$router.push("/admin");
      },
    },
  };
  </script>
  