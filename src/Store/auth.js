import axios from 'axios';
export const auth = async (email, password) => {

  const call = axios.get('http://localhost:4000/user/login', {
    params: {
      email: email,
      password: password
    }
  })

  const respons = await call.then(respons => respons.data)
  window.localStorage.setItem('data', JSON.stringify(respons))
  return respons;

};

export const signUp = async (data) => {

  const bodyFormData = new FormData();
  bodyFormData.append('email', data.email);
  bodyFormData.append('password', data.password);
  bodyFormData.append('firstName', data.firsName);
  bodyFormData.append('lastName', data.lastName);
  bodyFormData.append('gender', data.gender);
  bodyFormData.append('image', data.file);

  const call = axios({
    method: "post",
    url: "http://localhost:4000/user/signup",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })

  const respons = await call.then(respons => respons.data)

  if (respons == 'Invalied Email!') {
    return respons;

  } else {
    window.localStorage.setItem('data', JSON.stringify(respons))
    return respons;
  }



};



