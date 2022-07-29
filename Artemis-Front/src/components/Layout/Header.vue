<template>
  <section>
    <!-- mobile -->

    <!-- desktop -->
    <v-app-bar
    id="headerApp"
    height="85px"
    fixed
  >
    <v-row>
      <v-col cols="12" sm="11" class="space align paddbottomdel">
        <aside class="contleft divrow acenter">
          <!-- toggle -->
          <v-btn class="toggle vermobile" width="2.8em" height="2.8em" rounded
            @click.stop="ShowDrawer()">
            <v-icon size="clamp(1.5em, 2vw, 2em)" color="#FFFFFF !important">mdi-menu</v-icon>
          </v-btn>
          <!-- logo -->
          <router-link to="/" class="eliminarmobile">
            <img class="logo" src="@/assets/logos/logo.png" style="max-width: 100px; height: auto; "
              alt="logo">
          </router-link>
        </aside>

        <!-- content -->
        <div class="contmiddle">
          <a v-for="(item, index) in dataHeader" :key="index" @click="$router.push(item.link)"
            class="h9-em notdefault-hover">
            {{ item.title }}
          </a>
        </div>

        <divider></divider>

        <aside class="contright">
          <v-btn 
            v-show="!sesion"
            class="walletButton" 
            color="#F29627" 
            rounded
            @click="signIn()"
          >
            Conectar con NEAR
          </v-btn>
          <div
              v-show="sesion"
              class="text-center"
            >
              <v-menu offset-y transition="slide-x-transition">
                <template #activator="{ on, attrs }">
                  <v-btn 
                    class="walletButton" 
                    color="#F29627" 
                    rounded
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ accountId }}
                  </v-btn>
                </template>
                <v-list style = "background-color: #E5E5E5">
                  <v-list-item to="/user-profile">
                    <v-list-item-title>Mi Perfil</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="signOut()">
                    <v-list-item-title>Cerrar Sesión</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
        </aside>
      </v-col>
    </v-row>
  </v-app-bar>

  <MenuHeader ref="menu"></MenuHeader>
  </section>
</template>

<script>
import MenuHeader from "./MenuHeader.vue"
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

let scrollValue =
document.body.scrollTop || document.documentElement.scrollTop;
let resizeTimeout;
function resizeThrottler(actualResizeHandler) {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      resizeTimeout = null;
      actualResizeHandler();

      // The actualResizeHandler will execute at a rate of 15fps
    }, 80);
  }
}
export default {
  name: "Header",
  components: {
    MenuHeader
  },
  i18n: require("./i18n"),
  // created() {
  //   this.element = document.getElementById("theme");
  //   const theme = localStorage.getItem("theme");
  //   if (theme) {
  //     this.CambiarTheme(theme);
  //   }
  //   if (theme == "light") {
  //     this.themeButton = true;
  //   }
  //   if (theme == "dark") {
  //     this.themeButton = false;
  //   }
  // },
  data() {
    return {
      // themeButton: true,
      accountId: null,
      sesion: null,
      dataHeader: [
        {
          title: "Inicio",
          link: "/"
        },
        {
          title: "Cursos",
          link: "/cursos"
        },
        // {
        //   title: "Mi Perfil",
        //   link: "#"
        // },
        // {
        //   title: "Contacto",
        //   link: "#"
        // }
      ]
    };
  },
  methods: {
    async signIn () {
      const near = await connect(config);
      const wallet = new WalletConnection(near)
      wallet.requestSignIn(
        'contract2.e-learning.testnet'
      )
    },
    async isSigned () {    
      const near = await connect(config);
      const wallet = new WalletConnection(near)
      if (wallet.isSignedIn()) {
        this.sesion = true
        // returns account Id as string
        const walletAccountId = wallet.getAccountId()
        this.accountId = walletAccountId
        this.dataHeader = [
          {
            title: "Inicio",
            link: "/"
          },
          {
            title: "Cursos",
            link: "/cursos"
          },
          // {
          //   title: "Mi Perfil",
          //   link: "#"
          // },
          
          {
            title: "Instructor",
            link: "/instructor"
          },
          {
            title: "Mi Aprendizaje",
            link: "/aprendizaje"
          }
      ]
      }
    },
    async signOut () {
      const near = await connect(config);
      const wallet = new WalletConnection(near)
      wallet.signOut()
      this.sesion = false
      this.dataHeader = [
        {
          title: "Inicio",
          link: "/"
        },
        {
          title: "Cursos",
          link: "/cursos"
        },
        // {
        //   title: "Mi Perfil",
        //   link: "#"
        // },
        // {
        //   title: "Contacto",
        //   link: "#"
        // }
      ]
      this.$router.push({ path: '/' })
    },
    ShowDrawer() {
      this.$refs.menu.ShowDrawer();
    },
    // CambiarTheme(theme) {
    //   this.$store.dispatch("CambiarTheme", { theme, element: this.element });
    //   this.themeButton = !this.themeButton;
    // },
    // CambiarTheme2(theme) {
    //   this.$refs.menu.OverlayMethod(theme);
    // },
    OcultarHeader() {
      // in top
      let Desplazamiento_Actual = window.pageYOffset;
      if (Desplazamiento_Actual > scrollValue) {
        document.getElementById("headerApp").style.background = "#FFFFFF";
      } else {
        document.getElementById("headerApp").style.background = "transparent";
      }
    },
    scrollListener() {
      resizeThrottler(this.OcultarHeader);
    }
  },
  mounted() {
    document.getElementById("headerApp").style.background = "transparent";
    document.addEventListener('scroll', this.scrollListener);
    this.isSigned()
    
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.scrollListener);
  }
};
</script>

<style src="./Layout.scss" lang="scss" />
