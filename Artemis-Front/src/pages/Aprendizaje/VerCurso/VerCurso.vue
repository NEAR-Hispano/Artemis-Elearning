<template>
  <section id="verCurso" class="subparent divcol gap relative">
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
    <h2 class="h4-em">{{title}}</h2>
    <v-tabs v-model="tabs" vertical>

    <!-- ////////////////////////////////// -->
      <v-tab v-for="(item,i) in dataStepper" :key="i" active-class="activeClass" class="h9-em" style="display:flex;justify-content:flex-start;gap.5em">
        <v-icon left class="notdefault-clr">
          mdi-numeric-{{i+1}}-circle
        </v-icon>
        {{item.listTitle}}
      </v-tab>
      <v-tab class="h9-em" style="display:none">VALORAR CURSO</v-tab>
      <!-- ////////////////////////////////// -->

      <v-tab-item v-for="(item,i) in dataStepper" :key="i">
        <section class="sectionTop" v-if="item.type == 2">
          <embed class="embed" :src="item.documentPath" alt="pdf" pluginspage="http://www.adobe.com/products/acrobat/readstep2.html">
          <!-- <ejs-pdfviewer v-if="item.documentPath" id="pdfViewer" style="height: 33.14em !important" :serviceUrl="serviceUrl" :documentPath="documentPath"></ejs-pdfviewer> -->
        </section>

        <section class="sectionTop" v-if="item.type == 1">
          <video :src="item.course.video" controls />
        </section>

        <aside class="divcol">
          <h4 class="h7-em semibold fill-w notdefault-clr">DESCRIPCIÓN</h4>
          <p>{{item.course.desc}}</p>
        </aside>
        
        <aside class="divcol">
          <h4 class="h7-em semibold fill-w notdefault-clr">LO QUE APRENDERAS</h4>
          <p v-html="item.course.aprendizaje"></p>
        </aside>

        <aside class="space">
          <h4 class="h7-em semibold fill-w notdefault-clr">DANOS TU OPINION</h4>
          <v-btn class="botones h9-em" rounded @click="tabs=dataStepper.length+1">VALORAR CURSO</v-btn>
        </aside>

        <aside class="divcol">
          <h4 class="h7-em semibold fill-w notdefault-clr">CERTIFICATE!!</h4>
          <div class="space">
            <p>Puedes optar por la certificacion ahora. puedes optar 1 vez.</p>
            <v-btn class="botones h9-em" rounded @click="Certificate()">CERTIFICATE</v-btn>
          </div>
        </aside>
      </v-tab-item>
    <!-- ////////////////////////////////// -->
      <v-tab-item>
        <section class="sectionTop">
          <v-window touchless>
            <v-window-item>
              <aside class="divcol">
                <h5>VALORA ESTE CURSO</h5>
                <v-rating
                  v-model="feedback.rating"
                  background-color="pink lighten-3"
                  color="orange"
                ></v-rating>

                <h5>DANOS TU OPINION</h5>
                <v-textarea
                  v-model="feedback.coment"
                  filled
                  no-resize
                ></v-textarea>
              </aside>

              <aside class="contControls center">
                <v-btn
                  v-if="!progress"
                  rounded
                  @click="setReview()"
                >
                  GRABAR
                </v-btn>

                <v-btn
                  v-if="progress"
                  disabled
                  rounded
                  @click="setReview()"
                >
                  GRABAR

                  <v-progress-circular
                    :size="18"
                    :width="4"
                    indeterminate
                  ></v-progress-circular>
                </v-btn>
              </aside>
            </v-window-item>
          </v-window>
        </section>

        <!-- <aside class="divcol">
          <h4 class="h7-em semibold fill-w notdefault-clr">DESCRIPCIÓN</h4>
          <p>Aprende los principales elementos de blockchain (cadena de bloques) y NEAR Protocol en este curso en video.</p>
        </aside>

        <aside class="divcol">
          <h4 class="h7-em semibold fill-w notdefault-clr">LO QUE APRENDERAS</h4>
          <p>
            Tendrás un claro entendimiento de lo que es la tecnología blockchain, 
            también conocida como cadena de bloques, y cómo funciona.<br>
            Entenderás lo que es Bitcoin y cómo puedes empezar a usar Bitcoin.<br>
            Conocerás , entenderás y podrás hablar con confianza acerca de los principales 
            términos y conceptos relacionados a blockchain y Bitcoin.
          </p>
        </aside> -->

        <!-- <aside class="divcol">
          <h4 class="h7-em semibold fill-w notdefault-clr">CERTIFICATE!!</h4>
          <div class="space">
            <p>Puedes optar por la certificacion ahora. puedes optar 1 vez.</p>
            <v-btn class="botones h9-em" rounded to="/presentar-examen">CERTIFICATE</v-btn>
          </div>
        </aside> -->
      </v-tab-item>
    </v-tabs>
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
//import VueDocPreview from 'vue-doc-preview'
// import { PdfViewerPlugin, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner } from '@syncfusion/ej2-vue-pdfviewer';
// import Vue from 'vue';
// Vue.use(PdfViewerPlugin);

