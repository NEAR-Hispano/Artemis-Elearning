<template>
  <section id="cursos" class="subparent divcol gap">
    <v-col id="preview" class="divcol gap">
      <section class="divcolmobile">
        <img class="referenceImg alignmobile" :src="image" alt="Reference Img">

        <aside class="divcol fill-w" style="gap: clamp(.5em, 1vw, 1em)">
          <h4 class="titulo h5-em bold tcentermobile">{{titulo}}</h4>
          <span class="subtitulo h8-em notdefault-clr" style="color: #747A80">
            Creado por: <span style="color: #FF6B3B">{{ instructor }}</span>
          </span>
          <v-card class="divcol gap" style="display:Flex">
            <aside class="space divwrap">
              <div class="divcol">
                <span class="h8-em">Precio Actual:</span>
                <div class="divrow aend" style="gap: .2em">
                  <span class="h3-em bold aend" style="height: min-content; line-height: 1">
                    {{formatPrice(precio)}}
                  </span>
                  <span class="h6 normal" style="transform:translateY(-2px)">NEAR</span>
                </div>
              </div>

              <v-rating
                background-color="pink lighten-3"
                color="orange"
              ></v-rating>
            </aside>

            <aside class="start">
              <v-btn 
                class="h7-em normal"
                @click="courseBuy()"
              >
                Comprar
              </v-btn>
            </aside>
          </v-card>
        </aside>
      </section>

      <section class="divcolmobile">
        <aside class="divcol gap fill-wmobile">
          <h4 class="h7-em semibold fill-w notdefault-clr">LO QUE APRENDERAS</h4>
          <div class="divcol">
            <p>{{aprendizaje}}</p>
          </div>
        </aside>

        <aside class="divcol jspace fill-w gap">
          <div clasS="divcol gap">
            <h4 class="h7-em semibold fill-w notdefault-clr">CONTENIDO DEL CURSO</h4>

            <!-- lista -->
            <v-data-table
              class="data_table"
              :headers="headersPreview"
              :items="desserts"
              sort-by="orden"
            >
              <template v-slot:no-data>
                <span class="h8-em">NO HAY INFORMACION DISPONIBLE</span>
              </template>
            </v-data-table>
          </div>
        </aside>
      </section>

      <section>
        <h4 class="h7-em fill-w semibold notdefault-clr">CURSOS PUBLICADOS POR EL INSTRUCTOR</h4>

        <section class="wrapper">
          <v-slide-group
            v-model="slider"
            center-active
            show-arrows
            class="fill-w"
          >
            <v-slide-item v-for="(item, index) in dataSlider" :key="index"
              v-slot="{ toggle }">
              <v-card color="var(clr-card)" class="cartas divcol" v-ripple="{ class: 'activeRipple' }"
                @click="toggle">
                <img :src="item.img" alt="Imagen curso">
                <div class="divcol astart">
                  <aside class="divcol">
                    <span class="h7-em bold">{{item.title}}</span>
                    <a :href="item.to" class="h9-em semibold" style="color: #FF6B3B !important">
                      Instructor {{item.instructor }}
                    </a>
                  </aside>

                  <aside class="space fill-w gap divwrapmobile">
                    <span class="h5-em bold">{{price}} 
                      <span class="h10 normal">NEAR</span>
                    </span>
                    <v-rating
                      v-model="item.rating"
                      background-color="pink lighten-3"
                      color="orange"
                    ></v-rating>
                  </aside>
                </div>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </section>
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
  name: "DetalleCursos",
  data() {
    return {
      titulo: null,
      instructor: null,
      categoria: null,
      descripcion: null,
      aprendizaje: null,
      precio: null,
      image: null,
      accountId: "",
      item: {},
      headersPreview: [
        { text: 'ORDEN', align: 'start', value: 'orden' },
        { text: 'TITULO', value: 'titulo' },
        { text: 'TIPO', value: 'tipo' },
      ],
      desserts: [],
      slider: "",
      course_id: this.$route.params.id,
      dataSlider: [
        {
          img: require("@/assets/images/python.jpg"),
          title: "Rust Basico",
          instructor: "IRON MAN",
          to: "#",
          price: "0.75",
          rating: "4",
        },
      ],
    }
  },
  mounted () {
    this.getCourse()
  },
  methods: {
    formatPrice (price) {
      return utils.format.formatNearAmount(price.toLocaleString('fullwide', { useGrouping: false }))
    },
    async getCourse() {
      const CONTRACT_NAME = 'contract.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_market_courses'],
        sender: wallet.account()
      })
      await contract.get_market_courses({
        course_id: parseInt(this.course_id),
      })
        .then((response) => {
          this.titulo = response[0].title
          this.instructor = response[0].creator_id
          this.categoria = response[0].categories
          this.descripcion = response[0].short_description
          this.aprendizaje = response[0].long_description
          this.precio = response[0].price
          this.image = response[0].img
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async courseBuy () {
      const CONTRACT_NAME = 'contract.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        changeMethods: ['course_buy'],
        sender: wallet.account()
      })
      await contract.course_buy({
        course_id: parseInt(this.course_id),
      }, '300000000000000', // attached GAS (optional)
      utils.format.parseNearAmount((Number(this.formatPrice(this.precio)) + 0.015).toString()))
    }
  }
};
</script>

<style src="./Cursos.scss" lang="scss" />
