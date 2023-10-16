import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {app} from "../firebase"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutStart, signOutSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice"


function Profile() {
  const {currentUser, loading, error} = useSelector((state)=>state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName) 
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on("state_changed", 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
        setFilePerc(Math.round(progress))
      },  
    
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL)=>{
        setFormData({...formData, avatar:downloadURL})
      }) 
    }
    )
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]:e.target.value})
  }
  

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify(formData)
      })

      const data = await res.json()
      if(data.success===false){
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

    } catch(error){
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDelete = async() => {
    try{
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE"        
      })
      const data = res.json()
      if(data.success===false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess())
    } catch(error){
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async() => {
    try{
      dispatch(signOutStart())
      const res = await fetch(`/api/auth/signout`)
      const data = res.json()
      console.log("Before's data", data )
      if(data.success===false){
        console.log("Mid's data", data )
        dispatch(signOutFailure(data.message))
        return
      }
      console.log("After's data", data )
      dispatch(signOutSuccess()) 
    } catch(error){
      dispatch(signOutFailure(error))
    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Hi {currentUser.username}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="text-sm self-center">
          {fileUploadError ?
          <span className="text-red-700">Error in uploading image</span>:
          filePerc>0 && filePerc<100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePerc}%`}
            </span>
          ):filePerc===100?(
            <span className="text-green-700">Image successfully uploaded !</span>
          ):(
            " "
          )
        }
        </p>
        <input onChange={handleChange} defaultValue={currentUser.username} id="username" type="text" placeholder="username" className="border rounded-lg p-3" />
        <input onChange={handleChange} defaultValue={currentUser.email} id="email" type="text" placeholder="email" className="border rounded-lg p-3" />
        <input onChange={handleChange} defaultValue={currentUser.password} id="password" type="password" placeholder="password" className="border rounded-lg p-3" />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:placeholder-opacity-95 disabled:opacity-80">{loading?"loading":"update"}</button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>

      <p className="text-red-700 mt-5">{error? error : " "} </p>
      {updateSuccess && <p className="text-green-500">User updated successfully</p>}
    </div>
  )
}

export default Profile