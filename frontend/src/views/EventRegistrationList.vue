<template>
  <div style="margin-top: 1rem">
    <p v-if="loading">⏳ Lade Anmeldungen...</p>
    <p v-if="!loading && registrations.length === 0">Keine Anmeldungen vorhanden.</p>

    <table v-if="registrations.length > 0" border="1" cellpadding="6">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Fragen</th>
          <th>Zahlung</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in registrations" :key="r.id">
          <td>{{ r.name }}</td>
          <td>{{ r.email }}</td>
          <td>{{ r.questions_suggestions }}</td>
          <td>{{ r.payment_method }}</td>
          <td>{{ r.created_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["slug"],
  data() {
    return {
      registrations: [],
      loading: false,
    };
  },
  watch: {
    slug: {
      immediate: true,
      handler(newSlug) {
        if (newSlug) {
          this.loadRegistrations(newSlug);
        }
      },
    },
  },
  methods: {
    async loadRegistrations(slug) {
      this.loading = true;
      try {
        const res = await axios.get(`http://localhost:5000/admin/registrations/${slug}`);
        this.registrations = res.data;
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
