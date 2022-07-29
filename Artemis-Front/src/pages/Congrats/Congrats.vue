<template>
  <section id="congrats" class="subparent divcol gap">
    <v-col cols="11" class="align gap">
      <h2 class="h4-em tcenter align" style="max-width:885px;">
        {{curso}} {{approvated?'Felicidades!!!':null}}
      </h2>

      <span class="h7-em bold">
        {{approvated?'Con mucho gusto nos complace informarle que usted ha finalizado exitosamente la certificación de este curso con una calificación de:':
        'Le informamos que el resultado de su evaluación de certificación fue de:'}}
      </span>

      <h2 class="h4-em tcenter">{{nota}} Puntos</h2>

      <span class="h7-em bold">
        {{approvated?'Es por ello que usted tiene disponible el siguiente certificado.':
        'Esta puntuación está por debajo del mínimo requerido para optar por el certificado de Aprobación. Para poder optar por presentar  nuevamente  la prueba de certificación,  deberá honrar nuevamente el pago del costo del curso.'}}
      </span>
    </v-col>
    
    <v-col v-if="approvated" class="center">
      <img :src="certificadoPreview" alt="certificado" style="width:min(100%, 784px)">
    </v-col>

    <v-col class="center gap">
      <v-btn style="background-color:#D0BFAA !important;" height="30px" class="botones" rounded
        @click="botonLeft()">
        {{approvated?'DESCARGAR':'SALIR'}}
      </v-btn>
      <v-btn style="background-color:#D0BFAA !important" height="30px" class="botones" rounded
        @click="botonRight()">
        {{approvated?'MINTEAR':'CERTIFICARSE NUEVAMENTE'}}
      </v-btn>
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
  name: "Congrats",
  props: {
    approve: Object
  },
  data() {
    return {
      approvated: null,
      certificadoPreview: null,
      nota: null,
      curso: null,
      id_certificado: null,
    }
  },
  mounted () {
    this.approvated = this.approve.approvated
    this.curso = this.approve.curso
    this.certificadoPreview = this.approve.img_certificado
    this.nota = this.approve.nota
    this.id_certificado = this.approve.id_certificado
  },
  methods: {
    botonLeft() {
      if(this.approvated==true) {
        fetch(this.certificadoPreview)
          .then(resp => resp.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download= "hola"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            console.log("fin")
          })
          .catch((error) => {
            console.log(error)
          })
      }
      else {console.log('reprovado')}
    },
    botonRight() {
      if(this.approvated==true) {
        this.nftMint()
      }
    },
    async nftMint() {
      const CONTRACT_NAME = 'nft.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        changeMethods: ['nft_mint'],
        sender: wallet.account()
      })
      await contract.nft_mint({
        certificate_id: this.id_certificado,
      }, '300000000000000', // attached GAS (optional)
      utils.format.parseNearAmount("1.5"))
        .then(async (response) => {
          console.log(response)
          console.log(true)
        }) 
        .catch((error) => {
          console.log(error)
        })
    },
  }
};
</script>

<style src="./Congrats.scss" lang="scss" />
