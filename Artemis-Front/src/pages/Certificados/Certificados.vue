<template>
  <section id="certificados" class="subparent divcol gap">
    <v-col cols="11" class="align">
      <h2 class="h4-em">
        MIS CERTIFICADOS
      </h2>

      <div class="divwrap gap">
        <span class="h7-em bold marginrighta center">DESDE ACA PODRA USTEDE COMO ESTUDIANTE PODRA VER SUS CERTIFICADOS</span>
      </div>
    </v-col>

    <v-col>
      <h3 class="h8-em">CURSOS ADQUIRIDOS:</h3>

      <v-data-table
        id="datatable"
        :headers="headersTable"
        :items="dataTable"
        hide-default-footer
      >
        <template v-slot:[`item.curso`]="{ item }">
          <div class="divcol center" style="gap:1em">
            <img :src="item.img_course" alt="Course Image" width="164px">
            <h3 style="color:#0E1F2F !important" class="h7-em p">{{item.name}}</h3>
          </div>
        </template>

        <template v-slot:[`item.certificado`]="{ item }">
          <div class="center">
            <img :src="item.img_certificado" alt="Course Image" width="150px">
          </div>
        </template>
    
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn class="botones" :disabled="!item.minteable" rounded @click="nftMint(item)">MINTEAR</v-btn>
        </template>
      </v-data-table>
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
  name: "Certificados",
  data() {
    return {
      headersTable: [
        { value: "curso", text: "CURSO", align: "center" },
        { value: "certificado", text: "CERTIFICADO", align: "center" },
        { value: "actions", sortable: false, align: "center" },
      ],
      dataTable: [],
    }
  },
  mounted () {
    this.getCertificados()
  },
  methods: {
    async nftMint(item) {
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
        certificate_id: item.id,
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
    async getCertificados() {
      this.dataTable = []
      const CONTRACT_NAME = 'nft.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_certificate_list'],
        sender: wallet.account()
      })
      await contract.get_certificate_list({
        account_id: wallet.getAccountId(),
      })
        .then(async (response) => {
          for (var i = 0; i < response.length; i++) {
            var item = {}
            item.id = response[i].id
            item.name = response[i].curso
            item.img_course = response[i].img_curso
            item.img_certificado = response[i].img_certificado
            item.minteable = response[i].minteable
            this.dataTable.push(item)
          }
          this.dataTable = this.dataTable.reverse()
        })
    },
  }
};
</script>

<style src="./Certificados.scss" lang="scss" />
