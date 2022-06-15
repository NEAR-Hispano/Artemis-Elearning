<template>
  <section id="verCurso" class="subparent divcol gap">
    <h2 class="h4-em">{{title}}</h2>
    <v-tabs v-model="tabs" vertical >

    <!-- ////////////////////////////////// -->
      <v-tab v-for="(item,i) in dataStepper" :key="i" active-class="activeClass" class="jstart h9-em">
        <v-icon left class="notdefault-clr">
          mdi-numeric-{{i+1}}-circle
        </v-icon>
        {{item.listTitle}}
      </v-tab>
      <v-tab class="h9-em">CERTIFICACIÓN</v-tab>
    <!-- ////////////////////////////////// -->

      <v-tab-item v-for="(item,i) in dataStepper" :key="i">
        <section class="sectionTop" v-if="item.type == 'article'">
          <VueDocPreview style="height: 33.14em !important" :value="item.docPreview.value" :type="item.docPreview.type" />
        </section>

        <section class="sectionTop" v-if="item.type == 'video'">
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

        <aside class="divcol">
          <h4 class="h7-em semibold fill-w notdefault-clr">CERTIFICATE!!</h4>
          <div class="space">
            <p>Puedes optar por la certificacion ahota. puedes optar 1 vez.</p>
            <v-btn class="botones h9-em" rounded  @click="tabs=dataStepper.length">CERTIFICATE</v-btn>
          </div>
        </aside>
      </v-tab-item>
    <!-- ////////////////////////////////// -->
      <v-tab-item>
        <section class="sectionTop">
          <v-window v-model="PresentacionExamen" touchless>
            <v-window-item v-for="(item,i) in dataPresentacionExamen" :key="i" :value="i+1">
              <aside class="divcol">
                <h5>PREGUNTA # {{i+1}}</h5>
                <span>{{item.question1}}</span>
              </aside>

              <aside class="divcol">
                <div class="space">
                  <h5>OPCIONES</h5>
                  <h5>SELECCIÓN</h5>
                </div>
                <ul class="divcol">
                  <li v-for="(item2,i) in item.options" :key="i"
                    class="space">
                    <span>{{item2.option}}</span>
                    <v-checkbox
                      v-model="item2.isSelected"
                      hide-details
                      @click="item.options.forEach(element=>{element.isSelected=false});item2.isSelected=true"
                      style="margin-top: 0"
                    ></v-checkbox>
                  </li>
                </ul>
              </aside>

              <aside class="contControls spacee gap">
                <v-btn rounded v-if="i >= 1" @click="PresentacionExamen--">ANTERIOR</v-btn>
                <v-btn v-if="i > dataPresentacionExamen.length" rounded @click="PresentacionExamen++">SIGUIENTE</v-btn>
                <v-btn v-else rounded @click="PresentacionExamen++">Finalizar</v-btn>
              </aside>
            </v-window-item>

            <v-window-item :value="dataPresentacionExamen.length+1">
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
                <v-btn rounded>GRABAR</v-btn>
              </aside>
            </v-window-item>
          </v-window>
        </section>

        <aside class="divcol">
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
        </aside>

        <!-- <aside class="space">
          <h4 class="h7-em semibold fill-w notdefault-clr">DANOS TU OPINION</h4>
          <v-btn class="botones h9-em" rounded>VALORAR CURSO</v-btn>
        </aside> -->
      </v-tab-item>
    </v-tabs>
  </section>
</template>

<script>
import VueDocPreview from 'vue-doc-preview'

export default {
  name: "VerCurso",
  components: { VueDocPreview },
  data() {
    return {
      tabs: 0,
      title: "Blockchain y NEAR Protocol: Fundamentos Esenciales",
      dataStepper: [
        {
          listTitle: "INTRODUCCIÓN",
          type: "article",
          docPreview: {
            value: "https://www.sample-videos.com/doc/Sample-doc-file-100kb.doc",
            type: "office",
          },
          course: {
            desc: "Aprende los principales elementos de blockchain (cadena de bloques) y NEAR Protocol en este curso en video.",
            aprendizaje: "Tendrás un claro entendimiento de lo que es la tecnología blockchain, también conocida como cadena de bloques, y cómo funciona. <br>Entenderás lo que es Bitcoin y cómo puedes empezar a usar Bitcoin. <br>Conocerás , entenderás y podrás hablar con confianza acerca de los principales términos y conceptos relacionados a blockchain y Bitcoin."
          },
        },
        {
          listTitle: "PRESENTAND EL PROYECTO",
          type: "video",
          course: {
            video: require("@/assets/videos/test.mp4"),
            desc: "Aprende los principales elementos de blockchain (cadena de bloques) y NEAR Protocol en este curso en video.",
            aprendizaje: "Tendrás un claro entendimiento de lo que es la tecnología blockchain, también conocida como cadena de bloques, y cómo funciona. <br>Entenderás lo que es Bitcoin y cómo puedes empezar a usar Bitcoin. <br>Conocerás , entenderás y podrás hablar con confianza acerca de los principales términos y conceptos relacionados a blockchain y Bitcoin.",
          },
        },
      ],
      PresentacionExamen: 1,
      dataPresentacionExamen: [
        {
          question1: "¿Qué casos reales de uso tienen hoy los 'smart contracts'?",
          options: [
            {
              option: "Deuda en la biblioteca",
              isSelected: false,
            },
            {
              option: "Non Funfile Tokens",
              isSelected: false,
            },
            {
              option: "Lavado de Autos",
              isSelected: false,
            },
            {
              option: "Estudios Universitarios",
              isSelected: false,
            },
          ],
        },
      ],
      feedback: { rating: null, coment: null }
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>

<style src="./VerCurso.scss" lang="scss" />
