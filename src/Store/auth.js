import axios from 'axios';
export const auth = async (email, password) => {

  const call = axios.get('http://localhost:4000/user/login', {
    params: {
      email: email,
      password: password
    }
  })

  const respons = await call.then(respons => respons.data)

 


  if (respons === 'Email or Password is InCorrect!' || respons === 'Somthing Went Wrong!') {
    return respons;

  } else {
    window.localStorage.setItem('data', JSON.stringify(respons))
    return respons;
  }

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

  if (respons === 'Invalied Email!') {
    return respons;

  } else {
    window.localStorage.setItem('data', JSON.stringify(respons))
    return respons;
  }



};




export const Add = async (data) => {

  const bodyFormData = new FormData();
  bodyFormData.append('title', data.title);
  bodyFormData.append('desc', data.desc);
  bodyFormData.append('pref', data.pref);
  for (const key of Object.keys(data.image)) {
    bodyFormData.append('image', data.image[key])
  }
  bodyFormData.append('price', data.price);

  const call = axios({
    method: "post",
    url: "http://localhost:4000/courses/addcours",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })

  const respons = await call.then(respons => respons.data)

  return respons;

};





export const Get = async () => {


  const call = axios({
    method: "get",
    url: "http://localhost:4000/courses/getcoures",
  })

  const respons = await call.then(respons => respons.data)
  return respons;
};


export const Delete = async (data) => {

  const call = axios.delete('http://localhost:4000/courses/deletecoures', {
    params: {
      id: data
    }
  })

  const respons = await call.then(respons => respons.data)
  return respons;
};



