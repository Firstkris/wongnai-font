import { CardRestaurant } from "../components/filterPageComponents/CardRestaurant";
import React from "react";
import { SlideBar } from "../components/filterPageComponents/SlideBar";
import { useRestaurant } from "../hooks/hooks.jsx";
import { useEffect } from "react";
import { Breadcrumbs } from "../components/BreadCrumb.jsx";
import { useUser } from "../feature/user/contexts/UserContext.jsx";
import { Loading } from "../components/Loading";

import SlidePhoto from "../components/filterPageComponents/SlidePhoto.jsx";
import { MiniMapGoogle } from "../feature/MimiMapGoogle.jsx";
import { useState } from "react";
import { LocationIcon } from "../icons/icon.jsx";
import { useLocation } from "react-router-dom";

const breadcrumbs = [
  { label: "หน้าหลัก", link: "/" },
  {
    label: "ค้นหาร้านอาหาร",
  },
];
export const FilterPage = () => {
  const {
    filterPageData,
    fetchRestaurantWithUserLogin,
    isLoading,
    currentPosition,
    fetchFilterData,
    filterInput,
    fetchSidebar,
  } = useRestaurant();

  const { restaurants } = filterPageData;
  const { user } = useUser();
  const [isOpenMap, setIsOpenMap] = useState();

  //if user is login ? fetchRestaurantWithUserLogin : fetchFilterPage

  useEffect(() => {
    fetchSidebar();
  }, []);
  console.log(restaurants);
  return (
    //layout
    isLoading ? (
      <Loading />
    ) : (
      <div className="flex flex-col gap-2 z-10 ">
        {/* layout subheader */}
        <div className="w-full bg-white mt-1  shadow-sm">
          <div className="flex flex-col gap-2 py-4 w-[886px] md:mx-auto xl:w-[1024px]">
            <div className="pl-1">
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="font-semibold text-3xl">
              ร้านอาหารยอดนิยม ในกรุงเทพมหานคร
            </div>
          </div>
        </div>
        {/* map */}
        {isOpenMap && (
          <div className="w-full flex justify-center">
            <div className="relative h-72 w-[1020px] bg-white p-4 rounded-lg">
              <MiniMapGoogle
                lat={currentPosition?.latitude}
                lng={currentPosition?.longitude}
                restaurants={restaurants}
              />

              <button
                className="bg-white absolute right-6 py-2 px-4 top-6 text-center rounded-md"
                onClick={() => setIsOpenMap((prev) => !prev)}
              >
                ปิด
              </button>
            </div>
          </div>
        )}
        {/* layout body*/}
        <div className="md:mx-auto  ">
          <div className=" flex justify-around gap-4 w-[886px] xl:w-[1024px]">
            {/* <Slidebar> */}
            <div className="flex min-w-fit mb-4">
              <SlideBar />
            </div>
            <div className="flex flex-col w-3/4  gap-4">
              <div className="flex  rounded-lg shadow-lg bg-white bg-opacity-100 items-center">
                <SlidePhoto />
              </div>
              <div className="flex gap-4 justify-around mb-4">
                <div className="flex flex-col gap-4 ">
                  {/* restaurants */}
                  {restaurants?.length > 0 ? (
                    restaurants
                      .sort((a, b) => a.id - b.id)
                      .map((restaurant, index) => (
                        <CardRestaurant key={index} restaurant={restaurant} />
                      ))
                  ) : (
                    <div className="flex justify-center gap-2 p-4 bg-white rounded-lg font-semibold  w-[480px] text-gray-400">
                      NO FILTERS
                    </div>
                  )}
                </div>
                {/* right bar */}
                <div className="flex flex-col gap-4  w-2/6 rounded-lg h-screen">
                  {!isOpenMap && (
                    <div className="w-full rounded-lg h-48 p-2 bg-white  shadow-md flex flex-col gap-1">
                      <div>ค้นหาจากแผนที่</div>
                      <div className="relative flex justify-center items-center h-5/6 rounded-lg">
                        <img
                          src="https://static2.wongnai.com/static2/images/3dwN7In.png"
                          className="w-full h-full"
                        />
                        <button
                          className="absolute bg-blue-200 hover:bg-blue-300 p-2 rounded-lg flex items-center gap-1"
                          onClick={() => setIsOpenMap((prev) => !prev)}
                        >
                          <LocationIcon className="w-6 h-6" /> ดูแผนที่
                        </button>
                      </div>
                    </div>
                  )}
                  <div className=" bg-slate-300 rounded-lg">
                    <img src="https://res.cloudinary.com/da8uycieq/image/upload/v1710416287/Screenshot_2567-03-14_at_18.36.34_1_uaz6od.png" />
                  </div>
                  <div className="w-full rounded-lg gap-2 flex flex-col p-2 bg-white shadow-md">
                    <div>บทความแนะนำ</div>
                    <div className="flex flex-col gap-2 max-w-11/12">
                      <div className="flex gap-2">
                        <div className="min-w-16 h-16 bg-gray-200 rounded-md"></div>
                        <div>
                          <div>บทความแนะนำ 1</div>
                          <div className="text-md font-light hidden lg:block">
                            เนื้อหา
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="min-w-16 h-16 bg-gray-200 rounded-md"></div>
                        <div>
                          <div>บทความแนะนำ 2</div>
                          <div className="text-md font-light hidden lg:block">
                            เนื้อหา
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
