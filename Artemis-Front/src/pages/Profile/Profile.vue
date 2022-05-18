<template>
  <v-col id="profile">
    <v-snackbar v-model="snackbar.visible" auto-height :color="snackbar.color" :multi-line="snackbar.mode === 'multi-line'" :timeout="snackbar.timeout" :top="snackbar.position === 'top'">
      <v-layout align-center pr-4>
        <v-icon class="pr-3" dark large>{{ snackbar.icon }}</v-icon>
        <v-layout column>
          <div>
            <strong>{{ snackbar.title }}</strong>
          </div>
          <div>{{ snackbar.text }}</div>
        </v-layout>
      </v-layout>
      <v-btn v-if="snackbar.timeout === 0" icon @click="snackbar.visible = false">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <h2 class="h4-em">
      PERFIL
    </h2>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <section class="contForm">
        <v-card color="transparent" class="form">
          <label class="h7-em" for="nombre">NOMBRE</label>
          <v-text-field
            v-model="profile.name"
            id="nombre"
            :rules="rules.date"
            solo
          >
          </v-text-field>
        </v-card>
        <v-card color="transparent" class="form">
          <label class="h7-em" for="apellido">APELLIDO</label>
          <v-text-field
            v-model="profile.last_name"
            id="apellido"
            :rules="rules.date"
            solo
          >
          </v-text-field>
        </v-card>
        <v-card color="transparent" class="form">
          <label class="h7-em" for="dni">DNI</label>
          <v-text-field
            v-model="profile.dni"
            id="dni"
            :rules="rules.date"
            solo
          >
          </v-text-field>
        </v-card>
        <v-card color="transparent" class="form">
          <label class="h7-em" for="wallet">WALLET</label>
          <v-text-field
            v-model="accountId"
            solo
            disabled
          >
          </v-text-field>
        </v-card>
        <v-card color="transparent" class="form">
          <label class="h7-em" for="pais">PAIS</label>
          <v-text-field
            v-model="profile.country"
            id="pais"
            solo
          >
          </v-text-field>
        </v-card>
        <v-card color="transparent" class="form">
          <label class="h7-em" for="email">EMAIL</label>
          <v-text-field
            v-model="profile.email"
            id="email"
            solo
          >
          </v-text-field>
        </v-card>
        <v-card color="transparent" class="form">
          <label class="h7-em" for="discord">DISCORD</label>
          <v-text-field
            v-model="profile.discord"
            id="discord"
            solo
          >
          </v-text-field>
        </v-card>
        <v-card color="transparent" class="form">
          <label class="h7-em" for="profesion">PROFESION</label>
          <v-text-field
            v-model="profile.profession"
            id="profesion"
            solo
          >
          </v-text-field>
        </v-card>
        <v-card color="transparent" class="biografia form">
          <label class="h7-em" for="biografia">BIOGRAFIA</label>
          <v-textarea
            v-model="profile.biography"
            id="biografia"
            :rules="rules.long"
            solo
          >
          </v-textarea>
        </v-card>
      </section>
    </v-form>

    <v-col align="center">
      <v-btn 
        v-if="newProfile"
        class="h7-em" 
        rounded
        @click="setData()">
        GUARDAR
      </v-btn>
      <v-btn 
        v-else
        class="h7-em" 
        rounded
        @click="setDataEdit()">
        GUARDAR
      </v-btn>
    </v-col>
  </v-col>
</template>

<script>
import * as nearAPI from 'near-api-js'
const { connect, keyStores, WalletConnection, Contract } = nearAPI

const keyStore = new keyStores.BrowserLocalStorageKeyStore()
const config = {
        networkId: "testnet",
        keyStore, 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };

