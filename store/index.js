export const state = () => ({
  authUser: null,
  loggedIn: false,
})

export const getters = {
  isLoggedIn: state => !!state.authUser && state.loggedIn,
}


export const actions = {
  async nuxtServerInit({ dispatch }, ctx) {
    if (this.$fire.auth === null) {
      throw 'nuxtServerInit Example not working - this.$fire.auth cannot be accessed.'
    }

    if (ctx.$fire.auth === null) {
      throw 'nuxtServerInit Example not working - ctx.$fire.auth cannot be accessed.'
    }

    if (ctx.app.$fire.auth === null) {
      throw 'nuxtServerInit Example not working - ctx.$fire.auth cannot be accessed.'
    }
    
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { allClaims: claims, ...authUser } = ctx.res.locals.user
      await dispatch('onAuthStateChanged',
        authUser,
        claims
      )
    }
  },

  async onAuthStateChanged({ commit, dispatch }, {authUser, claims}) {
    if (window.location.pathname.includes('/signup')) {
      return
    }
    // console.log('authUser',authUser)

    if (!authUser) {
      // await this.$router.push("/")
      await dispatch('account/RESET_ACCOUNT')
      commit('RESET_STORE')
      return
    }

    if (!authUser.emailVerified ) {
      return
    }

    if (authUser ) {
      try {
        await dispatch('account/FETCH_ACCOUNT')
        // await this.$router.push("/dashboard")
        
        // const beforeLoginPath = localStorage.getItem('BEFORE_LOGIN_PATH')
        // console.log(beforeLoginPath)
        // if (beforeLoginPath) {
        //   this.$router.push({path: beforeLoginPath})
        //   localStorage.setItem('BEFORE_LOGIN_PATH', null)
        // } else {
        //   this.$router.push({path: '/dashboard'})
        // }
      } catch (e) {
        console.error(e)
      }
    }

    commit('SET_USER', authUser)
  }
}

export const mutations = {

  RESET_STORE(state) {
    state.authUser = null
    state.loggedIn = false
  },

  SET_USER(state, authUser) {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
      emailVerified: authUser.emailVerified,
      displayName: authUser.displayName,
      idToken: authUser.idToken
    }
    state.loggedIn = true
  }
}
