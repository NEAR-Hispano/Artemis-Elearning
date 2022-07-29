<template>
  <v-app id="error">
    <v-container fluid class="error-page center divcol">
      <v-row justify="center" align="center">
        <v-col class="tcenter center divcol paddmobile">
          <!-- content -->
          <h1 class="p bold">404</h1>
          <span class="h2-em bold">Sorry Wrong Page</span>
          <v-btn href="#/" class="h4-em bold">Homepage</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'Error',
};
</script>

<style src="./Error.scss" lang="scss"></style>
