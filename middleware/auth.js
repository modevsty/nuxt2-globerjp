export default function({ store, redirect }) {
  if(!store.getters['isLoggedIn']) {
    return redirect('/login')
  }
}
// export default function ({ store, redirect }) {
//   if (!store.state.loggedIn) {
//     return redirect('/login')
//   }
// }