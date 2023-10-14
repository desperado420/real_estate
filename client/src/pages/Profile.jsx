import { useSelector } from "react-redux/es/hooks/useSelector"

function Profile() {
  const {currentUser} = useSelector((state)=>state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Hi {currentUser.username}
      </h1>
      <form className="flex flex-col gap-4">
        <img src={currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <input id="username" type="text" placeholder="username" className="border rounded-lg p-3" />
        <input id="email" type="text" placeholder="email" className="border rounded-lg p-3" />
        <input id="password" type="text" placeholder="password" className="border rounded-lg p-3" />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:placeholder-opacity-95 disabled:opacity-80">update</button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      
    </div>
  )
}

export default Profile