import { reactive } from "vue";

export const auth = reactive({
  username: null,
  authenticated: false,
  _id: "",
  async fetchUser() {
    const response = await fetch("/api/whoami", { credentials: "include" });
    if (response.ok) {
      const data = await response.json();
      this.username = data.username;
      this.authenticated = true;
      this._id = data._id;
    } else {
      this.username = null;
      this.authenticated = false;
      this._id = null;
    }
  },
});
