"use client"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import ROUTES from "@/constants/routes"

const Home = () => {

  return (
    <>
      <Button className="px-10 ml-[20px] mt-[100px]" onClick={() => { signOut({ redirectTo: ROUTES.SIGN_IN }) }}>
        Sign Out
      </Button>
    </>
  )
}

export default Home