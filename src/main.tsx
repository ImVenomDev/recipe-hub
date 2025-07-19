// vite-env.d.ts
/// <reference types="vite-plugin-pwa/client" />

import { StrictMode, useEffect, useState, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register';
import { BrowserRouter, Routes as Router, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

import {HeroUIProvider} from '@heroui/react'
import {ToastProvider} from "@heroui/toast";

import { getData } from '../firebase.config'

import type { Category } from './types.tsx'
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { AdminRoute } from './components/ProtectedRoute.tsx'
import ProteicRecipes from './pages/ProteicRecipes.tsx';
import UniqueRecipes from './pages/UniqueRecipes.tsx';
import MostPopular from './pages/MostPopular.tsx';

const App = lazy(() => import('./pages/Home'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Layout = lazy(() => import('./components/Header/Layout'));
const RecipePage = lazy(() => import('./pages/RecipePage'));
const Register = lazy(() => import('./components/Account/Register'));
const Login = lazy(() => import('./components/Account/Login'));
const VerifyEmail = lazy(() => import('./components/Account/verifyEmail'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const UserRecipesPage = lazy(() => import('./pages/UserRecipesPage'));
const LatestRecipes = lazy(() => import('./pages/LatestRecipes'));
const SplashScreen = lazy(() => import('./components/SplashScreen.tsx'));


const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('È disponibile un aggiornamento. Vuoi aggiornare ora?')) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log("App pronta per l'uso offline");
    }
});

const Routes = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const cat = await getData<Category>('categories');
            setCategories(cat);
        };
        fetchData();
    }, []);

    return (
        <Suspense fallback={<div className="p-10 text-center">Caricamento...</div>}>
            <AuthProvider>
                <BrowserRouter>
                    <Layout categories={categories}>
                        <Router>
                            <Route path="/" element={<App />} />
                            <Route path="/category/:id" element={<CategoryPage categories={categories}/>} />
                            <Route path="/recipe/:id" element={<RecipePage/>} />
                            <Route path='/register' element={<Register />}/>
                            <Route path='/login' element={<Login />}/>
                            <Route path="/verify" element={<VerifyEmail />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/account" element={<AccountPage/>} />
                            <Route path="/user-recipes/:user" element={<UserRecipesPage/>} />
                            <Route path="/ultime-ricette" element={<LatestRecipes/>} />
                            <Route path="/proteiche" element={<ProteicRecipes/>} />
                            <Route path="/piatti-unici" element={<UniqueRecipes/>} />
                            <Route path="/ricette-popolari" element={<MostPopular/>} />
                            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                            <Route path="*" element={<div>Pagina non trovata.</div>} />
                        </Router>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        </Suspense>
    )
}

const AppContainer = () => {
    const [showSplash, setShowSplash] = useState(true);
    
    if( showSplash ) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />
    }
    return (
        <HeroUIProvider>
            <HelmetProvider>
                <ToastProvider/>
                    <Routes />
            </HelmetProvider>
        </HeroUIProvider>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppContainer />
    </StrictMode>,
)
