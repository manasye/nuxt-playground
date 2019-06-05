import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        )
        state.loadedPosts[postIndex] = editedPost
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios
          .get('https://nuxt-playground-manasye.firebaseio.com/posts.json')
          .then(res => {
            const posts = []
            for (const key in res.data) {
              posts.push({ ...res.data[key], id: key })
            }
            vuexContext.commit('setPosts', posts)
          })
          .catch(e => {
            context.error(e)
          })
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return axios
          .post(
            'https://nuxt-playground-manasye.firebaseio.com/posts.json',
            createdPost
          )
          .then(result => {
            vuexContext.commit('addPost', {
              ...createdPost,
              id: result.data.name
            })
          })
          .catch(() => {})
      },
      editPost(vuexContext, editedPost) {
        return axios
          .put(
            `https://nuxt-playground-manasye.firebaseio.com/posts/${
              editedPost.id
            }.json`,
            editedPost
          )
          .then(() => {
            vuexContext.commit('editPost', editedPost)
          })
          .catch(() => {})
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      }
    }
  })
}

export default createStore
