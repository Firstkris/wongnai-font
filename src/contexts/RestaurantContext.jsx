import io from "socket.io-client";

const socket = io.connect("http://localhost:8888/");

import { useState, createContext } from "react";
import {
  filterPageGetRestaurant,
  getFilterRestaurant,
  getAllUserBookmark,
  getRestaurantById,
} from "../apis/restaurants";
import { useUser } from "../feature/user/contexts/UserContext";
import { getUserBookmark } from "../apis/user";

import { useEffect } from "react";

export const RestaurantContext = createContext();

export const RestaurantContextProvider = ({ children }) => {
  const [r, serR] = useState("");
  const [filterPageData, setFilterPageData] = useState({});
  const [filterInput, setFilterInput] = useState({ rating: [] });
  const [isLoading, setLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [sideBarData, setSideBarData] = useState({});

  const [restaurantData, setRestaurantPage] = useState({});
  const [reviewsRating, setReviewsRating] = useState(null);

  const { user } = useUser();
  const [restaurant, setRestaurant] = useState("");
  const [searchBar1, setSearchBar] = useState([]);

  const [nameRestaurant, setNameRestaurant] = useState([]);
  const fetch = async () => {
    const data = await filterPageGetRestaurant();
    setNameRestaurant(data.data.restaurants);
    const response = await filterPageGetRestaurant();
    setSearchBar(response.data);
    // setFilterPageData(data.data.restaurants);
    // console.log(data.data.restaurants)
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });
      });
    }
  }, []);
  useEffect(() => {
    fetch();
  }, []);
  console.log(filterPageData);

  useEffect(() => {
    socket.auth = { sender: "RESTAURANT" + r };
    // console.log("first");
    socket.connect();
    return () => socket.disconnect();
  }, [r]);

  const fetchSidebar = async () => {
    try {
      const response = await filterPageGetRestaurant();
      console.log(response.data);
      setSideBarData({
        districts: response.data.districts,
        facilities: response.data.facilities,
        categories: response.data.categories,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFilterPage = async () => {
    try {
      // setLoading(true)
      const response = await filterPageGetRestaurant();
      setFilterPageData(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      // setLoading(false);
    }
  };

  const fetchFilterData = async (filterData) => {
    try {
      if (Object.keys(filterData).length === 0) {
        console.log("no filter");
        return;
      } else if (Object.values(filterData).every((arr) => arr.length === 0)) {
        // setLoading(true)
        if (!user) {
          console.log("no user");
          fetchFilterPage();
        } else {
          console.log("have user");
        }
      }

      //fetchRestaurantWithUserLogin()
      const filterDataParams = {
        districtId: filterData?.districtNameTh,
        facilityId: filterData?.facilityName,
        rating: filterData?.rating,
        priceLength: filterData?.priceLength,
        categoryId: filterData?.categoryName,
      };

      const response = await getFilterRestaurant(filterDataParams);

      if (response.data?.restaurants?.length > 0) {
        setFilterPageData((prev) => ({
          ...prev,
          restaurants: response.data?.restaurants,
        }));
      } else {
        setFilterPageData((prev) => ({
          ...prev,
          restaurants: [],
        }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setLoading(false)
    }
  };

  const clearFilters = () => {
    try {
      setFilterInput({});
      if (!user) {
        fetchFilterPage();
      } else {
        fetchRestaurantWithUserLogin();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRestaurantWithUserLogin = async () => {
    //if user is login
    try {
      const response = await getAllUserBookmark();
      //  console.log("this bookmark", response.data)
      setFilterPageData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRestaurantAndBookmarkById = async (restaurantId) => {
    try {
      setLoading(true);
      if (user) {
        const [restaurantResponse, bookmarkResponse] = await Promise.all([
          getRestaurantById(restaurantId),
          getUserBookmark(restaurantId),
        ]);

        setRestaurantPage({
          restaurant: restaurantResponse.data?.restaurant,
          bookmarks: bookmarkResponse.data?.bookmarks,
        });
        return;
      }

      const response = await getRestaurantById(restaurantId);
      setRestaurantPage({
        restaurant: response.data?.restaurant,
        bookmarks: [],
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filterByRating = (rating) => {
    if (!rating && restaurantData?.restaurant?.reviews)
      return setReviewsRating(restaurantData?.restaurant?.reviews);
    const reviews = restaurantData?.restaurant?.reviews?.filter(
      (el) => el.star == rating
    );
    setReviewsRating(reviews);
  };
  ////////

  return (
    <RestaurantContext.Provider
      value={{
        filterPageData,
        setFilterInput,
        fetchFilterPage,
        filterInput,
        fetchFilterData,
        clearFilters,
        fetchRestaurantWithUserLogin,
        isLoading,
        setLoading,
        fetchRestaurantAndBookmarkById,
        restaurantData,
        filterByRating,
        reviewsRating,
        nameRestaurant,
        setRestaurantPage,
        restaurant,
        setRestaurant,
        socket,
        serR,
        currentPosition,
        setCurrentPosition,
        searchBar1,
        sideBarData,
        fetchSidebar,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
