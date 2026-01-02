import { createRouter, createWebHistory } from "vue-router";

import Login from "@/components/auth/Login.vue";
import Signup from "@/components/auth/Signup.vue";
import Search from "@/components/Search.vue";
import NewTournament from "@/components/tournaments/NewTournament.vue";
import Field from "@/components/Field.vue";
import Tournament from "@/components/tournaments/Tournament.vue";
import Schedule from "@/components/tournaments/Schedule.vue";
import Match from "@/components/match/Match.vue";
import Standing from "@/components/tournaments/Standing.vue";
import UsersList from "@/components/users/UsersList.vue";
import User from "@/components/users/User.vue";
import NewTeam from "@/components/team/NewTeam.vue";
import Team from "@/components/team/Team.vue";

const routes = [
  { path: "/", component: Search },
  { path: "/login", component: Login, meta: { hideNavBar: true } },
  { path: "/signup", component: Signup, meta: { hideNavBar: true } },
  { path: "/fields/:id", component: Field },
  { path: "/tournaments/new", component: NewTournament },
  { path: "/tournaments/:id", component: Tournament },
  { path: "/tournaments/:id/schedule", component: Schedule, props: true },
  { path: "/match/:id", component: Match, props: true },
  { path: "/tournament/:id/standings", component: Standing, props: true },
  { path: "/users", component: UsersList },
  { path: "/users/:id", component: User },
  { path: "/teams/new", component: NewTeam },
  { path: "/teams/:id", component: Team },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
