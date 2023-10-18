import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from "swiper/react"
import SwiperCore from "swiper"
import {Navigation} from "swiper/modules"
import "swiper/css/bundle"

function Listing() {
    SwiperCore.use([Navigation])
    const {id} = useParams()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const fetchListing = async() => {
        try{
            setLoading(true)
            const res = await fetch(`/api/listing/getListing/${id}`)
            const data = await res.json()
            if(data.success===false) {
                setError(true)
                setLoading(false)
                return
            } 
            setListing(data)
            setLoading(false)
        } catch(error){
            setError(true)
            setLoading(false)
        }
        
    }
    useEffect(()=>{
        fetchListing()
    },[id])

  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>loading...</p>}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing.imageUrls.map((url)=>(
                        <SwiperSlide key={url}>
                            <div className='h-[500px]' style={{background:`url(${url}) center no-repeat`, backgroundSize:"cover"}}>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )}
    </main>
  )
}

export default Listing