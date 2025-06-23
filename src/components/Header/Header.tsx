// Header.tsx
import { Input, Button } from '@heroui/react';
import { Search, Menu } from 'lucide-react';
import logo from '/assets/logo-black.svg';
import small_logo from '/assets/logo-small.png';
import { useNavigate } from 'react-router-dom';

type Props = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: Props) {
    const navigate = useNavigate();
    return (
        <header className="w-full flex fixed z-50 items-center justify-between px-4 py-3 bg-white shadow-md">
            {/* Sinistra: menu + logo */}
            <div className="flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={onMenuClick}>
                    <Menu className="w-6 h-6 text-purple-900" />
                </button>

                {/* Logo dinamico */}
                <img onClick={() => navigate('/')} src={small_logo} alt="logo mobile" className="h-6 w-auto cursor-pointer block md:hidden" />
                <img onClick={() => navigate('/')} src={logo} alt="logo desktop" className="h-12 w-auto cursor-pointer hidden md:block" />
            </div>

            {/* Centro: barra di ricerca */}
            <div className="flex-1 px-6 max-w-3xl">
                <Input placeholder="Cosa vuoi cucinare?" variant="bordered" radius="full" className="w-full" endContent={<Search className="text-purple-900 w-5 h-5" />}/>
            </div>

            {/* Destra: azioni */}
            <div className="flex items-center gap-10">
                <a href='/login'>
                    <Button radius="full" className="bg-orange-400 text-white font-semibold px-5">
                        Accedi
                    </Button>
                </a>
            </div>
        </header>
    );
}
