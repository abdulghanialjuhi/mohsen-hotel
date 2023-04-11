import React from 'react'
import Header from './Header'
import Footer from './Footer'
import GlobalState, { Context } from "../../context/GlobalState";
import { ProtectedRoute } from "./ProtectedRoutes";

export default function Wrapper({ children }) {

    const store = GlobalState()

    return (
        <Context.Provider value={store}>
            <div className='flex bg-gray-100 flex-col min-h-screen max-w-[1440px] mx-auto'>
                <Header />
                <main className='flex flex-grow px-8'>
                    {store.loading ? 'loading...' : (
                        <ProtectedRoute>
                            {children}
                        </ProtectedRoute>
                    )}
                </main>
                <Footer />
            </div>
        </Context.Provider>
    )
}
