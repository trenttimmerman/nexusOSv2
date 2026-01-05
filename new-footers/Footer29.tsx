import React from 'react';

const Footer29: React.FC = () => {
    return (
        <>
            <style>
                {`
                .glitch-text {
                    position: relative;
                    color: white;
                    text-decoration: none;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    display: inline-block;
                }
                .glitch-text:hover:before,
                .glitch-text:hover:after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #111827;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                }
                .glitch-text:hover:before {
                    left: 2px;
                    text-shadow: -1px 0 #ff00c1;
                    animation: glitch-anim-1 2s infinite linear alternate-reverse;
                }
                .glitch-text:hover:after {
                    left: -2px;
                    text-shadow: -1px 0 #00fff9;
                    animation: glitch-anim-2 2s infinite linear alternate-reverse;
                }

                @keyframes glitch-anim-1 {
                    0% { clip: rect(42px, 9999px, 44px, 0); }
                    5% { clip: rect(12px, 9999px, 62px, 0); }
                    10% { clip: rect(8px, 9999px, 90px, 0); }
                    15% { clip: rect(61px, 9999px, 14px, 0); }
                    20% { clip: rect(32px, 9999px, 80px, 0); }
                    25% { clip: rect(50px, 9999px, 100px, 0); }
                    30% { clip: rect(24px, 9999px, 68px, 0); }
                    35% { clip: rect(97px, 9999px, 41px, 0); }
                    40% { clip: rect(27px, 9999px, 56px, 0); }
                    45% { clip: rect(83px, 9999px, 29px, 0); }
                    50% { clip: rect(64px, 9999px, 83px, 0); }
                    55% { clip: rect(10px, 9999px, 60px, 0); }
                    60% { clip: rect(39px, 9999px, 2px, 0); }
                    65% { clip: rect(74px, 9999px, 52px, 0); }
                    70% { clip: rect(58px, 9999px, 91px, 0); }
                    75% { clip: rect(44px, 9999px, 1px, 0); }
                    80% { clip: rect(13px, 9999px, 76px, 0); }
                    85% { clip: rect(43px, 9999px, 35px, 0); }
                    90% { clip: rect(93px, 9999px, 23px, 0); }
                    95% { clip: rect(41px, 9999px, 73px, 0); }
                    100% { clip: rect(3px, 9999px, 86px, 0); }
                }
                 @keyframes glitch-anim-2 {
                    0% { clip: rect(7px, 9999px, 98px, 0); }
                    5% { clip: rect(86px, 9999px, 55px, 0); }
                    10% { clip: rect(43px, 9999px, 21px, 0); }
                    15% { clip: rect(65px, 9999px, 3px, 0); }
                    20% { clip: rect(9px, 9999px, 78px, 0); }
                    25% { clip: rect(69px, 9999px, 48px, 0); }
                    30% { clip: rect(3px, 9999px, 94px, 0); }
                    35% { clip: rect(53px, 9999px, 33px, 0); }
                    40% { clip: rect(19px, 9999px, 82px, 0); }
                    45% { clip: rect(78px, 9999px, 12px, 0); }
                    50% { clip: rect(49px, 9999px, 63px, 0); }
                    55% { clip: rect(22px, 9999px, 81px, 0); }
                    60% { clip: rect(75px, 9999px, 40px, 0); }
                    65% { clip: rect(15px, 9999px, 95px, 0); }
                    70% { clip: rect(88px, 9999px, 37px, 0); }
                    75% { clip: rect(47px, 9999px, 8px, 0); }
                    80% { clip: rect(28px, 9999px, 66px, 0); }
                    85% { clip: rect(89px, 9999px, 20px, 0); }
                    90% { clip: rect(5px, 9999px, 51px, 0); }
                    95% { clip: rect(71px, 9999px, 18px, 0); }
                    100% { clip: rect(62px, 9999px, 45px, 0); }
                }
                `}
            </style>
            <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8 border-t-2 border-fuchsia-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-2xl font-bold">
                        <a href="#" className="glitch-text" data-text="CYBERCORP">CYBERCORP</a>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-semibold text-sm">
                        <a href="#" className="glitch-text" data-text="Network">Network</a>
                        <a href="#" className="glitch-text" data-text="Security">Security</a>
                        <a href="#" className="glitch-text" data-text="Data">Data</a>
                        <a href="#" className="glitch-text" data-text="Careers">Careers</a>
                    </nav>
                     <p className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} CyberCorp. All rights reserved.
                     </p>
                </div>
            </footer>
        </>
    );
};

export default Footer29;