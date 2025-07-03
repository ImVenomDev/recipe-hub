import { Button, Spinner, User } from '@heroui/react';
import { Menu } from 'lucide-react';
import logo from '/assets/logo-black.svg';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.config';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import HeaderSearch from './HeaderSearch';

type Props = {
    onMenuClick: () => void;
};

export default function Header({ onMenuClick }: Props) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full fixed z-50 flex flex-wrap items-center justify-between px-4 py-3 bg-white shadow-md gap-4 sm:gap-6"
        >
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={onMenuClick}>
                    <Menu className="w-6 h-6 text-purple-900" />
                </button>
                <img
                    src={logo}
                    alt="logo desktop"
                    onClick={() => navigate('/')}
                    className="h-12 w-auto cursor-pointer hidden md:block"
                />
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 w-full sm:w-auto sm:flex-[2] max-w-3xl order-3 sm:order-none">
                <HeaderSearch/>
            </div>

            {/* Right: User / Auth */}
            <div className="flex items-center gap-3 ml-auto">
                {loading ? (
                    <Spinner size="sm" />
                ) : user ? (
                    <>
                        <User
                            avatarProps={{
                                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                            }}
                            name={user.displayName || user.email}
                            className="hidden sm:flex"
                        />
                        <Button
                            className="hidden sm:flex bg-[#9340ff] text-white font-semibold px-4 py-1 text-sm"
                            onPress={() => auth.signOut()}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button
                        className="hidden sm:flex bg-[#9340ff] text-white font-semibold px-4 py-1 text-sm"
                        onPress={() => navigate('/login')}
                    >
                        Accedi
                    </Button>
                )}
            </div>
        </motion.header>
    );
}
