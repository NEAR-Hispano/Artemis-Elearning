<template>
  <section id="walletAlert">
    <v-alert
      :value="alertMetamask"
      elevation="3"
      transition="scale-transition"
      id="alertaWallet"
    >
      <aside id="contenedorCloseAlert">
        <v-btn class="iconoCloseAlert" icon @click="alertMetamask = false">
          <v-icon id="colorCloseAlert" size="1.5rem">mdi-close</v-icon>
        </v-btn>
      </aside>

      <v-col cols="11" id="contenedorAlertWallet" style="padding: 0 !important">
        <div class="contenedorAlertPosition">
          <v-icon style="color: #f6943c !important" size="2.5rem"
            >mdi-minus-circle</v-icon
          >
          <span id="titleAlert">Metamask not Founded</span>
        </div>

        <div class="contenedorAlertPosition">
          <v-icon style="visibility: hidden" size="2.5rem"
            >mdi-minus-circle</v-icon
          >
          <p class="textAlertUp">Need metamask extension for loggin</p>
        </div>
        <div class="contenedorAlertPosition">
          <v-icon style="visibility: hidden" size="2.5rem"
            >mdi-minus-circle</v-icon
          >
          <a
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=es"
            target="_blank"
            class="textAlertDown"
          >
            View on explorer
            <sup style="top: -3px !important">
              <v-icon x-small class="flechitaAlert"> mdi-arrow-top-right </v-icon>
            </sup>
          </a>
        </div>
      </v-col>
    </v-alert>
  </section>
</template>

<script>
export default {
  name: "WalletAlert",
  data() {
    return {
      alertMetamask: false,
    };
  },
  methods: {
    AlertMetamask() {
      this.alertMetamask = true
    }
  }
};
</script>

<style src="./Alerts.scss" lang="scss"></style>
