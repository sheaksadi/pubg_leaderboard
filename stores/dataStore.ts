import { defineStore } from 'pinia'
import axios from "axios";

export const useDataStore = defineStore('data', {
  state: () => ({
    discordUsers: [],
    members: [],
    onlineCount: 0,
  }),
  actions: {
    async init() {
      await this.getMembers();
      await this.getOnlineCount();
      await this.getDiscordUsers();
    },
    async getDiscordUsers() {
      const res = await axios.get('http://localhost:3100/api/discordUsers');
      this.discordUsers = res.data;
    },
    async getMembers() {
      const res = await axios.get('http://localhost:3100/api/members');
      this.members = res.data;
    },

    async getOnlineCount() {
      const res = await axios.get('http://localhost:3100/api/getOnlineCount');
      this.onlineCount = res.data.onlineCount;
    },

    async getTest() {

    }
  }
})
