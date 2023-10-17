import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useEffect, useState } from "react"
import { app } from "../firebase"
import {useNavigate, useParams} from "react-router-dom"

function UpdateListing() {
    const navigate = useNavigate()
    
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:0,
        discountedPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    })
    const {listingId} = useParams()
    const func = async() => {
        const res = await fetch(`/api/listing/getListing/${listingId}`)
        const data = await res.json()
        if(data.success===false){
            console.log(data.message)
            return
        }
        setFormData(data)
    }
    useEffect(()=>{
        func()
    },[])
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    console.log(formData)
    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length<7){
            setUploading(true)
            setImageUploadError(false)
            
            const promises = []

            for(let i=0;i<files.length;i++){
                promises.push(storeImage(files[i]))
            }
            // Haandi Function Begins
            Promise.all(promises).then((urls)=>{
                setFormData({...formData, imageUrls:formData.imageUrls.concat(urls)})
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError("Image upload failed")
                setUploading(false)
            })
            // Haandi Function Ends
        } else{
            setImageUploadError("You can only upload 6 images per listing")
            setUploading(false)
        }
    }
    // Haandi Function Begins
    const storeImage = async(file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log(`Upload is ${progress}% done`)
                },
                (error)=>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL)
                    })
                }
            )
        })
    }
    // Haandi function ends

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls:formData.imageUrls.filter((_,i)=> i!==index)
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id==='rent'){
            setFormData({
                ...formData,
                type:e.target.id
            }) 
        }
        else if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id==='offer'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked
            })
        }
        else{
            setFormData({...formData, [e.target.id]:e.target.value})
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            if(formData.imageUrls.length<1) return setError("You must upload at least one image")
            if(+formData.regularPrice < +formData.discountedPrice) return setError("Discounted price must be lower than regular price")
            setLoading(true)
            setError(false)
            const res = await fetch(`/api/listing/update/${listingId}`,{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(formData)
            })
            const data = await res.json()
            setLoading(false)
            if(data.success===false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)

        } catch(error){
            setLoading(false)
            setError(error.message)
        }
    }

  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className='text-3xl font-semibold text-center my-7'>
            Update a Listing
        </h1>
        <form className="flex clex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
                <input onChange={handleChange} value={formData.name} id="name" maxLength="62" minLength="10" required type="text" placeholder="Name" className="border p-3 rounded-lg" />
                <textarea onChange={handleChange} value={formData.description} id="description" required type="text" placeholder="Description" className="border p-3 rounded-lg" />
                <input onChange={handleChange} value={formData.address} id="address" required type="text" placeholder="Address" className="border p-3 rounded-lg" />
                

                <div className="flex gap-6 flex-wrap ">
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.type==="sale"} type="checkbox" id="sale" className="w-5" />
                        <span> Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.type==="rent"} type="checkbox" id="rent" className="w-5" />
                        <span> Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.parking} type="checkbox" id="parking" className="w-5" />
                        <span> Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.furnished} type="checkbox" id="furnished" className="w-5" />
                        <span> Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.offer} type="checkbox" id="offer" className="w-5" />
                        <span> Offer</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={formData.bedrooms} className="p-3 border border-gray-300 rounded-lg" type="number" id="bedrooms" min="1" max="10" required />
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={formData.bathrooms} className="p-3 border border-gray-300 rounded-lg" type="number" id="bathrooms" min="1" max="5" required />
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input  onChange={handleChange} value={formData.regularPrice} className="p-3 border border-gray-300 rounded-lg" type="number" id="regularPrice" required />
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className="text-xs">($/month)</span>
                        </div>
                    </div>

                    {formData.offer && <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={formData.discountedPrice} className="p-3 border border-gray-300 rounded-lg" type="number" id="discountedPrice" required />
                        <div className="flex flex-col items-center">
                            <p>Discounted Price</p>
                            <span className="text-xs">($/month)</span>
                        </div>
                    </div>}
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold">Images:
                    <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6 allowed) </span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e)=>setFiles(e.target.files)} className="p-3 border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple />
                    <button type="button" disabled={uploading} onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80" >
                        {uploading?"Loading...":"Upload"}
                    </button>
                </div>
                <p className="text-red-700 text-sm"> {imageUploadError && imageUploadError} </p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                        <button type="button" onClick={()=>handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                        </div>
                    ))
                }

                <button disabled={loading || uploading} onClick={handleSubmit} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading?"Updating":"Update Listing"}</button>
                {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
            
        </form>
    </main>
  )
}

export default UpdateListing