<template>
  <section id="aprendizaje" class="subparent divcol gap">
    <v-col cols="11" class="align">
      <h2 class="h4-em">
        APRENDIZAJE
      </h2>

      <div class="divwrap gap">
        <span class="h7-em bold marginrighta center">DESDE ACA PODRA GESTIONAR SUS CURSOS Y EXAMENES</span>
        <v-btn class="botones marginlefta" rounded to="/certificados">VER CERTIFICADOS</v-btn>
      </div>
    </v-col>

    <v-col>
      <h3 class="h8-em">CURSOS ADQUIRIDOS:</h3>
      
      <section v-for="(item, i) in dataCursos" :key="i"
        class="wrapper">
        <aside class="firstAside divrow">
          <img :src="item.img" alt="imagen curso">
        </aside>

        <aside class="divcol">
          <h3 class="h7-em p alignmobile" style="margin-right: auto">TITULO</h3>
          <span class="h8-em descLimiter tcentermobile">{{item.title}}</span>
        </aside>

        <aside class="divcol">
          <h3 class="h7-em p alignmobile" style="margin-right: auto">LO QUE APRENDERAS</h3>
          <span class="h8-em descLimiter tspacemobile">{{item.desc}}</span>
        </aside>

        <aside class="divcol">
          <h3 class="h7-em p" style="color: #747A80 !important">Creado por:</h3>
          <span class="h7-em tcenter" style="color: #FF6B3B">{{item.creador}}</span>
        </aside>

        <v-btn class="botones h9-em" rounded @click="$router.push('/ver-curso/'+item.id)">VER CURSO</v-btn>
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
  name: "Aprendizaje",
  data() {
    return {
      dataCursos: [
        {
          title: "rust",
          img: require('@/assets/images/rust.png'),
          desc: "Grundlagen der JavaScript-Programmierung:jekten, Arrays, orEa ...Grundlagen der JavaScript-Programmierung:jekten, Arrays, orEa ...Grundlagen der JavaScript-Programmierung:jekten, Arrays, orEa ...",
          valoracion: 4.5,
        },
      ],
    }
  },
  mounted () {
    this.getCourses()
  },
  methods: {
    newTest() {
      this.$router.push('/examenCreator')
    },
    formatPrice (price) {
      return utils.format.formatNearAmount(price.toLocaleString('fullwide', { useGrouping: false }))
    },
    async getCourses() {
      this.dataCursos = []
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_courses_purchased'],
        sender: wallet.account()
      })
      await contract.get_courses_purchased({
        user_id: wallet.getAccountId(),
      })
        .then(async (response) => {
          for (var i = 0; i < response.length; i++) {
            var item = {}
            item.id = response[i].id
            item.title = response[i].title
            item.desc = response[i].long_description
            item.img = response[i].img
            item.creador = response[i].creator_id
            if (response[i].reviews.length === 0) {
              item.valoracion = 0
            }
            this.dataCursos.push(item)
          }
          this.dataCursos = this.dataCursos.reverse()
        })
    },
  }
};
</script>

<style src="./Aprendizaje.scss" lang="scss" />
