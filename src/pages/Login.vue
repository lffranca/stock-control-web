<template>
  <q-page class="flex flex-center">
    <form class="login-form">
      <q-input
        outlined
        v-model="email"
        label="Email"
      />
      <br/>
      <q-input
        outlined
        v-model="password"
        type="password"
        label="Password"
      />
      <br/>
      <q-btn
        class="full-width"
        :loading="loading"
        color="primary"
        @click="login()"
      >
        Entrar
      </q-btn>
    </form>
  </q-page>
</template>

<style lang="scss">
  .login-form {
    width: 80%;
    min-width: 200px;
  }
</style>

<script>
import axios from 'axios'
import { Notify } from 'quasar'

import {URL_API, DATA_API} from '../constants/url-constant'
import {STORAGE_AUTH} from '../constants/storage-constant'

export default {
  name: 'LoginIndex',
  methods: {
    async login() {
      try {
        const {email, password} = this

        if (!email || !password) {
          Notify.create({
            message: 'Email and password are required!',
            position: 'top-right',
            color: 'red'
          })
          return
        }

        this.loading = true

        const {data} = await axios.post(
          `${URL_API}/oauth/token`,
          {
            ...DATA_API,
            username: email,
            password
          }
        )

        localStorage.setItem(STORAGE_AUTH, JSON.stringify(data))

        this.loading = false

        this.$router.push('/')
      } catch (error) {
        console.error(error)
        this.loading = false
        Notify.create({
          message: 'Incorrect email or password!',
          position: 'top-right',
          color: 'red'
        })
      }
    }
  },
  data () {
		return {
      email: "",
      password: "",
      loading: false
		}
	}
}
</script>
