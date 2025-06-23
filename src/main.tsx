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
        <BrowserRouter>
            <Layout categories={categories}>
                <Router>
                    <Route path="/" element={<App />} />
                    <Route path="/about" element={<div>About Page</div>} />
                    <Route path="/category/:id" element={<CategoryPage categories={categories}/>} />
                    <Route path="/recipe/:id" element={<RecipePage/>} />
                    <Route path='/register' element={<Register />}/>
                    <Route path='/login' element={<Login />}/>
                    <Route path="/verify" element={<VerifyEmail />} />
                    <Route path="*" element={<div>Pagina non trovata.</div>} />
                </Router>
            </Layout>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
        <ToastProvider/>
      <Routes />
    </HeroUIProvider>
  </StrictMode>,
)