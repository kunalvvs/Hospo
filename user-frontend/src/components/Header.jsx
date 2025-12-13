import React, { useState, useEffect, useRef } from 'react';
import UserSidebar from './UserSidebar';
import { GiHamburgerMenu } from "react-icons/gi";

const Header = ({ title }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowSidebar(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sidebarRef]);

    return (
        <div>
            {showSidebar && (
                <div ref={sidebarRef}>
                    <UserSidebar onClose={() => setShowSidebar(false)} />
                </div>
            )}

            <div className="flex mb-6 gap-4">
                <button onClick={() => setShowSidebar(true)} className="text-2xl text-white">
                    <GiHamburgerMenu />
                </button>
                <div>
                    <h1 className="flex justify-start items-start text-xl font-semibold text-white">
                        Find {title}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Header;
