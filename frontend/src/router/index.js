import { createRouter, createWebHistory } from "vue-router";

import Login from "@/components/auth/Login.vue";
import Signup from "@/components/auth/Signup.vue";
import Search from "@/components/Search.vue";
import NewTournament from "@/components/tournaments/NewTournament.vue";
import Field from "@/components/Field.vue";
import Tournament from "@/components/tournaments/Tournament.vue";

const routes = [
  { path: "/", component: Search },
  { path: "/login", component: Login, meta: { hideNavBar: true } },
  { path: "/signup", component: Signup, meta: { hideNavBar: true } },
  { path: "/tournaments/new", component: NewTournament },
  { path: "/fields/:id", component: Field },
  { path: "/tournaments/:id", component: Tournament },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
