<template>
  <section id="creatorCategoria" class="parent divcol">
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
    <v-col>
      <h2 class="h4-em">
        {{"Categoria".toUpperCase()}}
      </h2>
    </v-col>

    <v-col class="contnombre divcol">
      <label for="nombre">{{"Nombre".toUpperCase()}}</label>
      <v-text-field
        v-model="name"
        solo
      ></v-text-field>
    </v-col>

    <v-col class="contimagen divrow">
      <aside class="divcol">
        <label>{{"Imagen".toUpperCase()}}</label>
        <v-card color="#F3F6F5">
          <img v-if="imagePreview" :src="image" alt="Image uploaded">
        </v-card>
      </aside>

      <aside class="wrapper divcol fill-w">
        <div class="divcol">
          <label for="archivo">{{"Elige un archivo a subir".toUpperCase()}}</label>
          <input id="archivo" ref="fileInput" type="file" @input="pickFile();" />
        </div>

        <div class="center">
          <v-btn v-if="editarBtn" rounded color="#F29627" class="h8-em" @click="Guardar()">GUARDAR</v-btn>
          <v-btn v-else rounded color="#F29627" class="h8-em" @click="GuardarEditado()">GUARDAR</v-btn>
          <v-btn v-if="deleteBtn" rounded color="#F29627" class="h8-em" @click="Delete()">ELIMINAR</v-btn>
        </div>
      </aside>
    </v-col>

    <v-col class="contlista">
      <aside>
        <h3 class="h7-em">{{"Lista de categorias".toUpperCase()}}</h3>
      </aside>

      <v-slide-group
        center-active
        show-arrows
        class="fill-w"
      >
        <v-slide-item v-for="(item,i) in dataSlide" :key="i">
          <v-card color="#FFFFFF" @click="Editar(item)">
            <img :src="item.img" alt="image uplodaded">
            <span class="h8-em bold">{{ item.name }}</span>
          </v-card>
        </v-slide-item>
      </v-slide-group>
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
  name: "CreatorCategorias",
  data() {
    return {
      dataSlide: [],
      image: "",
      name: "",
      imagePreview: false,
      editarBtn: true,
      deleteBtn: false,
      selected: {},

      snackbar: {},
    }
  },
  mounted () {
    this.get_categorys()
  },
  methods: {
    pickFile () {
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.image = e.target.result
          this.imagePreview = true
        }
        reader.readAsDataURL(file[0])
      }
    },
    async Guardar() {
      if (this.image != "" && this.name != "") {  
        let input = this.$refs.fileInput
        let file = input.files
        const CONTRACT_NAME = 'contract.e-learning.testnet'
        const direccionIpfs = '.ipfs.dweb.link'
        // connect to NEAR
        
        const near = await connect(config)
        // create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['set_category'],
          sender: wallet.account()
        })
        const formData = new FormData()
        formData.append('file', file[0])

        await this.axios.post('http://localhost:3070/api/ipfs/', formData)
          .then((response) => {       
            console.log(response)     
            contract.set_category({
              name: this.name,
              img: 'https://' + response.data.data + direccionIpfs + '/' + response.data.nombre
            }).then(() => {
              this.get_categorys()
              this.snackbar = {
                color: "green",
                icon: "check_circle",
                mode: "multi-line",
                position: "top",
                timeout: 1500,
                title: "Éxito!",
                text: "La categoria ha sido creada",
                visible: true
              }
              this.image = ""
              this.name = ""
              this.imagePreview = false
              this.deleteBtn = false
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
          })
      }
    },
    async GuardarEditado() {
      if (this.image != "" && this.name != "") {
        let input = this.$refs.fileInput
        let file = input.files
        const CONTRACT_NAME = 'contract.e-learning.testnet'
        const direccionIpfs = '.ipfs.dweb.link'
        // connect to NEAR
        
        const near = await connect(config)
        // create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['put_category'],
          sender: wallet.account()
        })
        const formData = new FormData()
        formData.append('file', file[0])

        await this.axios.post('http://localhost:3070/api/ipfs/', formData)
          .then((response) => {            
            contract.put_category({
              category_id: this.id,
              name: this.name,
              img: 'https://' + response.data.data + direccionIpfs + '/' + response.data.nombre
            }).then(() => {
              this.get_categorys()
              this.snackbar = {
                color: "green",
                icon: "check_circle",
                mode: "multi-line",
                position: "top",
                timeout: 1500,
                title: "Éxito!",
                text: "La categoria ha sido actualizada",
                visible: true
              }
              this.image = ""
              this.name = ""
              this.imagePreview = false
              this.deleteBtn = false
            }).catch((error) => {
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
          })
      }
    },
    Editar(item) {
      this.imagePreview = true
      this.deleteBtn = true
      this.editarBtn = false
      this.id = item.id
      this.name = item.name
      this.image = item.img
      
      this.selected = item
    },
    async Delete() {
        const CONTRACT_NAME = 'contract.e-learning.testnet'
        // connect to NEAR
        
        const near = await connect(config)
        // create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['delete_category'],
          sender: wallet.account()
        })
        contract.delete_category({
          category_id: this.id,
        }).then((response) => {
            console.log(response)
            this.get_categorys()
            this.snackbar = {
                color: "green",
                icon: "check_circle",
                mode: "multi-line",
                position: "top",
                timeout: 1500,
                title: "Éxito!",
                text: "La categoria ha sido eliminada",
                visible: true
            }
            this.imagePreview = false
            this.editarBtn = true
            this.deleteBtn = false
            this.image = ""
            this.name = ""
        }).catch((error) => {
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
        })
    },
    async get_categorys () {
      this.dataSlide = []
      const CONTRACT_NAME = 'contract.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_category'],
        sender: wallet.account()
      })
      await contract.get_category().then((response) => {
        response.forEach((element) => {
          this.dataSlide.push({ id: element.id, name: element.name, img: element.img })
        })
      })
    },
  }
};
</script>

<style src="./CreatorCategoria.scss" lang="scss" />
