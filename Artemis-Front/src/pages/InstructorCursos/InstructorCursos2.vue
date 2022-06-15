<template>
  <section id="instructorCursos" class="subparent divcol gap">
    <v-col>
    <h2 class="h4-em">
      CREAR CURSO
    </h2>
  <v-row align="center">
    <v-item-group
      v-model="window"
      class="shrink mr-6"
      mandatory
      tag="v-flex"
    >
      <v-item
        v-for="n in length"
        :key="n"
        v-slot="{ active, toggle }"
      >
        <div>
          <v-btn
            :input-value="active"
            icon
            @click="toggle"
          >
            <v-icon>mdi-record</v-icon>
            Contenido
          </v-btn>
        </div>
      </v-item>
    </v-item-group>

    <v-col>
      <v-window
        v-model="window"
        class="elevation-1"
        vertical
      >
        <v-window-item
          v-for="n in length"
          :key="n"
        >
          <v-card flat>
            <v-card-text>
              <strong class="text-h6"> Descripción</strong>
            </v-card-text>
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
                    <img v-if="imagePreview" :src="descripcion_image" alt="Image uploaded">
                  </v-card>
                </aside>

                <aside class="wrapper divcol fill-w">
                  <div class="divcol">
                    <label for="archivo">{{"Elige un archivo a subir".toUpperCase()}}</label>
                    <input id="archivo" ref="fileInput" type="file" accept="image/*" @input="pickFile();" />
                  </div>
                </aside>
              </v-col>
          </v-card>
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
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
      length: 3,
      window: 0,

      progress: false,
      accountId: "",
      snackbar: {},
      stepWindow: 1,
      e6: 1,

      // descripcion
      descripcion_titulo: null,/*1*/
      descripcion_categoria: {},/*2*/
      lista_descripcion_categoria: [],
      descripcion_descripcion: null,/*3*/
      descripcion_aprendizaje: null,/*4*/
      descripcion_image: null,/*5*/
      imagePreview: false,

      // crear contenido
      contenido_titulo: null,
      contenido_descripcion: null,
      contenido_tipo: null,/*6*/
      file: "",
      examen_file: null,
      // actions contenido
      selectedPanel: false,
      cont_video: true,
      panel_video: false,
      cont_examen: true,
      panel_examen: false,
      // lista
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ORDEN', align: 'start', value: 'orden' },
        { text: 'TITULO', value: 'titulo' },
        { text: 'TIPO', value: 'tipo' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      headersPreview: [
        { text: 'ORDEN', align: 'start', value: 'orden' },
        { text: 'TITULO', value: 'titulo' },
        { text: 'TIPO', value: 'tipo' },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        orden: 0,
        titulo: "",
        descripcion: null,
        tipo: "",
        file: "",
        examen: null,
        // controls
        selectedPanel: false,
        cont_video: true,
        panel_video: false,
        cont_examen: true,
        panel_examen: false,
      },
      defaultItem: {
        orden: 0,
        titulo: "",
        descripcion: null,
        tipo: "",
        file: "",
        examen: null,
        // controls
        selectedPanel: false,
        cont_video: true,
        panel_video: false,
        cont_examen: true,
        panel_examen: false,
      },

      // publicar
      publicar_precio: null,/*7*/

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
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  created () {
    this.initialize()
  },
  mounted () {
    this.get_categorys()
  },
  methods: {
    change (id) {
      for (var i = 0; i < this.lista_descripcion_categoria.length; i++) {
        if (this.lista_descripcion_categoria[i].id === id) {
          this.descripcion_categoria.id = this.lista_descripcion_categoria[i].id
          this.descripcion_categoria.name = this.lista_descripcion_categoria[i].name
          this.descripcion_categoria.img = this.lista_descripcion_categoria[i].img
        }
      }
    },
    async get_categorys () {
      this.lista_descripcion_categoria = []
      const CONTRACT_NAME = 'contract.e-learning.testnet'
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
    pickFile () {
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.descripcion_image = e.target.result
          this.imagePreview = true
        }
        reader.readAsDataURL(file[0])
      }
    },
    previewVideo(){
      let video = document.getElementById('video-preview');
      let reader = new FileReader();

      reader.readAsDataURL( this.file );
      reader.addEventListener('load', function(){
        // esta es la url
        video.src = reader.result;
        console.log(video.src)
      });
    },
    handleFileUpload( event ){
      // esta es la informacion del archivo
      this.file = event.target.files[0];
      console.log(this.file)
      this.previewVideo();
    },
    PanelVideo() {
      if (this.panel_video === false) {
        this.panel_video = true
        this.cont_examen = false
        this.selectedPanel = true
        this.contenido_tipo = "video"
      } else {
        this.panel_video = false
        this.cont_examen = true
        this.selectedPanel = false
        this.file = ''
        this.contenido_tipo = null
      }
    },
    PanelExamen() {
      if (this.panel_examen === false) {
        this.panel_examen = true
        this.cont_video = false
        this.selectedPanel = true
        this.contenido_tipo = "pdf"
      } else {
        this.panel_examen = false
        this.cont_video = true
        this.selectedPanel = false
        this.examen_file = null
        this.contenido_tipo = null
      }
    },
    Grabar() {
      let object = {
        tipo: this.contenido_tipo,
        orden: this.desserts.length+1,
        titulo: this.contenido_titulo,
        descripcion: this.contenido_descripcion,
        file: this.file,
        examen: this.examen_file,
        // controls
        selectedPanel: this.selectedPanel,
        cont_video: this.cont_video,
        panel_video: this.panel_video,
        cont_examen: this.cont_examen,
        panel_examen: this.panel_examen,
      }

      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], object)
      } else {
        this.desserts.push(object)
      }
      console.log("desserts",this.desserts)
      this.close()
      
      // itemsmoipo = null
      this.file = ''
      this.examen_file = null
      this.contenido_titulo=""
      this.contenido_descripcion=""
      // clear controls
      this.selectedPanel = false
      this.cont_video = true
      this.panel_video = false
      this.cont_examen = true
      this.panel_examen = false
    },

    // edited functions
    previewVideoEdited(){
      let video = document.getElementById('video-preview-edited');
      let reader = new FileReader();

      reader.readAsDataURL( this.editedItem.file );
      reader.addEventListener('load', function(){
        // esta es la url
        video.src = reader.result;
        console.log(video.src)
      });
    },
    handleFileUploadEdited( event ){
      // esta es la informacion del archivo
      this.editedItem.file = event.target.files[0];
      console.log(this.editedItem.file)
      this.previewVideoEdited();
    },
    PanelVideoEdited() {
      if (this.editedItem.panel_video === false) {
        this.editedItem.panel_video = true
        this.editedItem.cont_examen = false
        this.editedItem.selectedPanel = true
        this.editedItem.contenido_tipo = "video"
      } else {
        this.editedItem.panel_video = false
        this.editedItem.cont_examen = true
        this.editedItem.selectedPanel = false
        this.editedItem.file = ''
        this.editedItem.contenido_tipo = null
      }
    },
    PanelExamenEdited() {
      if (this.editedItem.panel_examen === false) {
        this.editedItem.panel_examen = true
        this.editedItem.cont_video = false
        this.editedItem.selectedPanel = true
        this.editedItem.contenido_tipo = "pdf"
      } else {
        this.editedItem.panel_examen = false
        this.editedItem.cont_video = true
        this.editedItem.selectedPanel = false
        this.editedItem.examen_file = null
        this.editedItem.contenido_tipo = null
      }
    },

    // lista
    initialize () {
      this.desserts = []
    },
    editItem (item) {
      // problema para recibir info de programas
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.desserts.forEach(element => {
        element.orden = this.desserts.indexOf(element)+1
      });
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
    async Publicar() {  
      this.progress = true
      let input = this.$refs.fileInput
      let file = input.files
      var imgFinal
      var content = []
      const formData = new FormData()
      for (var i = 0; i < this.desserts.length; i++) {
        if (this.desserts[i].tipo === "video") {
          let item = {}
          item.title = this.desserts[i].titulo
          item.description = this.desserts[i].descripcion
          item.tipo = 1
          content.push(item)
          formData.append('files', this.desserts[i].file)
        } else if (this.desserts[i].tipo === "pdf") {
          let item = {}
          item.title = this.desserts[i].titulo
          item.description = this.desserts[i].descripcion
          item.tipo = 2
          content.push(item)
          formData.append('files', this.desserts[i].examen)
        }
      } 
      formData.append('files', file[0])

      const CONTRACT_NAME = 'contract.e-learning.testnet'
      const direccionIpfs = '.ipfs.dweb.link'
  
      // connect to NEAR
        
      const near = await connect(config)
        // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        changeMethods: ['publish_course'],
        sender: wallet.account()
      })

      this.axios.post('http://localhost:3070/api/ipfs/files/', formData)
          .then((response) => {            
            console.log(response)
            for (var i = 0; i < response.data.length; i++) {
              if (response.data.length === (i+1)) {
                imgFinal = 'https://' + response.data[i].data + direccionIpfs + '/' + response.data[i].nombre
              } else {
                content[i].content = 'https://' + response.data[i].data + direccionIpfs + '/' + response.data[i].nombre
              }
            }
     
            contract.publish_course({
              title: this.descripcion_titulo,
              categories: this.descripcion_categoria,
              short_description: this.descripcion_descripcion,
              long_description: this.descripcion_aprendizaje,
              img: imgFinal,
              content: content,
              price: (parseInt(this.publicar_precio)),
            }).then((response) => {
              console.log(response)
              this.snackbar = {
                  color: "green",
                  icon: "check_circle",
                  mode: "multi-line",
                  position: "top",
                  timeout: 1500,
                  title: "Éxito!",
                  text: "Tu curso ha sido publicado",
                  visible: true
              }
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
                contenidoTabla: this.desserts,
              }
          
              this.$store.dispatch("PublicarCurso", { object});
              this.$router.push({ path: '/instructor' })
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
          }).catch((error) => {
            console.log(error)
            this.snackbar = {
                color: "red",
                icon: "error",
                mode: "multi-line",
                position: "top",
                timeout: 1500,
                title: "Error!",
                text: "Ha ocurrido un error con el IPFS",
                visible: true
              }
            this.progress = false
          })
      }
      /*
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
        contenidoTabla: this.desserts,
      }
      console.log(object)
      this.$store.dispatch("PublicarCurso", { object});
      this.$router.push({ path: '/instructor' })
    }*/
  }
};
</script>

<style src="./InstructorCursos.scss" lang="scss" />