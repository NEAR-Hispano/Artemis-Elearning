<template>
  <section id="instructor" class="subparent divcol gap">
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
    <v-col cols="11" class="align">
      <h2 class="h4-em">
        CURSOS
      </h2>

      <div class="jend divwrap gap">
        <span class="h7-em bold marginrighta">DESDE ACA USTED INSTRUCTOR PODRA CREAR SUS CURSOS</span>
        <aside class="divrow gap">
          <v-btn 
            class="botones h9-em" 
            rounded
            @click="newCource()"
          >
          NUEVO CURSO
          </v-btn>
          <v-btn class="botones h9-em" rounded>ESTADÍSTICAS</v-btn>
        </aside>
      </div>
    </v-col>

    <v-col>
      <h3 class="h8-em">TUS CURSOS PUBLICADOS:</h3>
      
      <section v-for="(item, i) in dataCursos" :key="i"
        class="wrapper">
        <aside class="firstAside divrow">
          <img :src="item.img" alt="imagen curso">
          <div class="divcol">
            <span class="h7-em">{{item.title}}</span>
            <span class="h7-em">{{item.price}}<span class="h8-em">Ⓝ</span></span>
          </div>
        </aside>

        <aside class="divcol">
          <h3 class="h5-em p">{{item.profits}} NEAR</h3>
          <span class="h7-em tcenter">Ganancias Totales</span>
        </aside>
        
        <aside class="divcol">
          <h3 class="h5-em p">{{item.inscriptions}}</h3>
          <span class="h7-em tcenter">Inscripciones Totales</span>
        </aside>
        
        <aside class="divcol">
          <div class="divrow acenter">
            <h3 class="h5-em p">{{item.rating}}</h3>
            <v-rating
              v-model="item.rating"
              background-color="pink lighten-3"
              color="orange"
              half-increments
            ></v-rating>
          </div>

          <span class="h8-em tcenter">Valoración del curso</span>

          <div class="spacee fill-Ⓝw">
            <v-btn class="botones h9-em" rounded :to="'/instructor-editar-curso/' + item.id">EDITAR</v-btn>
            <v-btn class="botones h9-em" rounded @click="showDialog(item.id)">ELIMINAR</v-btn>
          </div>
          <v-dialog v-model="dialog" max-width="max-content">
                        <v-card>
                          <v-card-title class="text-h5">¿ QUIERES ELIMINAR ESTE CURSO ?</v-card-title>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red" rounded text @click="cerrarDialogo">
                              <span style="color: red !important">Cancelar</span>
                            </v-btn>
                            <v-btn color="#F29627" rounded text @click="DeleteCource()">
                              <span style="color: #F29627 !important">Eliminar</span>
                            </v-btn>
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
          </v-dialog>
        </aside>
      </section>
    </v-col>
  </section>
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
  name: "Cursos",
  data() {
    return {
      dataCursos: [],
      snackbar: {},
      dialog: false,
      item_id: null,
    }
  },
  mounted () {
    this.getCourcesInstructor()
  },
  methods: {
    showDialog (item) {
      this.item_id = item
        this.dialog = !this.dialog
      },
    async getCourcesInstructor() {
      const CONTRACT_NAME = 'contract.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_cources_intructor'],
        sender: wallet.account()
      })
      await contract.get_cources_intructor({
        user_id: wallet.getAccountId(),
      })
        .then((response) => {
          for (var i = 0; i < response.length; i++) {
            var item = {}
            item.id = response[i].id
            item.title = response[i].title
            item.price = response[i].price
            item.img = response[i].img
            if (response[i].inscriptions === null) {
              item.profits = 0
              item.inscriptions = 0
            } else {
              item.inscriptions = response[i].inscriptions.length
              item.profits = response[i].inscriptions.length * response[i].price
            }
            if (response[i].reviews === null) {
              item.rating = 0
            }
            this.dataCursos.push(item)
          }
          this.dataCursos = this.dataCursos.reverse()
        })
    },
    async newCource () {
      const response = await this.getData()

      if (response === true) {
        this.$router.push({ path: '/instructor-cursos' })
      } else {
        this.snackbar = {
              color: "red",
              icon: "error",
              mode: "multi-line",
              position: "top",
              timeout: 1500,
              title: "Error!",
              text: "Completa tu perfil para poder crear cursos",
              visible: true
        }
      }
    },
    async getData () {
      // connect to NEAR
      const near = await connect(config);
      // create wallet connection
      const wallet = new WalletConnection(near)
      let accountId = wallet.getAccountId()
      if (wallet.isSignedIn()) {
        const url = "api/v1/profile/?wallet=" + accountId
        this.axios.defaults.headers.common.Authorization='token'
        const response = this.axios.get(url)
          .then((response) => {
            if (response.data[0]){
              return true
            } else {
              return false
            }
        }).catch((error) => {
          console.log(error)
        })
        return response
      }
    },
    DeleteCource() {
      console.log(this.item_id)
    },
    cerrarDialogo: function () {
        this.dialog = !this.dialog
    },
  }
};
</script>

<style src="./Instructor.scss" lang="scss" />
