import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {HeroUIProvider} from '@heroui/react'
import './index.css'
import App from './pages/Home.tsx'
import { BrowserRouter, Routes as Router, Route } from 'react-router-dom'
import CategoryPage from './pages/CategoryPage.tsx'
import Layout from './components/Header/Layout.tsx'
import { getData } from '../firebase.config'
import type { Category } from './types.tsx'
import {ToastProvider} from "@heroui/toast";
import RecipePage from './pages/RecipePage.tsx'
import Register from './components/Account/Register.tsx'
import Login from './components/Account/Login.tsx'
import VerifyEmail from './components/Account/verifyEmail.tsx'

import { AuthProvider } from "./contexts/AuthContext.tsx";
import AdminPage from './pages/AdminPage.tsx'
import { AdminRoute } from './components/ProtectedRoute.tsx'
import SearchPage from './pages/SearchPage.tsx'
import AccountPage from './pages/AccountPage.tsx'
import { HelmetProvider } from 'react-helmet-async'
import UserRecipesPage from './pages/UserRecipesPage.tsx'

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
                        <Route path="/user-recipes/:id" element={<UserRecipesPage/>} />
                        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                        <Route path="*" element={<div>Pagina non trovata.</div>} />
                    </Router>
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HeroUIProvider>
            <HelmetProvider>
                <ToastProvider/>
                <Routes />
            </HelmetProvider>
        </HeroUIProvider>
    </StrictMode>,
)