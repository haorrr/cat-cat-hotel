// export default function HomePage() {
//   return(
//     <div className="text-red-500" >
//       Hello World
//     </div>
//   )
// }

import { ChangePassword } from "@/components/auth/ChangePassword";
import GetUser from "@/components/auth/GetUser";
import { Login } from "@/components/auth/Login";
import LogoutButton from "@/components/auth/LogoutButton";
import { Register } from "@/components/auth/Register";
import { CreateBooking } from "@/components/booking/CreateBooking";
import GetBookings from "@/components/booking/GetBookings";
import { CreateCat } from "@/components/cat/CreateCat";
import GetCats from "@/components/cat/GetCats";


export default function HomePage() {
  return (
    <div>
      <div className="flex" >
        <Register />
        <Login />
        <LogoutButton />
        <ChangePassword />
      </div>
      <GetUser />
      <GetCats />
      <CreateCat />
      <CreateBooking />
      <GetBookings />
    </div>

  )
}