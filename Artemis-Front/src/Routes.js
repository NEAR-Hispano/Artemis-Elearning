import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    // path 1
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/Login/Login'),
    },
    // path 2
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/components/Layout/Layout'),
      children: [
        {
          path: '/',
          name: 'Home',
          component: () => import('@/pages/Home/Home'),
        },
        {
          path: '/category-creator',
          name: 'CreatorCategoria',
          component: () => import('@/components/CreatorCategoria/CreatorCategoria'),
        },
        {
          path: '/user-profile',
          name: 'Profile',
          component: () => import('@/pages/Profile/Profile'),
        },
        {
          path: '/cursos',
          name: 'Cursos',
          component: () => import('@/pages/Cursos/Cursos'),
        },
        {
          path: '/curso/:id?',
          name: 'DetalleCurso',
          component: () => import('@/pages/Cursos/DetalleCurso'),
        },
        {
          path: '/instructor',
          name: 'Instructor',
          component: () => import('@/pages/Instructor/Instructor'),
        },
        {
          path: '/instructor-cursos',
          name: 'InstructorCursos',
          component: () => import('@/pages/InstructorCursos/InstructorCursos'),
        },
        {
          path: '/instructor-editar-curso/:id?',
          name: 'InstructorCursosEdited',
          component: () => import('@/pages/InstructorCursos/InstructorCursosEdited'),
        },
        {
          path: '/aprendizaje',
          name: 'Aprendizaje',
          component: () => import('@/pages/Aprendizaje/Aprendizaje'),
        },
        {
          path: '/ver-curso/:id?',
          name: 'VerCurso',
          component: () => import('@/pages/Aprendizaje/VerCurso/VerCurso'),
        },
        {
          path: '/presentar-examen/:id?',
          name: 'PresentarExamen',
          component: () => import('@/pages/Aprendizaje/VerCurso/PresentarExamen'),
        },
        {
          path: '/certificados',
          name: 'Certificados',
          component: () => import('@/pages/Certificados/Certificados'),
        },
        {
          path: '/congrats',
          name: 'Congrats',
          component: () => import('@/pages/Congrats/Congrats'),
        },
      ],
    },
    // here path 3 if need
    
    // path 4
    {
      path: '*',
      name: 'Error',
      component: () => import('@/components/Error/Error'),
    }
  ],
});
