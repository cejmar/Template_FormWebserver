<template>
  <main style="max-width: 600px; margin: 2rem auto; font-family: sans-serif">
    <h1>{{ organizationName }} Anmeldung</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label>Name*</label>
        <input v-model="form.name" required />
      </div>
      <div>
        <label>Email*</label>
        <input type="email" v-model="form.email" required />
      </div>
      <div>
        <label>Fragen oder Wünsche</label>
        <textarea v-model="form.questions_suggestions"></textarea>
      </div>
      <div>
        <label>Zahlungsmethode</label>
        <select v-model="form.payment_method">
          <option>Bar</option>
          <option>Überweisung</option>
          <option>Paypal</option>
        </select>
      </div>
      <!-- Honeypot -->
      <input v-model="form.honeypot" style="display: none" autocomplete="off" />

      <button type="submit">Anmelden</button>
      <p v-if="message">{{ message }}</p>
    </form>
  </main>
</template>

<script>
import axios from "axios";
import.meta.env.VITE_ORGANIZATION_NAME

export default {
  data() {
    return {
      organizationName: import.meta.env.VITE_ORGANIZATION_NAME,
      form: {
        name: "",
        email: "",
        questions_suggestions: "",
        payment_method: "",
        honeypot: "",
      },
      message: "",
    };
  },
  methods: {
    async submitForm() {
      try {
        const res = await axios.post(
          "http://localhost:5000/register",
          this.form
        );
        this.message = "🎉 Erfolgreich angemeldet!";
      } catch (err) {
        this.message = "❌ Fehler beim Absenden!";
      }
    },
  },
};
</script>
