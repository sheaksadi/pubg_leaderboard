import {pinia} from "~/stores/pinia";
import {defineStore} from "pinia";
import axios from "axios";
import type {SessionData, User} from "~/types";


export const useAuthStore = defineStore('auth', {
    // State
    state: () => ({
        session: null as User | null,
        status: 'loading' as 'loading' | 'authorization' | 'unauthorization',
    }),

    // Actions
    actions: {
        async signIn() {
            this.status = 'authorization';
            console.log("sign in");
            window.location.href = `http://localhost:3100/api/auth/login`;
        },

        async signOut() {
            try {
                await axios.post('http://localhost:3100/api/auth/logout', {}, { withCredentials: true });
                this.session = null;
                this.status = 'unauthorization';
            } catch (error) {
                console.error('Failed to sign out:', error);
            }
        },

        async getSession() {
            this.status = 'loading';
            console.log('Fetching session data');

            try {
                const { data } = await axios.get<{ session: SessionData }>(
                    'http://localhost:3100/api/auth/session',
                    {
                        withCredentials: true,
                        headers: { Accept: 'application/json' },
                    }
                );

                const sessionData = data.session;
                console.log('Session data received:', sessionData);

                if (sessionData?.user) {
                    // sessionData.user.avatar = `https://cdn.discordapp.com/avatars/${sessionData.user.id}/${sessionData.user.avatar}.png?size=512`;
                    this.session = sessionData.user;
                    this.status = 'authorization';
                } else {
                    this.session = null;
                    this.status = 'unauthorization';
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
                this.session = null;
                this.status = 'unauthorization';
            }
        },
    },
})