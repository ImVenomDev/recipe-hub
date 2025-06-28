import { Input, Button, Spinner, User } from '@heroui/react';
import { Search, Menu } from 'lucide-react';
import logo from '/assets/logo-black.svg';
import small_logo from '/assets/logo-small.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.config';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 flex-shrink-0"
      >
        <button className="p-2 rounded-full hover:bg-gray-100" onClick={onMenuClick}>
          <Menu className="w-6 h-6 text-purple-900" />
        </button>

        <img
          onClick={() => navigate('/')}
          src={small_logo}
          alt="logo mobile"
          className="h-6 w-auto cursor-pointer block md:hidden"
        />
        <img
          onClick={() => navigate('/')}
          src={logo}
          alt="logo desktop"
          className="h-12 w-auto cursor-pointer hidden md:block"
        />
      </motion.div>

      {/* Center: Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1 w-full sm:w-auto sm:flex-[2] max-w-3xl order-3 sm:order-none"
      >
        <Input
          placeholder="Cosa vuoi cucinare?"
          variant="bordered"
          radius="full"
          className="w-full"
          endContent={<Search className="text-purple-900 w-5 h-5" />}
        />
      </motion.div>

      {/* Right: User / Auth */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 ml-auto"
      >
        {loading ? (
          <Spinner size="sm" />
        ) : user ? (
          <>
            <User
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
              name={user.displayName}
              className="hidden sm:flex"
            />
            <Button
              className="bg-[#9340ff] text-white font-semibold px-4 py-1 text-sm"
              variant="flat"
              onPress={() => auth.signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            className="bg-[#9340ff] text-white font-semibold px-4 py-1 text-sm"
            onPress={() => navigate('/login')}
          >
            Accedi
          </Button>
        )}
      </motion.div>
    </motion.header>
  );
}
