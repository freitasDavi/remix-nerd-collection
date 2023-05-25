import type { ReactNode } from "react";

interface SignProps {
    children: ReactNode,
    shouldInvert?: boolean
}

export function Sign({ children, shouldInvert = true }: SignProps) {
    return (
        <section className="bg-gray-900 lg:grid lg:min-h-screen lg:grid-cols-12">
            <aside className={`relative block h-16 lg:col-span-5 lg:h-full xl:col-span-6 ${shouldInvert ? 'lg:order-last' : ''}`}>
                <img src="/assets/loginBackground.jpg" alt="Teste" className="absolute inset-0 h-full w-full object-cover" />
            </aside>
            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                <div className="max-w-xl lg:max-w-3xl">
                    <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                        Bem vindo ao NerdCollection 🦸🏻
                    </h1>
                    {children}
                </div>
            </main>
        </section>
    );
}