export default {
  name: "VerCurso",
  //components: { VueDocPreview },
  // provide: {
  //   PdfViewer: [Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner]
  // },
  data() {
    return {
      progress: false,
      snackbar: {},
      // serviceUrl:"https://ej2services.syncfusion.com/production/web-services/api/pdfviewer",
      // documentPath: "https://bafybeid6o3onclvh4sgusl7a7s3iudqgfej634dmzdtldpp4nyxo5bjrxu.ipfs.dweb.link/Sistema_descentralizado_para_publicar_y_revisar_articulos_cientificos.pdf",
      course_id: this.$route.params.id,
      tabs: 1,
      title: '',
      dataStepper: [],
      feedback: { rating: null, coment: null }
    }
  },
  mounted () {
    this.getCourse()
    this.getReview()
  },
  methods: {
    async Certificate () {
      const response = await this.getData()

      if (response === true) {
        this.$router.push('/presentar-examen/'+this.course_id)
      } else {
        this.snackbar = {
              color: "red",
              icon: "error",
              mode: "multi-line",
              position: "top",
              timeout: 1500,
              title: "Error!",
              text: "Completa tu perfil para poder certificarte",
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
    async setReview() {
      if (this.feedback.rating != null && this.feedback.coment != "" && this.feedback.coment != null) {  
        this.progress = true
        const CONTRACT_NAME = 'contract2.e-learning.testnet'
        // connect to NEAR
        
        const near = await connect(config)
        // create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['set_review'],
          sender: wallet.account()
        }) 

        contract.set_review({
          course_id: parseInt(this.course_id),
          review: this.feedback.coment,
          critics: this.feedback.rating
        }).then(() => {
          this.snackbar = {
            color: "green",
            icon: "check_circle",
            mode: "multi-line",
            position: "top",
            timeout: 1500,
            title: "Éxito!",
            text: "La review ha sido guardada",
            visible: true
          }
          this.progress = false
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
            text: error,//"Ha ocurrido un error",
            visible: true
          }
          this.progress = false
        })
      }
    },
    async getReview() {
      const CONTRACT_NAME = 'contract2.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_review'],
        sender: wallet.account()
      })
      await contract.get_review({
        user_id: wallet.getAccountId(),
        course_id: parseInt(this.course_id),
      })
        .then((response) => {
          if (response[0]) {
            this.feedback.coment = response[0].review
            this.feedback.rating = response[0].critics
          } else {
            this.feedback.coment = null
            this.feedback.rating = null
          }
        })
        .catch((error) => {
          console.log(error)
          this.feedback.coment = null
          this.feedback.rating = null
        })
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

          for (var i = 0; i < response.content.length; i++) {
            let item = {}
            if (response.content[i].tipo === 2) {
              item = {
                listTitle: response.content[i].title,
                type: response.content[i].tipo,
                // docPrevieww: {
                //   value: response.content[i].content,
                //   type: "code"
                // },
                documentPath: response.content[i].content,
                course: {
                  desc: response.short_description,
                  aprendizaje: response.long_description
                }
              }
            } else if (response.content[i].tipo === 1) {
              item = {
                listTitle: response.content[i].title,
                type: response.content[i].tipo,
                course: {
                  video: response.content[i].content,
                  desc: response.short_description,
                  aprendizaje: response.long_description
                }
              }
            }
            this.dataStepper.push(item)
          }
          this.tabs = 1
        })
        .catch((error) => {
          console.log(error)
        })
    },
  }
};
</script>

<style src="./VerCurso.scss" lang="scss" />
