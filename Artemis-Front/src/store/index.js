import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

  namespace: true,
  state: {
    baseURL: process.env.BASE_URL,
    theme: "light",
    dataCursos: [],
    editedCursos: {},
    editedIndex: 0,
  },
  mutations: {
    CambiarTheme(state, theme) {
      state.theme = theme
    },
    PublicarCurso(state, object) {
      state.dataCursos.push(object)
    },
    EliminarCurso(state, index) {
      state.dataCursos.splice(index, 1)
    },
    EditarCurso(state, {object, index}) {
      state.editedCursos = object
      state.editedIndex = index
    },
    PublicarCursoEdited(state, object) {
      state.dataCursos.splice(state.editedIndex, 1)
      state.dataCursos.push(object)
    },
  },
  actions: {
    CambiarTheme({state, commit}, {theme, element}) {
      element.href = `${state.baseURL}themes/${theme}/theme.css`;
      localStorage.setItem("theme", theme);
      commit( "CambiarTheme", theme)
    },
    PublicarCurso({commit}, {object}) {
      // localStorage.setItem("curso", object);
      commit( "PublicarCurso", object)
    },
    EliminarCurso({commit}, {index}) {
      commit( "EliminarCurso", index)
    },
    EditarCurso({commit}, {object, index}) {
      commit( "EditarCurso", {object, index})
    },
    PublicarCursoEdited({commit}, {object}) {
      // localStorage.setItem("curso", object);
      commit( "PublicarCursoEdited", object)
    },
  },
});
