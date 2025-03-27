<template>
    <form @submit.prevent="submitEvent" style="margin-top: 1rem">
      <h3>➕ Neues Event erstellen</h3>
  
      <div style="margin-bottom: 1rem">
        <label>Eventname*</label>
        <input v-model="form.name" required />
      </div>
  
      <div style="margin-bottom: 1rem">
        <label>Url Name *</label>
        <input v-model="form.slug" required placeholder="www.xxx.de/events/<url name>" />
      </div>
  
      <div style="margin-bottom: 1rem">
        <label>Anmeldestart*</label>
        <input type="datetime-local" v-model="form.start_date" required />
      </div>
  
      <div style="margin-bottom: 1rem">
        <label>Anmeldeende*</label>
        <input type="datetime-local" v-model="form.end_date" required />
      </div>
  
      <button type="submit">Event anlegen</button>
      <p v-if="message" :style="{ color: success ? 'green' : 'red' }">{{ message }}</p>
    </form>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        form: {
          name: "",
          slug: "",
          start_date: "",
          end_date: "",
        },
        message: "",
        success: false,
      };
    },
    methods: {
      async submitEvent() {
        this.message = "";
        this.success = false;
  
        try {
          await axios.post("http://localhost:5000/admin/events", this.form);
          this.success = true;
          this.message = "✅ Event erfolgreich erstellt!";
          this.$emit("created"); // <-- informiert AdminPanel, dass es neu laden soll
          this.resetForm();
        } catch (err) {
          console.error(err);
          this.message = "❌ Fehler beim Erstellen des Events.";
        }
      },
      resetForm() {
        this.form = {
          name: "",
          slug: "",
          start_date: "",
          end_date: "",
        };
      },
    },
  };
  </script>
  