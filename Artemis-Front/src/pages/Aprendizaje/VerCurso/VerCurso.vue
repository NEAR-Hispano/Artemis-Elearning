<template>
  <section id="verCurso" class="subparent divcol gap">
    <v-stepper
      v-model="e6"
      non-linear
    >
      <h2 class="h4-em">{{title}}</h2>
      <!-- ////////////////////////////////// -->
      <template v-for="(item,i) in dataStepper">
        <v-stepper-step
          :step="i+1"
          editable
          :key="i"
        >
          {{item.listTitle}}
        </v-stepper-step>

        <v-stepper-content :step="i+1" :key="i">
          <section class="sectionTop" v-if="item.type == 'article'">
            <VueDocPreview :value="docPreview.value" :type="docPreview.type" />
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
              <v-btn class="botones h9-em" rounded  @click="e6 = dataStepper+1">CERTIFICATE</v-btn>
            </div>
          </aside>

          <aside class="space">
            <h4 class="h7-em semibold fill-w notdefault-clr">DANOS TU OPINION</h4>
            <v-btn class="botones h9-em" rounded>VALORAR CURSO</v-btn>
          </aside>
        </v-stepper-content>
      </template>
      <!-- ////////////////////////////////// -->

      <!-- ////////////////////////////////// -->
      <v-stepper-step
        :step="dataStepper+1"
        editable
        complete
      >
        CERTIFICACIÓN
      </v-stepper-step>

      <v-stepper-content :step="dataStepper+1">
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
                <v-btn v-else rounded>Finalizar</v-btn>
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

        <aside class="divcol">
          <h4 class="h7-em semibold fill-w notdefault-clr">CERTIFICATE!!</h4>
          <div class="space">
            <p>Puedes optar por la certificacion ahota. puedes optar 1 vez.</p>
            <v-btn class="botones h9-em" rounded>CERTIFICATE</v-btn>
          </div>
        </aside>

        <aside class="space">
          <h4 class="h7-em semibold fill-w notdefault-clr">DANOS TU OPINION</h4>
          <v-btn class="botones h9-em" rounded>VALORAR CURSO</v-btn>
        </aside>
      </v-stepper-content>
      <!-- ////////////////////////////////// -->
    </v-stepper>
  </section>
</template>

<script>
import VueDocPreview from 'vue-doc-preview'

export default {
  name: "VerCurso",
  components: { VueDocPreview },
  data() {
    return {
      e6: 0,
      title: "Blockchain y NEAR Protocol: Fundamentos Esenciales",
      dataStepper: [
        {
          listTitle: "INTRODUCCIÓN",
          type: "article",
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
      docPreview: {
        value: "https://www.sample-videos.com/doc/Sample-doc-file-100kb.doc",
        type: "office",
      }
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>

<style src="./VerCurso.scss" lang="scss" />
