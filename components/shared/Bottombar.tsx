"use client"

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Bottombar(){
    const router = useRouter();
    const pathName = usePathname();

    return (
        <section className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map((link) => {
                    const active = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route;

                    return(
                        <Link href={link.route} key={link.label} className={`bottombar_link ${active && 'bg-primary-500'}`}>
                            <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default Bottombar;
