<template>
  <v-row id="footer" no-gutters class="spacea align">
    <!-- content -->
    <aside class="dicol">
      <img class="logoFooter" src="@/assets/logos/logo.png" alt="logo Artemis" style="max-width: 100px; height: auto; "  >
      <!-- <p class="h8-em">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
        tempor incididunt ut labore et dolore m
      </p> -->
    </aside>

    <aside v-for="(item, index) in dataFooter" :key="index"
      class="divcol">
      <label class="h8-em">{{ item.title }}</label>
      <a v-for="(item2, index) in item.links" :key="index" @click="$router.push(item2.to)"
      class="h8-em">
        {{ item2.link }}
      </a>

      <a :href="item.to" v-if="item.icon" class="notHover center">
        <v-btn icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </a>
    </aside>
  </v-row>
</template>

<script>
import * as nearAPI from 'near-api-js'
const { connect, keyStores, WalletConnection } = nearAPI

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
  data() {
    return {
      dataFooter: [
        {
          title: "Ir a",
          links: [
            {
              link: "Inicio",
              to: "/"
            },
            {
              link: "Cursos",
              to: "/cursos"
            },
            // {
            //   title: "Mi Perfil",
            //   link: "#"
            // },
            // {
            //   link: "Contacto",
            //   to: "#"
            // }
          ]
        },
        {
          title: "NEAR ARTEMIS",
          links: [
            {
              link: "Quienes somos",
              to: "#"
            },
            {
              link: "Estudios",
              to: "#"
            },
            {
              link: "Ayuda y Asistencia",
              to: "#"
            },
            {
              link: "Politicas de Privacidad",
              to: "#"
            },
          ],
        },
        {
          title: "Siganos",
          to: "#",
          icon: "discord"
        },
      ]
    }
  },
  mounted() {
    this.isSigned() 
  },
  methods: {
    async isSigned () {    
      const near = await connect(config);
      const wallet = new WalletConnection(near)
      if (wallet.isSignedIn()) {
        this.sesion = true
        // returns account Id as string
        const walletAccountId = wallet.getAccountId()
        this.accountId = walletAccountId
        this.dataFooter = [
            {
              title: "Ir a",
              links: [
              {
                link: "Inicio",
                to: "/"
              },
              {
                link: "Cursos",
                to: "/cursos"
              },
              // {
              //   title: "Mi Perfil",
              //   link: "#"
              // },
              
              {
                link: "Instructor",
                to: "/instructor"
              },
              {
                link: "Mi Aprendizaje",
                to: "/aprendizaje"
              }
            ]
          },
          {
            title: "NEAR ARTEMIS",
            links: [
              {
                link: "Quienes somos",
                to: "#"
              },
              {
                link: "Estudios",
                to: "#"
              },
              {
                link: "Ayuda y Asistencia",
                to: "#"
              },
              {
                link: "Politicas de Privacidad",
                to: "#"
              },
            ],
          },
          {
            title: "Siganos",
            to: "#",
            icon: "discord"
          },
        ]
      } else {
        this.dataFooter = [
          {
            title: "Ir a",
            links: [
              {
                link: "Inicio",
                to: "/"
              },
              {
                link: "Cursos",
                to: "/cursos"
              },
              // {
              //   title: "Mi Perfil",
              //   link: "#"
              // },
              // {
              //   link: "Contacto",
              //   to: "#"
              // }
            ]
          },
          {
            title: "NEAR ARTEMIS",
            links: [
              {
                link: "Quienes somos",
                to: "#"
              },
              {
                link: "Estudios",
                to: "#"
              },
              {
                link: "Ayuda y Asistencia",
                to: "#"
              },
              {
                link: "Politicas de Privacidad",
                to: "#"
              },
            ],
          },
          {
            title: "Siganos",
            to: "#",
            icon: "discord"
          },
        ]
      }
    },
  }
}
</script>

<style src="./Layout.scss" lang="scss" />
