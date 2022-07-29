<template>
  <section id="instructorCursos" class="subparent divcol gap">
    <v-snackbar
      v-model="snackbar.visible"
      auto-height
      :color="snackbar.color"
      :multi-line="snackbar.mode === 'multi-line'"
      :timeout="snackbar.timeout"
      :top="snackbar.position === 'top'"
    >
      <v-layout align-center pr-4>
        <v-icon class="pr-3" dark large>{{ snackbar.icon }}</v-icon>
        <v-layout column>
          <div>
            <strong>{{ snackbar.title }}</strong>
          </div>
          <div>{{ snackbar.text }}</div>
        </v-layout>
      </v-layout>
      <v-btn
        v-if="snackbar.timeout === 0"
        icon
        @click="snackbar.visible = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-window v-model="stepWindow" touchless>
      <v-window-item :value="1">
        <v-col>
          <h2 class="h4-em">
            EDITAR CURSO
          </h2>

          <v-stepper
            v-model="e6"
            non-linear
          >
            <!-- ////////////////////////////////// -->
            <v-stepper-step
              :complete="e6 > 1"
              step="1"
              editable
            >
              DESCRIPCIÓN
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card color="transparent" class="form">
                <label class="h9-em" for="descripcion_titulo">TITULO</label>
                <v-text-field
                  v-model="descripcion_titulo"
                  id="descripcion_titulo"
                  solo
                >
                </v-text-field>
              </v-card>
              <v-card color="transparent" class="form">
                <label class="h9-em" for="descripcion_categoria">CATEGORIA</label>
                <v-select
                  v-model="id"
                  :items="lista_descripcion_categoria"
                  id="descripcion_categoria"
                  item-text="name"
                  item-value="id"
                  solo
                  v-on:change="change(id)"
                >
                </v-select>
              </v-card>
              <v-card color="transparent" class="form">
                <label class="h9-em" for="descripcion_descripcion">DESCRIPCIÓN</label>
                <v-text-field
                  v-model="descripcion_descripcion"
                  id="descripcion_descripcion"
                  solo
                >
                </v-text-field>
              </v-card>
              <v-card color="transparent" class="biografia form">
                <label class="h9-em" for="descripcion_aprendizaje">QUE APRENDERAN</label>
                <v-textarea
                  v-model="descripcion_aprendizaje"
                  id="descripcion_aprendizaje"
                  solo
                >
                </v-textarea>
              </v-card>

              <v-col class="contimagen divrow divwrapmobile">
                <aside class="divcol">
                  <label class="h9-em">IMAGEN</label>
                  <v-card color="#F3F6F5">
                    <img :src="descripcion_image" alt="Image uploaded">
                  </v-card>
                </aside>

                <aside class="wrapper divcol fill-w">
                  <div class="divcol">
                    <label for="archivo">{{"Elige un archivo a subir".toUpperCase()}}</label>
                    <input id="archivo" ref="fileInput" type="file" accept="image/*" @input="pickFile();" />
                  </div>
                </aside>
              </v-col>
            </v-stepper-content>
            <!-- ////////////////////////////////// -->

            <!-- ////////////////////////////////// -->
            <v-stepper-step
              :complete="e6 > 2"
              step="2"
              editable
            >
              PUBLICAR
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-card color="transparent" class="form">
                <label class="h9-em" for="publicar_precio">PRECIO</label>
                <v-text-field
                  v-model="publicar_precio"
                  id="publicar_precio"
                  solo
                  style="max-width: 10em"
                  number
                >
                </v-text-field>
                <label class="h9-em" for="publicar_precio">PRECIO CERTIFICADO</label>
                <v-text-field
                  v-model="publicar_certificado"
                  id="publicar_precio"
                  solo
                  style="max-width: 10em"
                  number
                >
                </v-text-field>
              </v-card>

              <v-btn class="botones h8-em" rounded @click="stepWindow++">
                VISTA PREVIA
              </v-btn>
            </v-stepper-content>
            <!-- ////////////////////////////////// -->
          </v-stepper>
        </v-col>
      </v-window-item>



      <v-window-item :value="2">
        <v-col id="preview" class="divcol gap">
          <section class="divcolmobile">
            <img class="referenceImg alignmobile" :src="descripcion_image" alt="Reference Img">

            <aside class="divcol fill-w" style="gap: clamp(.5em, 1vw, 1em)">
              <h4 class="titulo h5-em bold tcentermobile">{{descripcion_titulo}}</h4>
              <span class="subtitulo h8-em notdefault-clr" style="color: #747A80">
                Creado por: <span style="color: #FF6B3B">{{ accountId }}</span>
              </span>
              <v-card class="space divwrap" style="display:Flex">
                <div class="divcol">
                  <span class="h8-em">Precio Actual:</span>
                  <span class="number bold">{{publicar_precio}} 
                    <span class="h8 normal">NEAR <span class="h6">Ⓝ</span></span>
                  </span>
                </div>

                <v-rating
                  background-color="pink lighten-3"
                  color="orange"
                ></v-rating>
              </v-card>
            </aside>
          </section>

          <section class="divcolmobile">
            <aside class="divcol gap fill-wmobile">
              <h4 class="h7-em semibold fill-w notdefault-clr">LO QUE APRENDERAS</h4>
              <div class="divcol">
                <p>{{descripcion_aprendizaje}}</p>
              </div>
            </aside>

            <aside class="divcol jspace fill-w gap">
              <div clasS="divcol gap">
                <h4 class="h7-em semibold fill-w notdefault-clr">CONTENIDO DEL CURSO</h4>

                <!-- lista -->
                <v-data-table
                  class="data_table"
                  :headers="headersPreview"
                  :items="this.$store.state.editedCursos.contenidoTabla"
                  sort-by="orden"
                >
                  <template v-slot:no-data>
                    <span class="h8-em">NO HAY INFORMACION DISPONIBLE</span>
                  </template>
                </v-data-table>
              </div>

              <div class="spacee gap">
                <v-btn class="botones h8-em" rounded @click="stepWindow--">
                  REGRESAR
                </v-btn>
                <v-btn class="botones h8-em" rounded @click="Publicar()">
                  PUBLICAR
                </v-btn>
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
                        <span class="h5-em bold">{{formatPrice(item.price)}} 
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
      </v-window-item>
    </v-window>
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
  name: "Cursos",
  mounted() {
    this.get_categorys()
    this.getCourseEdit()
  },
  data() {
    return {
      id: null,
      course_id: this.$route.params.id,
      stepWindow: 1,
      e6: 1,
      accountId: "",
      snackbar: {},
      // descripcion
      descripcion_titulo: null,/*1*/
      descripcion_categoria: {},/*2*/
      lista_descripcion_categoria: [],
      descripcion_descripcion: null,/*3*/
      descripcion_aprendizaje: null,/*4*/
      descripcion_image: null,/*5*/

      // publicar
      publicar_precio: null,/*7*/
      publicar_certificado: null,

      headersPreview: [
        { text: 'ORDEN', align: 'start', value: 'orden' },
        { text: 'TITULO', value: 'titulo' },
        { text: 'TIPO', value: 'tipo' },
      ],
      // slider
      slider: "",
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
  methods: {
    formatPrice (price) {
      return utils.format.formatNearAmount(price.toLocaleString('fullwide', { useGrouping: false }))
    },
    change (id) {
      for (var i = 0; i < this.lista_descripcion_categoria.length; i++) {
        if (this.lista_descripcion_categoria[i].id === id) {
          this.descripcion_categoria.id = this.lista_descripcion_categoria[i].id
          this.descripcion_categoria.name = this.lista_descripcion_categoria[i].name
          this.descripcion_categoria.img = this.lista_descripcion_categoria[i].img
        }
      }
    },
    pickFile () {
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.descripcion_image = e.target.result
        }
        reader.readAsDataURL(file[0])
      }
    },
    async get_categorys () {
      this.lista_descripcion_categoria = []
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      this.accountId = wallet.getAccountId()
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_category'],
        sender: wallet.account()
      })
      await contract.get_category().then((response) => {
        response.forEach((element) => {
          this.lista_descripcion_categoria.push({ id: element.id, name: element.name, img: element.img })
        })
      })
    },
    async getCourseEdit() {
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
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
          this.descripcion_titulo = response[0].title
          this.descripcion_categoria = response[0].categories
          this.id = this.descripcion_categoria.id
          this.descripcion_descripcion = response[0].short_description
          this.descripcion_aprendizaje = response[0].long_description
          this.publicar_precio = this.formatPrice(response[0].price)
          this.publicar_certificado = this.formatPrice(response[0].price_certification)    
          this.descripcion_image = response[0].img
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async Publicar() {
      this.progress = true;
      let input = this.$refs.fileInput;
      let file = input.files;

      const formData = new FormData();
      formData.append("file", file[0]);

      const CONTRACT_NAME = "contract2.e-learning.testnet";
      const direccionIpfs = ".ipfs.dweb.link";

      // connect to NEAR

      const near = await connect(config);
      // create wallet connection
      const wallet = new WalletConnection(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        changeMethods: ["put_course"],
        sender: wallet.account(),
      });

        await axios.post('https://artemis-edu.com:3070/api/ipfs/', formData)
          .then((response) => {    
            var imgFinal
            if (file[0]) {
              imgFinal = 'https://' + response.data.data + direccionIpfs + '/' + response.data.nombre
            } else {
              imgFinal = this.descripcion_image
            }
            contract
              .put_course({
                course_id: parseInt(this.course_id),
                title: this.descripcion_titulo,
                categories: this.descripcion_categoria,
                short_description: this.descripcion_descripcion,
                long_description: this.descripcion_aprendizaje,
                img: imgFinal,
                price: utils.format.parseNearAmount(this.publicar_precio),
                price_certification: utils.format.parseNearAmount(this.publicar_certificado),
              })
              .then(() => {
                  this.$router.push({ path: "/instructor" });
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
                    text: "Ha ocurrido algo",
                    visible: true
                  }
                  this.progress = false;
                })
              })
              .catch((error) => {
                console.log("error", error);
                this.snackbar = {
                  color: "red",
                  icon: "error",
                  mode: "multi-line",
                  position: "top",
                  timeout: 1500,
                  title: "Error!",
                  text: error + "Ha ocurrido algo con el IPFS",
                  visible: true,
                };
                this.progress = false;
            });
    },
    PublicarEdited() {
      let object = {
        name: this.descripcion_titulo,
        img: this.descripcion_image,
        price: this.publicar_precio,
        earned: 0,
        inscriptions: 0,
        rating: 0,
        //
        categoria: this.descripcion_categoria,
        descripcion: this.descripcion_descripcion,
        aprendizaje: this.descripcion_aprendizaje,
        contenidoTabla: this.$store.state.editedCursos.contenidoTabla,
      }
      this.$store.dispatch("PublicarCursoEdited", { object });
      this.$router.push({ path: '/instructor' })
    }
  }
};
</script>

<style src="./InstructorCursos.scss" lang="scss" />
