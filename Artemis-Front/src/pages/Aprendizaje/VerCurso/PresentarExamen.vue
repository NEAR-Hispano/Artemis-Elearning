<template>
  <section id="verCurso" class="subparent divcol gap">
    <h2 class="h4-em tcenter">{{title}}</h2>
    <h3 class="h5-em tcenter">CERTIFICACIÓN</h3>

    <section class="sectionTop">
      <v-card v-if="testInit" class="warning warningExamnen divcol" style="display:flex">
        <p>
          Esta a punto de iniciar la prueba de certificación la cual consta de 10 preguntas.
          Cada pregunta tiene una valoración de 2 puntos, siendo la nota minima aprobatoria de 20 puntos.
          Una vez iniciado el proceso de evaluación no se podrá cancelar.
          Tenga la prevision de contar con internet y energía eléctrica.
          Solo tendrá un intento para completar toda la prueba y culmina en el tiempo 
          establecido de 10 minutos a partir de dar click al botón CERTIFICATE de esta pantalla.
        </p>

        <v-card-action class="center gap">
          <v-btn class="botones2" rounded to="/aprendizaje">CANCELAR</v-btn>
          <v-btn class="botones" :disabled="pass_certification" rounded @click="passBuy()">COMPRAR PASE</v-btn>
          <v-btn class="botones" :disabled="!pass_certification" rounded @click="getCertificacion(),testInit=false">CERTIFICATE</v-btn>
        </v-card-action>
      </v-card>

      <v-window v-else v-model="PresentacionExamen" touchless>
        <v-window-item v-for="(item,i) in dataPresentacionExamen" :key="i" :value="i+1">
          <aside class="divcol">
            <h5>PREGUNTA # {{i+1}}</h5>
            <span>{{item.question}}</span>
          </aside>

          <aside class="divcol">
            <div class="space">
              <h5>OPCIONES</h5>
              <h5>SELECCIÓN</h5>
            </div>
            <ul class="divcol">
              <li v-for="(item2,i) in item.options" :key="i"
                class="space">
                <span>{{item2.option}}</span>
                <v-checkbox
                  v-model="item2.isSelected"
                  hide-details
                  @click="item.options.forEach(element=>{element.isSelected=false});item2.isSelected=true"
                  style="margin-top: 0"
                ></v-checkbox>
              </li>
            </ul>
          </aside>

          <aside class="contControls spacee gap">
            <v-btn rounded v-if="i >= 1" @click="PresentacionExamen--">ANTERIOR</v-btn>
            <v-btn v-if="PresentacionExamen == dataPresentacionExamen.length" rounded
              @click="warningModal=true">Finalizar</v-btn>
            <v-btn v-else rounded @click="PresentacionExamen++">SIGUIENTE</v-btn>
          </aside>
        </v-window-item>
      </v-window>
    </section>

    <v-dialog v-model="warningModal" persistent max-width="850px">
      <v-card class="divcol gap" style="box-shadow:0 0 2px 3px rgba(0,0,0,1) !important;padding:2em">
        <span class="h8-em">
          Esta usted seguro que desea finalizar la prueba de certificacion? Una vez confirmado la 
          finalizacion no podra volver a las preguntas y automaticamente se procedera a evaluar su prueba. 
          En caso de no cubrir la nota minima aptobatoria que es 10 puntos, usted reprobara y no podra contar 
          con el certificado digital. En caso de requerir nuevamente optar por la prueba de certificacion 
          usted tedra que cancelar el costo del mismo.
        </span>

        <div class="center gap">
          <v-btn :disabled="progress" class="botones" style="background-color: #D0BFAA !important" rounded height="30px"
            @click="warningModal=false">REGRESAR</v-btn>
          <v-btn v-if="!progress" class="botones" rounded height="30px" @click="revisionCertificacion()">FINALIZAR</v-btn>
          <v-btn 
            v-if="progress" :disabled="progress" class="botones" rounded height="30px" @click="revisionCertificacion()"
          >
          FINALIZAR
          <v-progress-circular
            :size="18"
            :width="4"
            indeterminate
          ></v-progress-circular>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import axios from 'axios'
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
  name: "PresentarExamen",
  data() {
    return {
      progress: false,
      warningModal: false,
      testInit: true,
      course_id: this.$route.params.id,
      pass_certification: null,
      price_certification: null,
      disabled1: null,
      disabled2: null,
      title: null,
      PresentacionExamen: 1,
      dataPresentacionExamen: [],
      feedback: { rating: null, coment: null }
    }
  },
  mounted () {
    this.getCourse()
    this.getPass()
  },
  methods: {
    anyfunction() {
      this.revisionCertificacion()
    },
    async getCourse() {
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_course_id'],
        sender: wallet.account()
      })
      await contract.get_course_id({
        user_id: wallet.getAccountId(),
        course_id: parseInt(this.course_id),
      })
        .then((response) => {
          console.log(response)
          this.title = response.title
          this.price_certification = response.price_certification
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getPass() {
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_pass_certification'],
        sender: wallet.account()
      })
      await contract.get_pass_certification({
        user_id: wallet.getAccountId(),
        course_id: parseInt(this.course_id),
      })
        .then((response) => {
          this.pass_certification = response.pass_certification
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getCertificacion() {
      const near = await connect(config);
      const wallet = new WalletConnection(near)

      if (wallet.isSignedIn()) {
        const url = "api/v1/get-certificacion/"
        this.axios.defaults.headers.common.Authorization='token '
        let item = {
          course_id: this.course_id
        }
        this.axios.post(url, item)
          .then((response) => {
            if (response.data){
              this.dataPresentacionExamen = response.data
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
    },
    async revisionCertificacion() {
      this.progress = true
      const near = await connect(config);
      const wallet = new WalletConnection(near)

      if (wallet.isSignedIn()) {
        const url = "https://artemis-edu.com:3070/api/v1/revision-certificacion/"
        let item = {
          course_id: this.course_id,
          datos: this.dataPresentacionExamen,
          user_id: wallet.getAccountId()
        }
        axios.post(url, item)
          .then((response) => {
            if (response.data){
              if (response.data.nota >= 10) {
                let item3 = {
                  approvated: true,
                  curso: response.data.curso,
                  id_certificado: response.data.id_certificado,
                  img_certificado: response.data.img_certificado,
                  nota: response.data.nota
                }
                this.$emit("Nota", item3)
                this.$router.push('/congrats')
              } else if (response.data.nota < 10) {
                let item3 = {
                  approvated: false,
                  nota: response.data.nota
                }
                this.$emit("Nota", item3)
                this.$router.push('/congrats')
              }
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
          this.progress = false
        })
      }
    },
    async passBuy () {
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        changeMethods: ['pass_certification_buy'],
        sender: wallet.account()
      })
      await contract.pass_certification_buy({
        course_id: parseInt(this.course_id),
      }, '300000000000000', // attached GAS (optional)
      utils.format.parseNearAmount((Number(this.formatPrice(this.price_certification)) + 0.015).toString()))
    },
    formatPrice (price) {
      return utils.format.formatNearAmount(price.toLocaleString('fullwide', { useGrouping: false }))
    }
  }
};
</script>

<style src="./VerCurso.scss" lang="scss" />
