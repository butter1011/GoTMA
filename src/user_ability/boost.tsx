import { useNavigate } from 'react-router-dom';

const Boost = () => {
    const navigate = useNavigate();

    return (
        <div className='px-2'>
            <div className="max-w-full h-full mx-auto flex flex-col px-5 py-6 items-center">
                <button className="absolute left-[22px] top-[15px] bg-transparent p-0 border-none" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="white" />
                    </svg>
                </button>
                <div className="w-full flex-grow my-[6%]">
                    <h1>Boost</h1>
                </div>
                <div className='flex'>
                    <img src='/image/coin_small.svg' alt='coin_small' />
                    <div className='text-3xl mx-1 z-50'>1,500</div>
                </div>
                <div className="absolute right-[28%] top-[20%]">
                    <img src='/image/rocket.png' alt='rocket' className='h-[171.13px] w-[238px]' />
                </div>
                <div className='absolute left-[40%] top-[32%] z-0'>
                    <img src='/image/icon/curly_icon.svg' alt='curly line' className='h-[300px] w-[300px]' />
                </div>
            </div>

            <div className='absolute w-[96%] mt-[28%] z-40'>
                <button
                    className="flex items-center justify-between w-full h-[72px] flex-shrink bg-[#1E3D4B] rounded-lg hover:opacity-80 active:scale-95 text-white my-[10px] p-0"
                >
                    <div className="flex items-center justify-center flex-1 ps-[15px] relative">
                        <img src='/image/icon/multitap_icon.svg' alt='multitap' className="w-[60px] h-[60px] flex-shrink-0 mr-2" />
                        <div className="flex flex-col text-lg w-full text-start mt-1">
                            <p className="whitespace-nowrap">
                                Multitap
                            </p>
                            <div className="flex items-center">
                                <img src="/image/coin_small.svg" className="w-6 h-6" alt="coin" />
                                <p className="ml-1 font-bold">10</p>
                                <p className='ml-2 text-lg text-[#9E9E9E]'>| 1 level</p>
                            </div>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="me-4" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z" fill="#9E9E9E" />
                    </svg>
                </button>
                <button
                    className="flex items-center justify-between w-full h-[72px] flex-shrink bg-[#1E3D4B] rounded-lg hover:opacity-80 active:scale-95 text-white my-[10px] p-0"
                >
                    <div className="flex items-center justify-center flex-1 ps-[11px] relative">
                        <img src='/image/icon/energy_icon.svg' alt='multitap' className="w-[60px] h-[50px] flex-shrink-0 mr-3" />
                        <div className="flex flex-col text-lg w-full text-start mt-1">
                            <p className="whitespace-nowrap">
                                Energy Limit
                            </p>
                            <div className="flex items-center">
                                <img src="/image/coin_small.svg" className="w-6 h-6" alt="coin" />
                                <p className="ml-1 font-bold">10</p>
                                <p className='ml-2 text-lg text-[#9E9E9E]'>| 1 level</p>
                            </div>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="me-4" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z" fill="#9E9E9E" />
                    </svg>
                </button>
                <button
                    className="flex items-center justify-between w-full h-[72px] flex-shrink bg-[#1E3D4B] rounded-lg hover:opacity-80 active:scale-95 text-white my-[10px] p-0"
                >
                    <div className="flex items-center justify-center flex-1 ps-[11px] relative">
                        <img src='/image/icon/recharging_icon.svg' alt='multitap' className="w-[60px] h-[48px] flex-shrink-0 mr-3" />
                        <div className="flex flex-col text-lg w-full text-start mt-1">
                            <p className="whitespace-nowrap">
                                Recharging Speed
                            </p>
                            <div className="flex items-center">
                                <img src="/image/coin_small.svg" className="w-6 h-6" alt="coin" />
                                <p className="ml-1 font-bold">10</p>
                                <p className='ml-2 text-lg text-[#9E9E9E]'>| 1 level</p>
                            </div>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="me-4" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z" fill="#9E9E9E" />
                    </svg>
                </button>
            </div>
        </div>
    )
};

export default Boost;
