import { useSelector } from "react-redux/es/hooks/useSelector"

function Profile() {
  const {currentUser} = useSelector((state)=>state.user)
  return (
    <div>
      Hi {currentUser.username}
    </div>
  )
}

export default Profile