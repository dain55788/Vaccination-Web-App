import AsyncStorage from "@react-native-async-storage/async-storage";

export default (current, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            //bỏ await trong reducer và nếu cần thiết thì chỉ nên gọi xóa token ở logout handle
            AsyncStorage.removeItem("token");
            return null;
    }

    return current;
}