import Header from "../components/Header"
import Footer from "../components/Footer"
import { Outlet } from "react-router"
import { bodyFont } from "../styles/Common.js"

function RootLayout() {
  return (
    <div className={bodyFont}>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default RootLayout