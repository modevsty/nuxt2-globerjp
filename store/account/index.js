import {
  // state
  ACCOUNT,
  // mutations
  SET_ACCOUNT,
  SET_ACCOUNT_PROFILESHOW,
  SET_ACCOUNT_IMAGES,
  LOGOUT_ACCOUNT,
  // actions
  RESET_ACCOUNT,
  FETCH_ACCOUNT,
  ENSURE_ACCOUNT_EXISTS,
  // getters
  EMAIL,
  COUNTRY,
  EXPECTEDGRADUATIONYEAR,
  PROFILESHOW,
  FIRSTNAME,
  NICKNAME,
  LASTNAME,
  MAJOR,
  INTERESTS,
  UNIVERSITY,
  DATEOFENTRY,
  DEGREE,
  ISADMIN,
  ISORGANIZER,
  AVATARIMAGE,
  BACKGROUNDIMAGE
} from "./types";

export const mutations = {
  [LOGOUT_ACCOUNT](state) {
    state[ACCOUNT] = null;
  },
  [SET_ACCOUNT](state, setting) {
    state[ACCOUNT] = state[ACCOUNT] ? {...state[ACCOUNT], ...setting} : setting;
  },
  [SET_ACCOUNT_PROFILESHOW](state, setting) {
    state[ACCOUNT].profileShow = setting.profileShow;
  },
  [SET_ACCOUNT_IMAGES](state, setting) {
    state[ACCOUNT].backgroundImage.imageUrl = setting.backgroundImage.imageUrl;
    state[ACCOUNT].backgroundImage.teaserImageUrl = setting.backgroundImage.teaserImageUrl;
    state[ACCOUNT].avatarImage.imageUrl = setting.avatarImage.imageUrl;
    state[ACCOUNT].avatarImage.teaserImageUrl = setting.avatarImage.teaserImageUrl;
  }
};

export const state = () => ({
  [ACCOUNT]: null
});

export const actions = {
  async [RESET_ACCOUNT] ({commit}) {
    if (!state[ACCOUNT]) return;
      commit(SET_ACCOUNT, null);
  },
  async [FETCH_ACCOUNT]({commit}) {
    const currDate = Date.now().toString()
    if (state[ACCOUNT]) return state[ACCOUNT];
    // console.log(rootState.authUser)
    let res = await this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid).get()
    let data = {
      email: "",
      country: "",
      expectedGraduationYear: "",
      firstName: "",
      nickName: "",
      lastName: "",
      major: "",
      profileShow: {
        nickName: true,
        realName: true,
        email: false,
        country: true,
        university: true,
        degree: true,
        major: true,
        interests: true,
        dateOfEntry: false,
        expectedGraduationYear: true
      },
      interests: [],
      university: "",
      dateOfEntry: "",
      degree: "",
      createdAt: currDate,
      updatedAt: currDate,
      backgroundImage: {imageUrl: '', teaserImageUrl: ''},
      avatarImage: {imageUrl: '', teaserImageUrl: ''}}
    if (res.exists) {
      data = {...data, ...res.data()}
    } else {
      try{
        data = {
          email: this.$fire.auth.currentUser.email,
          country: "",
          expectedGraduationYear: "",
          firstName: "",
          nickName: "",
          lastName: "",
          major: "",
          profileShow: {
            nickName: true,
            realName: true,
            email: false,
            country: true,
            university: true,
            degree: true,
            major: true,
            interests: true,
            dateOfEntry: false,
            expectedGraduationYear: true
          },
          interests: [],
          university: "",
          dateOfEntry: "",
          degree: "",
          createdAt: currDate,
          updatedAt: currDate,
          backgroundImage: {imageUrl: '', teaserImageUrl: ''},
          avatarImage: {imageUrl: '', teaserImageUrl: ''}
        }
        await this.$fire.firestore.collection("users").doc(this.$fire.auth.currentUser.uid).set(data)
      } catch(error) {
        console.log("this error",error)
      }
    }
    commit(SET_ACCOUNT, data);
    return data;
  },
  async [ENSURE_ACCOUNT_EXISTS]({ dispatch, state }) {
    if (state[ACCOUNT]) return state[ACCOUNT];

    const data = await dispatch(FETCH_ACCOUNT);
    return data;
  }
};

export const getters = {
  [ISADMIN](state) {
    if (!state[ACCOUNT] || !state[ACCOUNT].isAdmin) return false;

    return state[ACCOUNT].isAdmin;
  },
  [ISORGANIZER](state) {
    if (!state[ACCOUNT] || !state[ACCOUNT].isOrganizer) return false;

    return state[ACCOUNT].isOrganizer;
  },
  [EMAIL](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].email;
  },
  [COUNTRY](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].country;
  },
  [EXPECTEDGRADUATIONYEAR](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].expectedGraduationYear;
  },
  [FIRSTNAME](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].firstName;
  },
  [NICKNAME](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].nickName;
  },
  [LASTNAME](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].lastName;
  },
  [MAJOR](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].major;
  },
  [INTERESTS](state) {
    if (!state[ACCOUNT]) return [];

    return state[ACCOUNT].interests;
  },
  [UNIVERSITY](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].university;
  },
  [DEGREE](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].degree;
  },
  [DATEOFENTRY](state) {
    if (!state[ACCOUNT]) return "";

    return state[ACCOUNT].dateOfEntry;
  },
  [AVATARIMAGE](state) {
    if (!state[ACCOUNT]) return {imageUrl: '', teaserImageUrl: ''};

    return state[ACCOUNT].avatarImage;
  },
  [BACKGROUNDIMAGE](state) {
    if (!state[ACCOUNT]) return {imageUrl: '', teaserImageUrl: ''};

    return state[ACCOUNT].backgroundImage;
  },
  [PROFILESHOW](state) {
    if (!state[ACCOUNT]) return null;

    return state[ACCOUNT].profileShow;
  }
};

