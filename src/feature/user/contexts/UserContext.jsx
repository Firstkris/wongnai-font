import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import * as userApi from "../../../apis/user";
import * as Token from "../../../utils/local-storage";
import { createContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io.connect("http://localhost:8888/");

const UserContext = createContext();
export default function UserContextProvider({ children }) {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [userDefault, setUserDefault] = useState(null);
  const [onFetch, setOnFetch] = useState(false);

  useEffect(() => {
    socket.auth = { sender: "USER" + user?.id };
    // console.log("first");
    socket.connect();
    return () => socket.disconnect();
  }, [user?.id]);

  useEffect(() => {
    if (Token.getToken()) {
      userApi
        .fetchMe()
        .then((res) => {
          setUser(res.data.user);
          setUserDefault(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
      // .finally(() => setLoading(false));
    }
  }, [onFetch]);

  const logout = () => {
    setUser(null);
    Token.clearToken();
    toast.success("Logout successful");
  };

  const deleteReviewById = async (id) => {
    await userApi.deleteReviewById(id);
    // setOnFetch((c) => !c); ฮั่นเอาออก
    toast.success("Delete review successful");
  };

  const deleteBookmarkById = async (id) => {
    console.log("id", id);
    await userApi.deleteBookmarkById(id);
    // setOnFetch((c) => !c); // ฮั่นเอาออก
    toast.success("Delete bookmark successful");
  };
  // console.log(user);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        //  otherUser,
        userId,
        deleteReviewById,
        onFetch,
        userDefault,
        setOnFetch,
        deleteBookmarkById,
        socket,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
