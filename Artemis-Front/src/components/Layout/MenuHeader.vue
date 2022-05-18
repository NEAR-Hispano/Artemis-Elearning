<template>
  <section id="menuHeader">
    <!-- drawer mobile -->
    <v-navigation-drawer
      v-model="drawer"
      fixed
      height="100%"
      temporary
      right
      :overlay-opacity="overlay_opacity"
      :overlay-color="overlay_color"
      color="#F29627"
    >
      <v-list>
        <v-list-item
          v-for="(item, index) in dataDrawer"
          :key="item.title"
          :href="item.to"
          link
        >
          <v-list-item-content>
            <div v-bind:key="index" class="center">
              <a :href="item.to" class="h8-em" style="color:#FFFFFF !important">{{ item.title }}</a>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- submenu use if u need it-->
    <!-- <v-menu
      bottom
      transition="scroll-y-transition"
      offset-y
      z-index="10"
      max-width="244px"
      activator=".openSubmenuADrawer"
    >
      <v-list color="#ef3340">
        <v-list-item
          v-for="(item, i) in dataSubmenuA"
          :key="i"
          :href="item.to"
        >
          <v-list-item-title class="center">
            <a :href="item.to" class="h8-em" style="color:#FFFFFF !important">
              {{ item.title }}
            </a>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->

    <!-- dialog (delete if dont need it) -->
    <!-- <v-dialog
      id="dialogo"
      v-model="dialog"
      max-width="832.49px"
      :overlay-opacity="overlay_opacity"
      :overlay-color="overlay_color"
      activator=".openMenuCollections"
    >
      <section class="colorCartas">
        <span class="center bold h4">
          use if u need this
        </span>
      </section>
    </v-dialog> -->

  </section>
</template>

<script>
export default {
  name: "HeaderMenu",
  i18n: require("./i18n"),
  // created() {
  //   const theme = localStorage.getItem("theme");
  //   this.OverlayMethod(theme);
  // },
  data() {
    return {
      // dialog: false,
      overlay_opacity: "0.1",
      overlay_color: "orange",
      drawer: false,
      dataDrawer: [
        {
          title: "Inicio",
          to: "#/",
        },
        {
          title: "Cursos",
          to: "#",
        },
        // {
        //   title: "Mi Perfil",
        //   to: "#",
        // },
        {
          title: "Instructor",
          to: "#",
        },
        {
          title: "Mi Aprendizaje",
          to: "#",
        },
      ],
    };
  },
  methods: {
    // OverlayMethod(theme) {
    //   if (theme == "dark") {
    //     this.overlay_opacity = "0.5";
    //     this.overlay_color = "black"
    //   }
    //   if (theme == "light") {
    //     this.overlay_opacity = "0.2";
    //     this.overlay_color = "white"
    //   }
    // },
    ShowDrawer() {
      this.drawer = !this.drawer
    },
  },
};
</script>

<style src="./Layout.scss" lang="scss"></style>
