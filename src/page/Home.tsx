import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../component/ProgressBar";
import { isMobile } from "react-device-detect";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { useEnergy } from "../hooks/EnergyContext";

function Home() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const address = useTonAddress();
  const { remainedEnergy, setRemainedEnergy, startRecovery, stopRecovery } =
    useEnergy(); // use the context
  const [isTouch, setIsTouch] = useState(false); // New state to track touch event
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  // const recoveryIntervalRef = useRef<number | null>(null);
  // const [token, setToken] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tapCount, setTapCount] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);
  const [isTapping, setIsTapping] = useState(false);
  const isFetching = useRef(false);
  // useEffect(() => {
  //   const storedEnergy = localStorage.getItem("remainedEnergy");
  //   console.log('storedEnergystoredEnergy', storedEnergy)
  //   if (storedEnergy) {
  //     setRemainedEnergy(parseInt(storedEnergy, 10));
  //   }
  // }, []);
  // var timer: any;
  useEffect(() => {
    let timer: any;

    if (isTapping) {
      timer = setTimeout(() => {
        fetchCreateTap(address, tapCount);
        setIsTapping(false); // Reset tapping state
      }, 1000); // 300 milliseconds delay
    }

    // return () => clearTimeout(timer);
  }, [isTapping, address, tapCount]);

  useEffect(() => {
    const fetchAll = async () => {
      setLastClickTime(Date.now());
      const webapp = (window as any).Telegram?.WebApp.initDataUnsafe;
      // const webapp = {
      //   address: address,
      //   user: { id: "3a5a05f2-af44-4ce0-905e-f00bcd7bfb14" }
      // };
      if (webapp && webapp["user"]) {
        await fetchData(address, webapp["user"]["id"]);
        await fetchTodaysTap(address);
        await fetchTotalTap(address);
        setLoading(false);
      }
    };

    if (address) {
      setLoading(true);
      fetchAll();
    } else if (!address) {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (lastClickTime !== null) {
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime;
      if (timeSinceLastClick >= 1000) {
        startRecovery();
      } else {
        const timeoutId = setTimeout(startRecovery, 1000 - timeSinceLastClick);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [lastClickTime]);



  async function fetchData(walletAddress: string, userId: string) {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/tonWallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          userId: userId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      isFetching.current = false;
    }
  }

  async function fetchTodaysTap(walletAddress: string) {
    if (isFetching.current) return;

    isFetching.current = true;
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/getTodaysTap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wallet_address: walletAddress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      // const data = await response.json();
      // if (!data.error) setRemainedEnergy(data.data.remaining);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      isFetching.current = false;
    }
  }

  async function fetchTotalTap(walletAddress: string) {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/totalTaps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wallet_address: walletAddress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Total Tap: ", data);
      data.totalTaps && setTotalTaps(data.totalTaps);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      isFetching.current = false;
    }
  }

  // async function fetchCreateTap(walletAddress: string) {
  //   if (isFetching.current) return;

  //   isFetching.current = true;
  //   try {
  //     const response = await fetch(`${backendUrl}/api/v1/users/taps`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         wallet_address: walletAddress
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     if (!data.error)
  //       setRemainedEnergy(data.data.remaining)
  //   } catch (error) {
  //     console.error("There was a problem with the fetch operation:", error);
  //   }
  //   finally {
  //     isFetching.current = false;
  //   }
  // }

  function formatNumberWithCommas(number: number, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(number);
  }

  const bodyRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (event: any) => {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the target
    const y = event.clientY - rect.top; // y position within the target

    // Step 1: Create and append a <style> element
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    // Step 2: Define the @keyframes animation
    styleElement.sheet &&
      styleElement.sheet.insertRule(
        "@keyframes  fade-out-top-right {0% {opacity: 1; transform: translateY(0); } 100% {opacity: 0;transform: translateY(-100%);}}",
        0
      );

    // Create a new div element
    const newDiv = document.createElement("div");
    newDiv.textContent = "+1";
    newDiv.style.position = "absolute";
    newDiv.style.left = `${x}px`;
    newDiv.style.top = `${y - 50}px`;
    newDiv.style.color = "white";
    newDiv.className =
      "dynamic-div animate-fadeouttopright transform max-sm:text-3xl text-5xl font-bold transition not-selectable"; // You can add Tailwind classes here if needed

    // Append the new div to the body

    bodyRef.current && bodyRef.current.appendChild(newDiv);
    const interval = setTimeout(() => newDiv && newDiv.remove(), 400);

    return () => clearTimeout(interval);
  };

  const handleTap = (event: any) => {
    setLastClickTime(Date.now());
    stopRecovery();

    if (!address) {
      setModalVisible(true);
      return;
    }
    if (remainedEnergy > 0) {
      setRemainedEnergy(remainedEnergy - 1);
      localStorage.setItem("remainedEnergy", String(remainedEnergy - 1));
      // clearTimeout(timer);
      setTapCount(tapCount + 1);
      handleClick(event);
      setIsTapping(true); // Set tapping state
    }
  };

  const handleTouch = (event: any) => {
    setLastClickTime(Date.now());
    stopRecovery();
    if (!address) {
      setModalVisible(true);
      return;
    }
    const length = event.touches.length;
    if (remainedEnergy - length >= 0 && length >= 1) {
      setRemainedEnergy(remainedEnergy - length);
      setTapCount(tapCount + length);
      handleMultiTouchStart(event);
      setIsTapping(true); // Set tapping state
    }
  };

  async function fetchCreateTap(walletAddress: string, tapCount: number) {
    if (isFetching.current) return;

    isFetching.current = true;
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/taps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          tap_amount: tapCount,
          tap_remaining: remainedEnergy
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.error) {
        setTapCount(0);
        // setTapCount(data?.taps?.tap_amount);
        setRemainedEnergy(data?.taps?.tap_remaining);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      isFetching.current = false;
    }
  }

  // const handleTap = (event: any) => {
  //   setLastClickTime(Date.now());
  //   stopRecovery();

  //   if (!address) {
  //     setModalVisible(true);
  //     return;
  //   }
  //   if (remainedEnergy > 0) {
  //     setRemainedEnergy(remainedEnergy - 1);
  //     localStorage.setItem("remainedEnergy", String(remainedEnergy - 1));
  //     fetchCreateTap(address);
  //     if (token === null) {
  //       setToken(1);
  //     } else {
  //       setToken(token + 1);
  //     }
  //     handleClick(event);
  //   }
  // };

  const handleMultiTouchStart = (event: TouchEvent) => {
    // Iterate over each touch point
    Array.from(event.touches).forEach((touch) => {
      console.log("Touch's current position:", touch);
      // Call handleClick for each touch point
      handleClick({
        ...touch,
        target: event.target,
        preventDefault: () => { }, // Mock preventDefault for non-MouseEvent
        clientX: touch.clientX,
        clientY: touch.clientY,
        touches: [],
        targetTouches: [],
        changedTouches: []
      });
    });
  };

  // const handleTouch = (event: any) => {
  //   setLastClickTime(Date.now());
  //   stopRecovery();
  //   if (!address) {
  //     setModalVisible(true);
  //     return;
  //   }
  //   const length = event.touches.length;
  //   console.log(event, length);
  //   if (remainedEnergy - length >= 0 && length >= 1) {
  //     setRemainedEnergy(remainedEnergy - length);
  //     fetchCreateTap(address);
  //     setToken(token + length);
  //     handleMultiTouchStart(event);
  //   }
  // };

  const closeWalletModal = () => {
    setModalVisible(false);
  };

  const buttonWrapperRef = useRef(null);

  const handleTonButtonClick = () => {
    if (buttonWrapperRef.current) {
      const tonConnectButton = (buttonWrapperRef.current as any).querySelector(
        "button"
      ); // Adjust selector if necessary
      if (tonConnectButton) {
        tonConnectButton.click();
      }
    }
  };

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <div className="loader">Loading...</div>
    </div>
  ) : (
    <div className="flex flex-col items-center h-[100vh] pt-[15%] pb-[100px] justify-between min-h-[590px] bg-home-gradient">
      {/* Ton Wallet Connet Button */}
      <div className="w-full h-14 right-5 fixed top-2" ref={buttonWrapperRef}>
        <TonConnectButton className="float-right" />
      </div>

      {/* Display Number and Tap@Earn Context */}
      <div className="flex flex-col relative items-center justify-between">
        <h1 className="mb-4 max-sm:mb-1">Tap & Earn</h1>
        <div className="flex flex-row justify-center items-center not-selectable mt-4">
          <img src="/image/coin_small.svg" />
          <h3 className="text-3xl text-white">
            {tapCount} Hello Everyone
            {formatNumberWithCommas((tapCount + totalTaps))}
          </h3>
        </div>
      </div>

      {/* Tap Go! Icon */}
      <div
        className={`relative max-sm:my-0 rounded-full bg-cover aspect-square h-[45vh] flex-shrink-0 items-center justify-center ${remainedEnergy > 0
          ? "cursor-pointer"
          : "cursor-not-allowed opacity-50"
          }`}
        ref={bodyRef}
        style={{ backgroundImage: "url('/image/coin_big.png')" }}
        onTouchStart={(e) => {
          if (!isMobile) return;
          setIsTouch(true); // Set touch flag to true
          handleTouch(e);
        }}
        onClick={(e) => {
          if (isTouch) {
            setIsTouch(false); // Reset touch flag
            return;
          }
          handleTap(e);
        }}
      ></div>

      {/* Progress Bar and Limit */}
      <div>
        <div className="flex flex-col items-center not-selectable w-full mb-4">
          <div className="flex justify-between items-center w-full mb-1 pl-3 pr-4">
            <h3 className="font-bold">Tap Limit</h3>
            <h3 className="text-[#FFF] text-md font-bold">
              {remainedEnergy}/2000
            </h3>
          </div>
          <ProgressBar value={remainedEnergy * 0.05} />
        </div>
        {/* <div className="relative w-[340px] mt-6">
          <Link to='/boost' className="text-white flex flex-row items-center absolute right-4 bottom-[-20px]">
            <img src="/image/icon/boost_icon.svg" className="w-12 h-12" alt="Refs" />
            <span className="text-base mt-3">Boost</span>
          </Link>
        </div> */}
      </div>

      {/* Boost Button */}

      {/* Bottom Menu Button */}
      <div className="flex fixed flex-row items-center bottom-2 footer w-[95%] h-[65px] justify-between bg-navbar-gradient rounded-xl box-border px-4">
        <Link
          to="/refs"
          className="text-white w-20 h-20 flex flex-col items-center justify-center"
        >
          <img
            src="/image/icon/refs_icon.svg"
            className="w-10 h-10"
            alt="Refs"
          />
          <span className="text-xs">Refs</span>
        </Link>
        <Link
          to="/quest"
          className="text-white w-20 h-20 flex flex-col items-center justify-center"
        >
          <img
            src="/image/icon/icon_tasks.svg"
            className="w-10 h-10"
            alt="Tasks"
          />
          <span className="text-xs">Tasks</span>
        </Link>
        <Link
          to="/leaderboard"
          className="text-white w-20 h-20 flex flex-col items-center justify-center"
        >
          <img
            src="/image/icon/icon_ranks.svg"
            className="w-10 h-10"
            alt="Ranks"
          />
          <span className="text-xs">Ranks</span>
        </Link>
        {/* <Link
          to="/dailybonus"
          className="text-white w-20 h-20 flex flex-col items-center justify-center"
        >
          <img
            src="/image/icon/icon_streak.svg"
            className="w-10 h-10"
            alt="Streak"
          />
          <span className="text-xs">Streak</span>
        </Link> */}
      </div>
      {modalVisible && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center"
            onClick={() => setModalVisible(false)}
          ></div>

          <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg bg-[#1E3D4B] rounded-t-2xl flex flex-col justify-center gap-4 animate-slide-in-bottom transform transition-all max-h-[80vh] overflow-y-auto">
            <div className="flex justify-end w-full h-12">
              <button
                className="text-black bg-[#4F7383] p-1 rounded-full"
                onClick={closeWalletModal}
                style={{
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <img
                  src="/image/icon/close_icon.svg"
                  alt="close"
                  className="w-4 h-4"
                />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/image/icon/connect_wallet.svg"
                alt="connectButton"
                className="w-20 h-25"
              />
            </div>
            <p className="text-3xl font-bold text-center mb-2">
              Please connect the <br></br>wallet first!
            </p>
            <div
              className="flex text-xl justify-center items-center w-full h-16 px-2 py-1 bg-gradient-to-r from-[#07AEEA] to-[#D3984E] rounded-xl cursor-pointer gap-2"
              onClick={handleTonButtonClick}
            >
              <img src="/image/icon/union.svg" alt="tonbuttonicon" />
              Connnect TON Wallet
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Home;
