import axios from '../../plugin/axios'
import { Base64 } from '../../common'
import { showAlert } from '../../components/Alert'

export default {
  singin: async ({ username, password }) => {
    let basicAuth = Base64.btoa(`${username}:${password}`);
    let response;
    try {
      response = await axios.post(`/user/login`, {}, { headers: { Authorization: `Basic ${basicAuth}` } })
    } catch (error) {
      showAlert({ title: "Catch error", detail: error.message, type: 'info' })
    }
    return response;
  },
  singOut: async () => { return await axios.post(`/user/me/logout`) },
  forgotPass: async ({ username }) => { return await axios.post(`/user/forgot-password`, { username: username }) },
  register: async ({ username, email, phoneNumber, newPassword, firstName, lastName, position, address, picture, logoContent, logoMIME }) => {
    return await axios.post(`/user/register`, {
      username, email, phoneNumber, newPassword, firstName, lastName, position, address, picture, logoContent, logoMIME,
    })
  }
}
