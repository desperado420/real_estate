import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"

function Header() {
    const {currentUser} = useSelector((state)=>state.user)
    console.log(currentUser)
  return (
    <header className="bg-slate-300 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                <Link to="/">
                    <span className="text-slate-400">
                        EZChip
                    </span>
                    <span className="text-slate-800">
                        Estate

                    </span>
                </Link>
            </h1>
            <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                <input type="text" placeholder="Search..." className='bg-transparent focus:outline-none w-24 sm:w-64' />
                <FaSearch className='text-slate-600' />
            </form>  
            <ul className='flex gap-4'>
                <Link to={"/"} >
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to={'/about'} >
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                <Link to={'/profile'} >    
                {currentUser?(
                    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
                    
                ):(
                    
                        <li className=' text-slate-700 hover:underline'>Sign In</li>
                    
                )}
                </Link>
                
            </ul>

        </div>

    </header>
  )
}

export default Header