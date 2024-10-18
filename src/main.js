import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Home from "./components/Home.vue";
import Tutorials from "./components/Tutorials.vue";
import Profile from "./components/Profile.vue";
import SignIn from "./components/SignIn.vue";
import { supabase } from "./utils/supabase";
import AboutUs from "./components/AboutUs.vue";
import Legal from "./components/Legal.vue";
import TutorialView from "./components/TutorialView.vue";
import "./index.css";

const routes = [
  { path: "/", component: Home },
  { path: "/tutorials", component: Tutorials },
  { path: "/tutorials/:id", name: "TutorialView", component: () => import('./components/TutorialView.vue'), meta: { requiresAuth: true } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/signin", component: SignIn },
  { path: "/about", component: AboutUs },
  { path: "/legal", component: Legal },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (to.matched.some((record) => record.meta.requiresAuth) && !session) {
    next("/signin");
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.mount("#app");

console.log("Vue app mounted");
