import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Invoices from './pages/Invoices'
import Reports from './pages/Reports'
import AddShipment from './pages/AddShipment'
import Shipments from './pages/Shipments'
import Footer from './components/Footer'
import View from './pages/View'
import Preloder from './components/Preloder'

function App() {

  const [loder, setLoder] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoder(false);
    }, 3000);
  });
  return (
    <>
        <Routes>
            {/* <Route path='/' element={<Dashboard/>}/> */}
            <Route path="/" element={loder ? <Preloder /> : <Dashboard />} />
            <Route path='/clients' element={<Clients/>}/>
            <Route path='/invoice' element={<Invoices/>}/>
            <Route path='/shipments' element={<Shipments/>}/>
            <Route path='/report' element={<Reports/>}/>
            <Route path='/addShipment' element={<AddShipment/>}/>
            <Route path='/view/:id' element={<View/>}/>
        </Routes>
        
   
    </>
  )
}

export default App
