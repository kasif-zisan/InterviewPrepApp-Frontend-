import {useEffect, useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Url = "http://127.0.0.1:8000/api/user/profile/"
const user = "http://127.0.0.1:8000/auth/users/me/"
function EditProfile(){
    const[name, setName] = useState("");
    const[work, setWork] = useState("");
    const [author, setAuthor] = useState("");
    const[gender, setGender] = useState("");
    const [isError, setIsError] = useState("");
    const[profileImage, setProfileImage] = useState("");
    const[coverPhoto, setCoverPhoto] = useState("");
    const Access = localStorage.accessToken
    const navigate = useNavigate();
    useEffect(() => {
        //                                                         AUTHOR that is CURRENTLY LOGGED IN and about to POST (INTERCEPTOR AND .GET)
        axios.interceptors.request.use(
            config => {
              config.headers.authorization = `JWT ${Access}`;
              return config;
            },
            error => {
              return Promise.reject(error); 
            }
          )
          axios
          .get(user)
          .then((res) => {
            setAuthor(res.data.id)
           
          })
          
    }, [])

    const handleProfileImage = (e) => {
      console.log(e.target.files)
      setProfileImage(e.target.files[0])
    }
    const handleCoverPhoto = (e) => {
        console.log(e.target.files)
        setCoverPhoto(e.target.files[0])
    }
    
    const edit = (e) => {
        e.preventDefault();
        
        const formdata = new FormData();
        
        formdata.append('parent', author)
        formdata.append('name', name)
        formdata.append('works_at', work)
        formdata.append('gender', gender)
        formdata.append('avatar', profileImage)
        formdata.append('coverPhoto', coverPhoto)
        axios({
            method : "put",
            url : Url + author + '/',
            data : formdata,
            headers: { "Content-Type": "multipart/form-data", Authorization: `JWT ${Access}`},
        })
        .then((response) => {   
            console.log(response.data)
        
        })
        .catch((error) => setIsError(error.message));
        //navigate('/profile')
    }
    return(
        <div className = "EditProfile">
            <h1>Edit Profile</h1>
            <label>Name</label>
            <input type="text"  onChange={(e)=>setName(e.target.value)} required/>
            <label>Works at:</label>
            <input type="text"  onChange={(e)=>setWork(e.target.value)} required/>
            <label ><b>Change Profile Picture: </b></label>
                <input type="file" name="image" accept = "image/*" onChange={handleProfileImage}/>
            <label ><b>Change Cover Photo: </b></label>
                <input type="file" name="image" accept = "image/*" onChange={handleCoverPhoto}/>
            <button onClick={edit}>Edit Profile</button>
        </div>
    );
}
export default EditProfile;