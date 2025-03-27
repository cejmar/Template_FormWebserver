<template>
    <div style="padding: 2rem">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1>🛠️ Admin Panel</h1>
        <button @click="logout" style="padding: 0.5rem 1rem">🚪 Logout</button>
      </div>
  
      <button @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? "Formular schließen" : "➕ Neuen Event erstellen" }}
      </button>
  
      <EventCreateForm v-if="showCreateForm" @created="fetchEvents" />
  
      <hr style="margin: 2rem 0" />
      
      <h1>Events</h1>
      <hr style="margin: 2rem 0" />
      <div v-for="event in events" :key="event.id" style="margin-bottom: 2rem">
        <h2>{{ event.name }} ({{ event.slug }})</h2>
        <p>🗓️ Anmeldung: {{ event.start_date }} bis {{ event.end_date }}</p>
  
        <button @click="toggleEvent(event.slug)">
          {{ expandedSlug === event.slug ? "▲ Verstecke Teilnehmer" : "👥 Zeige Teilnehmer" }}
        </button>
  
        <EventRegistrationList
          v-if="expandedSlug === event.slug"
          :slug="event.slug"
        />
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import EventRegistrationList from "./EventRegistrationList.vue";
  import EventCreateForm from "./EventCreateForm.vue";
  
  export default {
    components: {
      EventRegistrationList,
      EventCreateForm,
    },
    data() {
      return {
        events: [],
        expandedSlug: null,
        showCreateForm: false,
      };
    },
    methods: {
      async fetchEvents() {
        const res = await axios.get("http://localhost:5000/events");
        this.events = res.data;
      },
      toggleEvent(slug) {
        this.expandedSlug = this.expandedSlug === slug ? null : slug;
      },
      logout() {
        localStorage.removeItem("admin_user");
        this.$router.push("/admin/login");
      },
      checkLogin() {
        const user = JSON.parse(localStorage.getItem("admin_user"));
        if (!user) {
          this.$router.push("/admin/login");
        }
      },
    },
    mounted() {
      this.checkLogin();
      this.fetchEvents();
    },
  };
  </script>
  