export default {
  name: "Profile",
  data() {
    return {
      snackbar: {},
      valid: true,
      newProfile: true,
      profile: {},
      accountId: null,
      wallet: null,
      rules: {
          date: [
            v => !!v || 'El valor es requerido',
          ],
          long: [
            v => (v || '' ).length <= 255 || '255 caracteres o menos',
          ],
          email: [
            v => /.+@.+\..+/.test(v) || 'E-mail tiene que ser valido',
          ]
        },
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async setData () {
      if (this.$refs.form.validate()) {
        const near = await connect(config);
        const wallet = new WalletConnection(near)

        if (wallet.isSignedIn()) {
          const url = "api/v1/profile/"
          this.axios.defaults.headers.common.Authorization='token '
          this.axios.post(url, this.profile)
            .then((response) => {
              if (response.data){
                console.log(response.data)
                this.snackbar = {
                  color: "green",
                  icon: "check_circle",
                  mode: "multi-line",
                  position: "top",
                  timeout: 1500,
                  title: "Éxito!",
                  text: "El perfil ha sido guardado",
                  visible: true
                }
                this.getData()
              }
          }).catch((error) => {
            console.log(error)
            this.snackbar = {
              color: "red",
              icon: "error",
              mode: "multi-line",
              position: "top",
              timeout: 1500,
              title: "Error!",
              text: "Ha ocurrido algo",
              visible: true
            }
          })
        }
      }
    },
    async setDataOld () {
      if (this.$refs.form.validate()) {
        const CONTRACT_NAME = 'contract.e-learning.testnet'
        // connect to NEAR
        const near = await connect(config);
        // create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['set_profile'],
          sender: wallet.account()
        })
        if (wallet.isSignedIn()) {
          await contract.set_profile({
            name: this.profile.name,
            last_name: this.profile.last_name,
            dni: this.profile.dni,
            profession: this.profile.profession,
            biography: this.profile.biography,
            discord: this.profile.discord,
            email: this.profile.email,
            country: this.profile.country,
          })
        }
      }
    },
    async setDataEdit () {
      if (this.$refs.form.validate()) {
        const near = await connect(config);
        const wallet = new WalletConnection(near)

        if (wallet.isSignedIn()) {
          const url = "api/v1/profile/" + this.profile.id + "/"
          this.axios.defaults.headers.common.Authorization='token '
          this.axios.put(url, this.profile)
            .then((response) => {
              if (response.data){
                console.log(response.data)
                this.snackbar = {
                  color: "green",
                  icon: "check_circle",
                  mode: "multi-line",
                  position: "top",
                  timeout: 1500,
                  title: "Éxito!",
                  text: "El perfil ha sido actualizado",
                  visible: true
                }
                this.getData()
              }
          }).catch((error) => {
            console.log(error)
            this.snackbar = {
              color: "red",
              icon: "error",
              mode: "multi-line",
              position: "top",
              timeout: 1500,
              title: "Error!",
              text: "Ha ocurrido algo",
              visible: true
            }
          })
        }
      }
    },
    async setDataEditOld () {
      if (this.$refs.form.validate()) {
        const CONTRACT_NAME = 'contract.e-learning.testnet'
        // connect to NEAR
        const near = await connect(config);
        // create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['put_profile'],
          sender: wallet.account()
        })
        if (wallet.isSignedIn()) {
          await contract.put_profile({
            name: this.profile.name,
            last_name: this.profile.last_name,
            dni: this.profile.dni,
            profession: this.profile.profession,
            biography: this.profile.biography,
            discord: this.profile.discord,
            email: this.profile.email,
            country: this.profile.country,
          })
        }
      }
    },
    async getData () {
      // connect to NEAR
      const near = await connect(config);
      // create wallet connection
      const wallet = new WalletConnection(near)
      this.accountId = wallet.getAccountId()
      this.profile.wallet = this.accountId
      if (wallet.isSignedIn()) {
        const url = "api/v1/profile/?wallet=" + this.accountId
        this.axios.defaults.headers.common.Authorization='token'
        this.axios.get(url)
          .then((response) => {
            if (response.data[0]){
              this.profile = response.data[0]
              this.newProfile = false
            } else {
              this.newProfile = true
            }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    async getDataOld () {
      const CONTRACT_NAME = 'contract.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config);
      // create wallet connection
      const wallet = new WalletConnection(near)
      this.accountId = wallet.getAccountId()
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_profile'],
        sender: wallet.account()
      })
      if (wallet.isSignedIn()) {
        // console.log(wallet.account())
        await contract.get_profile({
          user_id: wallet.getAccountId()
        }).then((res) => {
          this.profile = res
          this.newProfile = false
        }).catch(() => {
        })
      }
    }
  }
};
</script>

<style src="./Profile.scss" lang="scss" />
