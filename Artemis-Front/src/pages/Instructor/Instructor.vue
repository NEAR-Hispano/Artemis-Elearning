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
            @click="newCourse()"
          >
          NUEVO CURSO
          </v-btn>

          <v-dialog
            v-model="dialogEstadisticas"
            max-width="800px"
            scrollable
            overlay-opacity="0.4"
          >
            <template v-slot:activator="{on, attrs}">
              <v-btn class="botones h9-em" rounded v-on="on" v-bind="attrs">ESTADÍSTICAS</v-btn>
            </template>

            <v-card class="cardEstadisticas">
              <v-card-title class="center">
                <h3 class="h5-em">ESTADÍSTICAS</h3>
              </v-card-title>

              <v-data-table
                :headers="tableHeaders"
                :items="tableEstadisticas"
                hide-default-footer
              >
                <template v-slot:[`item.ganado`]="{ item }">
                  {{item.ganado}} <span class="bold" style="color:var(--clr-btn)">NEAR</span>
                </template>
              </v-data-table>

              <v-card-action class="end">
                <v-btn class="h8-em botones" rounded @click="dialogEstadisticas=false">CERRAR</v-btn>
              </v-card-action>
            </v-card>
          </v-dialog>
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
              disabled
            ></v-rating>
          </div>

          <span class="h8-em tcenter">Valoración del curso</span>

          <div class="spacee fill-w">
            <v-btn class="botones h9-em" rounded :to="'/instructor-editar-curso/' + item.id">EDITAR</v-btn>
            <v-btn class="botones h9-em" rounded @click="showDialog()">ELIMINAR</v-btn>
          </div>
          <v-dialog v-model="dialog" max-width="max-content">
                        <v-card>
                          <v-card-title class="text-h5">¿ QUIERES ELIMINAR ESTE CURSO ?</v-card-title>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red" rounded text @click="cerrarDialogo">
                              <span style="color: red !important">Cancelar</span>
                            </v-btn>
                            <v-btn color="#F29627" rounded :disabled="disabled_delete" text @click="DeleteCourse(item)">
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
const { connect, keyStores, WalletConnection, Contract, utils } = nearAPI

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
      total_val: 0,
      total_ven: 0,
      total_gan: 0,
      dialog: false,
      item_id: {},
      disabled_delete: false,
      dialogEstadisticas: false,
      tableHeaders: [
        { align: 'end', sortable: false, value: 'name' },
        { align: 'center', text: 'Ganado', value: 'ganado' },
        { align: 'center', text: 'Cursos Vendidos', value: 'vendido' },
        { align: 'center', text: 'Valoraciones', value: 'valoracion' },
      ],
      tableEstadisticas: [
        {
          name: 'Esta semana',
          ganado: "...",
          vendido: "...",
          valoracion: "...",
        },
        {
          name: 'Ultimos 30 días',
          ganado: "...",
          vendido: "...",
          valoracion: "...",
        },
        {
          name: 'Totales',
          ganado: 0,
          vendido: 0,
          valoracion: 0,
        },
      ]
    }
  },
  mounted () {
    this.getCoursesInstructor()
  },
  methods: {
    showDialog () {
      this.dialog = !this.dialog
    },
    formatPrice (price) {
      return utils.format.formatNearAmount(price.toLocaleString('fullwide', { useGrouping: false }))
    },
    async getCoursesInstructor() {
      this.dataCursos = []
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_courses_intructor'],
        sender: wallet.account()
      })
      await contract.get_courses_intructor({
        user_id: wallet.getAccountId(),
      })
        .then(async (response) => {
          for (var i = 0; i < response.length; i++) {
            var item = {}
            item.id = response[i].id
            item.title = response[i].title
            item.price = this.formatPrice(response[i].price)
            item.img = response[i].img
            if (response[i].inscriptions.length === 0) {
              item.profits = 0
              item.inscriptions = 0
            } else {
              item.inscriptions = response[i].inscriptions.length
              item.profits = ((response[i].inscriptions.length * this.formatPrice(response[i].price)) * 0.95).toFixed(2)
            }
            if (response[i].reviews.length === 0) {
              item.rating = 0
            } else {
              let rating = 0
              for (var j = 0; j < response[i].reviews.length; j++) {
                rating += response[i].reviews[j].critics
              }
              item.rating = rating / response[i].reviews.length
            }
            this.dataCursos.push(item)
          }
          this.dataCursos = this.dataCursos.reverse()
          this.getStats()
        })
    },
    async getStats () {
      this.total_val = 0
      this.total_ven = 0
      this.total_gan = 0
      for (var i = 0; i < this.dataCursos.length; i++) {
        this.total_ven += this.dataCursos[i].inscriptions
        this.total_gan += parseFloat(this.dataCursos[i].profits)
        this.total_val += this.dataCursos[i].rating
      }
      this.tableEstadisticas[2].ganado = this.total_gan.toFixed(2)
      this.tableEstadisticas[2].vendido = this.total_ven
      this.tableEstadisticas[2].valoracion = (this.total_val / this.dataCursos.length).toFixed(2)
    },
    async newCourse () {
      const response = await this.getDataInstructor()

      if (response === "ok") {
        this.$router.push({ path: '/instructor-cursos' })
      } else if (response === "perfil"){
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
      } else if (response === "firma"){
        this.snackbar = {
              color: "red",
              icon: "error",
              mode: "multi-line",
              position: "top",
              timeout: 1500,
              title: "Error!",
              text: "Sube tu firma digital para poder crear cursos",
              visible: true
        }
      } 
    },
    async getDataInstructor () {
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
              if (response.data[0].firma) {
                return "ok"
              }
              return "firma"
            } else {
              return "perfil"
            }
        }).catch((error) => {
          console.log(error)
        })
        return response
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
    async DeleteCourse(item) {
      console.log(item)
      this.disabled_delete = true
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
        
      const near = await connect(config)
        // create wallet connection
      const wallet = new WalletConnection(near)

      if (item.inscriptions === 0) {
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['delete_course'],
          sender: wallet.account()
        })
        contract.delete_course({
              course_id: item.id
            }).then((response) => {
              console.log(response)
              this.snackbar = {
                color: "green",
                icon: "check_circle",
                mode: "multi-line",
                position: "top",
                timeout: 1500,
                title: "Éxito!",
                text: "El curso ha sido eliminado",
                visible: true
              }
              this.getCoursesInstructor()
              this.cerrarDialogo
              this.disabled_delete = false
            })
          .catch((error) => {
            console.log(error)
            this.snackbar = {
              color: "red",
              icon: "error",
              mode: "multi-line",
              position: "top",
              timeout: 1500,
              title: "Error!",
              text: "Ha ocurrido un error",
              visible: true
            }
            this.cerrarDialogo
            this.disabled_delete = false
          })
      } else {
        this.snackbar = {
              color: "red",
              icon: "error",
              mode: "multi-line",
              position: "top",
              timeout: 1500,
              title: "Error!",
              text: "No se puede eliminar el curso",
              visible: true
            }
        this.cerrarDialogo
        this.disabled_delete = false
      }
    },
    cerrarDialogo: function () {
        this.dialog = !this.dialog
    },
  }
};
</script>

<style src="./Instructor.scss" lang="scss" />
