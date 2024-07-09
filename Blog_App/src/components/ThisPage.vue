<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div>
                <label>Email</label>
                <input type="email" v-model="email" required>
            </div>
            <div>
                <label>Password</label>
                <input type="password" v-model="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
import AuthService from '../services/authService';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        ...mapActions(['login']),
        async login() {
            try {
                const user = await AuthService.login({ email: this.email, password: this.password });
                this.login(user);
                this.$router.push('/');
            } catch (error) {
                console.error('Login failed', error);
            }
        }
    }
};
</script>
