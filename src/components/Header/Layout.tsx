// Layout.tsx
import { useDisclosure } from "@heroui/react";
import Header from "./Header";
import MenuDrawer from "./MenuDrawer";
import type { ReactNode } from "react";
import type { Category } from "../../types";

type LayoutProps = {
    children: ReactNode;
    categories: Category[];
};

export default function Layout({ children, categories }: LayoutProps) {
    const disclosure = useDisclosure(); // Controlla il drawer

    return (
        <>
            <Header onMenuClick={disclosure.onOpen} />
            <MenuDrawer {...disclosure} categories={categories} />
            <main className="pt-14">
                {children}
            </main>
        </>
    );
}
