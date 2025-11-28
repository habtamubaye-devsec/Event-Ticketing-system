import { useState } from 'react'
import MenuItems from './menu-items'
import type { UserType } from '../../interface'
import { Menu } from 'lucide-react'
import { Drawer } from 'antd';

function Sidebar({user} : {user:UserType}) {
  
  const [showMoblieMenu, setShowMobileMenu] = useState(false);

  return (
    <div className=''>
       <div className="lg:flex hidden h-full  lg:w-60">
         <MenuItems user = {user}/>
       </div>

       <div className='lg:hidden bg-gray-300 flex items-center p-2 px-4'>
        <Menu size={24}
          onClick={ () => setShowMobileMenu(!showMoblieMenu)}
          className='cursor-pointer hover:text-red-400 ' />
        <h1 className='px-2 ml-3 text-2xl font-bold text-red-600 '>Shey <b className='text-black font-bold'>Events</b></h1>
       </div>

       {showMoblieMenu &&  (
        <Drawer
        open={showMoblieMenu}
        placement='left'
        onClose={ () => setShowMobileMenu(false)}>
          <MenuItems user = {user}/>
        </Drawer>
       )}
    </div>
  )
}

export default Sidebar